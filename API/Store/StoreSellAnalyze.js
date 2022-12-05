const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}

router.use("/:sid", async (req, res, next) => {
  let sid = req.params.sid;

  // 測試用
  // let storeSid = 89;


  let sql = `SELECT order_total , order_time FROM orders  WHERE shop_sid = ${sid} ORDER BY sid DESC`;

  let [result] = await DB.query(sql);

  result.forEach((el)=>{
    el.order_time =  changeTime(el.order_time, 'YYYY/MM/DD HH:mm')
  })

  res.json(result);
});

module.exports = router;
