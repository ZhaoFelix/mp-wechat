/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-08 15:55:12
 * @LastEditTime: 2020-12-09 14:42:17
 * @FilePath: /mp-wechat/src/pages/mine/mine.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
import {mapState} from 'vuex';

export default {
    data() {
      return {
        active: 0,
      };
    },
    computed:{
      ...mapState(["userID"]),
    },
    methods: {
      onChangeTab() {
          console.log("切换tab")
      },
    },
    mounted(){
         this.$wxRequest
         .get({
           url:'/mobile/order/query?userId='+this.userID
         })
         .then((res) => {

         })
         .catch((error) =>{
           console.log("获取订单列表失败")
         })
    }
  };