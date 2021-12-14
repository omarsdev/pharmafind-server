const { Employee } = require("../models");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAllEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findAll();

  res.status(200).json({
    success: true,
    data: employee,
  });
});

exports.getEmployee = asyncHandler(async (req, res, next) => {
  const employeeId = req.params.employeeId;

  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id ${employeeId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

exports.createEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.create(req.body);

  res.status(201).json({
    success: true,
    data: employee,
  });
});

exports.loginEmployee = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(`Not valid email or password`, 400));
  }

  const employee = await Employee.findOne({
    where: { email: email },
  });

  if (!employee) {
    return next(new ErrorResponse(`Not valid email or password`, 400));
  }

  const isMatch = await bcrypt.compare(password, employee.password);

  if (!isMatch) {
    return next(new ErrorResponse(`Not valid email or password`, 400));
  }

  const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

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

exports.logOutEmployee = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", { maxAge: 1 }).json({
    success: true,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    data: req.employee,
  });
});
