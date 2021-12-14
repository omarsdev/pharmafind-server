const router = require("express").Router();

const {
  createEmployee,
  getAllEmployee,
  loginEmployee,
  logOutEmployee,
  getMe,
  getEmployee,
} = require("../controller/employeeController");

const { protectEmployee } = require("../middleware/auth");

router
  .route("/")
  .get(protectEmployee, getAllEmployee)
  .post(protectEmployee, createEmployee);
router.route("/me").get(protectEmployee, getMe);
router.route("/login").post(loginEmployee);
router.route("/logout").get(protectEmployee, logOutEmployee);
router.route("/:employeeId").get(protectEmployee, getEmployee);

module.exports = router;
