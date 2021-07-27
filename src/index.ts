import * as core from '@actions/core';
import * as github from '@actions/github';
import Testrail, { INewTestRun } from 'testrail-api';
import { PullRequestOpenedEvent } from '@octokit/webhooks-types';

import prOpenedHandler from './pullRequestOpened';
import prClosedHandler from './pullRequestClosed';
import pullRequestSynchronized from './pullRequestSynchronized';

const { getInput, setFailed } = core;
const { context, getOctokit } = github;

const skipTokens = [
  '[skip testrun]',
  '[no testrun]',
  '***NO_TESTRUN***',
  'skip-testrun',
];

run();
async function run(): Promise<void> {
  try {
    // Setup SDKs
    const octokit = getOctokit(getInput('github_token'));
    const testrail = new Testrail({
      host: getInput('testrail_URL'),
      password: getInput('testrail_token'),
      user: getInput('testrail_user'),
    });
    const sdks = { core, testrail, octokit };

    // Collect the data
    const testrailSuite = parseInt(getInput('testrail_suite'));
    const testrailProject = parseInt(getInput('testrail_project'));
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
      body: pullrequestDescriptionRaw,
      _links: {
        html: { href: pullrequestLink },
      },
      head: { sha: commitSHA },
    } = pull_request;
    const pullrequestDescription = pullrequestDescriptionRaw || '';
    const actionData = {
      pullrequestDescription,
      pullrequestNumber,
      pullrequestTitle,
      pullrequestLink,
      commitSHA,
      repoName,
      repoOwner,
      testrailSuite,
      testrailProject,
    };

    ///// Check for [no testrun] in PR
    core.startGroup('Create Testrail testrun');
    for (const token of skipTokens) {
      console.log(`checking for '${token}'...`);
      if (pullrequestDescription.includes(token)) {
        console.log(`... PR description contains ${token}, aborting action.`);
        return;
      } else {
        console.log('... not found');
      }
    }
    ///// Check for Event Type (PR opened or PR Closed)
    console.log(context);
    switch (context.action) {
      case 'opened':
        prOpenedHandler(sdks, actionData);
        break;
      case 'closed':
        prClosedHandler(sdks, actionData);
        break;
      case 'synchronize':
        pullRequestSynchronized(sdks, actionData);
        break;
      default:
        console.log(
          `Received unexpected action '${context.action}'. Only 'opened', 'synchronize' and 'closed' actions are supported.`,
        );
    }
  } catch (error) {
    setFailed(error.message);
  }
}
