import * as core from '@actions/core';
import * as github from '@actions/github';
import Testrail from 'testrail-api';
import { PullRequestOpenedEvent }  from '@octokit/webhooks-types'

const { getInput, setOutput, setFailed, debug } = core;
const { context, getOctokit } = github;

run();
async function run() {
  try {
    const octokit = getOctokit(getInput('github_token'));

    const host = getInput('testrail_URL');
    const password = getInput('testrail_token');
    const user = getInput('testrail_user');
    const testrail = new Testrail({ host, password, user });

    const testrailSuite = parseInt(getInput('testrail_suite'));
    const testrailProject = parseInt(getInput('testrail_project'));

    const project = (await testrail.getProject(testrailProject)).body;
    console.log(project);

    const suite = (await testrail.getSuite(testrailSuite)).body;
    console.log(suite);

    const time = new Date().toTimeString();
    setOutput('testrun_URL', time);
    setOutput('testrun_ID', Math.random() * 100);

    console.log(context.payload);
    // Get the JSON webhook payload for the event that triggered the workflow
    const pullrequest = context.payload.pull_request as PullRequestOpenedEvent;
    
    console.log(pullrequest)

  } catch (error) {
    setFailed(error.message);
  }
}
