// @ts-ignore
import client from "firebase-tools";
import { argv } from "yargs";

const deleteCollection = (collection: string) => {
  return client.firestore.delete(collection, {
    recursive: true,
    yes: true,
  });
};

const main = async () => {
  if (typeof argv.collection === "string") {
    await deleteCollection(argv.collection);
  }
};

main()
  .then(() => console.log("success"))
  .catch((e) => console.error("error", e))
  .then(() => process.exit(0));
