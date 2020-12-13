import admin from "firebase-admin";

const log = console;

(async () => {
  admin.initializeApp();

  try {
    const allUsers = await admin.auth().listUsers();
    await allUsers.users.reduce((promiseChain, user) => {
      return promiseChain.then(() => {
        return admin.auth().deleteUser(user.uid);
      });
    }, Promise.resolve());
  } catch (e) {
    log.error(e);
  } finally {
    process.exit(0);
  }
})();
