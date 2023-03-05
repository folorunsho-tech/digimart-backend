const { db } = require("../firebase/config.js");
const { getDoc, doc } = require("firebase/firestore");
const getCurrUser = async (uid) => {
  const docRef = doc(db, "owners", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};
module.exports = getCurrUser;
