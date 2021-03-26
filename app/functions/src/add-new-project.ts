import { AddNewProjectDto } from '@app-upgrade/common';
import * as functions from 'firebase-functions';
import { v4 as uuidv4 } from 'uuid';
import { getProjects } from './get-projects';
import { AccountRecord } from './records';
import { FirebaseAdmin } from './types';
import { identityConverter } from './utils';

export const addNewProject = async (
  admin: FirebaseAdmin,
  addNewProjectDto: AddNewProjectDto,
  authUid: string
) => {
  const db = admin.firestore();
  const projectId = uuidv4();
  const environmentId = uuidv4();

  if (!!authUid) {
    try {
      const account = await db
        .collection('accounts')
        .doc(authUid)
        .withConverter(identityConverter<AccountRecord>())
        .get();

      const accountRecord = account.data();
      if (!account.exists || accountRecord === undefined) {
        throw new functions.https.HttpsError(
          'not-found',
          `Could not find account with id ${authUid}`
        );
      }

      if (accountRecord.organizationId === undefined) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `Account with id ${authUid} does not have an organization set`
        );
      }

      await Promise.all([
        db.collection('projects').doc(projectId).set({
          projectId,
          organizationId: accountRecord.organizationId,
          projectName: addNewProjectDto.projectName,
          projectReleaseStrategy: addNewProjectDto.projectReleaseStrategy,
          createdOn: admin.firestore.Timestamp.now()
        }),
        db
          .collection('environments')
          .doc(environmentId)
          .set({
            environmentId,
            projectId,
            organizationId: accountRecord.organizationId,
            environmentName: addNewProjectDto.environmentName,
            domains: [addNewProjectDto.domainName],
            createdOn: admin.firestore.Timestamp.now()
          })
      ]);

      const allProjects = await getProjects(admin, authUid);

      // return back the newly created project
      return allProjects.find((project) => project.projectId === projectId);
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
