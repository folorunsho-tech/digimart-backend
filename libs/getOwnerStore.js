const { db } = require("../firebase/config.js");
const { doc, getDoc } = require("firebase/firestore");
const getOwnerStores = async (uid) => {
  const docRef = doc(db, "owners", uid);
  const docSnap = await getDoc(docRef);
  const stores = docSnap.data().stores;
  return stores;
};
module.exports = getOwnerStores;
