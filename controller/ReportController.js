const { Users, Pharmacist, Report } = require("../models");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.createUserReport = asyncHandler(async (req, res, next) => {
  const { description } = req.body;

  const report = await Report.create({
    description,
    userId: req.user.id,
  });

  res.json({
    success: true,
    data: report,
  });
});

exports.createPharmacistReport = asyncHandler(async (req, res, next) => {
  const { description } = req.body;

  const report = await Report.create({
    description,
    pharmacistId: req.pharmacist.id,
  });

  res.json({
    success: true,
    data: report,
  });
});

exports.getAllUsersReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findAll({
    where: {
      pharmacistId: null,
    },
    include: {
      model: Users,
    },
  });

  res.json({
    success: true,
    data: report,
  });
});

exports.getAllPharmacistReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findAll({
    where: {
      userId: null,
    },
    include: {
      model: Pharmacist,
    },
  });

  res.json({
    success: true,
    data: report,
  });
});
