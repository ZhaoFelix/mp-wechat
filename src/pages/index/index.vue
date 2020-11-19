<template>
  <div>
    <van-row>
      <van-col offset="2" span="20">
        <div>
          <van-cell open-type="getUserInfo" :title="textOfBuildTitle" :label="textOfBuild" @click="changePageToUser($event, 0)" size="lagre" custom-class="van-cell--mid"></van-cell>
        </div>
      </van-col>
    </van-row>
    <van-row>
      <van-col offset="2" span="20">
        <div>
          <van-cell  :title="textOfNormalTitle" :label="textOfNormal" @click="changePageToProp" custom-class="van-cell--mid"></van-cell>
        </div>
      </van-col>
    </van-row>
    <!-- 遮罩层 -->
    <van-button type="primary" @click="onClickShow">嵌入内容</van-button>
    <van-overlay :show ="show">
      <view class="wrapper">
        <view class="block">
          <div class="textSize">
            <h2>请选择您的身份</h2>
          </div>
          <div>
            <button open-type="getUserInfo" type="primary" custom-class="van-button--user" @click="onClickHide" @getuserinfo="bindGetUserInfo($event, 0)">我是用户</button>
          </div>
          <div>
            <button open-type="getUserInfo" type="primary" custom-class="van-button--prop" @click="changePageToCheck" @getuserinfo="bindGetUserInfo($event, 1)">我是物业</button>
          </div>
        </view>
      </view>
    </van-overlay>
  </div>
</template>

<script>

export default {
  data() {
    return {
      openID: "",
      textOfBuildTitle:"商业装修垃圾清运",
      textOfBuild:"适用于：商店装修",
      textOfNormalTitle:"普通装修垃圾清运",
      textOfNormal:"适用于：普通住宅装修垃圾清运、毛胚住宅装修垃圾清运、新房住宅垃圾清运、老房住宅垃圾清运",
      show:true,
      showBorder:true,
      count:"0"
    }
  },
  methods: {
    onClickShow(){
      this.show = true
    },
    onClickHide(){
      this.show = false
    },
    changePageToUser(e, id){
      let url = "../inputPage/main"
      mpvue.navigateTo({ url });
    },
    changePageToProp(){
      let url = "../inputPages/main"
      mpvue.navigateTo({ url })
    },
    changePageToCheck(){
      let url = "../checkPage/main"
      mpvue.navigateTo({ url })
    },
    getOpenId() {
      var _this = this;
      console.log("开始获取openID!")
      // 登录获取openID
      wx.login({
        success(res) {
          if (res.code) {
            // console.log(res);
            _this.$wxRequest
              .post({
                url: "/mobile/wxauth/wxauth",
                data: {
                  code: res.code,
                },
              })
              .then((res) => {
                if (res.data.code == 20000) {
                  // console.log("测试---------------")
                  console.log(res.data)
                  // console.log(res.data.data.openid);
                  _this.$store.commit("setOpenID", {
                    openID: res.data.data.openid,
                  });
                } else {
                  console.log("获取openId失败")
                }
              })

            // 这里可以把code传给后台，后台用此获取openid及session_key
          }
        }
      })
    }, 
    bindGetUserInfo(e, id) {
      this.openID = this.$store.state.openID.openID
      console.log(this.$store.state.openID.openID)

      if (this.$store.state.isLogin) {
        return;
      }
      // console.log(e)
      console.log("-----------")
      if (e.mp.detail.userInfo) {
        console.log("用户按了允许授权按钮");
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
        console.log(data)

        this.$wxRequest
          .post({
            url: "/mobile/wxauth/wechat",
            data: data,
          })
          .then((res) => {
            console.log("bindGetUSerInfo--------------")
            // console.log(res.data)
            if (res.data.code == 20000) {
              console.log(res.data.data[0]);
              this.$store.commit("setUserID", {
                openID: res.data.data[0].wechat_id,
              });
              this.$store.commit("changeLogin");
              // 
              if (id == 0) {
                const url = "../inputPage/main"
                mpvue.navigateTo({ url });
              } else {
                const url = "../checkPage/main"
                mpvue.navigateTo({ url });
              }
            } else {
              console.log("获取失败")
            }
          });
      } else {
        console.log("用户点击了拒绝按钮")
      }
    }
  },
  mounted() {
    var _this = this;
    wx.getSetting({
      success(res) {    	          	 
        if (!res.authSetting['scope.userInfo']) {//未授权getUserInfo            	
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {	                
              // 用户已经同意小程序使用用户信息，后续调用 wx.userInfo 接口不会弹窗询问       
              console.log(res)
              // wx.getUserInfo({
              //   success(res) {
              //     _this.getOpenId()
              //   }
              // })
            },
            fail(err){
              console.log(err)
            }
          })
        }else{//已授权
          wx.getUserInfo({
            success(res) {	
              _this.getOpenId()
            },
            fail(err) {
              console.log(err)
            }
          })
        }
      }
    })
  }
}
</script>

<style scoped>

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 40%;
  background-color: #fff;
}

.textSize {
  text-align: center;
  color:black;
  margin:20px;
}

.van-cell--mid{
  background-color: blue;
  height: 70%;
  width: 80%;
  margin: 10% 10%;
}

.van-button--user{
  background-color:rgb(255, 153, 0);
  border: white;
  width: 50%;
  height: 40px;
  margin: 5% 25%;
}

.van-button--prop {
  background-color:rgb(0, 119, 255);
  border: white;
  width: 50%;
  height: 40px;
  margin: 5% 25%;
}

</style>
