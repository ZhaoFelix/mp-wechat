<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2021-04-20 16:41:48
 * @FilePath: /mp-wechat/src/pages/index/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div>
    <div class="container">
      <!-- 普通 -->
      <div
        class="business-card business-card-bg2"
        v-if="userType == 1"
        @click="toGenerateOrder(0)"
      >
        <div class="title">
          <span>{{ staticInfo[0].title }}</span>
        </div>
        <div class="info">
          <p>
            {{ staticInfo[0].info }}
          </p>
        </div>
      </div>
      <!-- 商业 -->
      <div
        class="business-card business-card-bg1"
        v-if="userType == 0 || userType == null"
        @click="toGenerateOrder(1)"
      >
        <div class="title">
          <span>{{ staticInfo[1].title }}</span>
        </div>
        <div class="info">
          <p>
            {{ staticInfo[1].info }}
          </p>
        </div>
      </div>

      <!-- 只针对普通用户显示 -->
      <div
        v-if="userType == 1"
        class="business-card business-card-bg1"
        @click="toGenerateOrder(2)"
      >
        <div class="title">
          <span>{{ staticInfo[2].title }}</span>
        </div>
        <div class="info">
          <p>
            {{ staticInfo[2].info }}
          </p>
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <van-overlay :show="show">
      <div class="wrapper">
        <div class="block">
          <div class="textSize">
            <h3>选择身份</h3>
          </div>
          <div>
            <button
              open-type="getUserInfo"
              class="van-button--user"
              @click="onClickHide"
              @getuserinfo="bindGetUserInfo($event, 0)"
            >
              普通用户
            </button>
          </div>
          <div>
            <button
              open-type="getUserInfo"
              class="van-button--prop"
              @getuserinfo="bindGetUserInfo($event)"
            >
              物业经理
            </button>
          </div>
          <div class="tip">
            <span style="color: red">*</span>
            若您是物业人员请使用手机号进行认证。
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import index from "./login.js";
export default index;
</script>

<style scoped>
@import "./index.css";
</style>
