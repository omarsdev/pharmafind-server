const router = require("express").Router();

router.route("/home").get((req, res) => {
  return res.send("Hello World");
});

router.use("/user", require("./users.routes"));
router.use("/pharmacist", require("./pharmacist.routes"));
router.use("/day", require("./day.routes"));
router.use("/scheduletime", require("./scheduletime.routes"));
router.use("/pharamcy", require("./pharmacy.routes"));
router.use("/employee", require("./employee.routes"));
router.use("/address", require("./address.routes"));
router.use("/report", require("./report.routes"));

module.exports = router;
