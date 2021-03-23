import { OnboardNewUserDto } from '@app-upgrade/common';
import * as functions from 'firebase-functions';
import { v4 as uuidv4 } from 'uuid';
import { createAccountIfNotExist } from './create-account-if-not-exist';
import { FirebaseAdmin } from './types';

export const onboardNewUser = async (
  admin: FirebaseAdmin,
  onboardNewUserDto: OnboardNewUserDto,
  authUid: string
) => {
  const db = admin.firestore();
  const organizationId = uuidv4();
  const projectId = uuidv4();
  const environmentId = uuidv4();

  if (!!authUid) {
    try {
      await Promise.all([
        createAccountIfNotExist(admin, authUid, { organizationId }),

        db.collection('organizations').doc(organizationId).set({
          organizationId,
          organizationName: onboardNewUserDto.organizationName,
          createdOn: admin.firestore.Timestamp.now()
        }),

        db.collection('projects').doc(projectId).set({
          projectId,
          organizationId,
          projectName: onboardNewUserDto.projectName,
          projectReleaseStrategy: onboardNewUserDto.projectReleaseStrategy,
          createdOn: admin.firestore.Timestamp.now()
        }),

        db
          .collection('environments')
          .doc(environmentId)
          .set({
            environmentId,
            projectId,
            organizationId,
            environmentName: onboardNewUserDto.environmentName,
            domains: [onboardNewUserDto.domainName],
            createdOn: admin.firestore.Timestamp.now()
          })
      ]);

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
