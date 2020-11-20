<template>
    <div>
        <div class="card">
            <van-row>
                <span class="titleSize">小区</span><br>
                <span class="textSize">{{ adress }}</span>
            </van-row>
            <van-row>
                <span class="titleSize">所属居委</span>
                <span class="textSize">{{ org }}</span>
            </van-row>
            <van-row>
                <span class="titleSize">所属物业</span>
                <span class="textSize">{{ wuye }}</span>
            </van-row>
            <van-row>
                <span class="titleSize">物业负责人</span>
                <span class="textSize">{{ name }}</span>
            </van-row>
            <van-row>
                <span class="titleSize">性别</span>
                <span class="textSize">{{ gender }}</span>
            </van-row>
            <van-row>
                <span class="titleSize">手机号</span>
                <span class="textSize">{{ phoneNumber}}</span>
            </van-row>
            <van-row>
                <span class="titleSize">身份证号</span>
                <span class="textSize">{{ id }}</span>
            </van-row>
        </div>
        <button class="changeButton" @click="changePages">确认</button>
    </div>
</template>
<script>
export default {
    data() {
        return{
            adress:"",
            org:"",
            wuye:"",
            name:"",
            gender:"",
            phoneNumber:"",
            id:1000000000
        }
    },
    method: {
        changePages() {
            let url = "../index/main"
            mpvue.navigateTo({ url })
        }
    }
}
</script>rip
<style scoped>
.card {
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.05);
    margin: 5% 10% 5% 10%;
    background-color: rgba(255, 255, 255, 0.883);
    border-radius: 15px;
}
.titleSize{
    font-weight: bold;
    font-size: 20px
}
.textSize{
    text-align: right;
    font-size: 15px;
}
.changeButton{
    background-color: dodgerblue;
    color: white;
    align-content: center;
    margin: 10% 20%;
}
</style>