import * as admin from 'firebase-admin';

export const identityConverter = <
  T
>(): admin.firestore.FirestoreDataConverter<T> => {
  return {
    toFirestore(t: T): admin.firestore.DocumentData {
      return {
        ...t
      };
    },

    fromFirestore(data: admin.firestore.QueryDocumentSnapshot<T>): T {
      return data.data();
    }
  };
};
