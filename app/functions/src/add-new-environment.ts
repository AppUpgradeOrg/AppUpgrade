import { AddNewEnvironmentDto } from '@app-upgrade/common';
import * as functions from 'firebase-functions';
import { v4 as uuidv4 } from 'uuid';
import { AccountRecord, ProjectRecord } from './records';
import { FirebaseAdmin } from './types';
import { identityConverter } from './utils';

export const addNewEnvironment = async (
  admin: FirebaseAdmin,
  addNewEnvironmentDto: AddNewEnvironmentDto,
  authUid: string
) => {
  const db = admin.firestore();
  const environmentId = uuidv4();

  if (!!authUid) {
    try {
      const [account, parentProject] = await Promise.all([
        db
          .collection('accounts')
          .doc(authUid)
          .withConverter(identityConverter<AccountRecord>())
          .get(),

        db
          .collection('projects')
          .doc(addNewEnvironmentDto.projectId)
          .withConverter(identityConverter<ProjectRecord>())
          .get()
      ]);

      const accountRecord = account.data();
      if (!account.exists || accountRecord === undefined) {
        throw new functions.https.HttpsError(
          'not-found',
          `Could not find account with id ${authUid}`
        );
      }

      const projectRecord = parentProject.data();

      if (!parentProject.exists || projectRecord === undefined) {
        throw new functions.https.HttpsError(
          'not-found',
          `Could not find project with id ${addNewEnvironmentDto.projectId}`
        );
      }

      if (accountRecord.organizationId !== projectRecord.organizationId) {
        throw new functions.https.HttpsError(
          'permission-denied',
          `Account with id = ${authUid} does not have access project with id = ${projectRecord.projectId}`
        );
      }

      await db
        .collection('environments')
        .doc(environmentId)
        .set({
          environmentId,
          projectId: projectRecord.projectId,
          organizationId: projectRecord.organizationId,
          environmentName: addNewEnvironmentDto.environmentName,
          domains: [addNewEnvironmentDto.domainName],
          createdOn: admin.firestore.Timestamp.now()
        });
      return environmentId;
    } catch (error) {
      throw new functions.https.HttpsError('unknown', error);
    }
  } else {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User not authenticated'
    );
  }
};
