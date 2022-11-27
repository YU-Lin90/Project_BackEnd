const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");

router.get("/GetStoreDetail", async (req, res) => {
  const orderSid = req.query.orderSid
  if(!orderSid){
    return res.json(0)
  }
  const memberSid = req.token.sid
  console.log({orderSid,memberSid});
  const sql = "SELECT o.`sid` orderSid, s.`name` shopName , s.`address` FROM `orders` o LEFT JOIN `shop` s ON o.`shop_sid` = s.`sid` WHERE o.`member_sid` = ? AND o.`sid` = ?"
  const [[result]] = await DB.query(sql,[memberSid,orderSid])
  console.log(result);
  res.json(result)
})

module.exports = router;