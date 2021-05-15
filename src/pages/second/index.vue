<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-05-15 21:34:46
 * @LastEditTime: 2021-05-15 22:02:26
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
  </div>
</template>
<script>
var orderInfo = {
  selectTime: "",
  orderNote: "",
  imagesList: [],
};
export default {
  data() {
    return {
      orderInfo,
    };
  },
  methods: {},
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
