const router = require("express").Router();

const {
  createCity,
  createCountry,
  getAllCities,
  getAllCountries,
  getCity,
  getCountry,
  updateCountry,
  updateCity,
  getAllStreet,
  createStreet,
  getStreet,
  updateStreet,
} = require("../controller/AddressController");

const { protectEmployee } = require("../middleware/auth");

router
  .route("/country")
  .get(getAllCountries)
  .post(protectEmployee, createCountry);

router
  .route("/country/:countryId")
  .get(getCountry)
  .put(protectEmployee, updateCountry);

router
  .route("/city/:countryId")
  .get(getAllCities)
  .post(protectEmployee, createCity);

router
  .route("/street/:cityId")
  .get(getAllStreet)
  .post(protectEmployee, createStreet);

router.route("/city/one/:cityId").get(getCity).put(protectEmployee, updateCity);
router
  .route("/street/one/:streetId")
  .get(getStreet)
  .put(protectEmployee, updateStreet);

module.exports = router;
