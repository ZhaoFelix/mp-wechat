<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2021-04-27 10:54:40
 * @FilePath: /mp-wechat/src/pages/order/index.vue
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
              <span class="v-line-span"></span>
            </div>
          </van-col>
          <van-col span="16">
            <div class="order-number common">
              {{ "订单编号：" + item.order_number }}
            </div>
          </van-col>
          <van-col offset="1" span="4">
            <div v-if="item.order_status == 1" class="order-status common">
              待指派司机
            </div>
            <div v-if="item.order_status == 2" class="order-status common">
              已取消
            </div>
            <div v-if="item.order_status == 3" class="order-status common">
              已指派司机
            </div>
            <div
              v-if="item.order_status == 4 || item.order_status == 5"
              class="order-status common"
            >
              司机运输中
            </div>
            <!-- <div
              v-if="item.order_status == 0 && item.left_pay_time > 0"
              class="order-status common"
            >
              未支付
            </div> -->
            <div v-if="item.order_status == 0" class="order-status common">
              <span v-if="item.left_pay_time <= 0"> 已过期 </span>
              <span v-else> 待支付 </span>
            </div>
            <div v-if="item.order_status == 7" class="order-status common">
              待补差价
            </div>
            <div v-if="item.order_status == 6" class="order-status common">
              已完成
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
            <van-col
              offset="4"
              span="7"
              v-if="item.order_status != 0 && item.order_status != 7"
            >
              <span class="price-title">实付款：</span>
              <span class="price">{{
                item.order_final_price + item.second_pay_price
              }}</span>
              <span class="price-end"> 元</span>
            </van-col>
            <van-col
              offset="4"
              span="7"
              v-if="item.order_status == 7 && item.order_type == 0"
            >
              <span class="price-title">待付差价：</span>
              <span class="price">{{ item.order_gap_price }}</span>
              <span class="price-end"> 元</span>
            </van-col>
            <van-col
              offset="4"
              span="7"
              v-if="item.order_status == 0 && item.order_price != null"
            >
              <span class="price-title">待付款：</span>
              <span class="price">{{ item.order_price * 0.8 }}</span>
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
            <span class="time">{{ item.reserve_time }}</span>
          </van-col>
        </van-row>
        <!-- 底部 -->
        <van-row v-if="item.order_status >= 3">
          <van-col offset="1">
            <div class="driver-info" v-if="item.order_status >= 3">
              {{
                "&nbsp;&nbsp;车牌号：" +
                item.car_number +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;司机姓名： " +
                item.driver_name +
                "&nbsp;&nbsp;"
              }}
            </div>
          </van-col>
        </van-row>
        <!-- 普通装修未支付 -->
        <van-row v-else-if="item.order_status == 0 && item.order_type == 1">
          <van-col offset="1">
            <div class="driver-info" v-if="item.left_pay_time >= 0">
              {{
                "&nbsp;&nbsp;剩余支付时间：" +
                ~~(item.left_pay_time / 60) +
                "分" +
                (item.left_pay_time % 60) +
                "秒&nbsp;&nbsp;"
              }}
            </div>
            <!-- <div class="driver-info" v-else>
              &nbsp;&nbsp;订单已过截止支付时间&nbsp;&nbsp;
            </div> -->
          </van-col>
        </van-row>
        <van-row v-else-if="item.order_status == 0 && item.order_type == 3">
          <van-col offset="1">
            <div class="driver-info" v-if="item.left_pay_time >= 0">
              {{
                "&nbsp;&nbsp;剩余支付时间：" +
                ~~(item.left_pay_time / 60) +
                "分" +
                (item.left_pay_time % 60) +
                "秒&nbsp;&nbsp;"
              }}
            </div>
            <!-- <div class="driver-info" v-else>
              &nbsp;&nbsp;订单已过截止支付时间&nbsp;&nbsp;
            </div> -->
          </van-col>
        </van-row>
        <!-- 按钮组 -->
        <van-row>
          <div class="btn-groups">
            <van-row>
              <!-- 1.联系司机+客服 -->
              <van-row v-if="item.order_status == 3 || item.order_status == 4">
                <van-col offset="12" span="5">
                  <button
                    class="driver-btn"
                    @click="contactDriver(item.driver_phone)"
                  >
                    联系司机
                  </button>
                </van-col>
                <van-col offset="1" span="5">
                  <button class="service-btn" @click="contactService">
                    联系客服
                  </button>
                </van-col>
              </van-row>
              <!-- 2.立即支付+客服 -->
              <!-- <van-row
                v-else-if="item.order_status == 0 && item.order_type == 1"
              >
                <van-col v-if="item.order_price != null" offset="12" span="5"
                  ><button class="driver-btn" @click="payPrice(item, 0)">
                    立即支付
                  </button>
                </van-col>
                <van-col :offset="item.order_price != null ? 1 : 18" span="5">
                  <button class="service-btn" @click="contactService">
                    联系客服
                  </button>
                </van-col>
              </van-row> -->
              <!-- 3.普通限时支付 -->
              <van-row
                v-else-if="item.order_status == 0 && item.order_type == 1"
              >
                <van-col v-if="item.left_pay_time >= 0" offset="12" span="5"
                  ><button class="driver-btn" @click="payPrice(item, 0)">
                    立即支付
                  </button>
                </van-col>
                <van-col :offset="item.left_pay_time >= 0 ? 1 : 18" span="5">
                  <button class="service-btn" @click="contactService">
                    联系客服
                  </button>
                </van-col>
              </van-row>
              <!-- 商业 -->
              <van-row
                v-else-if="item.order_status == 0 && item.order_type == 3"
              >
                <van-col v-if="item.left_pay_time >= 0" offset="12" span="5"
                  ><button class="driver-btn" @click="payPrice(item, 0)">
                    立即支付
                  </button>
                </van-col>
                <van-col :offset="item.left_pay_time >= 0 ? 1 : 18" span="5">
                  <button class="service-btn" @click="contactService">
                    联系客服
                  </button>
                </van-col>
              </van-row>
              <!-- 4.支付差价 + 客服 -->
              <van-row
                v-else-if="item.order_status == 7 && item.order_type == 0"
              >
                <van-col offset="12" span="5"
                  ><button class="driver-btn" @click="payPrice(item, 1)">
                    支付差价
                  </button>
                </van-col>
                <van-col offset="1" span="5">
                  <button class="service-btn" @click="contactService">
                    联系客服
                  </button>
                </van-col>
              </van-row>
              <!-- 5. 联系客服 -->
              <van-row v-else>
                <van-col offset="18" span="5">
                  <button class="service-btn" @click="contactService">
                    联系客服
                  </button>
                </van-col>
              </van-row>
            </van-row>
          </div>
        </van-row>
      </div>
    </van-row>
  </div>
</template>
<script>
import index from "./order.js";
export default index;
</script>

<style scoped>
@import "./index.css";
</style>
