/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-08 15:55:12
 * @LastEditTime: 2021-05-17 12:33:30
 * @FilePath: /mp-wechat/src/pages/order/order.js
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
    contactDriver(phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
      });
    },
    contactService() {
      wx.makePhoneCall({
        phoneNumber: servicePhone,
      });
    },
    timeFormatter(value) {
      let timeStr =
        value.split(" ")[0] +
        (value.split(" ")[1] == "12:00:00" ? " 下午" : " 上午");
      return timeStr;
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
          if (res.data.code == 20000) {
            this.list = res.data.data;
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
    secondOrder(item) {
      let url = "../second/main?orderId=" + item.order_id;
      mpvue.navigateTo({ url });
    },
  },
  mounted() {
    this.fetchData();
  },
  // 页面显示时调用
  onShow() {
    this.fetchData();
  },
};
