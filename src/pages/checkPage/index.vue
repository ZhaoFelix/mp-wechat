<template>
  <div>
    <div class="fieldSize">
      <div>
        <van-field
          type="number"
          :value="phoneNumber"
          label="联系电话"
          placeholder="输入您的手机号"
          maxlength="11"
          :error-message="phoneMessage"
          @change="onchangePhoneNumber"
          @blur="getValue"
          required
        >
          <!-- <van-button
            slot="button"
            size="small"
            type="primary"
            @click="getCode()"
            >发送验证码</van-button -->
          >
        </van-field>
        <span class="tip">* 手机号将用于进行物业身份的认证</span>
      </div>
      <!-- <div>
        <van-field
          type="text"
          :value="checkCode"
          label="验证码"
          placeholder="验证码"
          @change="getCheckCode"
          required
        />
      </div> -->
    </div>
    <div>
      <van-col offset="8" span="8">
        <van-button type="primary" size="large" @click="estateVerify"
          >认 证</van-button
        >
      </van-col>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      phoneNumber: "",
      checkCode: "",
      phoneMessage: "",
    };
  },
  computed: {
    ...mapState(["openID", "userID"]),
  },
  methods: {
    changePage() {
      let url = "../propInformation/main";
      mpvue.navigateTo({ url });
    },
    getValue(event) {
      this.phoneNumber = event.mp.detail.value;
    },
    getCheckCode(event) {
      this.checkCode = event.mp.detail;
    },
    onchangePhoneNumber(event) {
      const phone = event.mp.detail || event;
      // 失去光标后进行判断
      if (event.mp.detail.value != undefined) {
        return;
      }
      if (phone) {
        if (/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
          this.phoneMessage = "";
        } else {
          this.phoneMessage = "您输入的手机号码有误";
        }
      } else {
        this.phoneMessage = "输入的手机号不能为空";
      }
    },
    // 根据手机号进行身份认证
    estateVerify() {},
  },
};
</script>

<style scoped>
.fieldSize {
  margin: 20% 5% 20%;
}
.tip {
  color: red;
  font-size: 12px;
  padding: 8px;
}
</style>
>
