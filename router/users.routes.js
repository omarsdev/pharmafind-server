const router = require("express").Router();

const {
  createUser,
  getUsers,
  getUser,
  sendVerificationCode,
  loginUser,
  getMe,
  updateUser,
  getAllMyMessage,
  getAllMessageForPharmacy,
  sendUserPhoto,
} = require("../controller/userController");

const { protectUser } = require("../middleware/auth");

router.route("/").get(getUsers).post(createUser).put(protectUser, updateUser);
router.route("/code").post(sendVerificationCode);
router.route("/login").post(loginUser);
router.route("/me").get(protectUser, getMe);
router.route("/message").get(protectUser, getAllMyMessage);
router.route("/message/photo/:pharmacyId").post(protectUser, sendUserPhoto);
router.route("/message/:pharmacyId").get(protectUser, getAllMessageForPharmacy);
router.route("/:userId").get(getUser);

module.exports = router;
