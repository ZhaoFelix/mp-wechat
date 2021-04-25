/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-07 10:42:32
 * @LastEditTime: 2021-04-25 10:39:47
 * @FilePath: /mp-wechat/src/pages/index/login.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

import { mapState } from "vuex";

const staticInfo = [
  {
    type: "normal",
    title: "普通装修垃圾清运",
    info:
      "适用于：普通住宅装修垃圾清运、毛胚住宅装修垃圾清运、新房住宅垃圾清运、老房住宅垃圾清运",
  },
  {
    type: "business",
    title: "商业装修垃圾清运",
    info: "适用于：商业门店装修",
  },
  {
    type: "box",
    title: "建筑垃圾箱清运",
    info: "适用于：垃圾箱清运。",
  },
];
export default {
  data() {
    return {
      openID: "",
      staticInfo,
      showBorder: true,
      count: "0",

      canUseGetUserProfile: false,
    };
  },
  computed: {
    ...mapState(["show", "userType"]),
  },
  methods: {
    onClickShow() {
      this.$store.commit("setShow", true);
    },
    onClickHide() {
      this.$store.commit("setShow", false);
    },
    toGenerateOrder(type) {
      // 普通
      if (type == 1) {
        let url = "../usual/main?orderType=" + type;
        mpvue.navigateTo({ url });
      }
      // 商业
      else if (type == 2) {
        let url = "../business/main?orderType=" + type;
        mpvue.navigateTo({ url });
      }
      // 按箱
      else if (type == 3) {
        let url = "../box/main?orderType=" + type;
        mpvue.navigateTo({ url });
      }
    },
    changePageToCheck() {
      let url = "../verify/main";
      mpvue.navigateTo({ url });
    },
    bindGetUserInfo(e, id) {
      this.openID = this.$store.state.openID;
      if (this.$store.state.isLogin) {
        return;
      }
      if (e.mp.detail.userInfo) {
        let { userInfo } = e.mp.detail;
        let data = {
          user_type: id,
          openId: this.openID,
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender,
          nickName: userInfo.nickName,
          province: userInfo.province,
          country: userInfo.country,
        };
        this.addUserInfoToDB(data, id);
      } else {
        console.log("用户点击了拒绝按钮");
      }
    },
    getUserInfo() {
      this.openID = this.$store.state.openID;
      this.$wxRequest
        .post({
          url: "/mobile/wxauth/getUserInfo",
          data: { openId: this.openID },
        })
        .then((res) => {
          if (res.data.code == 20000) {
            let dataArr = res.data.data;
            if (dataArr.length == 0) {
              this.$store.commit("setShow", true);
            }
            // 判断是否已选择过角色
            else if (dataArr[0].user_type === null) {
              this.$store.commit("setShow", true);
            } else {
              //  存储用户ID和用户类型
              this.$store.commit("setUserID", dataArr[0].user_id);
              this.$store.commit("setUserType", dataArr[0].user_type);
              this.$store.commit("setNickname", dataArr[0].wechat_nickname);
              this.$store.commit("setAvatar", dataArr[0].wechat_avatar);
              this.userType = this.$store.state.userType;
              this.$store.commit("setShow", false);
              console.log("已选择过角色");
            }
          } else {
            console.log("查询失败", res.data.data);
          }
        });
    },
    // 高版本获取用户信息
    getUserProfile(e, id) {
      wx.getUserProfile({
        desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          let { userInfo } = res;
          let data = {
            user_type: id,
            openId: this.openID,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,
            nickName: userInfo.nickName,
            province: userInfo.province,
            country: userInfo.country,
          };
          this.addUserInfoToDB(data, id);
        },
        fail: (error) => {},
      });
    },
    // 普通更新角色类型
    updateUserType() {},
    // 将用户信息写入数据库
    addUserInfoToDB(data, id) {
      this.$wxRequest
        .post({
          url: "/mobile/wxauth/wechat",
          data: data,
        })
        .then((res) => {
          if (res.data.code == 20000) {
            console.log(res.data + "" + id);
            this.$store.commit("setUserID", res.data.data[0].user_id);
            this.$store.commit("changeLogin");
            this.$store.commit("setNickname", data.nickName);
            this.$store.commit("setAvatar", data.avatarUrl);
            if (id == 0) {
              this.show = false;
              this.getUserInfo();
            } else {
              const url = "../verify/main";
              mpvue.navigateTo({ url });
              this.getUserInfo();
            }
          } else {
            console.log("获取失败");
          }
        });
    },
  },
  mounted() {
    var _this = this;
    if (wx.getUserProfile) {
      this.canUseGetUserProfile = true;
    }
    // 登录获取openID
    wx.login({
      success(res) {
        // console.log(res);
        if (res.code) {
          console.log(res);
          _this.$wxRequest
            .post({
              url: "/mobile/wxauth/wxauth",
              data: {
                code: res.code,
              },
            })
            .then((res) => {
              if (res.data.code == 20000) {
                _this.$store.commit("setOpenID", res.data.data.openid);
                //根据openID判断用户是否是首次使用小程序
                _this.getUserInfo();
              } else {
                console.log("获取openId失败");
              }
            });
        }
      },
    });
  },
};
