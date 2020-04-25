require('./../util/util')
var users = require('../models/users');
var express = require('express');
var router = express.Router();


//用户登入
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  users.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: "/",
          maxAge: 1000 * 60 * 60
        })
        res.cookie("userName", doc.userName, {
          path: "/",
          maxAge: 1000 * 60 * 60
        })
        res.json({
          status: "0",
          msg: '登录成功',
          result: {
            userName: doc.userName
          }
        })
      } else {
        res.json({
          status: "0",
          msg: '账号或者密码错误',
          result: {}
        })
      }

    }
  })
})
//用户登出
router.post('/logout', function (req, res, next) {
  res.cookie("userId", '', {
    maxAge: 0
  })
  res.cookie("userName", '', {
    maxAge: 0
  })
  res.json({
    status: 0,
    msg: '',
    result: ''
  })
});
//检查登录状态
router.get('/checklogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      result: req.cookies.userName
    })
  }
});
//获取购物车列表
router.get('/cartlist', function (req, res, next) {
  var userId = req.cookies.userId
  users.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: 'sucess',
        result: doc.cartList
      })
    }
  })
});
//商品增加、减少、选中状态
router.post('/cartedit', function (req, res, next) {
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  var userId = req.cookies.userId;
  users.findOne({
    userId: userId
  }, function (err, usdoc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      var cartList = usdoc.cartList
      cartList.forEach((item) => {
        if (item.productId == productId) {
          item.productNum = productNum;
          item.checked = checked;
        }
      });
      usdoc.save(function (err, doc) {
        if (err) {
          res.json({
            status: 1,
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: 0,
            msg: '',
            result: 'success'
          })
        }
      })
    }
  })
});
//商品全选和全不选
router.post('/checkall', function (req, res, next) {
  var checked = req.body.checked;
  var userId = req.cookies.userId;
  users.findOne({
    userId: userId
  }, function (err, usdoc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      usdoc.cartList.forEach(item => {
        item.checked = checked;
      });
      usdoc.save(function (err, doc) {
        if (err) {
          res.json({
            status: 1,
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: 0,
            msg: 'success',
            result: ''
          })
        }
      })
    }
  })
});
//商品删除
router.post('/delcart', function (req, res, next) {
  var productId = req.body.productId;
  var userId = req.cookies.userId;
  users.updateOne({
    userId: userId,
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, function (err, usdoc) {
    if (err) {
      res.json({
        status: 1,
        msg: message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: 'success'
      })
    }
  })
});
//初始化地址
router.get('/address', function (req, res, next) {
  var userId = req.cookies.userId;
  users.findOne({
    userId: userId
  }, function (err, usdoc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      var addressList = usdoc.addressList
      res.json({
        status: 0,
        msg: 'success',
        result: addressList
      })
    }
  })
})
//设置默认地址
router.post('/defaultAddress', function (req, res, next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  users.findOne({
    userId: userId
  }, function (err, usdoc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      var addressList = usdoc.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
      usdoc.save(function (err, doc) {
        if (err) {
          res.json({
            status: 1,
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: 0,
            msg: 'success',
            result: doc
          })
        }
      })
    }
  })
})
//删除地址
router.post('/delAddress', function (req, res, next) {
  var addressId = req.body.addressId;
  var userId = req.cookies.userId;
  users.updateOne({
    userId: userId,
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: doc.addressList
      })
    }
  })
})
//初始化订单列表
router.post('/orderconfirm', function (req, res, next) {
  var userId = req.cookies.userId;
  users.findOne({
    userId: userId,
  }, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: doc.cartList
      })
    }
  })
})
//订单确定
router.post("/payMent", function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  users.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      var address = '',
        goodsList = [];
      //获取当前用户的地址信息
      doc.addressList.forEach((item) => {
        if (addressId == item.addressId) {
          address = item;
        }
      })
      //获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item);
        }
      });

      var platform = '622';
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform + r1 + sysDate + r2;
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      };

      doc.orderList.push(order);

      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: "1",
            msg: err.message,
            result: ''
          });
        } else {
          res.json({
            status: "0",
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });
    }
  })
});
//查询订单
router.get("/orderDetail", function (req, res, next) {
  var userId = req.cookies.userId,
    orderId = req.param("orderId");
  users.findOne({
    userId: userId
  }, function (err, userInfo) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var orderList = userInfo.orderList;
      if (orderList.length > 0) {
        var orderTotal = 0;
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        });
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            status: '120002',
            msg: '无此订单',
            result: ''
          });
        }
      } else {
        res.json({
          status: '120001',
          msg: '当前用户未创建订单',
          result: ''
        });
      }
    }
  })
});
module.exports = router
