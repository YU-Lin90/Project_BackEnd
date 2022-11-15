const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
router.use("/checkDisConfirm", async (req, res) => {

  let storeSid = req.token.sid;

  let sql =
    "SELECT o.`sid`, o.`member_sid`, o.`shop_sid`, o.`store_order_sid`, o.`shop_memo`, o.`order_time`, o.`order_total`,  o.`sale`, o.`paid`, o.`pay_method`, o.`cook_time`,o.`total_amount`, m.`name` FROM `orders` o LEFT JOIN `member` m ON m.`sid` = o.`member_sid` WHERE o.`shop_sid` = ? AND o.`shop_order_status` = 0 AND o.`paid` = 1";

  let [getData] = await DB.query(sql, storeSid);



  getData.forEach((element) => {
    const time = element.order_time;
    const timeChanged = moment(time)
      .tz("Asia/Taipei")
      .format("HH:mm:ss");
    element.order_time = timeChanged;
    element.orderNumber = 'S' + element.sid + element.shop_sid + element.member_sid
  });



  return res.json(getData);
});


router.use("/checkConfirmed", async (req, res) => {

  let storeSid = req.token.sid;

  let sql =
    "SELECT o.`sid`, o.`member_sid`, o.`shop_sid`, o.`store_order_sid`, o.`order_time`, o.`order_total`, o.`sale`, o.`deliver_fee`, o.`shop_order_status`,o.`total_amount`, m.`name` ,so.`shop_accept_time` FROM `orders` o LEFT JOIN `member` m ON m.`sid` = o.`member_sid` LEFT JOIN `shop_order` so ON o.`store_order_sid` = so.`sid` WHERE o.`shop_order_status` =1 AND o.`shop_sid` = ? AND so.`cook_finish` = 0";

  let [getData] = await DB.query(sql, storeSid);

  getData.forEach((element) => {
    const time = element.order_time;
    const timeChanged = moment(time)
      .tz("Asia/Taipei")
      .format("HH:mm:ss");
    element.order_time = timeChanged;
    element.orderNumber = 'S' + element.sid + element.shop_sid + element.member_sid
    element.shop_accept_time = moment(element.shop_accept_time)
    .tz("Asia/Taipei")
    .format("HH:mm:ss")
  });
  return res.json(getData);
});

router.use("/checkCompleted", async (req, res) => {

  let storeSid = req.token.sid;

  let sql =
  "SELECT o.`sid`, o.`member_sid`,o.`deliver_sid`, o.`shop_sid`, o.`store_order_sid`, o.`order_time`, o.`order_total`, o.`sale`, o.`deliver_fee`, o.`shop_order_status`,o.`total_amount`, m.`name` ,so.`shop_accept_time`,so.`shop_complete_time` ,d.name deliver_name FROM `orders` o LEFT JOIN `member` m ON m.`sid` = o.`member_sid` LEFT JOIN `shop_order` so ON o.`store_order_sid` = so.`sid` LEFT JOIN `deliver` d ON o.`deliver_sid` = d.sid WHERE o.`shop_order_status` =1 AND o.`shop_sid` = ? AND so.`cook_finish` = 1";

  let [getData] = await DB.query(sql, storeSid);

  getData.forEach((element) => {
    const time = element.shop_complete_time;
    const timeChanged = moment(time)
      .tz("Asia/Taipei")
      .format("HH:mm:ss");
    element.shop_complete_time = timeChanged;
    element.orderNumber = 'S' + element.sid + element.shop_sid + element.member_sid
  });
  return res.json(getData);
});

module.exports = router;
