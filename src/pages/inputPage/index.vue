<template>
    <div>
        <van-cellgroup>
            <van-field
                v-model='name'
                label="联系人"
                placeholder="姓名"
                :border="boolen"
                :href="onChange"
                required
            />
        </van-cellgroup>
        <van-cellgroup>
            <van-field
                type="tel"
                :value="phoneNumber"
                label="联系电话"
                placeholder="手机号码"
                :border="boolen"
                maxlength="11"
                bind:change
                required
            />
        </van-cellgroup>
        <van-cellgroup>
            <van-filed

            />
        </van-cellgroup>
        <van-cellgroup>
            <van-field
                :value="address"
                label="地址"
                placeholder="省 市 区"
                required
                readonly="true"
                />
        </van-cellgroup>
        <van-cellgroup>
            <van-field
                :value="detailedAddress"
                label="详细地址"
                type="text"
                placeholder="请输入具体地址 如：街道名称"
                required
            />
        </van-cellgroup>
        <van-cellgroup>
            <van-field
                :value="buildArea"
                type="digit"
                label="建筑面积"
                placeholder="单位为平方米"
                required
            />
        </van-cellgroup>
        <van-cellgroup>
            <van-field
                :value="thoseTime"
                label="预约时间"
                placeholder="日期 小时"
                required
                
                />
        </van-cellgroup>
        <van-cellgroup>
            <van-field
                v-model="message"
                label="备注"
                type="textarea"
                placeholder="请输入留言"
                autosize
                required
            />
        </van-cellgroup>
        <!-- <van-cell>
            <van-popup :show="show" position="bottom">
                
            </van-popup>
        </van-cell> -->
        <div>
            <van-cell title="垃圾数量：1~4张"/>
            <van-uploader :file-list="fileList" bind:after-read="afterRead" />
        </div>
        <div>
            <van-field
                :value="cost"
                label="清运费"
                readonly="true"
                input-class="costColor"
            />
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            show:"false",
            name:'',
            phoneNumber:'',
            address:'上海市',
            columns:'',
            detailedAddress:'',
            buildArea:'',
            thoseTime:'',
            fileList:[],
            cost:'0'
        }
    },
    methods:{
        onConfirm(v) {
            this.show = false;
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
    }
}
</script>
<style scoped>
>>> .costColor {
    color: red;
}
</style>