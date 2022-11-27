const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}

router.get("/GetStoreDetail", async (req, res) => {
  const orderSid = req.query.orderSid;
  if (!orderSid) {
    return res.json(0);
  }
  const memberSid = req.token.sid;
  // console.log({orderSid,memberSid});
  const sql =
    "SELECT o.`sid` orderSid, s.`name` shopName , s.`address` FROM `orders` o LEFT JOIN `shop` s ON o.`shop_sid` = s.`sid` WHERE o.`member_sid` = ? AND o.`sid` = ?";
  const [[result]] = await DB.query(sql, [memberSid, orderSid]);
  // console.log(result);
  res.json(result);
});
//
router.get("/GetChattingContent", async (req, res) => {
  const orderSid = req.query.orderSid;
  if (!orderSid) {
    return res.json(0);
  }
  const sid = req.token.sid;
  const side = req.token.side;
  console.log({ orderSid, sid, side });
  // const sql = "SELECT o.`sid` orderSid, s.`name` shopName , s.`address` FROM `orders` o LEFT JOIN `shop` s ON o.`shop_sid` = s.`sid` WHERE o.`member_sid` = ? AND o.`sid` = ?"
  // const [[result]] = await DB.query(sql,[memberSid,orderSid])
  // console.log(result);

  const sql =
    "SELECT `sid`, `post_sid`, `post_side`, `receive_sid`, `receive_side`, `post_content`, `post_time`, `order_sid` FROM `messages` WHERE `order_sid`=? AND ((`post_sid` =? AND `post_side`=?) OR (`receive_sid` = ?  AND `receive_side` = ? )) ORDER BY post_time DESC";
  const [result] = await DB.query(sql, [orderSid,sid, side, sid, side]);
  result.forEach((v)=>{
    v.post_time= changeTime(v.post_time, 'MM/DD hh:mm:ss')
    v.post_content = v.post_content.slice(1,v.post_content.length - 1)
  })
  console.log(result);
  res.json(result);
});

module.exports = router;
