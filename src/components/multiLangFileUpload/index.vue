<template>
    <div class="multi-upload-box">
        <div class="multi-upload-show" @click="showDialog = true">
            <div>
                <i class="el-icon-plus"></i>
                <img :src="getCnImgCover()">
            </div>
        </div>
        <el-dialog title="添加多语言图片" width="700px"
                   append-to-body
                   :visible.sync="showDialog"
                   @close="showDialog = false">
            <div class="multi-upload-wrapper">
                <div class="all-tip">
                    <el-button @click="handleSameAll" size="mini" type="primary" plain>同步所有</el-button> *将当前图片同步到其他所有语言项（已上传的会被覆盖）
                </div>
                <el-tabs type="border-card" v-model="curLanguage" @tab-click="handleTabChange">
                    <el-tab-pane v-for="(item, i) in languageList"
                                :name="item.code"
                                :key="i">
                        <span slot="label"><i v-if="item.code == 'cn' || item.code == 'en'" class="required">*</i> {{ item.desc }}</span>
                        <div class="upload-tips">
                            <span>上传图片：</span>
                            <em>支持上传.jpg/.png/.gif格式的文件，请保持各语言版本一致</em>
                        </div>
                        <c-upload :limit="limit"
                                  v-if="showDialog && curLanguage === item.code"
                                  :accept="accept"
                                  :refsName="item.code + 'fileUpload'"
                                  :fileList="curImgUrl"
                                  :getType="getType"
                                  :signCode="item.code" @setData="setFileList"></c-upload>
                        <div class="all-tip">
                            <el-button @click="handleSameEmpty" type="primary" plain size="mini">同步至未上传图片项</el-button> *将当前图片同步到其他未上传图片的语言项
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleClose">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import cUpload from '@/components/fileUpload/'
    export default {
        props: {
            propFileList: {
                type: Array,
                default: () => { return [] } // [{ languageCode: 'cn', name: 'a地址,b地址' }]
            },
            limit: {
                type: Number,
                default: 1
            },
            accept: String,
            getType: String
        },
        data () {
            return {
                param: {
                    name: ''
                },
                showDialog: false,
                rules: {
                    name: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                fileList: [],
                curLanguage: 'cn',
                curImgUrl: ''
            }
        },
        watch: {
            propFileList: {
                handler (val) {
                    console.log(val)
                    if (val) {
                        this.$nextTick(()=>{
                            this.fileList = JSON.parse(JSON.stringify(val))
                            this.handleTabChange()
                        })
                        
                    }
                },
                deep: true
            }
        },
        components: {
            cUpload
        },
        computed: {
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        created () {
            this.fileList = JSON.parse(JSON.stringify(this.propFileList))
            this.handleTabChange()
        },
        methods: {
            handleTabChange () {
                let curItem = this.fileList.find(item => item.languageCode === this.curLanguage)
                this.curImgUrl = curItem ? curItem.name : ''
            },
            getCnImgCover () {
                let item = this.propFileList.find((val) => {
                    return val.languageCode == 'cn'
                })
                return item ? this.dealShowFileSrc(item.name.split(',')[0]) : ''
            },
            handleSameAll () {
                if (!this.curImgUrl) {
                    this.$message.warning('请先上传当前项的图片')
                } else {
                    this.fileList = []
                    this.languageList.forEach(item => {
                        this.fileList.push({
                            languageCode: item.code,
                            name: this.curImgUrl
                        })
                    })
                    this.$message.success('同步成功')
                }
            },
            handleSameEmpty () {
                if (!this.curImgUrl) {
                    this.$message.warning('请先上传当前项的图片')
                } else {
                    this.languageList.forEach(language => {
                        let itemI = this.fileList.findIndex((val) => {
                            return val.languageCode == language.code
                        })
                        if (itemI === -1) {
                            this.fileList.push({
                                languageCode: language.code,
                                name: this.curImgUrl
                            })
                        }
                    })
                    this.$message.success('同步成功')
                }
            },
            setFileList (res) {
                console.log(res)
                let itemI = this.fileList.findIndex((val) => {
                    return val.languageCode == res.signCode
                })
                if (itemI != -1) {
                    this.fileList[itemI].name = res.data
                } else {
                    this.fileList.push({
                        languageCode: res.signCode,
                        name: res.data
                    })
                }
                this.handleTabChange()
            },
            getCurrentLangFile (code) {
                let item = this.fileList.find((val) => {
                    return val.languageCode == code
                })

                return item ? item.name : ''
            },
            handleClose () {
                // 取消了，则恢复
                this.fileList = JSON.parse(JSON.stringify(this.propFileList))
                this.curLanguage = 'cn'
                this.handleTabChange()
                this.showDialog = false
            },
            confirm () {
                let item = this.fileList.filter((val) => {
                    return (val.languageCode == 'cn' && val.name) || (val.languageCode == 'en' && val.name)
                })
                if (item.length < 2) {
                    return this.$message.warning('中文和英文图片不能为空')
                }
                this.showDialog = false
                this.$emit('setData', this.fileList)
            }
        }
    }
</script>
<style lang="scss" scoped>
.multi-upload-box{
   .multi-upload-show{
       width: 60px;
       height: 60px;
       border: 1px solid #145BD3;
       color: #145BD3;
       font-size: 30px;
       position: relative;
       cursor: pointer;
       box-sizing: border-box;
       padding: 2px;
       overflow: hidden;
       >div{
           width: 100%;
           height: 100%;
           display: flex;
           justify-content: center;
           align-items: center;
           border: 1px solid #145BD3;
       }
       img{
           width: 100%;
           display: flex;
           position: absolute;
           left: 0;
           top: 0;
       }
   }
}
.multi-upload-wrapper{
    .all-tip {
        margin: 10px 0;
    }
    .upload-tips {
        margin-bottom: 10px;

        span {
            color: #333;
        }

        em {
            font-weight: normal;
            color: #666;
        }
    }
}
</style>
