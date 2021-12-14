const router = require("express").Router();

const {
  createScheduleTime,
  getAllScheduleTime,
  getScheduleTimeById
} = require("../controller/scheduleTimeController");

router.route("/").get(getAllScheduleTime).post(createScheduleTime);
router.route("/:scheduleTimeId").get(getScheduleTimeById)

module.exports = router;
