const express = require("express");
const router = express.Router();
const db = require("../modules/db_connect");
const upload = require("../modules/upload-img");

router.get("/:shop_sid", async (req, res) => {
  const data = {
    options_types: {},
    options: {},
  };
  const { shop_sid } = req.params;
  const option_type_sql = "SELECT * FROM `options_types` WHERE `shop_sid`=?";
  const [option_type_rows] = await db.query(option_type_sql, [shop_sid]);

  const option_sql =
    "SELECT o.*, ot.shop_sid FROM `options` o JOIN `options_types` ot ON o.options_type_sid=ot.sid WHERE ot.shop_sid=?";
  const [option_rows] = await db.query(option_sql, [shop_sid]);

  data.options_types = option_type_rows;
  data.options = option_rows;

  res.json(data);
});

router.post("/:shop_sid", upload.none(), async (req, res) => {
  const { shop_sid } = req.params;
  const { sid, name, min, max, optionData } = req.body;
  const output = {
    success: false,
    error: "",
    postData: req.body,
  };

  const option_type_sql =
    "INSERT INTO `options_types`(`name`, `shop_sid`, `max`, `min`) VALUES (?,?,?,?)";
  const [option_type_result] = await db.query(option_type_sql, [
    name,
    shop_sid,
    min,
    max,
  ]);
  console.log(option_type_result);
  const option_sql =
    "INSERT INTO `options`(`name`, `price`, `options_type_sid`) VALUES (?,?,?)";
  for (let i = 0; i < optionData.length; i++) {
    const [option_result] = await db.query(option_sql, [
      optionData[i].name,
      optionData[i].price,
      option_type_result.insertId,
    ]);
    console.log(option_result);
  }
});

router.put("/:shop_sid", async (req, res) => {
  const { shop_sid } = req.params;
  const { sid, name, min, max, optionData } = req.body;
  const output = {
    success: false,
    error: "",
    postData: req.body,
  };

  const option_type_sql =
    "UPDATE `options_types` SET `name`=?,`shop_sid`=?,`max`=?,`min`=? WHERE sid=?";
  const [option_type_result] = await db.query(option_type_sql, [
    name,
    shop_sid,
    max,
    min,
    sid,
  ]);
  console.log(option_type_result);

  // 處理選項時，先刪除目前這個選項類別下所有的選項
  const delete_option_sql = "DELETE FROM `options` WHERE options_type_sid=?";
  const [delete_option_result] = await db.query(delete_option_sql, [sid]);
  console.log(delete_option_result);
  // 接下來再insert所有的選項
  const insert_option_sql =
    "INSERT INTO `options`(`name`, `price`, `options_type_sid`) VALUES (?,?,?)";
  for (let i = 0; i < optionData.length; i++) {
    const [insert_option_result] = await db.query(insert_option_sql, [
      optionData[i].name,
      optionData[i].price,
      sid,
    ]);
    console.log(insert_option_result);
  }
});

router.delete("/:sid", upload.none(), async (req, res) => {
  const { sid } = req.params;

  // 刪掉所選的option_type
  const delete_option_type_sql = "DELETE FROM `options_types` WHERE sid=?";
  const [option_type_result] = await db.query(delete_option_type_sql, [sid]);
  console.log(option_type_result);

  // 刪掉所刪option_type下面的option
  const delete_option_sql = "DELETE FROM `options` WHERE options_type_sid=?";
  const [delete_option_result] = await db.query(delete_option_sql, [sid]);
  console.log(delete_option_result);
});

module.exports = router;
