import core from '@actions/core';
import github from '@actions/github';

try {
  const testrailSuite = core.getInput('testrail_suite');
  const testrailProject = core.getInput('testrail_project');
  const testrailURL = core.getInput('testrail_URL');

  console.log(`testrailSuite ${testrailSuite}!`);
  console.log(`testrailProject ${testrailProject}!`);
  console.log(`testrailURL ${testrailURL}!`);
  
  const time = (new Date()).toTimeString();
  core.setOutput("testrun_URL", time);
  core.setOutput("testrun_ID", Math.random()*100);
  
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}