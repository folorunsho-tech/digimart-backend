const { setDoc, doc } = require("firebase/firestore");
const { db } = require("../firebase/config.js");

const createOwnerData = async (user) => {
  await setDoc(doc(db, "accounts", user.uid), {
    email: user.email,
    username: user.displayName,
    uid: user.uid,
    isOwner: true,
    isCustomer: false,
    isVerified: user.emailVerified,
    photoURL: user.photoURL,
    socials: [],
  });
};
module.exports = createOwnerData;
