import { sdks, eventData, pullrequestInfo } from './common';
import { parseAllDocuments } from 'yaml';

export default async function (sdks: sdks, eventData: eventData) {
  const { core, testrail } = sdks;
  const {
    pullrequestDescription,
  } = eventData;

  const { testrunID } : pullrequestInfo = parseAllDocuments(pullrequestDescription).pop() as any;

  ///// Close testrun
  core.startGroup('Close testrun');
  const { body: testrunUpdate } = await testrail.closeRun(
    testrunID,
  );
  console.log(testrunUpdate);
  core.endGroup();
}
