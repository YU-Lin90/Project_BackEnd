const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");

function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}

router.use("/getEvaTotalPages", async (req, res) => {
  const shopSid = req.query.shopSid
  const sql = "SELECT COUNT(1) totalRow FROM `shop_evaluation`  WHERE `shop_sid` = ?"
  const [[{ totalRow }]] = await DB.query(sql, shopSid)



  res.json(totalRow)
})


router.get("/getAllList", async (req, res) => {
  const shopSid = req.query.shopSid
  const pageNow = req.query.getPage
  const perPage = 24
  const sql = "SELECT m.`name`,se.`sid`, se.`order_sid`, se.`member_sid`, se. `evaluation_score`, se.`evaluation_content`, se.`evaluation_time`   FROM `shop_evaluation` se LEFT JOIN `member` m ON se.`member_sid` = m.`sid`  WHERE  se.`shop_sid` =?  ORDER BY se.`evaluation_content` DESC LIMIT ?,?"

  //${(queryPage - 1) * perPage}, ${perPage}
  const lowerPage = (pageNow - 1) * perPage
  const [result] = await DB.query(sql, [shopSid,lowerPage,perPage])
  result.forEach((v) => {
    v.evaluation_time = changeTime(v.evaluation_time, 'YYYY/MM/DD HH:mm:ss')
  })
  res.json(result)
})

module.exports = router;