const express = require("express");
const router = express.Router();
const db = require("../modules/db_connect");
const upload = require("../modules/upload-img");

// 如果傳進來的sid不為零，找到該商品資料並且回傳
router.get("/edit-form", upload.single(), async (req, res) => {
  const { sid } = req.query;

  const data = {
    shop: {},
    types: {},
    product: {},
    options_types: {},
    options: {},
    only_options_types: {},
  };
  const shop_sql =
    "SELECT s.* FROM `shop` s LEFT JOIN `products` p ON p.shop_sid=s.sid WHERE p.sid=?";
  const [[shop_rows]] = await db.query(shop_sql, [sid]);

  const type_sql = "SELECT * FROM products_types WHERE shop_sid=?";
  const [type_rows] = await db.query(type_sql, [shop_rows.sid]);

  const product_sql = "SELECT * FROM `products` WHERE sid=?";
  const [[product_rows]] = await db.query(product_sql, [sid]);

  const option_type_sql =
    "SELECT ot.*, otpr.product_sid FROM `options_types` ot LEFT JOIN `options_types_products_relation` otpr ON ot.sid=otpr.options_type_sid LEFT JOIN `products` p ON otpr.product_sid=p.sid WHERE p.sid=?";
  const [option_type_rows] = await db.query(option_type_sql, [sid]);

  // const option_sql =
  //   "SELECT o.*, ot.shop_sid FROM `options` o LEFT JOIN `options_types` ot ON o.options_type_sid=ot.sid LEFT JOIN `options_types_products_relation` otpr ON ot.sid=otpr.options_type_sid LEFT JOIN `products` p ON otpr.product_sid=p.sid WHERE p.sid=?";
  // const [option_rows] = await db.query(option_sql, [sid]);
  const option_sql =
    "SELECT o.*, ot.shop_sid FROM `options` o LEFT JOIN `options_types` ot ON o.options_type_sid=ot.sid WHERE ot.shop_sid=?";
  const [option_rows] = await db.query(option_sql, [shop_rows.sid]);

  const only_option_type_sql =
    "SELECT * FROM `options_types` WHERE `shop_sid`=?";
  const [only_option_type_rows] = await db.query(only_option_type_sql, [
    shop_rows.sid,
  ]);

  data.shop = shop_rows;
  data.types = type_rows;
  data.product = product_rows;
  data.options_types = option_type_rows;
  data.options = option_rows;
  data.only_options_types = only_option_type_rows;

  console.log(data);
  res.json(data);
});

// 如果回傳為零，代表要新增資料，只需要回傳這個餐廳的選項類別和選項回去
router.get("/add-form", upload.single(), async (req, res) => {
  const { shop_sid } = req.query;

  const data = {
    shop: {},
    types: {},
    product: {},
    options_types: {},
    options: {},
    only_options_types: {},
  };
  const shop_sql = "SELECT s.* FROM `shop` s WHERE s.sid=?";
  const [[shop_rows]] = await db.query(shop_sql, [shop_sid]);

  const type_sql = "SELECT * FROM products_types WHERE shop_sid=?";
  const [type_rows] = await db.query(type_sql, [shop_sid]);

  // const product_sql = "SELECT * FROM `products` WHERE sid=?";
  // const [[product_rows]] = await db.query(product_sql, [sid]);

  // const option_type_sql =
  //   "SELECT ot.*, otpr.product_sid FROM `options_types` ot LEFT JOIN `options_types_products_relation` otpr ON ot.sid=otpr.options_type_sid LEFT JOIN `products` p ON otpr.product_sid=p.sid WHERE p.sid=?";
  // const [option_type_rows] = await db.query(option_type_sql, [sid]);

  // const option_sql =
  //   "SELECT o.*, ot.shop_sid FROM `options` o LEFT JOIN `options_types` ot ON o.options_type_sid=ot.sid LEFT JOIN `options_types_products_relation` otpr ON ot.sid=otpr.options_type_sid LEFT JOIN `products` p ON otpr.product_sid=p.sid WHERE p.sid=?";
  // const [option_rows] = await db.query(option_sql, [sid]);
  const option_sql =
    "SELECT o.*, ot.shop_sid FROM `options` o LEFT JOIN `options_types` ot ON o.options_type_sid=ot.sid WHERE ot.shop_sid=?";
  const [option_rows] = await db.query(option_sql, [shop_sid]);

  const only_option_type_sql =
    "SELECT * FROM `options_types` WHERE `shop_sid`=?";
  const [only_option_type_rows] = await db.query(only_option_type_sql, [
    shop_sid,
  ]);

  data.shop = shop_rows;
  data.types = type_rows;
  // data.product = product_rows;
  // data.options_types = option_type_rows;
  data.options = option_rows;
  data.only_options_types = only_option_type_rows;

  console.log(data);
  res.json(data);
});

router.get("/:shop_sid", async (req, res) => {
  const data = {
    types: {},
    products: {},
    options_types: {},
    only_options_types: {},
  };
  const { shop_sid } = req.params;

  const type_sql = "SELECT * FROM products_types WHERE shop_sid=?";
  const [type_rows] = await db.query(type_sql, [shop_sid]);
  console.log(shop_sid);
  // 從資料庫取得商品資料與其類別名稱
  const product_sql =
    "SELECT p.*,pt.name type_name FROM `products` p LEFT JOIN `products_types` pt ON p.`products_type_sid`=pt.`sid` WHERE p.shop_sid=?";
  const [product_rows] = await db.query(product_sql, [shop_sid]);
  // const [product_rows] = await db.query(product_sql, [89]);
  console.log(product_rows);

  // 從資料庫取得選項類別的資料，帶有product_sid
  const option_type_sql =
    "SELECT ot.*, otpr.product_sid FROM `options_types` ot LEFT JOIN `options_types_products_relation` otpr ON ot.sid=otpr.options_type_sid JOIN `products` p ON otpr.product_sid=p.sid WHERE p.shop_sid=?";
  const [option_type_rows] = await db.query(option_type_sql, [shop_sid]);

  const only_option_type_sql =
    "SELECT * FROM `options_types` WHERE `shop_sid`=?";
  const [only_option_type_rows] = await db.query(only_option_type_sql, [
    shop_sid,
  ]);

  const option_sql =
    "SELECT o.*, ot.shop_sid FROM `options` o LEFT JOIN `options_types` ot ON o.options_type_sid=ot.sid WHERE ot.shop_sid=?";
  const [option_rows] = await db.query(option_sql, [shop_sid]);

  data.types = type_rows;
  data.options = option_rows;
  data.products = product_rows;
  data.options_types = option_type_rows;
  data.only_options_types = only_option_type_rows;

  res.json(data);
});

router.post("/:shop_sid", upload.single("avatar"), async (req, res) => {
  console.log("post");
  console.log(req.file);
  console.log(req.body);
  const { shop_sid } = req.params;
  let { name, price, type, note, discount, options_types, available } =
    req.body;
  console.log(name, price, type, note, discount, options_types, available);

  const output = {
    success: false,
    error: "",
    postData: [req.body, req.file],
  };

  // 找到新增的這個product是那個type，取得這個type裡商品的總數，+1當作這個新商品的order
  const order_sql =
    "SELECT COUNT(1) num FROM `products_types` pt LEFT JOIN `products` p ON   pt.sid = p.products_type_sid WHERE pt.sid=?";
  const [[{ num: order }]] = await db.query(order_sql, [type]);

  // 找到上傳圖片的路徑名稱(檔名)，當作資料表中的src
  const src = req.file ? req.file.filename : "";
  available = available ? 1 : 0;
  discount = discount.trim() ? Number(discount) : 0;
  options_types = options_types ? options_types : [];

  // 把這個商品的基本資料填入
  const product_sql =
    "INSERT INTO `products`( `name`, `price`, `product_order`, `products_type_sid`,`shop_sid`, `src`, `note`, `available`, `discount`) VALUES (?,?,?,?,?,?,?,?,?)";
  const [product_result] = await db.query(product_sql, [
    name,
    price,
    order,
    type,
    shop_sid,
    src,
    note,
    available,
    discount,
  ]);

  // 新增此新商品下可以選擇的客製化選項群組的資料表
  const product_option_sql =
    "INSERT INTO `options_types_products_relation`( `product_sid`, `options_type_sid`) VALUES (?,?)";
  // 將一個一個的options_type跟新商品建立關係
  if (options_types && options_types.length > 0) {
    for (let i = 0; i < options_types.length; i++) {
      const [product_option_result] = await db.query(product_option_sql, [
        product_result.insertId,
        options_types[i],
      ]);
      console.log(product_option_result);
    }
  }
  res.json(output);
});

// 修改一筆資料，params傳入的值是要修改的product_sid
router.put("/:shop_sid", upload.single("avatar"), async (req, res) => {
  //  const {sid} = req.params;
  console.log("put");
  const { shop_sid } = req.params;
  let { sid, name, price, type, note, discount, options_types, available } =
    req.body;
  console.log(req.body);
  const output = {
    success: false,
    error: "",
    postData: [req.body, req.file],
  };

  // 找到上傳圖片的路徑名稱(檔名)，當作資料表中的src
  const src = req.file ? req.file.filename : "";
  available = available ? 1 : 0;
  discount = price;
  options_types = options_types ? options_types : [];

  try {
    // 如果有上傳新的圖片，就取代原有的src
    if (src && src !== "") {
      const product_sql =
        "UPDATE `products` SET `name`=?,`price`=?,`products_type_sid`=?,`src`=?,`note`=?,`available`=?,`discount`=? WHERE sid=?";
      const [result] = await db.query(product_sql, [
        name,
        price,
        type,
        src,
        note,
        available,
        discount,
        sid,
      ]);
    } else {
      // 如果沒有上傳新的圖片，就不更改原有的src。
      const product_sql =
        "UPDATE `products` SET `name`=?,`price`=?,`products_type_sid`=?,`note`=?,`available`=?,`discount`=? WHERE sid=?";
      const [result] = await db.query(product_sql, [
        name,
        price,
        type,
        note,
        available,
        discount,
        sid,
      ]);
    }

    // 先刪除這個商品跟所有option_type的關係
    const delete_relation_sql =
      "DELETE FROM `options_types_products_relation` WHERE product_sid=?";
    const [delete_relation_result] = await db.query(delete_relation_sql, [sid]);

    // 重新新增商品跟勾選option_type的關係
    const insert_relation_sql =
      "INSERT INTO `options_types_products_relation`(`product_sid`, `options_type_sid`) VALUES (?,?)";
    for (let i = 0; i < options_types.length; i++) {
      const [insert_relation_result] = await db.query(insert_relation_sql, [
        sid,
        options_types[i],
      ]);
      // console.log(`insert_relation_result-${i} : `, insert_relation_result);
    }

    // console.log("result : ", result);
    // console.log("delete_relation_result : ", delete_relation_result);
    // if (result.affectedRows && delete_relation_result.affectedRows) {
    //   output.success = true;
    // }
  } catch (e) {
    if (!e) {
      output.success = true;
    }
    output.error = e;
  }

  res.json(output);
  console.log(output);
});

router.delete("/:sid", upload.none(), async (req, res) => {
  const { sid } = req.params;
  const sql = "DELETE FROM `products` WHERE sid=?";
  const [result] = await db.query(sql, [sid]);
  res.json(result);
  console.log(result);
});

// router.get("/edit-form", upload.none(), async (req, res) => {
//   console.log(123);
//   const { sid } = req.query;

//   const data = {
//     shop: {},
//     types: {},
//     product: {},
//     options_types: {},
//     options: {},
//     only_options_types: {},
//   };

//   const shop_sql =
//     "SELECT s.* FROM `shop` s LEFT JOIN `products` p ON p.shop_sid=s.sid WHERE p.sid=?";
//   const [[shop_rows]] = await db.query(shop_sql, [sid]);

//   const type_sql = "SELECT * FROM products_types WHERE shop_sid=?";
//   const [type_rows] = await db.query(type_sql, [shop_sid]);

//   const product_sql = "SELECT * FROM `products` WHERE sid=?";
//   const [[product_rows]] = await db.query(product_sql, [sid]);

//   const option_type_sql =
//     "SELECT ot.*, otpr.product_sid FROM `options_types` ot LEFT JOIN `options_types_products_relation` otpr ON ot.sid=otpr.options_type_sid LEFT JOIN `products` p ON otpr.product_sid=p.sid WHERE p.sid=?";
//   const [option_type_rows] = await db.query(option_type_sql, [sid]);

//   const option_sql =
//     "SELECT o.*, ot.shop_sid FROM `options` o LEFT JOIN `options_types` ot ON o.options_type_sid=ot.sid LEFT JOIN `options_types_products_relation` otpr ON ot.sid=otpr.options_type_sid LEFT JOIN `products` p ON otpr.product_sid=p.sid WHERE p.sid=?";
//   const [option_rows] = await db.query(option_sql, [sid]);

//   const only_option_type_sql =
//     "SELECT * FROM `options_types` WHERE `shop_sid`=?";
//   const [only_option_type_rows] = await db.query(only_option_type_sql, [
//     shop_rows.sid,
//   ]);

//   data.shop = shop_rows;
//   data.types = type_rows;
//   data.product = product_rows;
//   data.options_types = option_type_rows;
//   data.options = option_rows;
//   data.only_options_types = only_option_type_rows;

//   console.log(data);
//   res.json(data);
// });

module.exports = router;
