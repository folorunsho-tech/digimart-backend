const { db } = require("../firebase/config.js");
const { collection, getDocs } = require("firebase/firestore");
const getOwnerStores = async (uid) => {
  const stores = [];
  const storesRef = collection(db, "stores");
  const storesSnapshot = await getDocs(storesRef);
  storesSnapshot.forEach((doc) => {
    if (doc.data().owner_id === uid) {
      stores.push(doc.data());
    }
  });
  return stores;
};
module.exports = getOwnerStores;
