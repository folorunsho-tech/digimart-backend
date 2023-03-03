import { Router } from "express";
import { auth } from "../firebase/config";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getOwnerStores } from "../routes/store";

const router = Router();
router.post("/signup", async (req, res) => {
  const { email, password, display_name } = req.body;
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(user, { displayName: display_name });
    res.status(201).json({ user });
    res.redirect(`/createstore/${user.uid}`);
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    getOwnerStores(user.uid)
      .then((stores) => {
        res.status(201).json({ user, stores });
        return stores;
      })
      .then((stores) => {
        res.redirect(`/${stores[0].store_id}/dashboard`);
      });
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.post("loginwithgoogle", async (req, res) => {
  const { id_token } = req.body;
  const credential = GoogleAuthProvider.credential(id_token);
  const { user } = await signInWithCredential(auth, credential);
  res.status(201).json({ user });
});

module.exports = router;
