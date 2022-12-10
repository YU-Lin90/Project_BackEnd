const express = require("express");
const router = express.Router();
const DB = require("./ConnectDataBase");
const moment = require("moment-timezone");

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

const roadsNS = ['新生','環河','中山','復興','敦化','光復','西寧']
const roadsWE = ['忠孝','長安','南京','民生','民權','民族','和平']
const roadsND = ['信義','仁愛','中華','大安','基隆','安和','辛亥']
const roadList = [roadsNS,roadsWE,roadsND]
const directionNS = ['南','北']
const directionWE = ['東','西']
const directionND = ['','']
const drList = [directionNS,directionWE,directionND]

const ams = ['炸雞','漢堡','牛排','美式餐廳']
const amsImg = ['amF','amH','amS','amR']
const jps = ['壽司','拉麵','丼','日本料理']
const jpsImg = ['jpS','jpN','jpD','jpR']
const chs = ['麵店','小吃店','便當','豆漿店']
const chsImg = ['chN','chR','chB','chS']
const its = ['義大利麵','義式廚房',' PASTA','比薩']
const itsImg =['italyN','italyR','italyN','italyP']
const dks = ['咖啡','冷飲','果汁吧','鮮茶']
const dksImg = ['dkC','dkD','dkF','dkT']
const dss = ['蛋糕','豆花','冰品','甜點坊']
const dssImg = ['dsC','dsB','dsI','dsR']
const types = [0,ams,jps,chs,its,dks,dss]
const nameList = ['好吃','平價','好再來','老饕','隨意','源味','優質','好饗','饗餚','餚享','家鄉','佳好','德新']//13個

const imgList = [0,amsImg,jpsImg,chsImg,itsImg,dksImg,dssImg]

//Setfakedata/SetNewFakeShop
router.get('/updateOld100',async(req,res)=>{
  for (let i = 0 ;i<100;i++){
    const sql = "UPDATE `shop` SET `src`=? WHERE `sid` = ?"
    const srcName = 'store' + i + '.jpg'
    await DB.query(sql,[srcName,i])
  }
  res.json(1)
})


router.get("/SetNewFakeShop", async (req, res) => {
  for (let i = 0 ;i<100;i++){
    const foodType = getIntTo1(6)
    const shopNameIndex = getIntTo0(3)
    const shopName = nameList[getIntTo0(12)] + types[foodType][shopNameIndex]
  
    const phone = ('09' + getIntTo0(99999999) +'0123456789').slice(0,10)
    const email = 'S' + phone
    const password = 'S' + phone + 'PS'
  
  
    const getRoadType = getIntTo0(2)
    const address = '台北市'+ roadList[getRoadType][getIntTo0(6)] + drList[getRoadType][getIntTo0(1)] + '路' + getIntTo1(100) + '號'
  
    const bus_start = 0830
    const bus_end = 1730
    const src = imgList[foodType][shopNameIndex] + getIntTo1(8) + '.jpg'
    const waitTime = getIntTo1(10) * 5
    const eva = getIntTo1(50) / 10
  
    const datas = [shopName,email,password,address,phone,foodType,bus_start,bus_end,1,src,waitTime,eva]
  
    const sql = "INSERT INTO `shop`(`name`, `email`, `password`, `address`, `phone`, `food_type_sid`, `bus_start`, `bus_end`, `rest_right`, `src`, `wait_time`, `average_evaluation`) VALUES (?,?,?,?,? ,?,?,?,?,? ,?,?)"
    const [{insertId}] = await DB.query(sql,datas)
  }


  res.json(1)
})
//修正店家資料
router.get('/updateShopDatas',async(req,res)=>{

  const sql ="UPDATE `shop` SET `wait_time`= ? WHERE sid= ? "
  for(let i = 1 ;i<100;i++){
    // const phone = ('09' + getIntTo0(99999999) +'0123456789').slice(0,10)
    const eva = getIntTo1(10) * 5
    await DB.query(sql,[eva,i])    
  }
  res.json(1)
})
//隨機生成已完成訂單用
router.get("/randomOrder", async (req, res) => {
  const oneHour = 3600 * 1000;
  const hourPerWeek = 24 * 7;
  const newOrderDate = getIntRange(5, hourPerWeek) * oneHour;
  const newDay = new Date(new Date() - newOrderDate) ;

  //1107  總數
  const product1Amount = getIntTo1(5);
  //1108 總數
  const product2Amount = getIntTo1(6);

  const order_total = product1Amount * 120 + product2Amount * 155;
  const sale = order_total;
  const fee = getIntTo1(6) * 5;
  const total_amount = product1Amount + product2Amount;
  //1107 120
  //1108 155

  // return res.json(newDay);

  const orderSql =
    "INSERT INTO `orders`(`member_sid`, `shop_sid`, `deliver_sid`,`order_time`, `order_total`, `sale`, `paid`, `pay_method`, `deliver_fee`, `shop_order_status`, `deliver_order_status`, `total_amount`, `receive_name`, `receive_phone`, `receive_address`, `order_complete`) VALUES (1,89,1,?,?,?,1,0,?,1,1,?,'ゆう','0912345678','台北市大安區復興南路一段390號2樓',0)";

  const orderDetail = [newDay, order_total, sale, fee, total_amount];

  const [{ insertId: orderSid }] = await DB.query(orderSql, orderDetail);

  const detailSql =
    "INSERT INTO `order_detail`( `order_sid`, `product_sid`, `product_price`, `amount`) VALUES (?,?,?,?)";

  const productDetail1 = [orderSid, 1107, 120, product1Amount];

  const productDetail2 = [orderSid, 1108, 155, product2Amount];

  await DB.query(detailSql, productDetail1);
  await DB.query(detailSql, productDetail2);

  const shopOrderSql =
    "INSERT INTO `shop_order`(`member_sid`, `deliver_sid`, `order_sid`, `shop_accept_time`, `shop_complete_time`, `deliver_take`, `shop_sid`, `cook_finish`) VALUES (1,1,?,?,?,1,89,1)";
  const shop_accept_time =new Date(newDay.getTime() + oneHour)  ;
  const shop_complete_time = new Date(newDay.getTime() + oneHour * 2) ;
  const shopOrderDetail = [orderSid, shop_accept_time, shop_complete_time];

  const [{ insertId: shopOrderSid }] = await DB.query(
    shopOrderSql,
    shopOrderDetail
  );

  const deliverOrderSql =
    "INSERT INTO `deliver_order`( `member_sid`, `shop_sid`, `deliver_sid`, `store_order_sid`, `order_sid`,  `deliver_take_time`, `complete_time`, `order_finish`, `deliver_fee`,deliver_check_time) VALUES (1,89,1,?,?,?,?,1,?,?)";

  const deliver_take_time = new Date(newDay.getTime() + oneHour * 3) ;
  const complete_time = new Date(newDay.getTime() + oneHour * 4) ;
  const deliverOrderDetail = [
    shopOrderSid,
    orderSid,
    null,
    complete_time,
    fee,
    deliver_take_time
  ];
  console.log(deliverOrderDetail);
  const [{ insertId: deliverOrderSid }] = await DB.query(
    deliverOrderSql,
    deliverOrderDetail
  );

  const updateShopOrderSql =
    " UPDATE `shop_order` SET `deliver_order_sid`=? WHERE `order_sid` = ?";

  await DB.query(updateShopOrderSql, [deliverOrderSid, orderSid]);

  const updateOrderSql =
    "UPDATE `orders` SET `store_order_sid`= ?,`deliver_order_sid`=? WHERE `sid` = ?";

  await DB.query(updateShopOrderSql, [shopOrderSid,deliverOrderSid,orderSid]);
  console.log(orderSid);
  res.json(orderSid);
});

router.get("/RandomOrderStep4", async (req, res) => {
  const oneHour = 3600 * 1000;
  const hourPerWeek = 24 * 7;
  const newOrderDate = getIntRange(5, hourPerWeek) * oneHour;
  const newDay = new Date(new Date() - newOrderDate) ;

  //1107  總數
  const product1Amount = getIntTo1(5);
  //1108 總數
  const product2Amount = getIntTo1(6);

  const order_total = product1Amount * 120 + product2Amount * 155;
  const sale = order_total;
  const fee = getIntTo1(6) * 5;
  const total_amount = product1Amount + product2Amount;
  //1107 120
  //1108 155

  // return res.json(newDay);

  const orderSql =
    "INSERT INTO `orders`(`member_sid`, `shop_sid`, `deliver_sid`,`order_time`, `order_total`, `sale`, `paid`, `pay_method`, `deliver_fee`, `shop_order_status`, `deliver_order_status`, `total_amount`, `receive_name`, `receive_phone`, `receive_address`, `order_complete`) VALUES (1,89,1,?,?,?,1,0,?,1,1,?,'ゆう','0912345678','台北市大安區復興南路一段390號2樓',0)";

  const orderDetail = [newDay, order_total, sale, fee, total_amount];

  const [{ insertId: orderSid }] = await DB.query(orderSql, orderDetail);

  const detailSql =
    "INSERT INTO `order_detail`( `order_sid`, `product_sid`, `product_price`, `amount`) VALUES (?,?,?,?)";

  const productDetail1 = [orderSid, 1107, 120, product1Amount];

  const productDetail2 = [orderSid, 1108, 155, product2Amount];

  await DB.query(detailSql, productDetail1);
  await DB.query(detailSql, productDetail2);

  const shopOrderSql =
    "INSERT INTO `shop_order`(`member_sid`, `deliver_sid`, `order_sid`, `shop_accept_time`, `shop_complete_time`, `deliver_take`, `shop_sid`, `cook_finish`) VALUES (1,1,?,?,?,1,89,1)";
  const shop_accept_time =new Date(newDay.getTime() + oneHour)  ;
  const shop_complete_time = new Date(newDay.getTime() + oneHour * 2) ;
  const shopOrderDetail = [orderSid, shop_accept_time, shop_complete_time];

  const [{ insertId: shopOrderSid }] = await DB.query(
    shopOrderSql,
    shopOrderDetail
  );

  const deliverOrderSql =
    "INSERT INTO `deliver_order`( `member_sid`, `shop_sid`, `deliver_sid`, `store_order_sid`, `order_sid`,  `deliver_take_time`, `complete_time`, `order_finish`, `deliver_fee`,deliver_check_time) VALUES (1,89,1,?,?,?,?,1,?,?)";

  const deliver_take_time = new Date(newDay.getTime() + oneHour * 3) ;
  const complete_time = new Date(newDay.getTime() + oneHour * 4) ;
  const deliverOrderDetail = [
    shopOrderSid,
    orderSid,
    null,
    complete_time,
    fee,
    deliver_take_time
  ];
  console.log(deliverOrderDetail);
  const [{ insertId: deliverOrderSid }] = await DB.query(
    deliverOrderSql,
    deliverOrderDetail
  );

  const updateShopOrderSql =
    " UPDATE `shop_order` SET `deliver_order_sid`=? WHERE `order_sid` = ?";

  await DB.query(updateShopOrderSql, [deliverOrderSid, orderSid]);

  const updateOrderSql =
    "UPDATE `orders` SET `store_order_sid`= ?,`deliver_order_sid`=? WHERE `sid` = ?";

  await DB.query(updateOrderSql, [shopOrderSid,deliverOrderSid,orderSid]);
  console.log(orderSid);
  res.json(orderSid);
});

//更新經緯度資料
//SELECT `sid`, `name`, `email`, `password`, `address`, `phone`, `food_type_sid`, `bus_start`, `bus_end`, `rest_right`, `src`, `wait_time`, `average_evaluation`, `shop_lat`, `shop_lng` FROM `shop` WHERE 1

router.get('/GetAllAddress',async(req,res)=>{
  const sql = "SELECT `sid`, `address` FROM `shop` WHERE `sid` < 101"
  const [result] = await DB.query(sql)
  res.json(result)  
})
router.post('/Updatelatlng',async(req,res)=>{
  const postData = req.body
  const updateSql = "UPDATE `shop` SET `shop_lat`=?,`shop_lng`=? WHERE `sid` = ?"
  const totalRes = []
  for (let element of postData){
    const lat = element.lat
    const lng = element.lng
    const sid = element.sid
    const [result] = await DB.query(updateSql,[lat,lng,sid])
    totalRes.push(result)
  }
  res.json(totalRes)
})

const contentList = ['','超難吃','普通難吃','普普通通','還算好吃','非常好吃']
function getIntTo1(x) {
  return Math.floor(Math.random() * x + 1);
}
function getIntRange(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

router.get("/SetFakeShopEvas", async (req, res) => {
  for(let i = 1 ;i<101;i++){
    const oneHour = 3600 * 1000;
    const hourPerWeek = 24 * 7;
    const newOrderDate = getIntRange(5, hourPerWeek) * oneHour;
    const newDay = new Date(new Date() - newOrderDate) ;
  
    const randomScore = getIntTo1(5)
    const memberSid = getIntTo1(100)
    const orderSid = getIntRange(10000,99999)  
  
    const sql = "INSERT INTO `shop_evaluation`( `order_sid`, `member_sid`, `shop_sid`, `evaluation_score`, `evaluation_content`, `evaluation_time`) VALUES (?,?,?,?,?,?)"
    const inputDatas = [orderSid,memberSid,89,randomScore,contentList[randomScore],newDay]
  
    const [result] = await DB.query(sql,inputDatas)
  }
  res.json(1)
})



module.exports = router;