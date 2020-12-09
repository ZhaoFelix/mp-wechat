<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2020-12-09 17:17:13
 * @FilePath: /mp-wechat/src/pages/mine/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div class="main-container">
    <!-- <van-tabs :active="active" swipeable sticky animated @change="onChangeTab">
      <van-tab name="0" title="全部"> -->
    <van-row>
      <div class="custom-style" v-for="(item, index) in list" :key="index">
        <div class="top-divider"></div>
        <!-- 顶部 -->
        <van-row>
          <div style="height: 8px"></div>
          <van-col span="1" offset="1">
            <div class="v-line">
              <span></span>
            </div>
          </van-col>
          <van-col span="16">
            <div class="order-number common">
              {{ "订单编号：" + item.order_number }}
            </div>
          </van-col>
          <van-col offset="1" span="4">
            <div class="order-status common">
              {{ item.order_status == "0" ? "未支付" : "已支付" }}
            </div>
          </van-col>
        </van-row>
        <van-row>
          <van-col offset="1" span="22">
            <div class="divider"></div>
          </van-col>
        </van-row>
        <!-- 中间 -->
        <van-row>
          <van-row>
            <van-col offset="1" span="10">
              <span class="address-title">订单地区、街道</span>
            </van-col>
            <van-col offset="4" span="7" v-if="item.order_status == 1">
              <span class="price-title">实付款：</span>
              <span class="price">{{ item.order_final_price + ".00" }}</span>
              <span class="price-end"> 元</span>
            </van-col>
          </van-row>
          <van-row>
            <van-col offset="1">
              <span class="common">{{ item.user_address }}</span>
            </van-col>
          </van-row>
        </van-row>
        <van-row>
          <van-col offset="1">
            <span class="time-title">预约时间：</span>
            <span class="time">{{ item.user_reserve_time }}</span>
          </van-col>
        </van-row>
        <!-- 底部 -->
        <van-row>
          <van-col offset="1" span="11">
            <div class="driver-info">车牌号：沪G3DE4 周师傅</div>
          </van-col>
          <van-col offset="1" span="10">
            <div class="btn-groups">
              <van-row>
                <van-col span="11"
                  ><button class="driver-btn">联系司机</button>
                </van-col>
                <van-col offset="2" span="11">
                  <button class="service-btn">联系客服</button>
                </van-col>
              </van-row>
            </div>
          </van-col>
        </van-row>
      </div>
    </van-row>
    <!-- </van-tab>
      <van-tab name="1" title="已完成"> </van-tab>
      <van-tab name="2" title="待支付"> </van-tab>
    </van-tabs> -->
  </div>
</template>
<script>
import index from "./mine.js";
export default index;
</script>

<style scoped>
@import "./index.css";
</style>
