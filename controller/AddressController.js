const { Country, City, Street } = require("../models");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// Country

exports.getAllCountries = asyncHandler(async (req, res, next) => {
  const country = await Country.findAll({
    include: {
      model: City,
    },
  });

  res.json({
    success: true,
    data: country,
  });
});

exports.getCountry = asyncHandler(async (req, res, next) => {
  const countryId = req.params.countryId;

  const country = await Country.findByPk(countryId, {
    include: {
      model: City,
    },
  });

  if (!country) {
    return next(
      new ErrorResponse(`Country not found with id of ${countryId}`, 404)
    );
  }

  res.json({
    success: true,
    data: country,
  });
});

exports.createCountry = asyncHandler(async (req, res, next) => {
  const { name_en, name_ar } = req.body;

  const country = await Country.create({
    name_ar,
    name_en,
  });

  res.status(201).json({
    success: true,
    data: country,
  });
});

exports.updateCountry = asyncHandler(async (req, res, next) => {
  const countryId = req.params.countryId;
  const { name_ar, name_en } = req.body;

  const country = await Country.findByPk(countryId);

  country.name_en = name_en || country.name_en;
  country.name_ar = name_ar || country.name_ar;

  await country.save();

  res.json({
    success: true,
  });
});

// City
exports.getAllCities = asyncHandler(async (req, res, next) => {
  const countryId = req.params.countryId;

  const city = await City.findAll({
    where: {
      countryId,
    },
  });

  res.json({
    success: true,
    data: city,
  });
});

exports.getCity = asyncHandler(async (req, res, next) => {
  const cityId = req.params.cityId;

  const city = await City.findByPk(cityId);

  if (!city) {
    return next(new ErrorResponse(`City not found with id of ${cityId}`, 404));
  }

  res.json({
    success: true,
    data: city,
  });
});

exports.createCity = asyncHandler(async (req, res, next) => {
  const countryId = req.params.countryId;
  const { name_ar, name_en } = req.body;

  const country = await Country.findByPk(countryId);
  if (!country) {
    return next(
      new ErrorResponse(`Country not found with id of ${countryId}`, 404)
    );
  }

  const city = await City.create({
    name_ar,
    name_en,
    countryId,
  });

  res.json({
    success: true,
    data: city,
  });
});

exports.updateCity = asyncHandler(async (req, res, next) => {
  const cityId = req.params.cityId;
  const { name_ar, name_en } = req.body;

  const city = await City.findByPk(cityId);

  city.name_en = name_en || city.name_en;
  city.name_ar = name_ar || city.name_ar;

  await city.save();

  res.json({
    success: true,
  });
});

//Street
exports.getAllStreet = asyncHandler(async (req, res, next) => {
  const cityId = req.params.cityId;

  const street = await Street.findAll({
    where: {
      cityId,
    },
  });

  res.json({
    success: true,
    data: street,
  });
});

exports.getStreet = asyncHandler(async (req, res, next) => {
  const streetId = req.params.streetId;

  const street = await Street.findByPk(streetId);
  if (!street) {
    return next(
      new ErrorResponse(`Street not found with id of ${streetId}`, 404)
    );
  }

  res.json({
    success: true,
    data: street,
  });
});

exports.createStreet = asyncHandler(async (req, res, next) => {
  const cityId = req.params.cityId;
  const { name_en, name_ar } = req.body;

  const city = await City.findByPk(cityId);
  if (!city) {
    return next(new ErrorResponse(`City not found with id of ${cityId}`, 404));
  }

  const street = await Street.create({
    name_en,
    name_ar,
    cityId,
  });

  res.json({
    success: true,
    data: street,
  });
});

exports.updateStreet = asyncHandler(async (req, res, next) => {
  const streetId = req.params.streetId;
  const { name_en, name_ar } = req.body;

  const street = await Street.findByPk(streetId);

  street.name_en = name_en || street.name_en;
  street.name_ar = name_ar || street.name_ar;

  await street.save();

  res.json({
    success: true,
  });
});
