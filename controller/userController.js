const { Users, Chats, Messages, Pharmacy } = require("../models");

const fs = require("fs");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendEmail");
const codeGenerate = require("../utils/codeGenerate");
const sharp = require("sharp");

exports.getUsers = asyncHandler(async (req, res, next) => {
  const user = await Users.findAll();

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const newCode = codeGenerate();
  const user = await Users.create({
    name,
    email,
    password: newCode,
  });

  // sendEmail(email, newCode);
  const token = jwt.sign(
    { id: user.id, type: "user" },
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

  res.status(201).json({
    success: true,
    data: user,
    token
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await Users.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${userId}`, 404));
  }

  res.status(201).json({
    success: true,
    data: user,
  });
});

exports.sendVerificationCode = asyncHandler(async (req, res, next) => {
  const email = req.body.email;

  const user = await Users.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return next(new ErrorResponse(`Email not found.`, 404));
  }

  const newCode = codeGenerate();

  user.password = newCode;
  await user.save();

  sendEmail(email, newCode);

  res.json({
    success: true,
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new ErrorResponse(`Email or code are not enter`, 400));
  }

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new ErrorResponse(`Not valid email or password.`, 400));
  }

  // const isMatch = await bcrypt.compare(password.toString(), user.password);

  // if (!isMatch) {
  //   return next(new ErrorResponse(`Not valid email or password`, 400));
  // }

  const token = jwt.sign(
    { id: user.id, type: "user" },
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

exports.getMe = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    data: req.user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await Users.update(
    {
      firstName: req.body.firstName || req.user.firstName,
      lastName: req.body.lastName || req.user.lastName,
      phoneNumber: req.body.phoneNumber || req.user.phoneNumber,
      email: req.body.email || req.user.email,
    },
    {
      where: {
        id: req.user.id,
      },
    }
  );

  res.json({
    success: true,
    data: user,
  });
});

exports.getAllMyMessage = asyncHandler(async (req, res, next) => {
  const chat = await Chats.findAll({
    where: { userId: req.user.id },

    include: [
      {
        model: Pharmacy,
        attributes: ["id", "photo", "name"],
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

  res.json({
    success: true,
    data: chat,
  });
});

exports.getAllMessageForPharmacy = asyncHandler(async (req, res, next) => {
  const { pharmacyId } = req.params;

  const chat = await Chats.findOne({
    where: { userId: req.user.id, pharmacyId },

    include: [
      {
        model: Pharmacy,
        attributes: ["id", "photo", "name", "isOpen"],
      },
      {
        model: Messages,
        order: [["createdAt", "DESC"]],
        limit: 20,
      },
    ],
    attributes: ["id"],
  });

  if (!chat) {
    const pharmacy = await Pharmacy.findOne({
      where: { id: pharmacyId },
      attributes: ["id", "photo", "name", "isOpen"],
    });

    let newChat = {};
    newChat.Pharmacy = pharmacy;
    newChat.Messages = [];

    res.json({
      success: true,
      data: newChat,
    });
  } else {
    res.json({
      success: true,
      data: chat,
    });
  }
});

exports.sendUserPhoto = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { pharmacyId } = req.params;

  if (!req.files?.photos) {
    return next(new ErrorResponse(`Please add a photo`, 400));
  }

  let photos = req.files.photos;
  console.log(photos);

  if (!photos.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  const chat = await Chats.findOne({
    where: { userId: user.id, pharmacyId },
  });

  if (!chat) {
    return next(
      new ErrorResponse(`Chat not found please send message first`, 400)
    );
  }

  const chatPath = `${process.env.FILE_UPLOAD_USER_MESSAGE}/${chat.id}`;
  if (!fs.existsSync(chatPath)) {
    fs.mkdirSync(chatPath);
  }

  sharp(photos.data)
    .toFormat("jpg")
    .jpeg({ quality: 20 })
    .toFile(`${chatPath}/${photos.name}`);

  // const message = await Messages.create({
  //   chatId: chat.id,
  //   message: ,
  //   fromUserId: user.id,
  // });

  res.json({
    success: true,
    data: `${process.env.APP_HOST}/chat/${chat.id}/${photos.name}`,
  });
});
