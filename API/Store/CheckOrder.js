const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
//未接單 概覽
router.use("/checkDisConfirm", async (req, res) => {

  let storeSid = req.token.sid;

  let sql =
    "SELECT o.`sid`, o.`member_sid`, o.`shop_sid`, o.`store_order_sid`, o.`shop_memo`, o.`order_time`, o.`order_total`,  o.`sale`, o.`paid`, o.`pay_method`, o.`cook_time`,o.`total_amount`, m.`name` FROM `orders` o LEFT JOIN `member` m ON m.`sid` = o.`member_sid` WHERE o.`shop_sid` = ? AND o.`shop_order_status` = 0 AND o.`paid` = 1 ";

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

//未接單 細節 傳訂單SID進來
router.use("/checkDisConfirmDetail", async (req, res) => {
  // console.log(req.body);
  // return res.json(1)
  const orderSid =req.body.orderSid
  let storeSid = req.token.sid;
  //訂單內容
  const checkOrderSql = "SELECT o.*, m.`name` memberName FROM `orders` o LEFT JOIN `member` m ON o.`member_sid` = m.`sid` WHERE o.`sid` = ? AND o.`shop_sid` = ?"
  const [[getData]] = await DB.query(checkOrderSql,[orderSid,storeSid]);
  //商品細節
  const productDetailSql = "SELECT od.* , p.`name` productName FROM `order_detail` od LEFT JOIN `products` p ON od.`product_sid` = p.`sid`    WHERE od.`order_sid` = ?"
  const [productDetails] = await DB.query(productDetailSql,orderSid);



    const time = getData.order_time;
    const timeChanged = moment(time)
      .tz("Asia/Taipei")
      .format("HH:mm:ss");
      getData.order_time = timeChanged;
      getData.orderNumber = 'S' + getData.sid + getData.shop_sid + getData.member_sid


  const output = {getData,productDetails}
  return res.json(output);

});

//已接單 概覽
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
//已接單 細節
router.use("/checkConfirmedDetail", async (req, res) => {

    // console.log(req.body);
  // return res.json(1)
  const orderSid =req.body.orderSid
  let storeSid = req.token.sid;
  //訂單內容
  const checkOrderSql = "SELECT o.*, m.`name` memberName FROM `orders` o LEFT JOIN `member` m ON o.`member_sid` = m.`sid` WHERE o.`sid` = ? AND o.`shop_sid` = ?"
  const [[getData]] = await DB.query(checkOrderSql,[orderSid,storeSid]);
  //商品細節
  const productDetailSql = "SELECT od.* , p.`name` productName FROM `order_detail` od LEFT JOIN `products` p ON od.`product_sid` = p.`sid`    WHERE od.`order_sid` = ?"
  const [productDetails] = await DB.query(productDetailSql,orderSid);



    const time = getData.order_time;
    const timeChanged = moment(time)
      .tz("Asia/Taipei")
      .format("HH:mm:ss");
      getData.order_time = timeChanged;
      getData.orderNumber = 'S' + getData.sid + getData.shop_sid + getData.member_sid


  const output = {getData,productDetails}
  return res.json(output);
});
//已完成 概覽
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
//已完成 細節
router.use("/checkCompletedDetail", async (req, res) => {

   // console.log(req.body);
  // return res.json(1)
  const orderSid =req.body.orderSid
  let storeSid = req.token.sid;
  //訂單內容
  const checkOrderSql = "SELECT o.*, m.`name` memberName FROM `orders` o LEFT JOIN `member` m ON o.`member_sid` = m.`sid` WHERE o.`sid` = ? AND o.`shop_sid` = ?"
  const [[getData]] = await DB.query(checkOrderSql,[orderSid,storeSid]);
  //商品細節
  const productDetailSql = "SELECT od.* , p.`name` productName FROM `order_detail` od LEFT JOIN `products` p ON od.`product_sid` = p.`sid`    WHERE od.`order_sid` = ?"
  const [productDetails] = await DB.query(productDetailSql,orderSid);



    const time = getData.order_time;
    const timeChanged = moment(time)
      .tz("Asia/Taipei")
      .format("HH:mm:ss");
      getData.order_time = timeChanged;
      getData.orderNumber = 'S' + getData.sid + getData.shop_sid + getData.member_sid


  const output = {getData,productDetails}
  return res.json(output);
});

module.exports = router;
