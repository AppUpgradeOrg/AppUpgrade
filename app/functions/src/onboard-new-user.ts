import { OnboardNewUserDto } from '@app-upgrade/common';
import * as functions from 'firebase-functions';
import { v4 as uuidv4 } from 'uuid';
import { createAccountIfNotExist } from './create-account-if-not-exist';
import { FirebaseAdmin } from './types';
const { Storage } = require('@google-cloud/storage');

export const onboardNewUser = async (
  admin: FirebaseAdmin,
  onboardNewUserDto: OnboardNewUserDto,
  authUid: string
) => {
  const db = admin.firestore();
  const organizationId = uuidv4();
  const projectId = uuidv4();
  const environmentId = uuidv4();

  const storage = new Storage();
  const myBucket = storage.bucket('app-upgrade-qa');
  const file = myBucket.file('my-file.txt');
  const contents = 'This is the contents of the file.';

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
          }),

        file.save(contents)
      ]);
      console.log('Data added successfully');
      return;
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
