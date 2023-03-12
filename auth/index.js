const express = require("express");
const { auth } = require("../firebase/config.js");
const {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} = require("firebase/auth");
const getOwnerStores = require("../libs/getOwnerStore.js");
const createOwnerData = require("../libs/createOwnerData.js");

const router = express.Router();
router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(user, { displayName: username });
    await sendEmailVerification(user).then(() => {
      res.status(201).json({
        user,
        message: `Verification Email sent to ${user.email}`,
      });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (user.emailVerified) {
      await createOwnerData(user);

      getOwnerStores(user.uid).then((stores) => {
        if (stores.length > 0) {
          res
            .status(201)
            .json({ stores, redirect: `/admin/${stores[0].id}/home` });
        } else {
          res.status(201).json({ redirect: "/admin/initcreatestore" });
        }
      });
      res.cookie("digimart_token", user.refreshToken);
      res.cookie("digimart_user", user, {
        maxAge: 1296000000,
        secure: true,
        httpOnly: true,
      });
    } else {
      res
        .status(400)
        .json({ redirect: "/admin/verifyemail", error: "Email not verified" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.post("/loginwithgoogle", async (req, res) => {
  const { id_token } = req.body;
  const credential = GoogleAuthProvider.credential(id_token);
  const { user } = await signInWithCredential(auth, credential);
  res.status(201).json({ user });
});
router.post("/verfy-email", async (req, res) => {
  const { currentUser } = req.body;
  const { user } = await sendEmailVerification(currentUser);
  res.cookie("digimart_token", user.refreshToken);
  res.cookie("digimart_user", user, {
    maxAge: 1296000000,
    secure: true,
    httpOnly: true,
  });
  res.status(201).json({ user });
  getOwnerStores(user.uid).then((stores) => {
    res.status(201).json({ stores, redirect: `/admin/${stores[0].id}/home` });
  });
});

router.post("/logout", async (req, res) => {
  try {
    await auth.signOut();
    res.clearCookie("digimart_token");
    res.clearCookie("digimart_user");
    res
      .status(200)
      .json({ message: "User logged out", redirect: "/admin/auth/login" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
