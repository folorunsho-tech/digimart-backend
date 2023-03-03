import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { Router } from "express";
const router = Router();
type Store = {
  store_id: string;
  store_name: string;
  store_description: string;
  store_owner: string;
  last_modified_at: Date;
}[];
export const getOwnerStores = async (uid: string) => {
  const stores: Store = [];
  const querySnapshot = await getDocs(collection(db, "stores"));
  querySnapshot.forEach((doc) => {
    if (doc.data().store_owner === uid) {
      stores.push(doc.data());
    }
  });
  return stores;
};
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const docRef = await getDoc(doc(db, "stores", uid));
    res.status(200).json({ docRef });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/createstore", async (req, res) => {
  const { store_name, store_description, store_owner } = req.body;
  try {
    const docRef = await addDoc(collection(db, "stores"), {
      store_name,
      store_description,
      store_owner,
      last_modified_at: new Date(),
    });
    res.status(201).json({ docRef });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/updatestore", async (req, res) => {
  const { store_id } = req.body;
  try {
    const docRef = await updateDoc(doc(db, "stores", store_id), {
      ...req.body,
    });
    res.status(201).json({ docRef });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/deletestore", async (req, res) => {
  const { store_id } = req.body;
  try {
    const docRef = await deleteDoc(doc(db, "stores", store_id));
    res.status(201).json({ docRef });
  } catch (error) {
    res.status(400).json({ error });
  }
});
export default router;
