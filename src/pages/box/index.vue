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
        :value="orderInfo.estate_plot"
        label="物业小区"
        readonly
        placeholder="请选择小区"
        @click="onfocusPlotPicker"
        :error-message="errorMessage.plotPickerMessage"
      />
      <van-field
        :value="orderInfo.address"
        label="地址"
        placeholder="省 市 区"
        readonly="true"
      />
      <van-field
        :value="orderInfo.subAddress"
        label="详细地址"
        type="text"
        placeholder="请输入具体地址 如：**路**小区"
        @blur="onblurAddress"
      />
    </div>
    <div class="order-info">
      <van-field
        :value="orderInfo.boxNumber"
        type="number"
        label="垃圾箱数"
        placeholder="单位为箱"
        @blur="onblurArea"
        @change="onchangeArea"
        :error-message="errorMessage.areaMessage"
      />
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
    <!-- 小区选择 -->
    <van-popup :show="plotPicker" round position="bottom" @close="show = false">
      <van-picker
        show-toolbar
        title="选择小区"
        :columns="columns"
        @cancel="onCancelPlotPicker"
        @confirm="onConfirmPlotPicker"
      />
    </van-popup>
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
    <!-- TODO:订单价格 -->
    <div class="order-price">
      <van-row>
        <van-col offset="2" span="20">
          <span> 清运费：</span>
          <span style="color: red"> {{ finalPrice * 0.8 }} </span>
          <span>元</span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>代办费：</span>
          <span style="color: red"> {{ finalPrice * 0.2 }} </span>
          <span>元</span>
        </van-col>
      </van-row>
    </div>
    <div class="submit-btn">
      <van-row style="line-height: 12px">
        <van-col offset="9" span="1">
          <!-- <van-radio-group
            :value="orderInfo.userProtocl"
            @change="protoclOnChange"
          >
            <van-radio
              icon-size="12px"
              name="1"
              checked-color="#07c160"
              style="font-size: 12px"
            ></van-radio>
          </van-radio-group> -->
        </van-col>
        <van-col>
          <!-- <span class="protocol" @click="toProtocol"> 服务协议 </span> -->
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
          <span style="color: #4a90e2; font-size: 13px" @click="contactService"
            >电话客服</span
          >
        </van-col>
      </van-row>
      <div style="height: 20px"></div>
    </div>
    <div>
      <van-overlay :show="overlayshow" @click="onClickHide">
        <view class="wrapper">
          <view class="block"> </view>
        </view>
      </van-overlay>
    </div>
    <!-- 订单确认弹框内容 -->
    <van-dialog
      use-slot
      title="订单信息确认"
      :show="dialogShow"
      show-cancel-button
      :confirmButtonText="text"
      :confirm-button-color="color"
      @confirm="wechatPay"
      @close="dialogShow = false"
    >
      <van-cell-group title="请确保下列信息无误" :border="false">
        <van-cell
          center
          title="下单姓名："
          title-width="70px"
          :value="orderInfo.name"
          value-class="info"
          :border="false"
        />
        <van-cell
          title="手机号："
          title-width="70px"
          :value="orderInfo.phoneNumber"
          value-class="info"
          :border="false"
        />
        <van-cell
          title="订单地址："
          title-width="70px"
          :value="orderInfo.address + orderInfo.subAddress"
          value-class="info"
          :border="false"
        />
        <van-cell
          title="垃圾箱数："
          title-width="70px"
          :value="orderInfo.boxNumber"
          value-class="info"
          :border="false"
        />
        <van-cell
          title="预约时间："
          title-width="70px"
          :value="orderInfo.selectTime"
          value-class="info"
          :border="false"
        />
      </van-cell-group>
    </van-dialog>
    <!-- 提示节点 -->
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>
<script>
import index from "./order.js";
export default index;
</script>

<style scoped>
@import "./index.css";
/* TODO:无法拆分 */
van-cell >>> .info {
  padding-right: 20px;
  text-align: left;
}

van-cell >>> .title-style {
  font-size: 12px;
  color: rgba(1, 1, 1, 0.5);
}
van-cell >>> .title-style1 {
  font-size: 18px;
  color: rgba(1, 1, 1, 0.75);
}
</style>
