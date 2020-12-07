<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2020-12-07 21:14:22
 * @FilePath: /mp-wechat/src/pages/propInformation/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div>
    <div class="card" v-for="(item, index) in list" :key="index">
      <van-cell-group title="详细信息">
        <van-cell title="小区" :value="item.estate_plot" />
        <van-cell title="所属居委" :value="item.estate_region" />
        <van-cell title="所属物业" :value="item.estate_company" />
        <van-cell title="物业负责人" :value="item.estate_name" />
        <van-cell title="身份证号" :value="item.estate_card_id" />
        <van-cell title="性别" :value="iteem.estate_gener == 2 ? '男' : '女'" />
      </van-cell-group>
    </div>
    <button class="changeButton" @click="changePages">确认</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      phone: "",
      list: [],
    };
  },
  method: {
    changePages() {
      let url = "../index/main";
      mpvue.navigateTo({ url });
    },
  },
  mounted() {
    let params = this.$root.$mp.query;
    this.phone = params.phone;
    this.$wxRequest
      .get({
        url: "/public/verify/estate?phone=" + this.phone,
      })
      .then((res) => {
        console.log(res);
        this.list = res.data.data;
      });
  },
};
</script>
rip
<style scoped>
.card {
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.05);
  margin: 5% 10% 5% 10%;
  background-color: rgba(255, 255, 255, 0.883);
  border-radius: 15px;
}

.changeButton {
  background-color: dodgerblue;
  color: white;
  align-content: center;
  margin: 10% 20%;
}
</style>
