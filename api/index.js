const express = require("express");
const router = express.Router();
const ducksRouter = require("./ducks");
const usersRouter = require("./users");

router.use("/ducks", ducksRouter);
router.use("/users", usersRouter);

module.exports = router;
