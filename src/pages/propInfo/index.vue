<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2020-12-19 17:27:25
 * @FilePath: /mp-wechat/src/pages/propInfo/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div>
    <div class="card" v-for="(item, index) in list" :key="index">
      <van-cell-group title="详细信息">
        <van-cell
          value-class="info"
          title-width="90px"
          title="小区"
          :value="item.estate_plot"
        />
        <van-cell
          value-class="info"
          title-width="90px"
          title="所属居委"
          :value="item.estate_region"
        />
        <van-cell
          value-class="info"
          title-width="90px"
          title="所属物业"
          :value="item.estate_company"
        />
        <van-cell
          value-class="info"
          title-width="90px"
          title="物业负责人"
          :value="item.estate_name"
        />
        <van-cell
          value-class="info"
          title="身份证号"
          title-width="90px"
          :value="item.estate_card_id"
        />
        <van-cell
          title="性别"
          value-class="info"
          title-width="90px"
          :value="item.estate_gender === 2 ? '男' : '女'"
        />
      </van-cell-group>
    </div>
    <button class="changeButton" @click="changePages">确认</button>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Toast from "@vant/weapp/dist/toast/toast";
export default {
  data() {
    return {
      phone: "",
      list: [],
    };
  },
  computed: {
    ...mapState(["openID", "userID"]),
  },
  methods: {
    changePages() {
      this.$wxRequest
        .post({
          url: "/public/verify/auth",
          data: {
            phone: this.phone,
            userId: this.userID,
          },
        })
        .then((res) => {
          if (res.data.code == "20000") {
            wx.showToast({
              title: "认证成功",
              icon: "none",
            });

            //  认证成功，返回首页
            let url = "../index/main";
            mpvue.switchTab({ url });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none",
            });
          }
        });
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
        this.list = res.data.data;
      });
  },
};
</script>
<style scoped>
.card {
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.05);
  margin: 5% 10% 5% 10%;
  background-color: rgba(255, 255, 255, 0.883);
  border-radius: 15px;
}

.changeButton {
  background-color: #07c160;
  color: white;
  align-content: center;
  margin: 10% 20%;
}

van-cell >>> .info {
  padding-right: 20px;
  text-align: left;
}
</style>
