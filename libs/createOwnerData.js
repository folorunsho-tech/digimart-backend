const { setDoc, doc } = require("firebase/firestore");
const { db } = require("../firebase/config.js");

const createOwnerData = async ({
  uid,
  userEmail,
  emailVerified,
  phoneNumber,
  photoURL,
  displayName,
  stores,
}) => {
  const ownerData = {
    uid,
    userEmail,
    emailVerified,
    phoneNumber,
    photoURL,
    displayName,
    stores,
  };
  await setDoc(doc(db, "owners", uid), ownerData);
};
module.exports = createOwnerData;
