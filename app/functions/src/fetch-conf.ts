import { Conf } from '@app-upgrade/common';
import * as functions from 'firebase-functions';

export const fetchConf = (): Conf => {
  return {
    core: {
      environmentName: functions.config().core['environment-name'],
      webSdkUrl: functions.config().core['web-sdk-url']
    }
  };
};
