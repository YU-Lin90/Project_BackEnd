const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
router.use("/checkDisConfirm", async (req, res) => {

  let storeSid = req.token.sid;

  let sql =
    "SELECT o.`sid`, o.`member_sid`, o.`shop_sid`, o.`store_order_sid`, o.`shop_memo`, o.`order_time`, o.`order_total`,  o.`sale`, o.`paid`, o.`pay_method`, o.`cook_time`, m.`name` FROM `orders` o LEFT JOIN `member` m ON m.`sid` = o.`member_sid` WHERE o.`shop_sid` = ? AND o.`shop_order_status` = 0";

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
    "SELECT o.`sid`, o.`member_sid`, o.`shop_sid`, o.`deliver_sid`, o.`store_order_sid`, o.`deliver_order_sid`, o.`shop_memo`, o.`deliver_memo`, o.`order_time`, o.`order_total`, o.`coupon_sid`, o.`sale`, o.`paid`, o.`pay_method`, o.`LinePayID`, o.`daily_coupon_sid`, o.`deliver_fee`, o.`cook_time`, o.`shop_order_status`, m.`name` FROM `orders` o LEFT JOIN `member` m ON m.`sid` = o.`member_sid` WHERE o.`shop_sid` = ?";

  let [getData] = await DB.query(sql, storeSid);

  getData.forEach((element) => {
    const time = element.order_time;
    const timeChanged = moment(time)
      .tz("Asia/Taipei")
      .format("YYYY-MM-DD HH:mm:ss");
    element.order_time = timeChanged;
  });
  return res.json(getData);
});

router.use("/checkCompleted", async (req, res) => {

  let storeSid = req.token.sid;

  let sql =
    "SELECT o.`sid`, o.`member_sid`, o.`shop_sid`, o.`deliver_sid`, o.`store_order_sid`, o.`deliver_order_sid`, o.`shop_memo`, o.`deliver_memo`, o.`order_time`, o.`order_total`, o.`coupon_sid`, o.`sale`, o.`paid`, o.`pay_method`, o.`LinePayID`, o.`daily_coupon_sid`, o.`deliver_fee`, o.`cook_time`, o.`shop_order_status`, m.`name` FROM `orders` o LEFT JOIN `member` m ON m.`sid` = o.`member_sid` WHERE o.`shop_sid` = ?" ;

  let [getData] = await DB.query(sql, storeSid);

  getData.forEach((element) => {
    const time = element.order_time;
    const timeChanged = moment(time)
      .tz("Asia/Taipei")
      .format("YYYY-MM-DD HH:mm:ss");
    element.order_time = timeChanged;
  });
  return res.json(getData);
});

module.exports = router;
