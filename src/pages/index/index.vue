<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2020-12-07 13:45:28
 * @FilePath: /mp-wechat/src/pages/index/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div>
    <div class="container">
      <div
        class="business-card"
        v-for="(item, index) in staticInfo"
        :key="index"
        @click="toGenerateOrder(index)"
        :class="[index === 0 ? 'business-card-bg1' : 'business-card-bg2']"
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
    </div>
    <!-- 遮罩层 -->
    <van-overlay :show="show">
      <div class="wrapper">
        <div class="block">
          <div class="textSize">
            <h2>请选择您的身份</h2>
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
              @click="changePageToCheck"
              @getuserinfo="bindGetUserInfo($event, 1)"
            >
              我是物业
            </button>
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
