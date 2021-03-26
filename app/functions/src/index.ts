import {
  AddNewEnvironmentDto,
  AddNewProjectDto,
  OnboardNewUserDto
} from '@app-upgrade/common';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { addNewEnvironment as addNewEnvironmentFn } from './add-new-environment';
import { addNewProject as addNewProjectFn } from './add-new-project';
import { createAccountIfNotExist } from './create-account-if-not-exist';
import { fetchConf as fetchConfFn } from './fetch-conf';
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

export const addNewProject = functions.https.onCall(
  async (data: AddNewProjectDto, context) => {
    const uid = context.auth?.uid;

    if (!!uid) {
      return addNewProjectFn(admin, data, uid);
    } else {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User not authenticated'
      );
    }
  }
);

export const addNewEnvironment = functions.https.onCall(
  async (data: AddNewEnvironmentDto, context) => {
    const uid = context.auth?.uid;

    if (!!uid) {
      return addNewEnvironmentFn(admin, data, uid);
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

export const fetchConf = functions.https.onCall(async (data, context) => {
  return fetchConfFn();
});
