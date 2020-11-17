<template>
  <div>
    <van-row>
      <van-col offset="2" span="20">
        <van-cellgroup :border="showBorder">
          <div>
            <van-cell :title="textOfBuildTitle" :label="textOfBuild" @click="changePageToUser" size="lagre" custom-class="van-cell--mid"></van-cell>
          </div>
        </van-cellgroup>
      </van-col>
    </van-row>
    <van-row>
      <van-col offset="2" span="20">
        <van-cell :title="textOfNormalTitle" :label="textOfNormal" @click="changePageToProp" custom-class="van-cell--mid"></van-cell>
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
            <van-button type="primary" custom-class="van-button--user" @click="onClickHide">我是用户</van-button>
          </div>
          <div>
            <van-button type="primary" custom-class="van-button--prop" @click="changePageToCheck">我是物业</van-button>
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
      textOfBuildTitle:"商业装修垃圾清运",
      textOfBuild:"适用于：商店装修",
      textOfNormalTitle:"普通装修垃圾清运",
      textOfNormal:"适用于：普通住宅装修垃圾清运、毛胚住宅装修垃圾清运、新房住宅垃圾清运、老房住宅垃圾清运",
      show:true,
      showBorder:true
    }
  },
  methods: {
    onClickShow(){
      this.show = true
    },
    onClickHide(){
      this.show = false
    },
    changePageToUser(){
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
    }
  }
};
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
>>> .van-cell--mid{
  background-color: blue;
  height: 70%;
  width: 80%;
  margin: 10% 10%;
}
>>> .van-button--user{
  background-color:rgb(255, 153, 0);
  border: white;
  width: 50%;
  height: 40px;
  margin: 5% 25%;
}

>>> .van-button--prop {
  background-color:rgb(0, 119, 255);
  border: white;
  width: 50%;
  height: 40px;
  margin: 5% 25%;
}

</style>
