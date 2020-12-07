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
        <van-col offset="1" span="10">
          <span> 清运费：</span>
          <span style="color: red"> {{ finalPrice }} </span>
          <span>元</span>
        </van-col>
        <van-col offset="1" span="6">
          <span
            style="font-size: 12px; color: #4a90e2; text-decoration: underline"
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
          <span style="color: #4a90e2; font-size: 13px">电话客服</span>
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
          title="姓名："
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
          title="地址："
          title-width="70px"
          :value="orderInfo.address + orderInfo.subAddress"
          value-class="info"
          :border="false"
        />
        <van-cell
          title="装修面积："
          title-width="70px"
          :value="orderInfo.buildArea"
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
        <van-cell
          title="是否首次："
          title-width="70px"
          :value="orderInfo.isFirst == 1 ? '首次装修' : '非首次装修'"
          value-class="info"
          :border="false"
        />
      </van-cell-group>
    </van-dialog>
    <!-- 提示节点 -->
    <van-toast id="van-toast" />
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
