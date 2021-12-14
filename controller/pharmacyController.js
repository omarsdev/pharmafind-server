const fs = require("fs");
const path = require("path");

const { Pharmacy, Pharmacist, Chats, Users, Messages } = require("../models");
const { Op } = require("sequelize");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const sharp = require("sharp");

var moment = require("moment-timezone");

exports.createPharmacyByPharmacist = asyncHandler(async (req, res, next) => {
  const {
    name,
    details,
    latitude,
    longitude,
    locationDescription,
    start_time,
    end_time,
  } = req.body;

  const pharmacy = await Pharmacy.create({
    name,
    details,
    latitude,
    longitude,
    locationDescription,
    start_time,
    end_time,
    PharmacistId: req.pharmacist.id,
  });

  res.status(201).json({
    success: true,
    data: pharmacy,
  });
});

exports.createPharmacyByEmployee = asyncHandler(async (req, res, next) => {
  const { name, details, latitude, longitude, pharmacistId } = req.body;

  const pharmacist = await Pharmacist.findByPk(pharmacistId);
  if (!pharmacist) {
    return next(
      new ErrorResponse(`Pharmacist not found with id ${pharmacistId}`, 404)
    );
  }

  const pharmacy = await Pharmacy.create({
    name,
    details,
    latitude,
    longitude,
    PharmacistId: pharmacistId,
  });

  res.status(201).json({
    success: true,
    data: pharmacy,
  });
});

exports.getAllPharmacy = asyncHandler(async (req, res, next) => {
  // const { timeZone } = req.query;

  const pharmacy = await Pharmacy.findAll();

  // pharmacy = JSON.stringify(pharmacy);
  // pharmacy = JSON.parse(pharmacy);

  // pharmacy.map((element) => {
  //   const now = moment.tz(new Date(), timeZone);
  //   const startTime = moment
  //     .tz(new Date(element.start_time).toISOString(), timeZone)
  //     .format("hh:mm:ss a");
  //   const endTime = moment
  //     .tz(new Date(element.end_time).toISOString(), timeZone)
  //     .format("hh:mm:ss a");

  //   if (
  //     now.diff(moment(startTime, "hh:mm:ss a"), "minutes") > 0 &&
  //     moment(endTime, "hh:mm:ss a").diff(now, "minutes") > 0
  //   ) {
  //     element.online = true;
  //   } else {
  //     element.online = false;
  //   }
  // });

  res.status(200).json({
    success: true,
    data: pharmacy,
  });
});

exports.getPharmacyById = asyncHandler(async (req, res, next) => {
  const pharmacyId = req.params.pharmacyId;
  const { timeZone } = req.query;

  var pharmacy = await Pharmacy.findByPk(pharmacyId);

  pharmacy = JSON.stringify(pharmacy);
  pharmacy = JSON.parse(pharmacy);

  const now = moment.tz(new Date(), timeZone);
  const startTime = moment
    .tz(new Date(pharmacy.start_time).toISOString(), timeZone)
    .format("hh:mm:ss a");
  const endTime = moment
    .tz(new Date(pharmacy.end_time).toISOString(), timeZone)
    .format("hh:mm:ss a");

  if (
    now.diff(moment(startTime, "hh:mm:ss a"), "minutes") > 0 &&
    moment(endTime, "hh:mm:ss a").diff(now, "minutes") > 0
  ) {
    pharmacy.online = true;
  } else {
    pharmacy.online = false;
  }

  res.status(200).json({
    success: true,
    data: pharmacy,
  });
});

exports.getAllPharmacyEmployee = asyncHandler(async (req, res, next) => {
  const pharmacy = await Pharmacy.findAll({
    include: [
      {
        model: Pharmacist,
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: pharmacy,
  });
});

exports.searchPharmacy = asyncHandler(async (req, res, next) => {
  const pharmacy = await Pharmacy.findAndCountAll({
    where: {
      name: {
        [Op.iLike]: `${req.query.search}%`,
      },
    },
  });

  res.status(200).json({
    success: true,
    data: pharmacy,
  });
});

exports.uploadPhotoPharmacy = asyncHandler(async (req, res, next) => {
  const pharmacist = req.pharmacist;

  if (!pharmacist.Pharmacy) {
    return next(new ErrorResponse(`Please create pharmacy first`, 400));
  }

  if (!req.files?.photos) {
    return next(new ErrorResponse(`Please add a photo`, 400));
  }

  let photos = req.files.photos;

  if (!photos.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  const pharmacyPath = `${process.env.FILE_UPLOAD_PATH_PHARMACY}/${pharmacist.Pharmacy.id}`;
  if (!fs.existsSync(pharmacyPath)) {
    fs.mkdirSync(pharmacyPath);
  }

  photos.name = `${pharmacist.Pharmacy.name.toLowerCase()}${
    pharmacist.Pharmacy.id
  }${path.parse(photos.name).ext}`;

  sharp(photos.data)
    .toFormat("jpg")
    .jpeg({ quality: 100 })
    .toFile(`${pharmacyPath}/${photos.name}`);

  const updatePharmacy = await Pharmacy.update(
    {
      photo: `${photos.name}`,
    },
    {
      where: {
        id: pharmacist.Pharmacy.id,
      },
    }
  );

  res.json({
    success: true,
    updatePharmacy,
  });
});

exports.getPharmacyUserMessage = asyncHandler(async (req, res, next) => {
  const chat = await Chats.findAll({
    where: { pharmacyId: req.pharmacist.Pharmacy.id },

    include: [
      {
        model: Users,
        attributes: ["id", "name"],
      },
      {
        model: Messages,
        attributes: ["id", "message", "createdAt"],
        order: [["createdAt", "DESC"]],
        limit: 1,
      },
    ],
    attributes: ["id"],
  });

  res.status(200).json({
    success: true,
    data: chat,
  });
});

exports.getUserMessage = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const chat = await Chats.findOne({
    where: { pharmacyId: req.pharmacist.Pharmacy.id, userId },

    include: [
      {
        model: Users,
        attributes: ["id", "name"],
      },
      {
        model: Messages,
        // attributes: ["id", "message", "createdAt"],
        order: [["createdAt", "DESC"]],
        limit: 20,
      },
    ],
    attributes: ["id"],
  });

  res.status(200).json({
    success: true,
    data: chat,
  });
});

exports.getAllPharmacyLocation = asyncHandler(async (req, res, next) => {
  const pharmacy = await Pharmacy.findAll({
    attributes: ["id", "name", "latitude", "longitude"],
  });

  res.json({
    success: true,
    data: pharmacy,
  });
});
