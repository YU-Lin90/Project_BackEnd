const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");

router.post("/GetRandomStoreWithType", async (req, res) => {
  //篩選完成 傳進來的是不要的
  const rejectTypes = req.body
  let sqlSpilit = ''
  for(let element of rejectTypes){
    const num = Number(element)
    // console.log(num);
    if(num){
      sqlSpilit+=` food_type_sid != ${num}  AND  `
      // sqlSpilit.push(` food_type_sid != ${num}  AND  `)
    }
  }
  // sqlSpilit = sqlSpilit.join(' AND ')

  // sqlSpilit = '(' + sqlSpilit +')'
  //[1,5]
  const sqlBefore = "SELECT `sid`, `name`, `address`, `food_type_sid` FROM `shop` WHERE    "
  //LIMIT 1
  const sqlAfter =  " `sid` !=101  ORDER BY RAND() LIMIT 30  "
  const fullSql = sqlBefore + sqlSpilit +sqlAfter
  // console.log('完整SQL:'+fullSql);
  const [result] = await DB.query(fullSql)
  const YY = new Date().getFullYear()
  const MM = new Date().getMonth() + 1 
  const DD = new Date().getDate()
  const dateString = YY + '-' + MM + '-' + DD
  const checkSql = 'SELECT * FROM `daily_coupon` WHERE `member_sid` = ? AND `get_date` = ?'
  //這個會拿到次數 或是NULL
  const a  = 'SELECT MAX(`count`)  FROM `daily_coupon` WHERE `member_sid` = ? AND `get_date` = ?'
  /*{
    "sid": 744,
    "name": "好吃壽司",
    "email": "S0965600842",
    "password": "S0965600842PS",
    "address": "台北市環河南路29號",
    "phone": "0965600842",
    "food_type_sid": 2,
    "bus_start": "830",
    "bus_end": "1730",
    "rest_right": 1,
    "src": "storeCover96",
    "wait_time": 30,
    "average_evaluation": 2.3
} */
  const gettedShopSid = result.sid
  
  res.json(result)
})

/*1	美式
2	日式
3	中式
4	義式
5	飲料
6	甜點*/

module.exports = router;