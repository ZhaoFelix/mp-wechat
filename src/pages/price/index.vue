<!--
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-20 15:48:31
 * @LastEditTime: 2020-12-22 10:32:12
 * @FilePath: /mp-wechat/src/pages/price/index.vue
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
-->
<template>
  <div class="container">
    <div class="content-table">
      <h2>上海市清运费最高收费标准及计价方式</h2>
      <div class="table-img"></div>
      <div class="right">
        <p>
          上海市物价局
          <br />上海市绿化和市容管理局<br />上海市住房保障和房屋管理局
          <br />
          　　二○一四年四月一日
        </p>
      </div>
    </div>
    <div class="content-example">
      <h3>全市清运费最高收费标准及计价方式</h3>
      <p>
        　　1、首次装饰装修清运费收费标准适用于对毛坯住宅进行装饰装修产生的居民非生活垃圾清运；非首次装饰装修收费标准适用于对已完成装饰装修的住宅再次进行装饰装修产生的居民非生活垃圾清运。<br />
        　　2、住宅面积在55平方米（含55平方米）及以下的，按套收取基本面积清运费；超55平方米部分，按面积加收超基本面积清运费。<br />
        　　3、面积的核算方式：住宅已办理房地产权证的，按房地产权证载明的房屋建筑面积计；未办理房地产权证的，按预（销）售合同载明的房屋建筑面积计；公有住宅按公房租赁凭证载明的房屋使用面积或建筑面积计。<br />
        　　附例：以全市清运费最高收费标准计，对建筑面积160平方米的住宅进行首次装饰装修，其应付的清运费最高为：<br />
        　　300＋（140－55）×5＋（160－140）×7＝865元
      </p>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.01);
  position: absolute;
}
.content-table {
  text-align: center;
}

.right p {
  text-align: right;
}
.content-example {
  margin-top: 15px;
  padding-bottom: 50px;
}
.content-example h3 {
  text-align: center;
  padding-bottom: 8px;
}
p {
  color: rgba(1, 1, 1, 0.6);
  padding: 0 8px;
  font-size: 14px;
  line-height: 25px;
}

.table-img {
  width: 100%;
  height: 174px;
  background-size: contain;
  background-image: url("https://wechatimg.ningjin.qingmaoedu.com/mp/3.png");
  background-repeat: no-repeat;
}
</style>
