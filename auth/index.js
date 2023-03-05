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
  const { email, password, display_name } = req.body;
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(user, { displayName: display_name });
    await sendEmailVerification(user);
    const {
      uid,
      email: userEmail,
      emailVerified,
      phoneNumber,
      photoURL,
      displayName,
    } = user;

    if (emailVerified) {
      res.cookie("digimart_token", user.refreshToken);
      res.cookie("digimart_user", user, {
        maxAge: 1296000000,
        secure: true,
        httpOnly: true,
      });

      await createOwnerData({
        uid,
        userEmail,
        emailVerified,
        phoneNumber,
        photoURL,
        displayName,
        stores: [],
      });
      res.redirect(`/initcreatestore`);
    } else {
      res.cookie("digimart_token", user.refreshToken);
      res.cookie("digimart_user", user, {
        maxAge: 1296000000,
        secure: true,
        httpOnly: true,
      });

      res.status(400).json({ isVerified: false, error: "Email not verified" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (user.emailVerified) {
      res.cookie("digimart_token", user.refreshToken);
      res.cookie("digimart_user", user, {
        maxAge: 1296000000,
        secure: true,
        httpOnly: true,
      });

      getOwnerStores(user.uid)
        .then((stores) => {
          res.status(201).json({ stores });
        })
        .then((stores) => {
          res.redirect(`/${stores[0].store_id}/dashboard`);
        });
    } else {
      res.cookie("digimart_token", user.refreshToken);
      res.cookie("digimart_user", user, {
        maxAge: 1296000000,
        secure: true,
        httpOnly: true,
      });

      res.status(400).json({ isVerified: false, error: "Email not verified" });
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
  getOwnerStores(user.uid)
    .then((stores) => {
      res.status(201).json({ stores });
    })
    .then((stores) => {
      res.redirect(`/${stores[0].store_id}/dashboard`);
    });
});

router.post("/logout", async (req, res) => {
  try {
    await auth.signOut();
    res.clearCookie("digimart_token");
    res.clearCookie("digimart_user");
    res.status(200).json({ message: "User logged out" });
    res.redirect("/signin");
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
