import * as core from '@actions/core';
import * as github from '@actions/github';
import Testrail from 'testrail-api';

const { getInput, setOutput, setFailed, debug } = core;
const { context, getOctokit } = github;

run();
async function run() {
  try {
    const octokit = getOctokit(getInput('github_token'));

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(context.payload, undefined, 2);
    debug(`The event payload: ${payload}`);

    const host = getInput('testrail_URL');
    const password = getInput('testrail_token');
    const user = getInput('testrail_user');
    const testrail = new Testrail({ host, password, user });

    const testrailSuite = parseInt(getInput('testrail_suite'));
    const testrailProject = parseInt(getInput('testrail_project'));

    const project = await testrail.getProject(testrailProject);
    console.log(project);

    const suite = await testrail.getSuite(testrailSuite);
    console.log(suite);

    const time = new Date().toTimeString();
    setOutput('testrun_URL', time);
    setOutput('testrun_ID', Math.random() * 100);
  } catch (error) {
    setFailed(error.message);
  }
}
