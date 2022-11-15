const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
const jwt = require('jsonwebtoken');

//接單、完成訂單

router.use("/ConfirmOrder", async (req, res) => {

  let storeSid = req.token.sid;

  //這裡要拿訂單SID 更新接單狀態
  //前端要發{sid:訂單SID,member_sid:會員SID,shop_memo:商店備註}
  const orderSid = req.body.sid
  const memberSid = req.body.member_sid
  const shopMemo = req.body.shop_memo

  let sql =
    "UPDATE `orders` SET `shop_order_status`=1 WHERE sid = ?";
  let [updateResult] = await DB.query(sql, storeSid);
  //寫入店家訂單
  const insertSql = "INSERT INTO `shop_order`( `member_sid`, `order_sid`, `shop_memo`, `shop_accept_time`,`shop_sid`) VALUES (?,?,?,?,?)"
  //[memberSid,orderSid,shopMemo,NOW(),storeSid]
  let [insertResult] = await DB.query(insertSql,[memberSid,orderSid,shopMemo,NOW(),storeSid]);
  const OP = [updateResult,insertResult]

  return res.json(OP);
});

router.use("/CompleteOrder", async (req, res) => {

  let storeSid = req.token.sid;

  let sql =
    "SELECT o.`sid`, o.`member_sid`, o.`shop_sid`, o.`store_order_sid`, o.`shop_memo`, o.`order_time`, o.`order_total`,  o.`sale`, o.`paid`, o.`pay_method`, o.`cook_time`, m.`name` FROM `orders` o LEFT JOIN `member` m ON m.`sid` = o.`member_sid` WHERE o.`shop_sid` = ? AND o.`shop_order_status` = 0";

  let [getData] = await DB.query(sql, storeSid);




  return res.json(1);
});


module.exports = router;
