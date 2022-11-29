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
const jps = ['壽司','拉麵','丼','日本料理']
const chs = ['麵店','小吃店','便當','豆漿店']
const its = ['義大利麵','義式廚房',' PASTA','比薩']
const dks = ['咖啡','冷飲','果汁吧','鮮茶']
const dss = ['蛋糕','豆花','刨冰','甜點坊']
const types = [0,ams,jps,chs,its,dks,dss]
const nameList = ['好吃','平價','好再來','老饕','隨意','源味','優質','好饗','饗餚','餚享','家鄉','佳好','德新']//13個



router.get("/SetNewFakeShop", async (req, res) => {
  for (let i = 0 ;i<100;i++){
    const foodType = getIntTo1(6)
    const shopName = nameList[getIntTo0(12)] + types[foodType][getIntTo0(3)]
  
    const phone = ('09' + getIntTo0(99999999) +'0123456789').slice(0,10)
    const email = 'S' + phone
    const password = 'S' + phone + 'PS'
  
  
    const getRoadType = getIntTo0(2)
    const address = '台北市'+ roadList[getRoadType][getIntTo0(6)] + drList[getRoadType][getIntTo0(1)] + '路' + getIntTo1(100) + '號'
  
    const bus_start = 0830
    const bus_end = 1730
    const src = 'storeCover' + getIntTo1(100)
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
module.exports = router;