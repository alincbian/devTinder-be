const router = require("express").Router();
const {
  viewProfile,
  editProfile,
  updatePassword,
} = require("../controllers/profile");
const { userAuth } = require("../middleware/auth");

router.get("/profile/view", userAuth, viewProfile);
router.patch("/profile/edit", userAuth, editProfile);
router.patch("/profile/password", userAuth, updatePassword);

module.exports = router;
