import { sdks, eventData, pullrequestInfo, testrunInfo } from './types';
import { stringify } from 'yaml';

export default async function (sdk: sdks, eventData: eventData) {
  const { core, testrail, octokit } = sdk;
  const {
    pullrequestNumber,
    pullrequestTitle,
    pullrequestLink,
    pullrequestDescription,
    repoName,
    repoOwner,
    testrailSuite,
    testrailProject,
    commitSHA,
  } = eventData;

  ///// Create Testrail testrun
  core.startGroup('Create Testrail testrun');
  const testrunRequest = {
    suite_id: testrailSuite,
    name: `PR${pullrequestNumber}: ${pullrequestTitle}`,
    include_all: false,
    case_ids: [],
    refs: `${pullrequestNumber}`,
    description: 'in progres...',
  } as any;
  const { body: testrun } = await testrail.addRun(
    testrailProject,
    testrunRequest,
  );
  console.log(testrun);
  core.endGroup();

  ///// Update PR description
  core.startGroup('Add Testrail info to pullrequest description');
  const { id: testrunID, url: testrunURL } = testrun;
  const pullrequestComment = `Below was auto-generated and contains information used by the TestRail/GitHub integration\n### DO NOT EDIT DESCRIPTION BELOW THIS LINE`;
  const pullrequestData : pullrequestInfo = {
    testrunID,
    testrunURL,
  };
  const updatedPullrequestDescription = `${pullrequestDescription}\n${pullrequestComment}\n...\n${stringify(
    pullrequestData,
  )}`;
  const pullrequestRequest = {
    pull_number: pullrequestNumber,
    owner: repoOwner,
    repo: repoName,
    body: updatedPullrequestDescription,
  };
  const { data: pullrequestUpdate } = await octokit.rest.pulls.update(
    pullrequestRequest,
  );
  console.log(pullrequestUpdate);
  core.endGroup();

  ///// Add pending status on commit
  core.startGroup('Create pending status on PR');
  const statusCheckData = {
    owner: repoOwner,
    repo: repoName,
    sha: commitSHA,
    state: 'pending' as any,
    context: 'testrail-uat',
    description: 'No UAT tests have been run.',
  };
  const { data: checkResponse } = await octokit.rest.repos.createCommitStatus(
    statusCheckData,
  );
  console.log(checkResponse);
  core.endGroup();

  ///// Update testrun description
  core.startGroup('Update testrun description');
  const testrunDescription = `This testrun was auto-generated for a GitHub pull request. Please add test cases and run as needed. Click the "Push Results" button to send the test results to Github.\n\n##### DO NOT EDIT DESCRIPTION BELOW THIS LINE ######`;
  const testrunData : testrunInfo = {
    pullrequestLink,
    pullrequestNumber,
    repoOwner,
    repoName,
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
}
