<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2020-12-08 11:06:23
 * @FilePath: /mp-wechat/src/pages/mine/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div class="main-container">
    <van-tabs :active="active" bind:change="onChange">
      <van-tab title="全部"> </van-tab>
      <van-tab title="已完成"> </van-tab>
      <van-tab title="待支付"> </van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      price: 300,
    };
  },
  methods: {},
};
</script>

<style scoped></style>
