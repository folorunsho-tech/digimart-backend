const { db } = require("../firebase/config.js");
const express = require("express");
const {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  getDocs,
} = require("firebase/firestore");
const getOwnerStores = require("../libs/getOwnerStore.js");
// const getOwnerStores = require("../libs/getOwnerStore.js");

const router = express.Router();

router.get("/:owner_id", async (req, res) => {
  try {
    getOwnerStores(req.params.owner_id).then((stores) => {
      res.status(200).json({ stores });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.get("/:store_id", async (req, res) => {
  const { store_id } = req.params;
  try {
    const docRef = await getDoc(doc(db, "stores", store_id));
    res.status(200).json({ docRef });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/createstore", async (req, res) => {
  const { store_name, store_description, store_tagline, owner_id } = req.body;
  try {
    await setDoc(
      doc(db, "stores", store_name),
      {
        store_name,
        store_description,
        store_tagline,
        owner_id,
        last_modified_at: new Date(),
      },
      { merge: true }
    );
    getOwnerStores(owner_id).then((stores) => {
      res
        .status(201)
        .json({ stores, redirect: `/admin/${stores[0].store_name}/home` });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/updatestore", async (req, res) => {
  const { store_id, data } = req.body;
  try {
    const docRef = await updateDoc(doc(db, "stores", store_id), data);
    res.status(201).json({ docRef });
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.delete("/deletestore", async (req, res) => {
  const { store_id, uid } = req.body;
  try {
    await deleteDoc(doc(db, "stores", store_id));
    getOwnerStores(uid).then((data) => {
      res.status(201).json({ data });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
