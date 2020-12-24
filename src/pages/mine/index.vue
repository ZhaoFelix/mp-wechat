<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:57:47
 * @LastEditTime: 2020-12-24 14:46:19
 * @FilePath: /mp-wechat/src/pages/mine/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div class="main-container">
    <div class="user-info">
      <van-row>
        <van-col offset="1" span="6">
          <van-image
            :src="avatar"
            width="60"
            radius="30px"
            height="60px"
            fit="cover"
            @click="articleDetail"
          />
        </van-col>
        <van-col span="16">
          <div class="user-nickname">{{ isLogin ? nickname : "未登录" }}</div>
        </van-col>
      </van-row>
    </div>
    <div class="info-table">
      <van-cell
        is-link
        v-for="(item, index) in tableList"
        :key="index"
        :title="item.title"
        link-type="navigateTo"
        :url="item.url"
        @click="onClick(index)"
      />
    </div>
    <div class="version-info">v 1.0.0</div>
    <van-dialog
      use-slot
      title="反馈内容"
      :show="isFeedback"
      show-cancel-button
      @close="isFeedback = false"
      @confirm="feedbackContent"
    >
      <van-field
        :model="feedback"
        placeholder="请输入反馈信息"
        @blur="onblurFeedback"
        @change="onchangeFeedback"
      />
    </van-dialog>
  </div>
</template>

<script>
import index from "./mine.js";
export default index;
</script>

<style scoped>
@import url("./mine.css");
</style>
