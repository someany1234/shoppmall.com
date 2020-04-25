var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productScheme = new Schema({
  "productId": {
    type: String,
  },
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "productUrl": String,
  "checked": String,
  "productNum": String,
});
module.exports = mongoose.model('Good', productScheme)
