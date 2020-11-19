<template>
    <div>
        <div>
            <van-field
                v-model='name'
                label="联系人"
                placeholder="姓名"
                @change="onChange"
                required
            />
        </div>
        <div>
            <van-field
                type="tel"
                :value="phoneNumber"
                label="联系电话"
                placeholder="手机号码"
                maxlength="11"
                @change="onchange"
                required
            />
        </div>
        <div>
        </div>
        <div>
            <van-field
                :value="address"
                label="地址"
                placeholder="省 市 区"
                required
                readonly="true"
                />
        </div>
        <div>
            <van-field
                :value="detailedAddress"
                label="详细地址"
                type="text"
                placeholder="请输入具体地址 如：街道名称"
                required
            />
        </div>
        <div>
            <van-field
                :value="buildArea"
                type="digit"
                label="建筑面积"
                placeholder="单位为平方米"
                required
                @change="onChange"
            />
        </div>
        <div>
            <van-cell
                title="是否首次装修" 
                label="*是否首次装修详见计价方式说明"  
            >
            <van-button :plain="yesOrNo" round size="mini" type="info" @click="onClickButton">Yes</van-button>
            </van-cell>
        </div>
        <div>
            <van-field
            :value="currentDate"
            label="预约时间"
            placeholder="日期 小时"
            required
            readonly
            @click="showTimePicker"
            />
        </div>
        <div>
            <van-field
                :model="message"
                label="备注"
                type="textarea"
                placeholder="请输入留言"
                autosize
                required
            />
        </div>
        <div>
            <van-popup
            :show="show"
            position="bottom"
            custom-style="height: 40%;"
            @close="show = false"
            >
            <van-datetime-picker
            type="year-month-time"
            :value="currentDate"
            :min-date="minDate"
            @input="onInput"
            @confirm="onConfirm"
            @change="onChange"
            />
            </van-popup>
        </div>
        <div>
            <van-cell title="垃圾数量：1~4张"/>
            <van-uploader :file-list="fileList" bind:after-read="afterRead" />
        </div>
        <div>
            <van-field
                :value="(cost + buildArea)"
                label="清运费"
                readonly
                input-class="costColor"
            />
        </div>
        <div>
            <van-button type="primary" custom-class="van-button--size" @click="onClickShow">立即下单</van-button>
        </div>
        <div>
            <van-overlay :show="overlayshow" @click="onClickHide">
                <view class="wrapper">
                    <view class="block">

                    </view>
                </view>
            </van-overlay>
        </div>
    </div>
</template>
<script>
import getSTS from '../../utils/getSTS'
export default {
    data(){
        return{
            overlayshow:false,
            yesOrNo:false,
            show:false,
            name:'',
            phoneNumber:'',
            address:'上海市',
            columns:'',
            detailedAddress:'',
            buildArea:'',
            thoseTime:'',
            fileList:[],
            cost:'300',
            minHour: 0,
            maxHour: 24,
            minDate: new Date().getTime(),
            currentDate: new Date().getTime(),
            OSSAccessKeyId: "",
            policy: "",
            signature: ""
        }
    },
    methods:{
        showTimePicker(){
            this.show = true
        },
        onClose() {
            this.show = false
        },
        onConfirm() {
            this.show = false
        },
        afterRead(event) {
            const { file } = event.detail;
            wx.uploadFile({
                url: 'https://example.weixin.qq.com/upload', // 接口地址
                filePath: file.path,
                name: 'file',
                formData: { user: 'test' },
                success(res) {
                    const { fileList = [] } = this.data;
                    fileList.push({ ...file, url: res.data });
                    this.setData({ fileList });
                },
            });
        },
        onInput(event) {
            this.setData({
                currentDate: event.detail,
            });
        },
        //有关遮罩层
        onClickShow() {
            this.overlayshow = true
        },
        onClickHide() {
            this.overlayshow = false
            }
    },
    mounted() {
        this.$wxRequest
          .get({
            url: "/public/getToken/osstoken"
          })
          .then((res) => {
            console.log("getKey--------------")
            // console.log(res.data)
            if (res.data.code == 20000) {
              console.log(res.data);
              this.OSSAccessKeyId = res.data.OSSAccessKeyId
              this.signature = res.data.signature
              this.policy = res.data.policy
            }
          });
          
    }
}
</script>

<style scoped>
.costColor {
    color: red;
}

.van-button--size {
    margin: 5% 35%;
}

.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.block {
    z-index: 1;
    width: 70%;
    height: 50%;
    background-color: #fff;
}
</style>