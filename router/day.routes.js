const router = require("express").Router();

const {
  createDay,
  getAllDays,
  getDay,
} = require("../controller/dayController");

router.route("/").get(getAllDays).post(createDay);
router.route("/:dayId").get(getDay);

module.exports = router;
