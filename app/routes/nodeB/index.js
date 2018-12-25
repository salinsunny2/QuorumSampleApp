var express = require("express");
var router = express.Router();
const contractService = require("./NodeBServices");

/* GET users listing. */
router.get("/createItem/itemName/:name/itemPrice/:price", function(req, res, next) {
  let price = parseInt(req.params.price);
  let name = req.params.name;
  console.log(name, ' ', price)
  contractService.createItem(name, price, res);
});

router.get("/getItemPrice/:itemName", function(req, res, next) {
  console.log("came to get the bid");
  var itemName = req.params.itemName;
  contractService.getItemPriceByName(itemName, res);
});

router.get("/placeBid/item/:itemName/price/:bidPrice", function(req, res, next) {
  console.log("came to place a bid");
  let itemName = req.params.itemName;
  let bidPrice = parseInt(req.params.bidPrice);
  contractService.placeBid(itemName, bidPrice, res);
});
router.get("/getBid/item/:itemName", function(req, res, next) {
  console.log("came to get the bid");
  let itemName = req.params.itemName;
  contractService.getBid(itemName, res);
});
module.exports = router;
