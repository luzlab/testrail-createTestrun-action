import * as core from '@actions/core';
import * as github from '@actions/github';
import Testrail, { INewTestRun } from 'testrail-api';
import { PullRequestOpenedEvent } from '@octokit/webhooks-types';
import { stringify } from 'yaml';

import prOpenedHandler from './pullRequestOpened';

const { getInput, setOutput, setFailed } = core;
const { context, getOctokit } = github;

const skipTokens = [
  '[skip testrun]',
  '[no testrun]',
  '***NO_TESTRUN***',
  'skip-testrun',
];

run();
async function run():Promise<void>  {
  try {
    console.log(context);
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
      body: pullrequestDescriptionRaw,
      _links: {
        html: { href: pullrequestLink },
      },
      head: {
        sha: commitSHA,
      }
    } = pull_request;

    const pullrequestDescription = pullrequestDescriptionRaw || '';

    const octokit = getOctokit(getInput('github_token'));

    const host = getInput('testrail_URL');
    const password = getInput('testrail_token');
    const user = getInput('testrail_user');
    const testrail = new Testrail({ host, password, user });

    const testrailSuite = parseInt(getInput('testrail_suite'));
    const testrailProject = parseInt(getInput('testrail_project'));

    ///// Check for [no testrun] in PR
    core.startGroup('Create Testrail testrun');
    for (const token of skipTokens) {
      console.log(`checking for '${token}'...`)
      if (pullrequestDescription.includes(token)) {
        console.log(`... PR description contains ${token}, aborting action.`);
        return;
      } else {
        console.log('... not found')
      }
    };

    ///// Check for Event Type (PR opened or PR Closed)
    console.log(context);
    if (context.eventName = '') {
      prOpenedHandler({ core, testrail, octokit }, {
        pullrequestNumber,
        pullrequestTitle,
        pullrequestLink,
        pullrequestDescription,
        commitSHA,
        repoName,
        repoOwner,
        testrailSuite,
        testrailProject,
      });
    }
  } catch (error) {
    setFailed(error.message);
  }
}
