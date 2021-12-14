const router = require("express").Router();

const {
  createPharmacist,
  getPharmacist,
  getPharmacists,
  login,
  getMe,
  logOut,
  createPharmacistByEmployee,
  approvePharmacists,
  getAllPharmacistsNotApprove,
  sendVerificationCode,
  updateOpenPharmacy,
} = require("../controller/pharmacistController");

const { protectEmployee, protectPharmacist } = require("../middleware/auth");

router.route("/").get(protectEmployee, getPharmacists).post(createPharmacist);
router.route("/code").post(sendVerificationCode);
router.route("/login").post(login);
router.route("/logout").get(protectPharmacist, logOut);
router.route("/me").get(protectPharmacist, getMe);
router.route("/employee").post(protectEmployee, createPharmacistByEmployee);
router.route("/updateOpen").put(protectPharmacist, updateOpenPharmacy);
router.route("/:pharmacistId").get(protectEmployee, getPharmacist);
router
  .route("/employee/notApprove")
  .get(protectEmployee, getAllPharmacistsNotApprove);

router.route("/approve/:pharmacistId").put(protectEmployee, approvePharmacists);

module.exports = router;
