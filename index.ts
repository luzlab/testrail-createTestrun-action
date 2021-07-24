import * as core from '@actions/core';
import * as github from '@actions/github';
import Testrail, { INewTestRun } from 'testrail-api';
import { PullRequestOpenedEvent } from '@octokit/webhooks-types';
import { stringify } from 'yaml';

const { getInput, setOutput, setFailed, debug } = core;
const { context, getOctokit } = github;

const skipTokens = [
  '[skip testrun]',
  '[no testrun]',
  '***NO_TESTRUN***',
  'skip-testrun',
];

run();
async function run() {
  try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const {
      number: pullrequestNumber,
      pull_request,
      repository,
    } = context.payload as PullRequestOpenedEvent;

    const {
      owner: { login: repoOwner },
      name: repoName,
    } = repository;

    const {
      title: pullrequestTitle,
      body: pullrequestDescription,
      _links: {
        html: { href: pullrequestLink },
      },
    } = pull_request;
    console.log(pull_request);

    const octokit = getOctokit(getInput('github_token')).rest;

    const host = getInput('testrail_URL');
    const password = getInput('testrail_token');
    const user = getInput('testrail_user');
    const testrail = new Testrail({ host, password, user });

    const testrailSuite = parseInt(getInput('testrail_suite'));
    const testrailProject = parseInt(getInput('testrail_project'));

    ///// Check for [no testrun] in PR
    for (const token in skipTokens) {
      if (pullrequestDescription!.includes(token)) {
        console.log(`PR description contains ${token}, aborting action.`);
        return;
      }
    };

    ///// Create Testrail testrun
    core.startGroup('Create Testrail testrun');
    const testrunRequest = {
      suite_id: testrailSuite,
      name: `PR${pullrequestNumber}: ${pullrequestTitle}`,
      include_all: false,
      case_ids: [],
      refs: `${pullrequestNumber}`,
      description: 'in progres...',
    };
    const { body: testrun } = await testrail.addRun(
      testrailProject,
      testrunRequest,
    );
    console.log(testrun);
    core.endGroup();

    ///// Create comment on PR
    core.startGroup('Create comment on PR');
    const { id: testrunID, url: testrunURL } = testrun;
    const pullrequestComment = `This comment was auto-generated and contains information used by the TestRail/GitHub integration\n### DO NOT EDIT COMMENT BELOW THIS LINE`;
    const pullrequestData = {
      testrunID,
      testrunURL,
    };
    const commentData = `${pullrequestComment}\n...\n${stringify(
      pullrequestData,
    )}`;
    const commentRequest = {
      issue_number: pullrequestNumber,
      owner: repoOwner,
      repo: repoName,
      body: commentData,
    };
    const { data: comment } = await octokit.issues.createComment(
      commentRequest,
    );
    console.log(comment);
    core.endGroup();

    ///// Update testrun description
    core.startGroup('Update testrun description');
    const testrunDescription = `This testrun was auto-generated for a GitHub pull request. Please add test cases and run as needed. Click the "Push Results" button to send the test results to Github.\n\n##### DO NOT EDIT DESCRIPTION BELOW THIS LINE ######`;
    const testrunData = {
      pullrequestLink,
      pullrequestNumber,
      pullrequestTitle,
      pullrequestComment: comment.id,
    };
    const testrunUpdateRequest = {
      description: `${testrunDescription}\n...\n${stringify(testrunData)}`,
    } as any;
    const { body: testrunUpdate } = await testrail.updateRun(
      testrunID,
      testrunUpdateRequest,
    );
    console.log(testrunUpdate);
    core.endGroup();

    const time = new Date().toTimeString();
    setOutput('testrun_URL', time);
    setOutput('testrun_ID', Math.random() * 100);
  } catch (error) {
    setFailed(error.message);
  }
}
