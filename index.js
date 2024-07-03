const path = require("path");
const express = require("express");
const config = require("./config/app");
const cors = require("cors");
const router = require("./router");
const http = require("http");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const app = express();

const folderChecking = require("./utils/folderChecking");
folderChecking();

// app.use(cors());
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Cookie Parser.
app.use(cookieParser());
//upload photo
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "images")));

app.use(router);

app.use(errorHandler);

const server = http.createServer(app);
const SocketServer = require("./socket");
SocketServer(server);

server.listen(config.appPort, () => {
  console.log(`server running on port http://localhost:${config.appPort}`);
});
