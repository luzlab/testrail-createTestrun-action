import * as core from '@actions/core';
import * as github from '@actions/github';

const { getInput, setOutput, setFailed, debug } = core;
const { context, getOctokit } = github;

try {
  const octokit = getOctokit(getInput('github_token'));

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(context.payload, undefined, 2)
  debug(`The event payload: ${payload}`);
  
  const testrailSuite = getInput('testrail_suite');
  const testrailProject = getInput('testrail_project');
  const testrailURL = getInput('testrail_URL');

  debug(`testrailSuite ${testrailSuite}!`);
  debug(`testrailProject ${testrailProject}!`);
  debug(`testrailURL ${testrailURL}!`);
  
  const time = new Date().toTimeString();
  setOutput("testrun_URL", time);
  setOutput("testrun_ID", Math.random()*100);
  

} catch (error) {
  setFailed(error.message);
}