const { Pharmacist, Pharmacy } = require("../models");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const sendEmail = require("../utils/sendEmail");
const codeGenerate = require("../utils/codeGenerate");

exports.getPharmacists = asyncHandler(async (req, res, next) => {
  const pharmacists = await Pharmacist.findAll();

  return res.status(200).json({
    success: true,
    data: pharmacists,
  });
});

exports.getPharmacist = asyncHandler(async (req, res, next) => {
  const pharmacistId = req.params.pharmacistId;

  const pharmacists = await Pharmacist.findOne({
    where: {
      id: pharmacistId,
    },
  });

  if (!pharmacists) {
    return next(
      new ErrorResponse(`Pharmacist not found with id ${pharmacistId}`, 404)
    );
  }

  return res.status(200).json({
    success: true,
    data: pharmacists,
  });
});

exports.createPharmacist = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const newCode = codeGenerate();

  const pharmacist = await Pharmacist.create({
    name,
    email,
    password: newCode,
  });

  sendEmail(email, newCode);

  res.status(201).json({
    success: true,
    data: pharmacist,
  });
});

exports.createPharmacistByEmployee = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const newCode = codeGenerate();

  const pharmacist = await Pharmacist.create({
    name,
    email,
    password: newCode,
    isApprove: true,
  });

  res.status(201).json({
    success: true,
    data: pharmacist,
  });
});

exports.sendVerificationCode = asyncHandler(async (req, res, next) => {
  const email = req.body.email;

  const pharmacist = await Pharmacist.findOne({
    where: {
      email: email,
    },
  });

  if (!pharmacist) {
    return next(new ErrorResponse(`Email not found.`, 404));
  }

  const newCode = codeGenerate();

  pharmacist.password = newCode;
  await pharmacist.save();

  sendEmail(email, newCode);

  res.json({
    success: true,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse(`Phone number or password are not valid`, 400)
    );
  }

  const pharmacist = await Pharmacist.findOne({
    where: {
      email,
    },
  });

  if (!pharmacist) {
    return next(
      new ErrorResponse(`Phone number or password are not valid`, 400)
    );
  }

  if (!pharmacist.isApprove) {
    return next(
      new ErrorResponse(
        `Can not login until you account is not approve yet`,
        400
      )
    );
  }

  const isMatch = await bcrypt.compare(password, pharmacist.password);

  if (!isMatch) {
    return next(new ErrorResponse(`Not valid email or password`, 400));
  }

  const token = jwt.sign(
    { id: pharmacist.id, type: "pharmacist" },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
  });
});

exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", { maxAge: 1 }).json({
    success: true,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    data: req.pharmacist,
  });
});

exports.getAllPharmacistsNotApprove = asyncHandler(async (req, res, next) => {
  const pharmacists = await Pharmacist.findAll({
    where: {
      isApprove: false,
    },
  });

  return res.status(200).json({
    success: true,
    data: pharmacists,
  });
});

exports.approvePharmacists = asyncHandler(async (req, res, next) => {
  const pharmacistId = req.params.pharmacistId;

  const pharmacist = await Pharmacist.findByPk(pharmacistId);
  if (!pharmacist) {
    return next(
      new ErrorResponse(`Pharmacist not found with id ${pharmacistId}`, 404)
    );
  }

  if (pharmacist.isApprove) {
    return next(
      new ErrorResponse(`Pharmacist account is already approve`, 400)
    );
  }

  pharmacist.isApprove = true;

  await pharmacist.save();

  return res.status(200).json({
    success: true,
    data: pharmacist,
  });
});

exports.updateOpenPharmacy = asyncHandler(async (req, res, next) => {
  const { isOpen } = req.body;
  const pharmacist = req.pharmacist;

  const pharmacy = await Pharmacy.findByPk(pharmacist.Pharmacy.id);
  pharmacy.isOpen = isOpen;

  await pharmacy.save();

  res.json({
    success: true,
  });
});
