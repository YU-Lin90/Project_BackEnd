const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
const jwt = require('jsonwebtoken');

//接單、完成訂單

router.use("/confirm", async (req, res) => {
  console.log(req.body);
  // return res.json(1);
  let storeSid = req.token.sid;

  //這裡要拿訂單SID 更新接單狀態
  //前端要發{sid:訂單SID,member_sid:會員SID,shop_memo:商店備註}
  const orderSid = req.body.sid
  const memberSid = req.body.member_sid
  // const shopMemo = req.body.shop_memo


  //寫入店家訂單
  const insertSql = "INSERT INTO `shop_order`( `member_sid`, `order_sid`, `shop_accept_time`,`shop_sid`) VALUES (?,?,NOW(),?)"
  //[memberSid,orderSid,shopMemo,NOW(),storeSid]
  let [insertResult] = await DB.query(insertSql,[memberSid,orderSid,storeSid]);
  const shopOrderSid =  insertResult.insertId

  //更新接單狀態
  let sql =
  "UPDATE `orders` SET `store_order_sid` = ? , `shop_order_status` = 1 WHERE sid = ?";
  let [updateResult] = await DB.query(sql, [shopOrderSid,orderSid]);
  const OP = [updateResult.affectedRows,insertResult.affectedRows]
  return res.json(OP);
});

router.use("/CompleteOrder", async (req, res) => {
  // return res.json(1);
  let storeSid = req.token.sid;

  //這裡要拿訂單SID 更新接單狀態
  //前端要發{sid:訂單SID,member_sid:會員SID,shop_memo:商店備註}
  const shopOrderSid = req.body.storeOrderSid

  //更新接單狀態
  let sql ="UPDATE `shop_order` SET `shop_complete_time`= NOW(),`cook_finish`=1 WHERE `shop_sid` = ? AND `sid` = ?" ;
  let [updateResult] = await DB.query(sql,[storeSid,shopOrderSid]);
  const OP = updateResult.affectedRows
  console.log(OP);
  return res.json(OP);


  // return res.json(1);
});


module.exports = router;