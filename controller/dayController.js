const { Day } = require("../models");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.getAllDays = asyncHandler(async (req, res, next) => {
  const day = await Day.findAll();

  res.status(200).json({
    success: true,
    data: day,
  });
});

exports.getDay = asyncHandler(async (req, res, next) => {
  const dayId = req.params.dayId;

  const day = await Day.findOne({
    where: {
      id: dayId,
    },
  });

  if (!day) {
    return next(new ErrorResponse(`Day not found with id ${dayId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: day,
  });
});

exports.createDay = asyncHandler(async (req, res, next) => {
  const day = await Day.create(req.body);

  res.status(200).json({
    success: true,
    data: day,
  });
});
