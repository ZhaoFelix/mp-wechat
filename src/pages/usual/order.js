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
} from "../../../config/options.js";
import { mapState } from "vuex";
var orderInfo = {
  name: "",
  phoneNumber: "",
  address: "南桥镇",
  addressNumber: "",
  addressRoom: "",
  subAddress: "",
  buildArea: "",
  isFirst: "0",
  isAssign: "",
  selectTime: "",
  orderNote: "",
  orderPrice: "",
  userProtocl: "1",
  imagesList: [],
  estate_id: "0",
  estate_plot: "",
};
// 时间选择器相关配置
var datePickerOptions = {
  minHour: 8,
  maxHour: 20,
  // 最小时间必须提前一个小时
  minDate: new Date().getTime() + 16 * 60 * 60 * 1000,
  //  最多可提前2天进行预约
  maxDate: new Date().setDate(new Date().getDate() + 3),
  currentDate: null,
  isChange: false,
};
// 错误信息对象
var errorMessage = {
  phoneMessage: "",
  areaMessage: "",
  plotPickerMessage: "",
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
      text: "继续支付",
      totalTime: 3,
      color: "#1989fa",
      clock: null,
      detailAddress: "",
      filter(type, options) {
        if (type === "hour") {
          // 可预约的时间设置为8:00~16:00
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
            // url: "/mobile/order/query/plot?wechat_id=261",
          })
          .then((res) => {
            // let other = {
            //   text: "其他",
            //   id: 0,
            // };
            let temArr = res.data.data;
            this.columns = temArr;
            this.columns = [...this.columns];
            console.log(this.columns);
          })
          .catch((error) => {
            console.log("获取物业列表失败" + error);
          });
      }
    },
    dialogShow: function (newVal, oldVal) {
      if (newVal) {
        this.detailAddress =
          this.orderInfo.address +
          this.orderInfo.subAddress +
          this.orderInfo.addressNumber +
          "号" +
          this.orderInfo.addressRoom +
          "室";
      }
    },
  },
  computed: {
    ...mapState(["userID", "userType", "openID"]),
    finalPrice: function () {
      let finalPrice = 0;
      // 是否是首次装修
      if (orderInfo.isFirst == "1") {
        if (
          Number(this.orderInfo.buildArea) >= 55 &&
          Number(this.orderInfo.buildArea) <= 140
        ) {
          finalPrice = 300 + (Number(this.orderInfo.buildArea) - 55) * 5;
        } else if (Number(this.orderInfo.buildArea) > 140) {
          finalPrice =
            300 + (140 - 55) * 5 + (Number(this.orderInfo.buildArea) - 140) * 7;
        } else {
          finalPrice = 300;
        }
      } else {
        if (
          Number(this.orderInfo.buildArea) >= 55 &&
          Number(this.orderInfo.buildArea) <= 140
        ) {
          finalPrice = 360 + (Number(this.orderInfo.buildArea) - 55) * 6;
        } else if (Number(this.orderInfo.buildArea) > 140) {
          finalPrice =
            360 + (140 - 55) * 6 + (Number(this.orderInfo.buildArea) - 140) * 8;
        } else {
          finalPrice = 360;
        }
      }
      this.orderInfo.orderPrice = finalPrice;
      return finalPrice;
    },
    qingyunPrice: function () {
      return (this.finalPrice * 0.8).toFixed(2);
    },
    daibanPrice: function () {
      return (this.finalPrice * 0.2).toFixed(2);
    },
  },
  methods: {
    showTimePicker() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    },
    onDialogClose(isShow) {
      clearInterval(this.clock);
      this.dialogShow = isShow;
      this.totalTime = 3;
      this.color = "#1989fa";
      this.text = "继续支付";
    },
    // 选择器确认按钮事件
    onConfirm(event) {
      let time = timeUtil.formatDateStr(new Date(event.mp.detail));
      console.log(time);
      // 判断选择器是否变化
      if (this.datePickerOptions.isChange) {
        let newStr = time.split(" ");
        this.orderInfo.selectTime =
          newStr[0] + (newStr[1] == "08:00" ? " 上午" : " 下午");
      } else {
        let date = new Date().getDate() + 1;
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let hour = new Date().getHours();
        let newStr =
          year +
          "-" +
          (month < 10 ? "0" + month : month) +
          "-" +
          (date < 10 ? "0" + date : date) +
          " " +
          (hour < 12 ? "上午" : "下午");

        this.orderInfo.selectTime = newStr;
      }
      this.show = false;
    },
    onCancelPlotPicker() {
      this.plotPicker = false;
    },
    onConfirmPlotPicker(event) {
      this.orderInfo.estate_id = event.mp.detail.value.id;
      this.orderInfo.estate_plot = event.mp.detail.value.text;
      this.orderInfo.address = "南桥镇" + event.mp.detail.value.text;
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
    onfocusPlotPicker() {
      this.plotPicker = true;
    },
    // 用户备注
    onblurNote(event) {
      this.orderInfo.orderNote = event.mp.detail.value;
    },
    onchangePhoneNumber(event) {
      const phone = event.mp.detail || event;
      // 失去光标后进行判断
      if (event.mp.detail.value != undefined) {
        return;
      }
      if (phone) {
        if (/^1(3|4|5|6|7|8)\d{9}$/.test(phone)) {
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
    // 号
    onblurAddressNumber(event) {
      this.orderInfo.addressNumber = event.mp.detail.value;
    },
    // 室
    onblurAddressRoom(event) {
      this.orderInfo.addressRoom = event.mp.detail.value;
    },
    // 装修面积
    onblurArea(event) {
      this.orderInfo.buildArea = event.mp.detail.value;
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
    // 点击首次装修
    onFirstClick(event) {
      let { name } = event.currentTarget.dataset;
      if (this.orderInfo.isFirst == name) {
        this.orderInfo.isFirst = "0";
      } else {
        this.orderInfo.isFirst = name;
      }
    },
    onAssignClick(event) {
      let { name } = event.currentTarget.dataset;
      // TODO:非指定点弹框提示
      console.log(event.currentTarget);

      if (this.orderInfo.isAssign == name) {
        this.orderInfo.isAssign = "0";
      } else {
        this.orderInfo.isAssign = name;
      }
    },
    onChangeRadio(event) {
      console.log(event.target["0"]);
      this.orderInfo.isAssign = event.target["0"];
      if (event.target["0"] == "0") {
        Toast({
          message: "非指定清运点费用请与运输人员进行协商",
          duration: 2200,
        });
      }
    },
    // 提交订单
    submitOrder() {
      if (
        this.orderInfo.name == "" ||
        this.orderInfo.estate_id == "0" ||
        this.orderInfo.phoneNumber == "" ||
        this.orderInfo.addressNumber == "" ||
        this.orderInfo.addressRoom == "" ||
        this.orderInfo.buildArea == "" ||
        this.orderInfo.selectTime == ""
      ) {
        Toast.fail("基本信息不能为空");
        return;
      } else if (this.orderInfo.isAssign == "") {
        Toast.fail("请选择是否指定清运点");
        return;
      } else if (this.orderInfo.userProtocl == 0) {
        Toast.fail("请勾选用户协议");
        return;
      } else if (this.orderInfo.imagesList.length < 2) {
        Toast.fail("至少上传两张照片");
        return;
      }
      this.dialogShow = true;
      // // 倒计时5秒
      // this.clock = setInterval(() => {
      //   this.totalTime--;
      //   this.text = "继续支付(" + this.totalTime + ")s";
      //   if (this.totalTime < 0) {
      //     clearInterval(this.clock);
      //     this.text = "继续支付";
      //     this.color = "#1989fa";
      //   }
      // }, 1000);
    },
    // 调用微信支付
    wechatPay() {
      this.orderInfo.openId = this.openID;
      this.orderInfo.userId = this.userID;
      this.orderInfo.userType = this.userType;
      this.orderInfo.subAddress =
        this.orderInfo.addressNumber + "号" + this.orderInfo.addressRoom + "室";
      this.onClose();
      this.$wxRequest
        .post({
          url: "/public/order/usual/wxpay",
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
                    _this.orderInfo = {
                      name: "",
                      phoneNumber: "",
                      address: "上海市",
                      subAddress: "",
                      buildArea: "",
                      isFirst: "1",
                      selectTime: "",
                      orderNote: "",
                      orderPrice: "",
                      userProtocl: "1",
                      imagesList: [],
                      estate_id: "0",
                      estate_plot: "",
                    };
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
                  _this.orderInfo = {
                    name: "",
                    phoneNumber: "",
                    address: "上海市",
                    subAddress: "",
                    addressNumber: "",
                    addressRoom: "",
                    buildArea: "",
                    isFirst: "1",
                    selectTime: "",
                    orderNote: "",
                    orderPrice: "",
                    userProtocl: "1",
                    imagesList: [],
                    estate_id: "0",
                    estate_plot: "",
                  };
                } else {
                  wx.showToast({
                    title: res.errmsg,
                    icon: "none",
                  });
                }
              },
            });
            this.onDialogClose(false);
          } else if (res.data.code == 20001) {
            console.log(res.data.data);
          }
        });
    },
    toPrice() {
      const url = "../price/main";
      mpvue.navigateTo({ url });
    },
    toProtocol() {
      const url = "../protocol/main";
      mpvue.navigateTo({ url });
    },
    contactService() {
      wx.makePhoneCall({
        phoneNumber: servicePhone,
      });
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
