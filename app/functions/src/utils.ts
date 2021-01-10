import * as admin from 'firebase-admin';

export const identityConverter = <T>() => {
  return {
    toFirestore(t: T): admin.firestore.DocumentData {
      return {
        ...t
      };
    },

    fromFirestore(data: admin.firestore.DocumentData): T {
      return data as T;
    }
  };
};
