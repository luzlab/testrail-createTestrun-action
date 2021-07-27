import { sdks, eventData, pullrequestInfo } from './common';
import { parseAllDocuments } from 'yaml';

export default async function (sdks: sdks, eventData: eventData) {
  const { core, testrail } = sdks;
  const {
    pullrequestDescription,
  } = eventData;

  const { testrunID } = parseAllDocuments(pullrequestDescription).pop()?.contents?.toJSON() as pullrequestInfo;

  ///// Close testrun
  core.startGroup('Close testrun');
  console.log(testrunID);
  const { body: testrunUpdate } = await testrail.closeRun(
    testrunID,
  );
  console.log(testrunUpdate);
  core.endGroup();
}
