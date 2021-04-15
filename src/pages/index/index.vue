<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2021-04-15 14:36:30
 * @FilePath: /mp-wechat/src/pages/index/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div>
    <div class="container">
      <div
        class="business-card"
        v-for="(item, index) in staticInfo"
        v-if="userType != null"
        :key="index"
        @click="toGenerateOrder(index)"
        :class="[index === 0 ? 'business-card-bg2' : 'business-card-bg1']"
      >
        <div class="title">
          <span>{{ item.title }}</span>
        </div>
        <div class="info">
          <p>
            {{ item.info }}
          </p>
        </div>
      </div>
      <!-- 只针对普通用户显示 -->
      <div
        v-if="userType == null"
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
            <h3>提示</h3>
          </div>
          <div>
            <button
              open-type="getUserInfo"
              class="van-button--user"
              @click="onClickHide"
              @getuserinfo="bindGetUserInfo($event, 0)"
            >
              我是用户
            </button>
          </div>
          <div>
            <button
              open-type="getUserInfo"
              class="van-button--prop"
              @getuserinfo="bindGetUserInfo($event)"
            >
              我是物业
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
