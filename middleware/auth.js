const { Employee, Pharmacist, Pharmacy, Users } = require("../models");

const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");

const jwt = require("jsonwebtoken");

exports.protectEmployee = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findByPk(decoded.id);

    if (!employee) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    req.employee = employee;

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

exports.protectPharmacist = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const pharmacist = await Pharmacist.findByPk(decoded.id, {
      include: [
        {
          model: Pharmacy,
        },
      ],
    });

    if (!pharmacist) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    req.pharmacist = pharmacist;

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

exports.protectUser = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findByPk(decoded.id);
    // console.log(user);

    if (!user) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});
