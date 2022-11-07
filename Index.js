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

//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//跨域來源請求---React
//跨來源請求
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000",
    "http://192.168.35.16:3000",
    "http://192.168.1.107:3000"], //這邊改成他的伺服器(白名單)，有多個的時候用陣列表示
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
      req.token = parsedToken
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
      req.token = parsedToken
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
      req.token = parsedToken
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
      req.token = parsedToken
      next();
    }
  }
};




//===============================================分隔線================================================



//購物流程

//會員
//會員紅利點數(資料)
app.use("/MemberPointApi", require("./Api/Member/Member_PointApi"));


//店家

//外送員



//管理者
//優惠券管理(資料)
app.use(
  "/AdminCouponRenderApi",  
  require("./Api/Admin/Coupon/Admin_CouponRenderApi")
);
//優惠券管理(動作)
app.post(
  "/AdminCouponEditApi",adminTokenLoginCheck,  
  require("./Api/Admin/Coupon/Admin_CouponEditApi")
);














//===============================================分隔線================================================
//Token登入
app.use("/Login", require("./Modules/TokonLoginApi"));

//Token登入檢查  只檢查登入 不會用到登入的資訊
app.use("/LoginCheck", require("./Modules/TokonLoginCheckApi"));
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※

//設定根目錄資料夾 通常放在404前面
app.use(express.static("Public"));

//設定PORT
const port = process.env.SERVER_PORT || 3001;
//設定監聽port
const server = app.listen(port, () => {
  console.log("伺服器啟動，埠號", port);
});
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※

//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//WebSocket
//先不開 之後設定好再開
// require(__dirname + "/routes/WebSocket")(server);

//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//404頁面 放最後
app.use((req, res) => {
  res.status(404).send('No Pages');
});
