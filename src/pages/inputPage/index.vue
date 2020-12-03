<template>
  <div class="container">
    <div class="basic-info">
      <van-field
        v-model="orderInfo.name"
        label="联系人"
        placeholder="姓名"
        @blur="onblurName"
      />
      <van-field
        type="number"
        :value="orderInfo.phoneNumber"
        label="联系电话"
        placeholder="手机号码"
        maxlength="11"
        @blur="onblurPhoneNumber"
        @change="onchangePhoneNumber"
        :error-message="errorMessage.phoneMessage"
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
        @blur="onblurAddress" 
      />
    </div>
    <div class="order-info">
      <van-field
        :value="orderInfo.buildArea"
        type="number"
        label="建筑面积"
        placeholder="单位为平方米"
        @blur="onblurArea"
        @change="onchangeArea"
        :error-message="errorMessage.areaMessage"
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
        maxlength="100"
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
        :formatter="datePickerformatter"
      />
    </van-popup>
<!-- 图片上传相关 -->
    <div class="trash-images">
      <van-row>
        <van-col offset="1" span="6">
          <span style="font-size: 16px; color: #646566">垃圾量拍照</span>
        </van-col>
        <van-col offset="12" span="4">
          <div style="font-size: 16px; color: #646566; text-align: right">
           {{ orderInfo.imagesList.length + "/4"  }}
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
            :file-list="orderInfo.imagesList"
            max-count="4"
            @afterRead="afterRead"
            @delete="deleteImage"
          />
        </van-col>
      </van-row>
    </div>
    <!-- TODO:订单价格 -->
    <div class="order-price">
      <van-row>
        <van-col offset="1" span="10">
          <span> 清运费：</span>
          <span style="color: red"> {{ finalPrice }} </span>
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
          <button class="sub-btn" @click="submitOrder">立即下单</button>
        </van-col>
      </van-row>
      <div style="height: 20px"></div>
      <van-row>
        <van-col offset="10" span="4">
          <!-- TOOD：点击后弹出客服联系电话 -->
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
import timeUtil from "../../utils/index.js" 
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
  imagesList:[]
};
// 时间选择器相关配置
var datePickerOptions = {
  minHour: 8,
  maxHour: 20,
  // 最小时间必须提前一个小时
  minDate: new Date().getTime() + 1*60*60*1000,
  //  最多可提前2天进行预约
  maxDate: new Date().setDate(new Date().getDate() + 2),
  currentDate: null,
  isChange:false,
};

// 错误信息对象
var errorMessage = {
  phoneMessage:"",
  areaMessage:""
}

// oss对象信息
var OSS = {}

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
  computed:{
        finalPrice:function(){ 
          let finalPrice = 0
          // 是否是首次装修
          if (orderInfo.isFirst == "1") {
              if ( Number(this.orderInfo.buildArea) >= 55 && Number(this.orderInfo.buildArea) <= 140) {
                     finalPrice  = 300 + (Number(this.orderInfo.buildArea) - 55) * 5
              } else if (Number(this.orderInfo.buildArea) > 140){
                     finalPrice = 300 + (140 - 55) * 5 + (Number(this.orderInfo.buildArea) - 140) * 7
              }
          } else {
                if ( Number(this.orderInfo.buildArea) >= 55 && Number(this.orderInfo.buildArea) <= 140) {
                     finalPrice = 360 + (Number(this.orderInfo.buildArea) - 55) * 6
              } else if (Number(this.orderInfo.buildArea) > 140){
                     finalPrice = 360 + (140 - 55) * 6 + (Number(this.orderInfo.buildArea) - 140) * 8
              }
          }
          return finalPrice.toFixed(2)
        }
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
      let time = timeUtil.formatDateStr(new Date(event.mp.detail)) 
      // 判断选择器是否变化
      if (this.datePickerOptions.isChange) {
        this.orderInfo.selectTime = time
      }
      this.show = false;
    },
    onClickButton() {
      this.yesOrNo = false;
      this.firs = 1;
    },
    // 姓名
    onblurName(event) {
     this.orderInfo.name = event.mp.detail.value
    },
    // 手机号
    onblurPhoneNumber(event) {
      this.orderInfo.phoneNumber = event.mp.detail.value
    },
    onchangePhoneNumber(event){
      const phone = event.mp.detail || event
      // 失去光标后进行判断
     if (event.mp.detail.value != undefined) {
       return
     }
      if (phone) {
        if (/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
          this.errorMessage.phoneMessage = ''
        
        } else {
          this.errorMessage.phoneMessage = '您输入的手机号码有误';
       
        }
    } else {
       this.errorMessage.phoneMessage = '输入的手机号不能为空'
      }
    },
    // 地址
    onblurAddress(event) {
     this.orderInfo.subAddress = event.mp.detail.value
    },
    // 装修面积
    onblurArea(event) {
      this.orderInfo.buildArea = event.mp.detail.value
    },
    onchangeArea(event) {
      const area = event.mp.detail || event 
      // TODO:升级判断方式
      if (event.mp.detail.value != undefined) {
         return
      }
      if (area) {
         console.log(Number(area))
          if (isNaN(Number(area))) {
            this.errorMessage.areaMessage = "面积只能是数字"
          }
          else {
            this.errorMessage.areaMessage = ""
          }
      } else {
      this.errorMessage.areaMessage ="面积不能为空"
      }
    },
    afterRead(event){  
      console.log("测试")
      const { file } = event.mp.detail;
      let fileName = "ningjin_dev/"+new Date().getTime()+".png"
      var _this = this
      wx.uploadFile({
        url: "https://ningjintest.oss-cn-beijing.aliyuncs.com", // 接口地址
        filePath: file.url,
        name: "file",
        formData: {
          key:fileName,
          policy: this.OSS.policy,
          OSSAccessKeyId: this.OSS.OSSAccessKeyId,
          signature:this.OSS.signature
         },
        success(res) {
         _this.orderInfo.imagesList.push({url:"https://wechatimg.ningjin.qingmaoedu.com/" + fileName,name:""})
        },
        fail(error){
          console.log(error)
        }
      });
    },
    // 删除图片
    deleteImage(event){
      console.log(event.mp.detail.index)
      this.orderInfo.imagesList.pop(this.orderInfo.imagesList[event.mp.detail.index])
      console.log(this.orderInfo.imagesList)
    },
    // 时间选择器事件
    onChangeTime(event) {
      this.datePickerOptions.isChange = true
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
    submitOrder(){
      console.log(this.orderInfo)

    }
  },
  mounted() {
   
    this.$wxRequest
      .get({
        url: "/public/ossToken/getOssToken",
      })
      .then((res) => {
        if (res.data.code == 20000) {
          this.OSS = res.data.data
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
