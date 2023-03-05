import { db } from "../firebase/config";
import getOwnerStores from "./getOwnerStore";
const { collection, addDoc } = require("firebase/firestore");
const initializeCreateStore = async (
  { uid, store_name, store_description },
  res
) => {
  const docRef = collection(db, "stores");
  const docSnap = await addDoc(docRef, {
    owner: uid,
    store_name,
    store_description,
  });
  getOwnerStores(uid).then((stores) => {
    res.redirect(`/${stores[0].store_id}/dashboard`);
  });
};
module.exports = initializeCreateStore;
