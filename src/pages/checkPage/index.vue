<template>
    <div>
        <div class="fieldSize">
            <div>
                <van-field
                type="tel"
                :value="phoneNumber"
                label="联系电话"
                placeholder="手机号码"
                maxlength="11"
                @change="onchange"
                required
                >
                    <van-button slot="button" size="small" type="primary">发送验证码</van-button>
                </van-field>
            </div>
            <div>
                <van-field
                type="text"
                :value="checkCode"
                label="验证码"
                placeholder="验证码"
                @change="onchange"
                required
            />
            </div>
        </div>
        <div>
            <van-col offset="8" span="8">
                <van-button type="primary" size="large" >完 成</van-button>
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

    }
};
</script>

<style scoped>
>>> .fieldSize {
    margin: 20% 5% 20%;
}
</style>>
