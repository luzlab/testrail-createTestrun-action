/// <reference lib="DOM" />

import { testrailContext, testrunInfo, statusContext } from './common';
import { parseAllDocuments } from 'yaml';
import ky from 'ky';
import { encode } from 'js-base64';

declare var uiscripts: testrailContext;

const githubPAT = '<GITHUB_PAT>'
const githubAuthHeader = `Basic ${encode(`username:${githubPAT}`)}`;

$(() => {
  const button = $(
    '<div class="toolbar content-header-toolbar"><a class="toolbar-button toolbar-button-last toolbar-button-first content-header-button button-start" href="javascript:void(0)">Update PR</a></div>',
  );
  button.on('click', pushStatus);
  $('#content-header .content-header-inner').prepend(button);
});
async function pushStatus() {
  const testrailTestrunAPI = `${window.location.origin}/index.php?api/v2/get_run/${uiscripts.context.run.id}`;

  // fetch information from the testrun description
  const { description: testrunDescription } = await ky
    .get(testrailTestrunAPI)
    .json();
  console.log(testrunDescription);
  const pullrequestInfo = parseAllDocuments(testrunDescription)
    .pop()
    ?.contents?.toJSON() as testrunInfo;
  console.log(pullrequestInfo);
  const { repoName, repoOwner, pullrequestNumber } = pullrequestInfo;

  // fetch commit SHA for the last commit on the PR
  const {
    head: { sha: commitSHA },
  } = await ky(
    `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullrequestNumber}`,
    {
      headers: { Authorization: githubAuthHeader },
    },
  ).json();
  console.log(commitSHA);

  // Assemble the status JSON to send to GH
  const {
    passed_count,
    retest_count,
    untested_count,
    blocked_count,
    failed_count,
    custom_status1_count,
    custom_status2_count,
    custom_status3_count,
    custom_status4_count,
    custom_status5_count,
    custom_status6_count,
    custom_status7_count,
  } = uiscripts.context.run;

  const otherTests =
    blocked_count +
    untested_count +
    custom_status1_count +
    custom_status2_count +
    custom_status3_count +
    custom_status4_count +
    custom_status5_count +
    custom_status6_count +
    custom_status7_count;
  const totalTests = passed_count + failed_count + retest_count + otherTests;

  const json = {
    state: (passed_count + retest_count) === totalTests ? 'success' : 'failure',
    target_url: window.location.href,
    description: `${passed_count} passing, ${failed_count} failing, ${retest_count} retest, ${otherTests} other`,
    context: statusContext,
  };

  // Update the status for the commit (PR)
  const updateStatus = await ky
    .post(
      `https://api.github.com/repos/${repoOwner}/${repoName}/statuses/${commitSHA}`,
      {
        headers: { Authorization: githubAuthHeader },
        json,
      },
    )
    .json();
  console.log(updateStatus);
}
