/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:58:34
 * @LastEditTime: 2020-12-24 15:01:31
 * @FilePath: /mp-wechat/src/store/store.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    openID: "",
    isLogin: false,
    userID: 0,
    userType: null,
    show: false,
    avatar: "",
    nickname: "",
  },
  mutations: {
    setOpenID(state, v) {
      state.openID = v;
    },
    setUserID(state, v) {
      state.userID = v;
    },
    changeLogin(state) {
      state.isLogin = true;
    },
    setUserType(state, v) {
      state.userType = v;
    },
    setShow(state, v) {
      state.show = v;
    },
    setAvatar(state, v) {
      state.avatar = v;
    },
    setNickname(state, v) {
      state.nickname = v;
    },
  },
});
