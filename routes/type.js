const express = require("express");
const router = express.Router();
const db = require("../modules/db_connect");
const upload = require("../modules/upload-img");

router.get("/:shop_sid", async (req, res) => {
  const data = {
    types: {},
    products: {},
  };
  const { shop_sid } = req.params;

  const type_sql = "SELECT * FROM products_types WHERE shop_sid=?";
  const [type_rows] = await db.query(type_sql, [shop_sid]);

  const product_sql = "SELECT * FROM `products` WHERE shop_sid=?";
  const [product_rows] = await db.query(product_sql, [shop_sid]);

  data.types = type_rows;
  data.products = product_rows;

  res.json(data);
});

// 儲存新增類別的API，sid是type_sid
router.post("/:shop_sid", upload.none(), async (req, res) => {
  const { shop_sid } = req.params;
  const { type_name } = req.body;
  console.log(req.body);

  const output = {
    success: false,
    error: "資料新增失敗",
  };

  // 計算目前order排到第幾個
  const sql_order =
    "SELECT COUNT(1) as num FROM `products_types` WHERE shop_sid=?";
  try {
    const [[{ num }]] = await db.query(sql_order, [shop_sid]);
    const order = Number(num + 1);

    const sql =
      "INSERT INTO `products_types`( `name`, `shop_sid`, `type_order`) VALUES (?,?,?)";
    const result = await db.query(sql, [type_name, shop_sid, order]);

    if (result[0].affectedRows) {
      output.success = true;
      output.error = "";
    }
  } catch (e) {
    output.error = e;
  }

  res.json(output);
});

// 更新的儲存按鈕按下:
router.put("/:sid", upload.none(), async (req, res) => {
  const output = {
    success: false,
    error: "資料新增失敗",
  };

  const { sid } = req.params;
  const { type_name } = req.body;
  const sql = "UPDATE `products_types` SET `name`=? WHERE sid=?";
  try {
    const result = await db.query(sql, [type_name, sid]);

    if (result[0].affectedRows) {
      output.success = true;
      output.error = "";
    }
  } catch (e) {
    output.error = e;
  }
  res.json(output);
});

router.delete("/:sid", async (req, res) => {
  const { sid } = req.params;
  const sql = "DELETE FROM `products_types` WHERE sid=?";
  const result = await db.query(sql, [sid]);
});

module.exports = router;
