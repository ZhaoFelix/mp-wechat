import Toast from "@vant/weapp/dist/toast/toast";
import Dialog from "@vant/weapp/dist/dialog/dialog";
import timeUtil from "../../utils/index.js";
import { servicePhone } from "../../../config/options";
import {
  uploadUrl,
  downloadUrl,
  processImage,
  previewImage,
  bucket,
  boxPrice,
} from "../../../config/options.js";
import { mapState } from "vuex";
var orderInfo = {
  name: "",
  phoneNumber: "",
  address: "上海市",
  subAddress: "",
  buildArea: "0",
  isFirst: "1",
  selectTime: "",
  orderNote: "",
  userProtocl: "1",
  imagesList: [],
  estate_id: "0",
  estate_plot: "",
  boxNumber: "",
};
// 时间选择器相关配置
var datePickerOptions = {
  minHour: 8,
  maxHour: 20,
  // 最小时间必须提前一个小时
  minDate: new Date().getTime() + 12 * 60 * 60 * 1000,
  //  最多可提前2天进行预约
  maxDate: new Date().setDate(new Date().getDate() + 3),
  currentDate: null,
  isChange: false,
};
// 错误信息对象
var errorMessage = {
  phoneMessage: "",
  areaMessage: "",
};
// oss对象信息
var OSS = {};
export default {
  data() {
    return {
      overlayshow: false,
      yesOrNo: false,
      show: false,
      plotPicker: false,
      columns: [],
      orderInfo,
      datePickerOptions,
      OSS,
      errorMessage,
      OSSAccessKeyId: "",
      policy: "",
      signature: "",
      dialogShow: false,
      text: "继续支付(3)s",
      totalTime: 3,
      color: "red",
      clock: null,

      filter(type, options) {
        if (type === "hour") {
          return options.filter((option) =>
            option == 8 || option == 12 ? option : ""
          );
        }
        if (type === "minute") {
          return options.filter((option) => option % 30 === 0);
        }
        return options;
      },
      datePickerformatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        } else if (type === "month") {
          return `${value}月`;
        } else if (type === "day") {
          return `${value}日`;
        } else if (type === "hour") {
          return value == 8 ? "上午" : "下午";
        } else {
          return "";
        }
      },
    };
  },
  watch: {
    plotPicker: function (newVal, oldVal) {
      if (newVal) {
        this.$wxRequest
          .get({
            url: "/mobile/order/query/plot?wechat_id=" + this.userID,
          })
          .then((res) => {
            let other = {
              text: "其他",
              id: 0,
            };
            let temArr = res.data.data;
            this.columns = [temArr[0], other];
            this.columns = [...this.columns];
            console.log(this.columns);
          })
          .catch((error) => {
            console.log("获取物业列表失败" + error);
          });
      }
    },
  },
  computed: {
    ...mapState(["userID", "userType", "openID"]),
    finalPrice: function () {
      console.log("计算价格");
      return boxPrice * this.orderInfo.boxNumber;
    },
  },
  methods: {
    showTimePicker() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    },
    onDialogClose() {
      clearInterval(this.clock);
      this.dialogShow = false;
      this.totalTime = 3;
      this.color = "red";
      this.text = "继续支付(3)s";
    },
    // 选择器确认按钮事件
    onConfirm(event) {
      let time = timeUtil.formatDateStr(new Date(event.mp.detail));
      // 判断选择器是否变化
      if (this.datePickerOptions.isChange) {
        let newStr = time.split(" ");
        this.orderInfo.selectTime =
          newStr[0] + (newStr[1] == "8:00" ? " 上午" : " 下午");
      }
      this.show = false;
    },
    onCancelPlotPicker() {
      this.plotPicker = false;
    },
    onConfirmPlotPicker(event) {
      console.log(event.mp.detail.value.text);
      this.orderInfo.estate_id = event.mp.detail.value.id;
      this.orderInfo.estate_plot = event.mp.detail.value.text;
      this.plotPicker = false;
    },
    onClickButton() {
      this.yesOrNo = false;
      this.firs = 1;
    },
    // 姓名
    onblurName(event) {
      this.orderInfo.name = event.mp.detail.value;
    },
    // 手机号
    onblurPhoneNumber(event) {
      this.orderInfo.phoneNumber = event.mp.detail.value;
    },
    // 姓名
    onblurNote(event) {
      this.orderInfo.orderNote = event.mp.detail.value;
    },
    onfocusPlotPicker() {
      this.plotPicker = true;
    },
    onchangePhoneNumber(event) {
      const phone = event.mp.detail || event;
      // 失去光标后进行判断
      if (event.mp.detail.value != undefined) {
        return;
      }
      if (phone) {
        if (/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
          this.errorMessage.phoneMessage = "";
        } else {
          this.errorMessage.phoneMessage = "您输入的手机号码有误";
        }
      } else {
        this.errorMessage.phoneMessage = "输入的手机号不能为空";
      }
    },
    // 地址
    onblurAddress(event) {
      this.orderInfo.subAddress = event.mp.detail.value;
    },
    // 装修面积
    onblurArea(event) {
      this.orderInfo.boxNumber = event.mp.detail.value;
    },
    onchangeArea(event) {
      const area = event.mp.detail || event;
      // TODO:升级判断方式
      if (event.mp.detail.value != undefined) {
        return;
      }
      if (area) {
        console.log(Number(area));
        if (isNaN(Number(area))) {
          this.errorMessage.areaMessage = "面积只能是数字";
        } else {
          this.errorMessage.areaMessage = "";
        }
      } else {
        this.errorMessage.areaMessage = "面积不能为空";
      }
    },
    afterRead(event) {
      const { file } = event.mp.detail;
      let fileName = bucket + new Date().getTime() + ".png";
      var _this = this;
      wx.uploadFile({
        url: uploadUrl, // 接口地址
        filePath: file.url,
        name: "file",
        formData: {
          key: fileName,
          policy: this.OSS.policy,
          OSSAccessKeyId: this.OSS.OSSAccessKeyId,
          signature: this.OSS.signature,
        },
        success(res) {
          _this.orderInfo.imagesList.push({
            url: downloadUrl + fileName + previewImage,
            name: "",
            thumb: downloadUrl + fileName + processImage,
          });
          _this.orderInfo.imagesList = [..._this.orderInfo.imagesList];
        },
        fail(error) {
          console.log(error);
        },
      });
    },
    // 删除图片
    deleteImage(event) {
      console.log(event.mp.detail.index);
      this.orderInfo.imagesList.pop(
        this.orderInfo.imagesList[event.mp.detail.index]
      );
      this.orderInfo.imagesList = [...this.orderInfo.imagesList];
    },
    // 时间选择器事件
    onChangeTime(event) {
      this.datePickerOptions.isChange = true;
    },
    onInput(event) {},
    //有关遮罩层
    onClickShow() {
      this.overlayshow = true;
    },
    onClickHide() {
      this.overlayshow = false;
    },
    protoclOnChange() {
      if (this.orderInfo.userProtocl == "1") {
        this.orderInfo.userProtocl = "0";
      } else {
        this.orderInfo.userProtocl = "1";
      }
    },
    // 提交订单
    submitOrder() {
      if (
        this.orderInfo.name == "" ||
        this.orderInfo.phoneNumber == "" ||
        this.orderInfo.subAddress == "" ||
        this.orderInfo.selectTime == "" ||
        this.orderInfo.boxNumber == 0
      ) {
        Toast.fail("信息不完整");
        return;
      } else if (this.orderInfo.userProtocl == 0) {
        Toast.fail("请勾选用户协议");
        return;
      } else if (this.orderInfo.imagesList.length < 2) {
        Toast.fail("至少上传两张照片");
        return;
      }
      this.dialogShow = true;
      // 倒计时5秒
      this.clock = setInterval(() => {
        this.totalTime--;
        this.text = "继续支付(" + this.totalTime + ")s";
        if (this.totalTime < 0) {
          clearInterval(this.clock);
          this.text = "继续支付";
          this.color = "#1989fa";
        }
      }, 1000);
    },
    // 调用微信支付
    wechatPay() {
      if (this.totalTime <= 0) {
        this.orderInfo.openId = this.openID;
        this.orderInfo.userId = this.userID;
        this.orderInfo.userType = this.userType;
        this.onClose();
        this.$wxRequest
          .post({
            url: "/public/order/box/wxpay",
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
                      // on close
                      const url = "../order/main";
                      mpvue.switchTab({ url });
                      // 支付成功后重置表单数据
                      _this.resetForm();
                    });
                  }
                },
                fail: function (res) {
                  if (res.errMsg == "requestPayment:fail cancel") {
                    wx.showToast({
                      title: "支付取消",
                      icon: "none",
                    });
                    // 支付取消后重置表单数据
                    _this.resetForm();
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
      } else {
        this.dialogShow = true;
        this.onDialogClose();
      }
    },
    // 重置表单
    resetForm() {
      this.orderInfo = {
        name: "",
        phoneNumber: "",
        address: "上海市",
        subAddress: "",
        buildArea: "0",
        isFirst: "1",
        selectTime: "",
        orderNote: "",
        userProtocl: "1",
        imagesList: [],
        estate_id: "0",
        estate_plot: "",
        boxNumber: 0,
      };
    },
    contactService() {
      wx.makePhoneCall({
        phoneNumber: servicePhone,
      });
    },
    toProtocol() {
      const url = "../protocol/main";
      mpvue.navigateTo({ url });
    },
  },

  mounted() {
    let params = this.$root.$mp.query;
    this.orderInfo.orderType = params.orderType;
    // FIX: 获取对象存储的Token,
    this.$wxRequest
      .get({
        url: "/public/ossToken/getOssToken",
      })
      .then((res) => {
        if (res.data.code == 20000) {
          this.OSS = res.data.data;
        }
      });
  },
};
