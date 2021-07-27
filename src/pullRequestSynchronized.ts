import { sdks, eventData, pullrequestInfo, statusContext } from './common';
import { parseAllDocuments } from 'yaml';

export default async function (sdks: sdks, eventData: eventData) {
  const { core, octokit } = sdks;
  const {
    repoName,
    repoOwner,
    commitSHA,
  } = eventData;

  ///// Set pending status on commit
  core.startGroup('Create pending status on PR');
  const statusCheckData = {
    owner: repoOwner,
    repo: repoName,
    sha: commitSHA,
    state: 'pending' as any,
    context: statusContext,
    description: 'No UAT tests have been run.',
  };
  const { data: checkResponse } = await octokit.rest.repos.createCommitStatus(
    statusCheckData,
  );
  console.log(checkResponse);
  core.endGroup();
}
