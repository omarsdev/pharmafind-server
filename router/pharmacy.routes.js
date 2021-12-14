const router = require("express").Router();

const {
  getAllPharmacy,
  getPharmacyById,
  createPharmacyByEmployee,
  createPharmacyByPharmacist,
  getAllPharmacyEmployee,
  searchPharmacy,
  uploadPhotoPharmacy,
  getPharmacyUserMessage,
  getUserMessage,
  getAllPharmacyLocation,
} = require("../controller/pharmacyController");

const { protectEmployee, protectPharmacist } = require("../middleware/auth");

router
  .route("/")
  .get(getAllPharmacy)
  .post(protectPharmacist, createPharmacyByPharmacist);
router
  .route("/employee")
  .get(protectEmployee, getAllPharmacyEmployee)
  .post(protectEmployee, createPharmacyByEmployee);

router.route("/search").get(searchPharmacy);
router.route("/photo").put(protectPharmacist, uploadPhotoPharmacy);
router.route("/location").get(getAllPharmacyLocation);

router.route("/message").get(protectPharmacist, getPharmacyUserMessage);
router.route("/message/:userId").get(protectPharmacist, getUserMessage);

router.route("/:pharmacyId").get(getPharmacyById);

module.exports = router;
