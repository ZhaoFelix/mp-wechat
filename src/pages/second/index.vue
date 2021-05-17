<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-05-15 21:34:46
 * @LastEditTime: 2021-05-17 09:15:47
 * @FilePath: /mp-wechat/src/pages/second/index.vue
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div class="container">
    <div class="basic-info">
      <van-field
        :value="orderInfo.selectTime"
        label="预约时间"
        placeholder="2020-01-01 上午"
        readonly
        @click="showTimePicker"
      />
      <van-field
        :model="orderInfo.orderNote"
        label="备注"
        type="textarea"
        placeholder="请输入留言，选填"
        maxlength="100"
        autosize
        @blur="onblurNote"
        @change="onchangeNote"
      />
      <!-- 图片上传相关 -->
      <div class="trash-images">
        <van-row>
          <van-col offset="1" span="6">
            <span style="font-size: 16px; color: #646566">垃圾量拍照</span>
          </van-col>
          <van-col offset="1" span="7">
            <span style="font-size: 10px; color: red; text-align: left"
              >*至少上传两张照片</span
            >
          </van-col>
          <van-col offset="4" span="4">
            <div style="font-size: 16px; color: #646566; text-align: right">
              {{ orderInfo.imagesList.length + "/4" }}
            </div>
          </van-col>
        </van-row>
        <van-row>
          <van-col offset="1" span="22">
            <div class="divider"></div>
          </van-col>
        </van-row>
        <van-row>
          <van-col offset="1" span="22">
            <van-uploader
              image-fit="contain"
              :file-list="orderInfo.imagesList"
              max-count="4"
              @afterRead="afterRead"
              @delete="deleteImage"
            />
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="submit-btn">
      <div style="height: 5px"></div>
      <van-row>
        <van-col offset="6" span="12">
          <button class="sub-btn" @click="submitOrder">立即下单</button>
        </van-col>
      </van-row>
      <div style="height: 20px"></div>
    </div>
    <van-popup :show="show" round position="bottom" @close="show = false">
      <van-datetime-picker
        type="datetime"
        :value="datePickerOptions.currentDate"
        :min-date="datePickerOptions.minDate"
        :max-date="datePickerOptions.maxDate"
        :min-hour="datePickerOptions.minHour"
        @input="onInput"
        @confirm="onConfirm"
        @change="onChangeTime"
        @cancel="onClose"
        :filter="filter"
        :formatter="datePickerformatter"
      />
    </van-popup>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import timeUtil from "../../utils/index.js";
import Toast from "@vant/weapp/dist/toast/toast";
import Dialog from "@vant/weapp/dist/dialog/dialog";
import {
  uploadUrl,
  downloadUrl,
  processImage,
  previewImage,
  bucket,
} from "../../../config/options.js";
var orderInfo = {
  selectTime: "",
  orderNote: "",
  imagesList: [],
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
var OSS = {};
export default {
  data() {
    return {
      show: false,
      orderInfo,
      OSS,
      datePickerOptions,
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
  computed: {
    ...mapState(["userID", "userType", "openID"]),
  },
  mounted() {
    let params = this.$root.$mp.query;
    console.log(params);
    this.orderInfo.orderId = params.orderID;
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
  methods: {
    showTimePicker() {
      this.show = true;
    },
    // 备注
    onblurNote(event) {
      this.orderInfo.orderNote = event.mp.detail.value;
    },
    onClose() {
      this.show = false;
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

    // 选择器确认按钮事件
    onConfirm(event) {
      let time = timeUtil.formatDateStr(new Date(event.mp.detail));
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
    submitOrder() {
      if (this.orderInfo.selectTime == "") {
        Toast.fail("请选择预约时间");
        return;
      } else if (this.orderInfo.imagesList.length < 2) {
        Toast.fail("至少上传两张照片");
        return;
      } else {
        console.log(this.orderInfo);
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  position: absolute;
}

.basic-info {
  margin-top: 8px;
}
.trash-images {
  margin-top: 12px;
  background-color: white;
  padding: 5px 0 0 0;
}
.divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 5px 0;
}
.submit-btn {
  margin-top: 10px;
}
.sub-btn {
  color: white;
  background-color: #07c160;
  border: none;
}
</style>
