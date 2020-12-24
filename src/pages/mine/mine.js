/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-15 14:07:29
 * @LastEditTime: 2020-12-24 14:59:59
 * @FilePath: /mp-wechat/src/pages/mine/mine.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
import { mapState } from "vuex";
import { servicePhone } from "../../../config/options";
export default {
  data() {
    return {
      isFeedback: false,
      feedback: null,
    };
  },
  computed: {
    ...mapState(["isLogin", "openID", "userID", "avatar", "nickname"]),
  },
  methods: {
    onClick(index) {
      if (index == 0) {
        let url = "../protocol/main";
        mpvue.navigateTo({ url });
      } else if (index == 1) {
        this.isFeedback = true;
      } else {
        wx.makePhoneCall({
          phoneNumber: servicePhone,
        });
      }
    },
    onblurFeedback(event) {
      this.feedback = event.mp.detail.value;
    },
    feedbackContent() {
      if (this.feedback == null) {
        wx.showToast({
          title: "请输入反馈信息",
          icon: "none",
        });
      } else {
        this.$wxRequest
          .post({
            url: "/Dmobile/feedback",
            data: {
              userId: this.userID,
              feedback: this.feedback,
            },
          })
          .then((res) => {
            if (res.data.code == "20001") {
              wx.showToast({
                title: res.data.message,
                icon: "none",
              });
            } else if (res.data.code == "20000") {
              wx.showToast({
                title: res.data.message,
                icon: "none",
              });
            }
          });
      }
    },
  },
  mounted() {
    console.log("对象挂载");
  },
};
