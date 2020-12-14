import { OnboardNewUserDto } from '@app-upgrade/common';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { v4 as uuidv4 } from 'uuid';

admin.initializeApp();
const db = admin.firestore();

const createAccountIfNotExist = async (
  authUid: string,
  data: { [s: string]: any } = {}
) => {
  const accountDocumentRef = db.collection('accounts').doc(authUid);

  await db.runTransaction(async (tx) => {
    try {
      const accountDocument = await tx.get(accountDocumentRef);
      if (accountDocument.exists) {
        console.log(
          `Account(accountId = ${authUid}) already exists. Updating.`
        );
        await tx.set(accountDocumentRef, data, { merge: true });
        return;
      }

      await tx.create(accountDocumentRef, {
        accountId: authUid,
        createdOn: admin.firestore.Timestamp.now()
      });
    } catch (e) {
      console.error(
        `An error occurred creating a document for Account(accountId = ${authUid})`,
        e
      );
      throw e;
    }
  });
};

export const createAuthAccountRecord = functions.auth
  .user()
  .onCreate(async (user) => {
    await createAccountIfNotExist(user.uid);
    console.log(
      `Successfully created/updated Account(accountId = ${user.uid})`
    );
  });

export const onboardNewUser = functions.https.onCall(
  async (data: OnboardNewUserDto, context) => {
    const organizationId = uuidv4();
    const projectId = uuidv4();
    const environmentId = uuidv4();
    const uid = context.auth?.uid;

    if (!!uid) {
      try {
        await Promise.all([
          createAccountIfNotExist(uid, { organizationId }),

          db.collection('organizations').doc(organizationId).set({
            organizationId,
            organizationName: data.organizationName,
            createdOn: admin.firestore.Timestamp.now()
          }),

          db.collection('projects').doc(projectId).set({
            projectId,
            organizationId,
            projectName: data.projectName,
            projectReleaseStrategy: data.projectReleaseStrategy,
            createdOn: admin.firestore.Timestamp.now()
          }),

          db
            .collection('environments')
            .doc(environmentId)
            .set({
              environmentId,
              projectId,
              organizationId,
              environmentName: data.environmentName,
              domains: [data.domainName],
              createdOn: admin.firestore.Timestamp.now()
            })
        ]);

        console.log('Data added successfully');
      } catch (error) {
        throw new functions.https.HttpsError('unknown', error);
      }
    } else {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User not authenticated'
      );
    }
  }
);

export const getProject = functions.https.onCall(async (data, context) => {
  try {
    const projectData = await db
      .collection('projects')
      .where('projectId', '==', data.projectId)
      .get();
    return { details: projectData.docs[0].data() };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', error);
  }
});
