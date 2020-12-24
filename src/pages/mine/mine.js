/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-08 15:55:12
 * @LastEditTime: 2020-12-24 09:34:02
 * @FilePath: /mp-wechat/src/pages/mine/mine.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
import { mapState } from "vuex";
import { servicePhone } from "../../../config/options";
export default {
  data() {
    return {
      list: [],
      orderInfo: null,
    };
  },
  computed: {
    ...mapState(["userID", "openID"]),
  },
  methods: {
    // 计算剩余支付时长
    leftPayTime(startTime) {
      console.log("函数调用");
      return "剩余支付时长：" + startTime + "分0秒";
    },
    contactDriver(info) {
      console.log(info.driver_phone);
      wx.makePhoneCall({
        phoneNumber: info.driver_phone,
      });
    },
    contactService() {
      wx.makePhoneCall({
        phoneNumber: servicePhone,
      });
    },
    payPrice(item, payType) {
      this.orderInfo = item;
      this.orderInfo.openId = this.openID;
      this.orderInfo.userId = this.userID;
      this.orderInfo.payType = payType;
      if (this.orderInfo == null) {
        return;
      }
      console.log(this.orderInfo);
      this.$wxRequest
        .post({
          url: "/public/order/wxpay2",
          data: this.orderInfo,
        })
        .then((res) => {
          if (res.data.code == 20000) {
            let re = res.data.data;
            var _this = this;
            wx.requestPayment({
              timeStamp: re.timeStamp,
              nonceStr: re.nonceStr,
              package: re.package,
              signType: re.signType,
              paySign: re.paySign,
              tradeNo: re.trade_no,
              success: function (res) {
                if (res.errMsg == "requestPayment:ok") {
                  Dialog.alert({
                    message: "下单成功",
                    confirmButtonText: "查看订单",
                  }).then(() => {
                    _this.orderInfo = null;
                    _this.fetchData();
                  });
                }
              },
              fail: function (res) {
                if (res.errMsg == "requestPayment:fail cancel") {
                  wx.showToast({
                    title: "支付取消",
                    icon: "none",
                  });
                } else {
                  wx.showToast({
                    title: res.errmsg,
                    icon: "none",
                  });
                }
              },
            });
          } else if (res.data.code == 20001) {
            console.log(res.data.data);
          }
        });
    },
    fetchData() {
      var _this = this;
      this.$wxRequest
        .get({
          url: "/mobile/order/query?userId=" + this.userID,
        })
        .then((res) => {
          if (res.data.code == "20000") {
            this.list = res.data.data;
            for (let i = 0; i < this.list.length; i++) {
              let obj = this.list[i];
              if (obj.car_id != null && obj.driver_id != null) {
                _this.$wxRequest
                  .get({
                    url:
                      "/mobile/order/query/info?carId=" +
                      obj.car_id +
                      "&driverId=" +
                      obj.driver_id,
                  })
                  .then((res) => {
                    if (res.data.code == "20000") {
                      obj.Info = res.data.data[0];
                      _this.list = [..._this.list];
                    }
                  });
              }
            }
          } else {
            wx.showToast({
              title: "数据获取失败",
              icon: "none",
            });
          }
        })
        .catch((error) => {
          console.log("获取订单列表失败");
        });
    },
  },
  mounted() {
    this.fetchData();
  },
  // 页面显示时调用
  onShow() {
    console.log("页面显示");
    this.fetchData();
  },
};
