<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2020-12-08 14:57:02
 * @FilePath: /mp-wechat/src/pages/mine/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div class="main-container">
    <van-tabs :active="active" swipeable sticky bind:change="onChangeTab">
      <van-tab name="0" title="全部">
        <van-row>
          <div class="custom-style">
            <!-- 顶部 -->
            <van-row>
              <van-col span="1" offset="1">
                <div class="v-line">
                  <span></span>
                </div>
              </van-col>
              <van-col span="13">
                <div class="order-number common">订单编号：20482947147294</div>
              </van-col>
              <van-col offset="3" span="5">
                <div class="order-status common">待支付</div>
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
                <van-col offset="4" span="7">
                  <span class="price-title">实付款：</span>
                  <span class="price">453.00</span>
                  <span class="price-end"> 元</span>
                </van-col>
              </van-row>
              <van-row>
                <van-col offset="1">
                  <span class="common">上海市奉贤区奉浦大道123号</span>
                </van-col>
              </van-row>
            </van-row>
            <van-row>
              <van-col offset="1">
                <span class="time-title">预约时间：</span>
                <span class="time">2020-12-31 14:20</span>
              </van-col>
            </van-row>
            <!-- 底部 -->
            <van-row>
              <van-col offset="1" span="11">
                <div class="driver-info">车牌号：沪G3DE4 周师傅</div>
              </van-col>
              <van-col offset="1" span="10">
                <div class="btn-grounps">
                  <van-row>
                    <van-col span="11"><button>主要按钮</button> </van-col>
                    <van-col offset="2" span="11">
                      <button>主要按钮</button>
                    </van-col>
                  </van-row>
                </div>
              </van-col>
            </van-row>
          </div>
        </van-row>
      </van-tab>
      <van-tab name="1" title="已完成"> </van-tab>
      <van-tab name="2" title="待支付"> </van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    onChangeTab() {},
  },
};
</script>

<style scoped>
.main-container {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  position: absolute;
}
.custom-style {
  background-color: white;
}
.v-line {
  height: 20px;
  text-align: left;
}

.v-line span {
  width: 4px;
  height: 15px;
  background-color: #3675ff;
  position: absolute;
  line-height: 15px;
  text-align: center;
  margin-top: 2.5px;
  border-radius: 2px;
}
.common {
  height: 20px;
  color: rgba(1, 1, 1, 0.6);
  font-size: 14px;
  line-height: 20px;
}
.order-status {
  text-align: right;
}
.divider {
  height: 1px;
  background-color: rgba(1, 1, 1, 0.1);
  margin: 10px 0;
}
.address-title {
  font-weight: bold;
}
.price-title,
.price,
.price-end {
  font-size: 12px;
  font-weight: bold;
  color: rgba(1, 1, 1, 0.8);
}
.time-title {
  margin-top: 8px;
  font-size: 15px;
  font-weight: bold;
  color: rgba(1, 1, 1, 0.8);
}
.time {
  font-size: 14px;
  color: rgba(1, 1, 1, 0.6);
}
.price {
  color: red;
}

.driver-info {
  font-size: 12px;
  background-color: #4a90e2;
  color: white;
  text-align: center;
  margin: 10px 0;
  opacity: 0.75;
  border-radius: 2px;
  height: 18px;
  line-height: 18px;
}

.btn-grounps {
  text-align: center;
  margin: 10px 0;
}

.btn-grounps button {
  height: 18px;
  font-size: 12px;
  line-height: 18px;
}
</style>
