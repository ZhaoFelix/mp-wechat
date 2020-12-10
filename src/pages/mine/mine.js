/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-08 15:55:12
 * @LastEditTime: 2020-12-10 10:21:48
 * @FilePath: /mp-wechat/src/pages/mine/mine.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
import {mapState} from 'vuex';

export default {
    data() {
      return {
        // active: 0,
        list:[]
      };
    },
    computed:{
      ...mapState(["userID"]),
    },
    methods: {
      onChangeTab() {
          console.log("切换tab")
      },
      contactDriver(info){
        console.log(info.driver_phone)
        wx.makePhoneCall({
          phoneNumber: info.driver_phone
        })
      },
      contactService(){
        // TODO:待添加客服电话
        console.log("联系客服")
        wx.makePhoneCall({
          phoneNumber: "15300869767"
        })
      }
    },
    mounted(){
      var _this = this;
         this.$wxRequest
         .get({
           url:'/mobile/order/query?userId='+this.userID
         })
         .then((res) => {
            if (res.data.code == '20000'){
                this.list = res.data.data
                for (let i=0;i<this.list.length;i++){
                  let obj = this.list[i]
                  if(obj.car_id != null && obj.driver_id != null){
                    _this.$wxRequest.get({
                      url:'/mobile/order/query/info?carId='+obj.car_id+"&driverId="+obj.driver_id
                    }).then((res) => {
                      if(res.data.code == '20000'){
                        obj.Info = res.data.data[0]
                        _this.list = [..._this.list]
                      }
                    })
                  }
                }
            } else {
              wx.showToast({
                title: "数据获取失败",
                icon: "none",
            });
            }
         })
         .catch((error) =>{
           console.log("获取订单列表失败")
         })
    }
  };