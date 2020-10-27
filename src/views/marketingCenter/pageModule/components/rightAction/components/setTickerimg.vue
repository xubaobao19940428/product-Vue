<template>
    <div class="set-ticker-img-wrapper">
        <el-dialog title="主图贴纸"
            :visible="showTickerSet"
            :close-on-click-modal="false"
            @close="handleClose"
        >
            <el-form :model="param" ref="setTickerImgForm" label-width="120px" @submit.native.prevent>
                <el-form-item 
                    class="is-required"
                    label="上传贴纸：" >
                    <ul class="file-upload-box">
                        <li v-for="item in languageList" :key="item.code">
                            <c-upload :limit="1" @setData="(val) => setTickerSet(val, item.code)"
                                :fileList="curTickerImg[item.code]"
                                ></c-upload>
                            {{ item.desc }}
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="选择商品：">
                    <el-input clearable @keyup.enter.native="getProductList" v-model="param.inputParam">
                        <i slot="suffix" class="el-icon-search el-input__icon" @click="getProductList"></i>
                    </el-input>
                </el-form-item>
            </el-form>
            <template v-if="from == 'group'">
                <el-table 
                    v-loading="load"
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
                    border
                    row-key="spuId"
                    ref="tickerImgTable"
                    :data="selectProductList">
                    <el-table-column type="selection" width="55" :selectable="setDisableItem" :reserve-selection="true"></el-table-column>
                    <el-table-column label="商品ID" prop="spuId" align="center"></el-table-column>
                    <el-table-column label="商品信息" width="360" align="center">
                        <template slot-scope="scope">
                            <div class="flex flex-item--center">
                                <el-popover
                                    placement="top-start"
                                    trigger="hover"
                                >
                                    <img :src="dealShowFileSrc(scope.row.groupSpuCover)" class="previewImage"/>
                                    <img :src="dealShowFileSrc(scope.row.groupSpuCover)" class="thumbnail"  slot="reference" style="width:50px"/>
                                </el-popover>
                                <el-tooltip class="item" effect="dark" :content="scope.row.groupSpuTitleCn" placement="top">
                                    <span class="title">{{ scope.row.groupSpuTitleCn }}</span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template v-else>
                <el-table 
                    v-loading="load"
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
                    border
                    row-key="productId"
                    ref="tickerImgTable"
                    :data="selectProductList">
                    <el-table-column type="selection" width="55" :selectable="setDisableItem" :reserve-selection="true"></el-table-column>
                    <el-table-column label="商品ID" prop="productId" align="center"></el-table-column>
                    <el-table-column label="商品信息" width="360" align="center">
                        <template slot-scope="scope">
                            <div class="flex flex-item--center">
                                <el-popover
                                    placement="top-start"
                                    trigger="hover"
                                >
                                    <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage"/>
                                    <img :src="dealShowFileSrc(scope.row.productCover)" class="thumbnail"  slot="reference" style="width:50px"/>
                                </el-popover>
                                <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                                    <span class="title">{{ scope.row.productName }}</span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

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
        showTickerSet: Boolean,
        productList: Array,
        curEditTickerIndex: [Number, String],
        allSelectIds: Array,
        curTickerImg: Object,
        curSelecIds: Array,
        from: String
    },
    data () {
        return {
            uploadParam: {},
            fileData: [],
            load: false,
            param: {
                inputParam: '',
                tickerImg: JSON.parse(JSON.stringify(this.curTickerImg)),
                selectIds: []
            },
            setTickerImg: {},
            selectProductList: JSON.parse(JSON.stringify(this.productList)) || [],
            rules: {
                tickerImg: [{
                    validator: (rule, value, calllback) => {
                        if (!(value.en || value.cn)) {
                            calllback(new Error('中英文图片必须设置'))
                        } else {
                            calllback()
                        }
                    }
                }]
            }
        }
    },
    components: {
        cUpload
    },
    mounted () {
        this.$nextTick(() => {
            this.toggleSelection(this.curSelecIds)
        })
    },
    methods: {
        handleSelectionChange (val) {
            if (this.from == 'group') {
                this.param.selectIds = val.map(item => item.spuId)
            } else {
                this.param.selectIds = val.map(item => item.productId)
            }
        },
        toggleSelection (rows) {
            if (this.from == 'group') {
                if (rows && rows.length) {
                    this.selectProductList.forEach(row => {
                        if (rows.includes(row.spuId)) {
                            this.$refs['tickerImgTable'].toggleRowSelection(row, true)
                        }
                    })
                }
            } else {
                if (rows && rows.length) {
                    this.selectProductList.forEach(row => {
                        if (rows.includes(row.productId + '')) {
                            this.$refs['tickerImgTable'].toggleRowSelection(row, true)
                        }
                    })
                }
            }
        },
        handleClose () {
            this.$emit('close')
        },
        handleConfirm () {
            let temp = JSON.parse(JSON.stringify(this.param))
            if (!temp.tickerImg.cn || !temp.tickerImg.en) {
                this.$message.error('中英文图片须设置')
                return
            }
            if (!temp.selectIds.length) {
                this.$message.error('商品必选')
                return
            }
            delete temp.inputParam
            this.$emit('confirm', temp)
        },
        setTickerSet (res, code) {
            this.param.tickerImg[code] = res.data
        },
        getProductList () {
            if (!this.param.inputParam || !this.param.inputParam.trim()) {
                this.selectProductList = this.productList
                return
            }
            let temp = this.param.inputParam
            let list = []
            if (this.from == 'group') {
                list = this.productList.filter(item => {
                    if (temp.includes(item.spuId)) {
                        return item
                    }
                })
            } else {
                list = this.productList.filter(item => {
                    if (temp.includes(item.productId)) {
                        return item
                    }
                })
            }

            this.selectProductList = list
        },
        setDisableItem (row, index) {
            // 设置禁用项
            if (!this.allSelectIds || !this.allSelectIds.length) {
                return true
            }
            if (this.from == 'group') {
                if (this.allSelectIds.includes(row.spuId)) {
                    return false
                } else {
                    return true
                }
            } else {
                if (this.allSelectIds.includes(row.productId)) {
                    return false
                } else {
                    return true
                }
            }
        }
    }
}
</script>

<style lang="scss">
.set-ticker-img-wrapper {
    .avatar-uploader,.el-upload--picture-card, .el-upload-list__item{
        width: 100px;
        height: 100px;
        line-height: 100px;
    }
}
</style>
<style scoped lang="scss">
.set-ticker-img-wrapper {
    .file-upload-box {
        display: flex;
        flex-wrap: wrap;
        li {
            text-align: center;
        }
    }
    .file-upload-wrapper {
        margin-right: 4px;
        margin-bottom: 0;
    }
}
</style>