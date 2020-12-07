/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-07 10:42:32
 * @LastEditTime: 2020-12-07 10:44:11
 * @FilePath: /mp-wechat/src/pages/index/login.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
const staticInfo = [
    {
      type: "business",
      title: "商业装修垃圾清运",
      info: "适用于：商业门店装修",
    },
    {
      type: "normal",
      title: "普通装修垃圾清运",
      info:
        "适用于：普通住宅装修垃圾清运、毛胚住宅装修垃圾清运、新房住宅垃圾清运、老房住宅垃圾清运",
    },
  ];
  export default {
    data() {
      return {
        openID: "",
        staticInfo,
        show: false,
        showBorder: true,
        count: "0",
      };
    },
    methods: {
      onClickShow() {
        this.show = true;
      },
      onClickHide() {
        this.show = false;
      },
      toGenerateOrder(type) {
        let url = "../inputPage/main";
        mpvue.navigateTo({ url });
      },
      changePageToCheck() {
        let url = "../checkPage/main";
        mpvue.navigateTo({ url });
      },
      bindGetUserInfo(e, id) {
        this.openID = this.$store.state.openID.openID;
        console.log(this.$store.state.openID.openID);
        if (this.$store.state.isLogin) {
          return;
        }
        if (e.mp.detail.userInfo) {
          let { encryptedData, userInfo, iv } = e.mp.detail;
          let data = {
            user_type: id,
            openId: this.openID,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,
            nickName: userInfo.nickName,
            province: userInfo.province,
            country: userInfo.country,
          };
          console.log(data);
  
          this.$wxRequest
            .post({
              url: "/mobile/wxauth/wechat",
              data: data,
            })
            .then((res) => {
              if (res.data.code == 20000) {
                console.log(res.data.data[0]);
                this.$store.commit("setUserID", {
                  openID: res.data.data[0].wechat_id,
                });
                this.$store.commit("changeLogin");
                //
                if (id == 0) {
                  this.show = false;
                } else {
                  const url = "../checkPage/main";
                  mpvue.navigateTo({ url });
                }
              } else {
                console.log("获取失败");
              }
            });
        } else {
          console.log("用户点击了拒绝按钮");
        }
      },
      getUserInfo() {
        this.openID = this.$store.state.openID.openID;
        this.$wxRequest
          .post({
            url: "/mobile/wxauth/getUserInfo",
            data: { openId: this.openID },
          })
          .then((res) => {
            if (res.data.code == 20000) {
              let dataArr = res.data.data;
              if (dataArr.length == 0) {
                this.show = true;
              }
            } else {
              console.log("查询失败", res.data.data);
            }
          });
      },
    },
    mounted() {
      var _this = this;
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
                  _this.$store.commit("setOpenID", {
                    openID: res.data.data.openid,
                  });
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