import {
  AccountCommon,
  EnvironmentCommon,
  ProjectCommon
} from '@app-upgrade/common';
import * as admin from 'firebase-admin';

export interface AccountRecord extends AccountCommon {
  createdOn: admin.firestore.Timestamp;
}

export interface ProjectRecord extends ProjectCommon {
  createdOn: admin.firestore.Timestamp;
}

export interface EnvironmentRecord extends EnvironmentCommon {
  createdOn: admin.firestore.Timestamp;
}
