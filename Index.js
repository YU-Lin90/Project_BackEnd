//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//前後端分離，不要用session
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//全域設定
//設定變數
require("dotenv").config();
//伺服器系統
const express = require("express");
//檔案系統
const multer = require("multer");
//時區
const moment = require("moment-timezone");
//資料庫連線模組
const DB = require(__dirname + "/modules/ConnectDataBase");
//圖片上傳模組  1012/1050
const upload = require(__dirname + "/modules/Upload_Imgs");
//搬移檔案系統
const fs = require("fs").promises;
//UUID 隨機碼
//     {解構賦值重設呼叫名}
const { v4: getv4 } = require("uuid");
const app = express();
const jwt = require("jsonwebtoken");
const orderSocket = express();

//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//跨域來源請求---React
//跨來源請求
const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.35.16:3000",
      "http://192.168.1.107:3000",
      "http://192.168.34.140:3000",

    ], //這邊改成他的伺服器(白名單)，有多個的時候用陣列表示
    optionsSuccessStatus: 200,
  })
);
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//檔頭解析
app.use(express.urlencoded({ extended: false }));
//解析JSON格式
app.use(express.json());
//FormData解析
app.post(multer().none(), async (req, res) => {
  next();
});
//Token Check
//===============================================分隔線================================================
//====※※※※※=============※========================================================================
//========※=================※=======※※※※==========================================================
//========※======※※※※===※==※===※====※===※※※=================================================
//========※======※====※===※※=====※※※※===※====※===============================================
//========※======※====※===※※=====※=========※====※===============================================
//========※======※※※※===※==※===※※※※===※====※===============================================
//===============================================分隔線================================================
//Token版  登入檢查程式 前端要送Token到後端
//確認完之後直接把資訊放在  req.token往下傳
//使用方式  路徑              中介函式                    API路由
//app.use("/MemberPointApi", memberTokenLoginCheck, require("./Api/Member/Member_PointApi"));
//在API路由內的req.token 可以拿到登入SID資訊等等
//其他GET、POST 等等的資料不會動到
//===============================================分隔線================================================
//會員
const memberTokenLoginCheck = async (req, res, next) => {
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  if (tokenGet === "null") {
    return res.json(0);
  } else {
    const parsedToken = jwt.verify(tokenGet, process.env.JWT_SECRET);
    const loginSql =
      "SELECT `sid`, `name`, `email` FROM `member` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
    const { email, sid, name } = parsedToken;
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      return res.json(0);
    } else {
      req.token = parsedToken;
      next();
    }
  }
};
//店家
const storeTokenLoginCheck = async (req, res, next) => {
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  if (tokenGet === "null") {
    return res.json(0);
  } else {
    const parsedToken = jwt.verify(tokenGet, process.env.JWT_SECRET);
    const loginSql =
      "SELECT `sid`, `name`, `email` FROM `shop` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
    const { email, sid, name } = parsedToken;
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      return res.json(0);
    } else {
      req.token = parsedToken;
      next();
    }
  }
};
//外送員
const deliverTokenLoginCheck = async (req, res, next) => {
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  if (tokenGet === "null") {
    return res.json(0);
  } else {
    const parsedToken = jwt.verify(tokenGet, process.env.JWT_SECRET);
    const loginSql =
      "SELECT `sid`, `name`, `email` FROM `deliver` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
    const { email, sid, name } = parsedToken;
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      return res.json(0);
    } else {
      req.token = parsedToken;
      next();
    }
  }
};
//管理員
const adminTokenLoginCheck = async (req, res, next) => {
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  if (tokenGet === "null") {
    return res.json(0);
  } else {
    const parsedToken = jwt.verify(tokenGet, process.env.JWT_SECRET);
    const loginSql =
      "SELECT `sid`, `name`, `email` FROM `shop` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
    const { email, sid, name } = parsedToken;
    if (sid !== 101) {
      return res.json(0);
    }
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      return res.json(0);
    } else {
      req.token = parsedToken;
      next();
    }
  }
};

//===============================================分隔線================================================
//時間格式轉換 直接回傳值  傳入時間,新格式   changeTime(oldTime,"YYYY-MM-DD HH:mm:ss")
function changeTime(oldTime,form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}

//購物流程
//LinePay
app.post(
  "/LinePaySetOrder",
  memberTokenLoginCheck,
  require("./API/Shopping/BeforeLinePay")
);
app.use("/LinePay", require("./API/Shopping/LinePay"));
app.use("/oldLinePay", require("./Modules/LinePay"));


//結帳頁顯示(資料)
app.use("/Pay",memberTokenLoginCheck,require("./API/Shopping/PayGetDatas"))
//結帳頁 獲得等待時間(資料)
app.get("/PayGetWaitTime", async (req, res) => {
  //PayGetWaitTime/?sid=
  const sql = "SELECT `wait_time` FROM `shop` WHERE `sid` = ?";
  const [[{ wait_time }]] = await DB.query(sql, req.query.sid);
  console.log(wait_time);
  res.json(wait_time);
});

//結帳頁 現金支付(動作)
app.post("/CashPay", memberTokenLoginCheck, require("./API/Shopping/CashPay"));
//首頁 優惠券資訊(資訊)
app.get('/HomePageGetCoupon',require("./API/Member/HomePage_Coupon"))
//===============================================分隔線================================================
//會員
//會員中心紅利點數(資料)
app.use("/MemberPointApi", require("./Api/Member/Member_PointApi"));
//會員中心 現在訂單 (資料)
app.use("/MemberOrderCheck", memberTokenLoginCheck, require("./API/Member/Member_CheckOrder"));
//會員中心 歷史訂單(資料)
app.use("/MemberOldOrder",memberTokenLoginCheck,require("./API/Member/Member_CheckOldOrder"))
//會員中心 給予評價(動作)
app.use("/OrderCommand",memberTokenLoginCheck,require("./API/Member/Member_OrderCommand"))
//===============================================分隔線================================================
//錚
//會員紅利點數(資料)
app.use("/MemberPointApi", require("./Api/Member/Member_PointApi"));
//會員
app.use('/MemberLogin', require("./API/Member/address-book"));

//會員獲得優惠券(資料)
app.use("/MemberCouponGetRenderApi", require("./API/Member/Member_CouponGetRenderApi"));

//會員獲得優惠券(動作)
app.use("/MemberCouponGetApi", require("./API/Member/Member_CouponGetApi"));
//===============================================分隔線================================================

//客服
app.use(
  "/Member/ChatServiceToAdmin",
  [memberTokenLoginCheck],
  require("./Modules/ServiceSystemForDB")
);
//===============================================分隔線================================================
//店家
app.get('/store-list',async (req, res) => {
  const sql = 'SELECT * FROM `shop` WHERE 1'
  const [rows] = await DB.query(sql)
  res.send(rows)
})

app.use("/store-admin/overview", require("./routes/overview"));
app.use("/store-admin/type", require("./routes/type"));
app.use("/store-admin/product", require("./routes/product"));
app.use("/store-admin/option", require("./routes/option"));
//客服
app.use(
  "/Store/ChatServiceToAdmin",
  [storeTokenLoginCheck],
  require("./Modules/ServiceSystemForDB")
);
//店家訂單(資料)
app.use(
  "/StoreOrders",
  [storeTokenLoginCheck],
  require("./API/Store/CheckOrder")
);
//店家訂單(動作)
app.use(
  "/StoreConfirmOrders",
  [storeTokenLoginCheck],
  require("./API/Store/ConfirmOrder")
);

//獲得正整數範圍，有含上限(最小值,最大值)
function getIntRange(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

//獲得正整數 含輸入的數到0
function getIntTo0(x) {
  return Math.floor(Math.random() * (x + 1));
}
//獲得正整數 含輸入的數到1
function getIntTo1(x) {
  return Math.floor(Math.random() * x + 1);
}

//隨機生成訂單用
app.get("/randomOrder", async (req, res) => {
  const SQL =
    "INSERT INTO `orders`(`member_sid`,`shop_sid` , `shop_memo`, `order_time`, `order_total`, `sale`, `paid`, `pay_method`, `total_amount`) VALUES (?,?,?,NOW(),?,?,?,?,?)";
  const price = getIntTo1(20) * 50;
  const [result] = await DB.query(SQL, [
    getIntTo1(50),
    89,
    "",
    price,
    price,
    1,
    0,
    getIntTo1(20),
  ]);
  console.log(result);
  res.json(result);
});
//購物車測試頁叫資料
app.get("/getTempProductList", async (req, res) => {
  const sql = "SELECT * FROM `products` WHERE `shop_sid` = 89";

  const [result] = await DB.query(sql);

  res.json(result);
});

//外送員

app.use(
  "/Deliver/ChatServiceToAdmin",
  [deliverTokenLoginCheck],
  require("./Modules/ServiceSystemForDB")
);

//管理者
//優惠券管理(資料)
app.use(
  "/AdminCouponRenderApi",
  require("./Api/Admin/Coupon/Admin_CouponRenderApi")
);
//優惠券管理(動作)
app.post(
  "/AdminCouponEditApi",
  adminTokenLoginCheck,
  require("./Api/Admin/Coupon/Admin_CouponEditApi")
);
app.use(
  "/AdminService",
  adminTokenLoginCheck,
  require("./Api/Admin/Service/Admin_ServiceRenderApi")
);

//===============================================分隔線================================================
//Token登入
app.use("/Login", require("./Modules/TokonLoginApi"));

//Token登入檢查  只檢查登入 不會用到登入的資訊
app.use("/LoginCheck", require("./Modules/TokonLoginCheckApi"));
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※

//設定根目錄資料夾 通常放在404前面
app.use(express.static("Public"));
app.use("/uploads",express.static("uploads"));


app.use("/images", express.static("Images"));

//設定PORT
const port = process.env.SERVER_PORT || 3001;
//設定監聽port
const server = app.listen(port, () => {
  console.log("路由伺服器啟動，埠號:", port);
});
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※

//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//WebSocket 客服
require(__dirname + "/Modules/WebSocket")(server);

//傳送訂單進度
const orderServer = orderSocket.listen('3200', () => {
  console.log("訂單伺服器啟動，埠號:", '3200');
});
require(__dirname + "/Modules/OrderWebSocket")(orderServer);

//傳送GEOLOCATIN
// const deliverServer = express().listen('3500', () => {
//   console.log("外送進度伺服器啟動，埠號:", '3500');
// });;
// require(__dirname + "/Modules/DeliverWebSocket")(deliverServer);



//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//404頁面 放最後
app.use((req, res) => {
  res.status(404).send("No Pages");
});
