var goods = require('../models/goods');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

mongoose.connect('mongodb://localhost:27017/dumall')
mongoose.connection.on("connected", function () {
  console.log('MongoDB connected success.')
});
mongoose.connection.on("error", function () {
  console.log('MongoDB connected fail.')
});
mongoose.connection.on("disconnected", function () {
  console.log('MongoDB connected disconnected.')
})


//商品列表，分页加载，过滤加载，排序
router.get('/list', function (req, res, next) {
  let sort = parseInt(req.query.sort);
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let limit = page * pageSize;
  var pricefilter = {}
  if (req.query.pricefiter != '{}') {
    pricefilter = {
      salePrice: {
        $gt: JSON.parse(req.query.pricefiter).startprice,
        $lt: JSON.parse(req.query.pricefiter).endprice
      }
    }
  }
  let goodModel = goods.find(pricefilter).limit(limit);
  goodModel.sort({
    'salePrice': sort
  });
  goodModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          goodslist: doc
        }
      })
    }
  })
})
router.post("/addCart", function (req, res, nex) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var users = require('../models/users');
  users.findOne({
    userId: userId
  }, function (err, userdoc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      if (userdoc) {
        var gooditem = ''
        userdoc.cartList.forEach(function (item) {
          if (item.productId == productId) {
            gooditem = item
            item.productNum++;
          }
        });
        if (gooditem) {
          userdoc.save(function (err, doc) {
            if (err) {
              res.json({
                status: 1,
                msg: err.message,
                result: ''
              })
            } else {
              res.json({
                status: 0,
                msg: "添加购物车成功",
                result: ''
              })
            }
          })
        } else {
          goods.findOne({
            productId: productId
          }, function (err1, prodoc) {
            if (err1) {
              res.json({
                status: 1,
                msg: err1.message,
                result: ''
              })
            } else {
              if (prodoc) {
                prodoc.productNum = 1;
                prodoc.checked = 1;
                userdoc.cartList.push(prodoc);
                userdoc.save(function (err2, doc) {
                  if (err2) {
                    res.json({
                      status: 1,
                      msg: err2.message,
                      result: ''
                    })
                  } else {
                    res.json({
                      status: 0,
                      msg: "添加购物车成功",
                      result: ''
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})


module.exports = router
