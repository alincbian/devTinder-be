const router = require("express").Router();
const { signUp, login, logout } = require("../controllers/auth");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
