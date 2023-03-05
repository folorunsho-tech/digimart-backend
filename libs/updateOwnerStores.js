const { db } = require("../firebase/config.js");
const { doc, updateDoc } = require("firebase/firestore");
const updateOwnerStores = async ({ uid, data }) => {
  const docRef = doc(db, "owners", uid);
  const docSnap = await updateDoc(docRef, data);
  const stores = docSnap.data().stores;
  return stores;
};
module.exports = updateOwnerStores;
