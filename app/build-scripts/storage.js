const path = require('path');
const { Storage } = require('@google-cloud/storage');

function main(firebaseProjectName) {
  let bucketName;
  switch (firebaseProjectName) {
    case 'alpha':
      bucketName = 'app-upgrade-alpha.appspot.com';
      break;
    case 'gamma':
      bucketName = 'app-upgrade-gamma.appspot.com';
      break;
    default:
      throw new Error(`MissingCaseException: firebaseProjectName=${firebaseProjectName}`);
  }

  const filename = path.resolve('../web-sdk/dist/bundle.js');
  const destination = 'bundle.js';

  // Creates a client
  const storage = new Storage();

  async function uploadFile() {
    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      destination: destination,
      public: true,
    });

    await storage.bucket(bucketName).file(destination).makePublic()

    console.log(`${filename} uploaded to ${bucketName}.`);
  }

  uploadFile().catch(console.error);
}

if (require.main === module) {
  main(...process.argv.slice(2));
}
