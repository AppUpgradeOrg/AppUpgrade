import { FirebaseAdmin } from './types';

export const createAccountIfNotExist = async (
  admin: FirebaseAdmin,
  authUid: string,
  data: { [s: string]: any } = {}
) => {
  const db = admin.firestore();
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
