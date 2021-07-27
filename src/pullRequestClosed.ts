import { sdks, eventData, pullrequestInfo } from './types';
import { parseAllDocuments } from 'yaml';

export default async function (sdk: sdks, eventData: eventData) {
  const { core, testrail } = sdk;
  const {
    pullrequestDescription,
  } = eventData;

  const { testrunID } : pullrequestInfo = parseAllDocuments(pullrequestDescription).pop() as any;

  ///// Close0 testrun
  core.startGroup('Close testrun');
  const { body: testrunUpdate } = await testrail.closeRun(
    testrunID,
  );
  console.log(testrunUpdate);
  core.endGroup();
}
