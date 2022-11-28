const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");

router.get("/GetAddress", async (req, res) => {
  const { side, orderSid }  = req.query
  // console.log(querys);
  //{ side: '1', orderSid: '1' }
  const deliverSid = req.token.sid
  console.log(deliverSid);
  //1
  const sql = "SELECT o.`receive_address` ,s.`name` shopName ,s.`address`, m.`name` memberName FROM `orders` o LEFT JOIN `shop` s ON o.`shop_sid` = s.`sid` LEFT JOIN `member` m ON o.`member_sid` = m.`sid` WHERE o.`sid` = ? AND o.`deliver_sid` = ?"
  const [[result]] = await DB.query(sql,[orderSid,deliverSid])
  

  res.json(result)
})

router.get('/GetOrderStep',async (req,res)=>{
  const deliverSid = req.token.sid
  const { orderSid }  = req.query
  const sql = "SELECT o.`receive_address` ,s.`name` shopName ,s.`address`, m.`name` memberName FROM `orders` o LEFT JOIN `shop` s ON o.`shop_sid` = s.`sid` LEFT JOIN `member` m ON o.`member_sid` = m.`sid` WHERE o.`sid` = ? AND o.`deliver_sid` = ?"
  const [[result]] = await DB.query(sql,[orderSid,deliverSid])
})

module.exports = router;