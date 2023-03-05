const { db } = require("../firebase/config.js");
const express = require("express");
const {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} = require("firebase/firestore");
// const getOwnerStores = require("../libs/getOwnerStore.js");

const router = express.Router();

router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  res.status(200).json({ uid });
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

module.exports = router;
