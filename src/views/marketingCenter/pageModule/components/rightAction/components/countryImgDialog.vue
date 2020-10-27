<template>
    <div class="country-img-dialog">
        <el-dialog title="添加图片"
            :visible="showCountryImg"
            :close-on-click-modal="false"
            @close="handleClose"
        >
            <ul class="file-upload-box">
                <li v-for="item in languageList" :key="item.code">
                    <c-upload 
                        :limit="1" 
                        @setData="(val) => setAdImg(val, item.code)"
                        :fileList="curImgObj[item.code]"
                        ></c-upload>
                    {{ item.desc }}
                </li>
            </ul>

            <span slot="footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import cUpload from '@/components/fileUpload'

export default {
    props: {
        languageList: Array,
        showCountryImg: Boolean,
        imgList: [Array, Object],
        curType: {
            type: String,
            default: 'array'
        } // 'array' 表示图片存储和传输的都是数组形式，'object' 则是对象形式
    },
    data () {
        return {
            curImgObj: {} // 先处理成对象形式
        }
    },
    components: {
        cUpload
    },
    created () {
        let temp = JSON.parse(JSON.stringify(this.imgList))
        let res = {}
        if (this.curType == 'array') {
            temp.forEach(item => {
                res[item.languageCode] = item.name
            })
        } else {
            res = temp
        }
        // 处理格式，方便判断
        this.curImgObj = Object.assign(res)
    },
    methods: {
        handleClose () {
            this.$emit('close')
        },
        handleConfirm () {
            let temp = { ...this.curImgObj }
            if (!temp.cn || !temp.en) {
                this.$message.error('中英文图片须设置')
                return
            }

            let res = null
            if (this.curType == 'array') {
                res = []
                Object.keys(temp).forEach(code => {
                    res.push({
                        languageCode: code,
                        name: temp[code]
                    })
                })
            } else {
                res = JSON.parse(JSON.stringify(temp))
            }

            this.$emit('confirm', res)
        },
        setAdImg (res, code) {
            this.curImgObj[code] = res.data
        }
    }
}
</script>


<style lang="scss">
.country-img-dialog {
    .avatar-uploader,.el-upload--picture-card, .el-upload-list__item{
        width: 100px;
        height: 100px;
        line-height: 100px;
    }
}
</style>
<style lang="scss">
.country-img-dialog {
    .file-upload-box {
        display: flex;
        flex-wrap: wrap;
        li {
            text-align: center;
            margin-right: 14px;
        }
    }
    .file-upload-wrapper {
        margin-right: 4px;
        margin-bottom: 0;
    }

}
</style>