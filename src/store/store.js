import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    openID: "",
    isLogin: false,
    userID: 0,
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
  },
});
