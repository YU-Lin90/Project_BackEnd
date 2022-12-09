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
    "SELECT o.*, ot.shop_sid FROM `options` o LEFT JOIN `options_types` ot ON o.options_type_sid=ot.sid WHERE ot.shop_sid=?";
  const [option_rows] = await db.query(option_sql, [shop_sid]);

  data.options_types = option_type_rows;
  data.options = option_rows;

  res.json(data);
});
// 快速填入
router.post("/demo-data", upload.none(), async (req, res) => {
  // 填入option_type
  ot_data = [
    {
      sid: 101,
      name: "加料選擇",
      shop_sid: 41,
      max: 2,
      min: 0,
      options_type_order: 1,
    },
    {
      sid: 102,
      name: "尺寸選擇",
      shop_sid: 41,
      max: 1,
      min: 1,
      options_type_order: 2,
    },
    {
      sid: 103,
      name: "甜度選擇",
      shop_sid: 41,
      max: 1,
      min: 1,
      options_type_order: 3,
    },
    {
      sid: 104,
      name: "溫度選擇【冷飲】",
      shop_sid: 41,
      max: 1,
      min: 1,
      options_type_order: 4,
    },
    {
      sid: 105,
      name: "溫度選擇【熱飲】",
      shop_sid: 41,
      max: 1,
      min: 1,
      options_type_order: 5,
    },
    {
      sid: 106,
      name: "加購選擇",
      shop_sid: 41,
      max: 4,
      min: 0,
      options_type_order: 6,
    },
  ];
  for (let i = 0; i < ot_data.length; i++) {
    const { sid, name, shop_sid, max, min, options_type_order } = ot_data[i];
    const ot_sql =
      "INSERT INTO `options_types`(`sid`, `name`, `shop_sid`, `max`, `min`, `options_type_order`) VALUES (?,?,?,?,?,?)";
    const ot_result = await db.query(ot_sql, [
      sid,
      name,
      shop_sid,
      max,
      min,
      options_type_order,
    ]);
  }
  // 填入opt
  opt_data = [
    {
      sid: 101,
      name: "加珍珠",
      price: 5,
      options_type_sid: 101,
      option_order: 1,
    },
    {
      sid: 102,
      name: "加椰果",
      price: 5,
      options_type_sid: 101,
      option_order: 2,
    },
    {
      sid: 103,
      name: "加粉條",
      price: 5,
      options_type_sid: 101,
      option_order: 3,
    },
    {
      sid: 104,
      name: "加蒟蒻",
      price: 10,
      options_type_sid: 101,
      option_order: 4,
    },
    {
      sid: 105,
      name: "加寒天",
      price: 10,
      options_type_sid: 101,
      option_order: 5,
    },
    // 尺寸
    { sid: 106, name: "M", price: 0, options_type_sid: 102, option_order: 1 },
    { sid: 107, name: "L", price: 20, options_type_sid: 102, option_order: 2 },
    // 甜度
    {
      sid: 108,
      name: "無糖",
      price: 0,
      options_type_sid: 103,
      option_order: 1,
    },
    {
      sid: 109,
      name: "微糖",
      price: 0,
      options_type_sid: 103,
      option_order: 2,
    },
    {
      sid: 110,
      name: "半糖",
      price: 0,
      options_type_sid: 103,
      option_order: 3,
    },
    {
      sid: 111,
      name: "少糖",
      price: 0,
      options_type_sid: 103,
      option_order: 4,
    },
    {
      sid: 112,
      name: "正常糖",
      price: 0,
      options_type_sid: 103,
      option_order: 5,
    },
    // 冷飲
    {
      sid: 113,
      name: "正常冰",
      price: 0,
      options_type_sid: 104,
      option_order: 1,
    },
    {
      sid: 114,
      name: "少冰",
      price: 0,
      options_type_sid: 104,
      option_order: 2,
    },
    {
      sid: 115,
      name: "微冰",
      price: 0,
      options_type_sid: 104,
      option_order: 3,
    },
    {
      sid: 116,
      name: "去冰",
      price: 0,
      options_type_sid: 104,
      option_order: 4,
    },
    {
      sid: 117,
      name: "常溫",
      price: 0,
      options_type_sid: 104,
      option_order: 5,
    },
    {
      sid: 118,
      name: "溫",
      price: 0,
      options_type_sid: 104,
      option_order: 6,
    },
    {
      sid: 119,
      name: "熱",
      price: 0,
      options_type_sid: 104,
      option_order: 7,
    },
    // 熱飲
    {
      sid: 120,
      name: "常溫",
      price: 0,
      options_type_sid: 105,
      option_order: 1,
    },
    {
      sid: 121,
      name: "溫",
      price: 0,
      options_type_sid: 105,
      option_order: 2,
    },
    {
      sid: 122,
      name: "熱",
      price: 0,
      options_type_sid: 105,
      option_order: 3,
    },
  ];
  for (let i = 0; i < opt_data.length; i++) {
    const { sid, name, price, options_type_sid, option_order } = opt_data[i];
    const opt_sql =
      "INSERT INTO `options`(`sid`, `name`, `price`, `options_type_sid`, `option_order`) VALUES (?,?,?,?,?)";
    const opt_result = await db.query(opt_sql, [
      sid,
      name,
      price,
      options_type_sid,
      option_order,
    ]);
  }
  // 建立ot_opt關係
  otpr_data = [
    { sid: 201, product_sid: 2001, options_type_sid: 101 },
    { sid: 202, product_sid: 2001, options_type_sid: 102 },
    { sid: 203, product_sid: 2001, options_type_sid: 103 },
    { sid: 204, product_sid: 2001, options_type_sid: 104 },
  ];
  for (let i = 0; i < otpr_data.length; i++) {
    const { sid, product_sid, options_type_sid } = otpr_data[i];
    const otpr_sql =
      "INSERT INTO `options_types_products_relation`(`sid`, `product_sid`, `options_type_sid`) VALUES (?,?,?)";
    const otpr_result = await db.query(otpr_sql, [
      sid,
      product_sid,
      options_type_sid,
    ]);
  }

  res.send("OK");
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
    "INSERT INTO `options_types`(`name`, `shop_sid`, `min`, `max`) VALUES (?,?,?,?)";
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
      optionData[i].price ? optionData[i].price : 0,
      option_type_result.insertId,
    ]);
    console.log(option_result);
  }
  res.send("OK");
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
      optionData[i].price ? optionData[i].price : 0,
      sid,
    ]);
    console.log(insert_option_result);
  }
  res.send("OK");
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

  const delete_otpr_sql =
    "DELETE FROM `options_types_products_relation` WHERE options_type_sid=?";
  const [delete_otpr_result] = await db.query(delete_otpr_sql, [sid]);

  res.send("OK");
});

module.exports = router;
