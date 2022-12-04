const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");

router.use("/", async (req, res, next) => {

  // let storeSid = req.token.sid;

// 測試用
  let storeSid = 89;
  let output = {};

  let sql =
    "SELECT o.sid , o.`order_total` FROM `orders` o WHERE o.`shop_sid` = 89 ORDER BY o.sid DESC";

  let [result] = await DB.query(sql, storeSid);

  output.result = result;
  res.json(result);
  console.log("get");

});

module.exports = router;
