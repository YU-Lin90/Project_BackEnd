const express = require("express");
const router = express.Router();
const DB = require("./ConnectDataBase");
const moment = require("moment-timezone");

router.use("/", async (req, res) => {
  // console.log(req.session.member);
  //沒登入判定
  if (!req.token || !req.body) {
    return res.json(0);
  }
  //有登入才叫資料
  else {
    const sid = Number(req.token.sid);
    const side = Number(req.token.side);
    console.log(sid);
    const sql =
      "SELECT msg.`sid`, msg.`post_sid`, msg.`post_side`, msg.`receive_sid`, msg.`receive_side`, msg.`post_content`, msg.`post_time`, msg.`order_sid` , m.`name` FROM `messages` msg LEFT JOIN `member` m ON  m.`sid` =  msg.`post_sid` WHERE  ((msg.`receive_sid` = 101 AND msg.`post_sid` = ? AND msg.`receive_side` = 4 AND msg.`post_side` = ?) OR (msg.`post_sid` = 101 AND msg.`post_side` = 4 AND msg.`receive_sid` = ? AND msg.`receive_side` =? ))";
    //     post_sid  post_side  receive_sid  receive_side
    let [getData] = await DB.query(sql, [sid, side,sid,side]);
    // console.log(getData);
    for (let element of getData) {
      const postTime = moment(element.post_time)
        .tz("Asia/Taipei")
        .format("YYYY-MM-DD HH:mm:ss");
      element.post_time = postTime;
      element.post_content = element.post_content.slice(1,element.post_content.length - 1)
    }

    return res.json(getData);
  }
});
module.exports = router;
// const sql =
// "SELECT msg.`sid`, msg.`post_sid`, msg.`post_side`, msg.`receive_sid`, msg.`receive_side`, msg.`post_content`, msg.`post_time`, msg.`order_sid` , m.`name` FROM `messages` msg LEFT JOIN `member` m ON  m.`sid` =  msg.`post_sid`  WHERE msg.`receive_side` = 3 AND msg.`receive_sid` = 101 ORDER BY msg.`post_time` DESC";



// SELECT msg.* ,m.name
// FROM (SELECT
// `post_sid`,
// `post_side`,
// MAX(`post_time`) `post_time`
// FROM `messages`
// WHERE `receive_side` = 4
// AND `receive_sid` = 101
// GROUP BY `post_sid`) msg
// LEFT JOIN `member` m
// ON m.`sid` =  msg.`post_sid` 