<template>
  <div class="container">
    <div class="basic-info">
      <van-field
        v-model="orderInfo.name"
        label="联系人"
        placeholder="姓名"
        @change="onchangeName"
      />
      <van-field
        type="tel"
        :value="orderInfo.phoneNumber"
        label="联系电话"
        placeholder="手机号码"
        maxlength="11"
        @change="onchangePhoneNumber"
      />
      <van-field
        :value="orderInfo.address"
        label="地址"
        placeholder="省 市 区"
        readonly="true"
      />
      <van-field
        :value="orderInfo.detailedAddress"
        label="详细地址"
        type="text"
        placeholder="请输入具体地址 如：街道名称"
        @change="onchangeAddress"
      />
    </div>
    <div class="order-info">
      <van-field
        :value="orderInfo.buildArea"
        type="number"
        label="建筑面积"
        placeholder="单位为平方米"
        @change="onchangeArea"
      />

      <!-- TODO:是否是首次装修 -->

      <van-radio-group :value="orderInfo.isFirst" @change="onChange">
        <van-cell
          center
          title="是否是首次装修"
          data-name="1"
          label="*是否首次装修详见计价方式说明"
          @click="onFirstClick"
        >
          <van-radio slot="right-icon" name="1" checked-color="#07c160" />
        </van-cell>
      </van-radio-group>
      <van-field
        :value="orderInfo.selectTime"
        label="预约时间"
        placeholder="2020-01-01 08:00"
        readonly
        @click="showTimePicker"
      />

      <van-field
        :model="orderInfo.orderNote"
        label="备注"
        type="textarea"
        placeholder="请输入留言，选填"
        autosize
      />
    </div>

    <!-- 时间选择器 -->
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
        :formatter="formatter"
      />
    </van-popup>

    <div class="trash-images">
      <van-row>
        <van-col offset="1" span="6">
          <span style="font-size: 16px; color: #646566">垃圾量拍照</span>
        </van-col>
        <van-col offset="12" span="4">
          <div style="font-size: 16px; color: #646566; text-align: right">
            1/4
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
            :file-list="fileList"
            max-count="4"
            :after-read="afterRead"
          />
        </van-col>
      </van-row>
    </div>
    <!-- TODO:订单价格 -->
    <div class="order-price">
      <van-row>
        <van-col offset="1" span="10">
          <span> 清运费：</span>
          <span style="color: red"> 130.00 </span>
          <span>元</span>
        </van-col>
        <van-col offset="1" span="6">
          <span
            style="font-size: 12px; color: blue; text-decoration: underline"
          >
            计价方式说明
          </span>
        </van-col>
      </van-row>
    </div>
    <div class="submit-btn">
      <van-row>
        <van-col offset="9" span="6">
          <van-radio-group
            :value="orderInfo.userProtocl"
            @change="protoclOnChange"
          >
            <van-radio
              icon-size="12px"
              name="1"
              checked-color="#07c160"
              style="font-size: 12px"
              >服务协议</van-radio
            >
          </van-radio-group>
        </van-col>
      </van-row>
      <div style="height: 5px"></div>
      <van-row>
        <van-col offset="6" span="12">
          <button class="sub-btn">立即下单</button>
        </van-col>
      </van-row>
      <div style="height: 20px"></div>
      <van-row>
        <van-col offset="10" span="4">
          <span style="color: blue; font-size: 13px">电话客服</span>
        </van-col>
      </van-row>
    </div>
    <div>
      <van-overlay :show="overlayshow" @click="onClickHide">
        <view class="wrapper">
          <view class="block"> </view>
        </view>
      </van-overlay>
    </div>
  </div>
</template>
<script>
import getSTS from "../../utils/getSTS";
var orderInfo = {
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
};
// 时间选择器相关配置
var datePickerOptions = {
  minHour: 8,
  maxHour: 20,
  minDate: new Date().getTime(),
  //  最多可提前2天进行预约
  maxDate: new Date().setDate(new Date().getDate() + 2),
  currentDate: new Date(),
};
export default {
  data() {
    return {
      overlayshow: false,
      yesOrNo: false,
      show: false,
      orderInfo,
      datePickerOptions,
      fileList: [],
      OSSAccessKeyId: "",
      policy: "",
      signature: "",
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
      formatter(type, value) {
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
  methods: {
    showTimePicker() {
      this.show = true;
    },
    onClose() {
      console.log("取消");
      this.show = false;
    },
    onConfirm() {
      console.log("确定");
      this.show = false;
    },
    onClickButton() {
      this.yesOrNo = false;
      this.firs = 1;
    },
    onchangeName(event) {
      this.name = event.detail;
    },
    onchangePhoneNumber(event) {
      this.phoneNumber = event.detail;
    },
    onchangeAddress(event) {
      this.detailedAddress = event.detail;
    },
    onchangeArea(event) {
      this.buildArea = event.detail;
    },
    onChangeTime(event) {
      this.currentDate = event.detail;
    },
    afterRead(event) {
      const { file } = event.detail;
      wx.uploadFile({
        url: "https://example.weixin.qq.com/upload", // 接口地址
        filePath: file.path,
        name: "file",
        formData: { user: "test" },
        success(res) {
          const { fileList = [] } = this.data;
          fileList.push({ ...file, url: res.data });
          this.setData({ fileList });
        },
      });
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
  },
  mounted() {
    this.$wxRequest
      .get({
        url: "/public/getToken/osstoken",
      })
      .then((res) => {
        if (res.data.code == 20000) {
          this.OSSAccessKeyId = res.data.OSSAccessKeyId;
          this.signature = res.data.signature;
          this.policy = res.data.policy;
        }
      });
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
.order-info {
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
.order-price {
  margin-top: 20px;
}

.submit-btn {
  margin-top: 10px;
}
.sub-btn {
  color: white;
  background-color: green;
  border: none;
}
</style>
