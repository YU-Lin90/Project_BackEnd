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
  const sqlBefore = "SELECT `sid`, `name`, `email`, `password`, `address`, `phone`, `food_type_sid`, `bus_start`, `bus_end`, `rest_right`, `src`, `wait_time`, `average_evaluation` FROM `shop` WHERE    "
  //LIMIT 1
  const sqlAfter =  " `sid` !=101  ORDER BY RAND() LIMIT 1   "
  const fullSql = sqlBefore + sqlSpilit +sqlAfter
  // console.log('完整SQL:'+fullSql);
  const [[result]] = await DB.query(fullSql)
  res.json(result)
})


/*1	美式
2	日式
3	中式
4	義式
5	飲料
6	甜點*/

module.exports = router;