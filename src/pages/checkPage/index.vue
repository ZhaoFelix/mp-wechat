<template>
    <div>
        <div class="fieldSize">
            <div>
                <van-field
                type="text"
                :value="phoneNumber"
                label="联系电话"
                placeholder="手机号码"
                maxlength="11"
                @change="getValue"
                required
                >
                    <van-button slot="button" size="small" type="primary" @click="getCode()">发送验证码</van-button>
                </van-field>
            </div>
            <div>
                <van-field
                type="text"
                :value="checkCode"
                label="验证码"
                placeholder="验证码"
                @change="getCheckCode"
                required
            />
            </div>
        </div>
        <div>
            <van-col offset="8" span="8">
                <van-button type="primary" size="large" @click="changePage(),checkCode()">完 成</van-button>
            </van-col>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            phoneNumber:'',
            checkCode:''

        };
    },
    methods:{
        changePage() {
            let url = "../propInformation/main"
            mpvue.navigateTo({ url })
        },
        getValue(event) {
            this.phoneNumber = event.mp.detail
        },
        getCheckCode(event) {
            this.checkCode = event.mp.detail
        },
        getCode() {
            let phone = this.phoneNumber
            // console.log(phone)
            console.log('获取手机验证码')
            this.$wxRequest
            .get({
                url: "/public/verify/verify?phone="+phone
            })
            .then((res) => {
                console.log("开始获取手机验证码--------------")
                // console.log(res.data)
                if(res.data.Message == "OK") {
                    console.log("获取验证码成功")
                } else {
                    console.log("获取验证码失败")
                }
            });
        },
        checkCode() {
            let data = {
                phone: this.phoneNumber,
                checkCode: this.checkCode
            }
            console.log(data)
            this.$wxRequest
            .post({
                url: "/public/verify/check",
                data: data
            })
            .then((res) => {
                console.log("开始获取手机验证码--------------")
                // console.log(res.data)
                if(res.data.Message == "OK") {
                    console.log("获取验证码成功")
                } else {
                    console.log("获取验证码失败")
                }
            });
        }

    }
};
</script>

<style scoped>
.fieldSize {
    margin: 20% 5% 20%;
}
</style>>
