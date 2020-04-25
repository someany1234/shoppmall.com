var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userScheme = new Schema({
  "userId": {
    type: String,
  },
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [{
    "productId": String,
    "productName": String,
    "salePrice": String,
    "checked": String,
    "productNum": String,
    "productImage": String
  }],
  "addressList": [{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode": String,
    "tel": String,
    "isDefault": Boolean
  }]
});
module.exports = mongoose.model('User', userScheme)
