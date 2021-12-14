const {
  sequelize,
  ScheduleTime,
  Day,
  ScheduleTimeDays,
  Pharmacy,
  PharmacyTime,
} = require("../models");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.getAllScheduleTime = asyncHandler(async (req, res, next) => {
  const scheduleTime = await ScheduleTime.findAll({
    include: [
      {
        model: Day,
        as: "Days",
      },
    ],
  });

  res.status(201).json({
    success: true,
    data: scheduleTime,
  });
});

exports.getScheduleTimeById = asyncHandler(async (req, res, next) => {
  const scheduleTime = await ScheduleTime.findByPk(req.params.scheduleTimeId, {
    include: [
      {
        model: Day,
        as: "Days",
      },
    ],
  });

  if (!scheduleTime) {
    return next(
      new ErrorResponse(
        `Schedule time not found with id ${req.params.scheduleTimeId}`,
        404
      )
    );
  }

  res.status(201).json({
    success: true,
    data: scheduleTime,
  });
});

exports.createScheduleTime = asyncHandler(async (req, res, next) => {
  const pharmacyId = req.params.pharmacyId;

  const { endDate, startDate, dayId } = req.body;

  const t = await sequelize.transaction();

  try {
    const day = await Day.findByPk(dayId);
    if (!day) {
      return next(new ErrorResponse(`Day id is not valid`, 404));
    }

    const pharmacy = await Pharmacy.findByPk(pharmacyId);
    if (!pharmacy) {
      return next(
        new ErrorResponse(`Pharmacy not found with id ${pharmacyId}`, 404)
      );
    }

    const scheduleTime = await ScheduleTime.create(
      {
        endDate,
        startDate,
      },
      { transaction: t }
    );

    const scheduleTimeDay = await ScheduleTimeDays.create(
      {
        schedule_time_id: scheduleTime.id,
        day_id: day.id,
      },
      { transaction: t }
    );

    const pharmacyTime = await PharmacyTime.create(
      {
        scheduleTimeID: scheduleTime.id,
        pharmacyID: pharmacyId,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      success: true,
      data: scheduleTime,
    });
  } catch (e) {
    await t.rollback();
    return res.status(500).json({ status: "Error", message: e.message });
  }
});
