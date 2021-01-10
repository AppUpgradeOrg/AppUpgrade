import { OnboardNewUserDto } from '@app-upgrade/common';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { createAccountIfNotExist } from './create-account-if-not-exist';
import { getProjects as getProjectsFn } from './get-projects';
import { onboardNewUser as onboardNewUserFn } from './onboard-new-user';

admin.initializeApp();

export const createAuthAccountRecord = functions.auth
  .user()
  .onCreate(async (user) => {
    await createAccountIfNotExist(admin, user.uid);
    console.log(
      `Successfully created/updated Account(accountId = ${user.uid})`
    );
  });

export const onboardNewUser = functions.https.onCall(
  async (data: OnboardNewUserDto, context) => {
    const uid = context.auth?.uid;

    if (!!uid) {
      return onboardNewUserFn(admin, data, uid);
    } else {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User not authenticated'
      );
    }
  }
);

export const getProjects = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) return [];

  return getProjectsFn(admin, context.auth.uid);
});
