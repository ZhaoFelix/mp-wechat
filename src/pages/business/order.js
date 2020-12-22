import Toast from "@vant/weapp/dist/toast/toast";
import timeUtil from "../../utils/index.js";
import { servicePhone } from "../../../config/options";
import {
  uploadUrl,
  downloadUrl,
  processImage,
  previewImage,
} from "../../../config/options.js";
import { mapState } from "vuex";
var orderInfo = {
  name: "",
  phoneNumber: "",
  address: "上海市",
  subAddress: "",
  buildArea: "",
  isFirst: "1",
  selectTime: "",
  orderNote: "",
  userProtocl: "1",
  imagesList: [],
};
// 时间选择器相关配置
var datePickerOptions = {
  minHour: 8,
  maxHour: 20,
  // 最小时间必须提前一个小时
  minDate: new Date().getTime() + 1 * 60 * 60 * 1000,
  //  最多可提前2天进行预约
  maxDate: new Date().setDate(new Date().getDate() + 2),
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
      orderInfo,
      datePickerOptions,
      OSS,
      errorMessage,
      OSSAccessKeyId: "",
      policy: "",
      signature: "",
      dialogShow: false,
      //   text: "继续支付(5)s",
      totalTime: 3,
      //   color: "red",
      clock: null,
      filter(type, options) {
        if (type === "hour") {
          return options.filter((option) =>
            option >= 8 && option <= 20 ? option : ""
          );
        }
        if (type === "minute") {
          return options.filter((option) => option % 10 === 0);
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
        }
        return value;
      },
    };
  },
  computed: {
    ...mapState(["userID", "userType", "openID"]),
  },
  methods: {
    showTimePicker() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    },
    // 选择器确认按钮事件
    onConfirm(event) {
      let time = timeUtil.formatDateStr(new Date(event.mp.detail));
      // 判断选择器是否变化
      if (this.datePickerOptions.isChange) {
        this.orderInfo.selectTime = time;
      }
      this.show = false;
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
      let fileName = "ningjin_dev/" + new Date().getTime() + ".png";
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
        this.orderInfo.buildArea == "" ||
        this.orderInfo.selectTime == ""
      ) {
        Toast.fail("信息不完整");
        return;
      } else if (this.orderInfo.userProtocl == 0) {
        Toast.fail("请勾选用户协议");
        return;
      } else if (this.orderInfo.imagesList.length != 4) {
        Toast.fail("至少上传四张照片");
        return;
      }
      this.dialogShow = true;
    },
    // 调用微信支付
    wechatPay() {
      this.orderInfo.openId = this.openID;
      this.orderInfo.userId = this.userID;
      this.orderInfo.userType = this.userType;
      this.onClose();
      this.$wxRequest
        .post({
          url: "/public/order/business",
          data: this.orderInfo,
        })
        .then((res) => {
          if (res.data.code == 20000) {
            let re = res.data;
            wx.showToast({
              title: re.message,
              icon: "none",
            });
            // 重置表单信息
            this.orderInfo = {
              name: "",
              phoneNumber: "",
              address: "上海市",
              subAddress: "",
              buildArea: "",
              isFirst: "1",
              selectTime: "",
              orderNote: "",
              userProtocl: "1",
              imagesList: [],
            };
          } else if (res.data.code == 20001) {
            console.log(res.data.data);
            wx.showToast({
              title: error,
              icon: "none",
            });
          }
        });
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
