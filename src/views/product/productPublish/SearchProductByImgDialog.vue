<template>
    <div>
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="true" width="1000px" top="5vh" append-to-body @close="handleDialogClose">
            <div slot="title">
                {{title}}
            </div>
            <div class="sales-filter-container">
                <el-form ref="salesFilterForm" inline label-width="90px" :model="queryData">
                    <el-form-item label="创建时间：" class="filter-item" prop="createTime">
                        <el-date-picker v-model="queryData.createTime" type="datetimerange" start-placeholder="开始时间" end-placeholder="截止时间" size="small" :default-time="['00:00:00', '23:59:59']" value-format="timestamp">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="" class="filter-item" prop="filter">
                        <el-radio-group v-model="queryData.filter" @change="handleRadioGroupChange">
                            <el-radio :label="1">只看未录用</el-radio>
                            <el-radio :label="2">只看已录用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="filter-item" style="margin-left: 20px;">
                        <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                        <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="operation">
                    <!-- <el-button icon="el-icon-download" type="primary" size="medium" @click="downImg">下载</el-button> -->
                    <el-button type="primary" size="medium" icon="el-icon-s-flag" plain style="float: right;" @click="tagChilindoImageStatus(true)">取消录用标记</el-button>
                    <el-button type="primary" size="medium" icon="el-icon-s-flag" style="float: right; margin-right: 10px;" @click="tagChilindoImageStatus(false)">标记为已录用</el-button>
                </div>
            </div>
            <div class="image-list" v-loading="loading">
                <div class="list-group-item image-box" v-for="(element, index) in imgList" :key="element.imageUrl" >
                    <div @click="choiceImgItem(element, index)">
                        <span class="tag-icon" v-if="element.status === 1"><i class="el-icon-s-flag"></i></span>
                        <el-image :src="element.imageUrl" class="image-item"></el-image>
                        <div :class="{active: element.checked}">
                            <div>
                                <i class="el-icon-circle-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagination-box">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[15, 25, 45, 100]" :current-page="queryData.page.pageNum" :page-size="queryData.page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    class="pagination">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // import moment from 'moment'
    import JSZip from 'jszip'
    import FileSaver from 'file-saver'
    import { getChilindoImages, tagChilindoImage } from '@/request/product'

    export default {
        data() {
            return {
                title: '以图找货',
                tableList: [],
                loading: false,
                queryData: {
                    createTime: [],
                    startTime: '',
                    endTime: '',
                    filter: 0, //0: all, 1: 只看未录用, 2: 只看已录用
                    page: {
                        pageSize: 15,
                        pageNum: 1
                    }
                },
                imgList: [],
                checkedList: [],
                total: 0
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        watch: {
            dialogVisible: function(newValue, oldValue) {
                if (newValue) {
                    this.getChilindoImageList()
                }
            }
        },
        methods: {
            getChilindoImageList() {
                if (this.queryData.createTime && this.queryData.createTime.length > 0) {
                    this.queryData.startTime = this.queryData.createTime[0] + ''
                    this.queryData.endTime = this.queryData.createTime[1] + ''
                } else {
                     this.queryData.startTime = ''
                     this.queryData.endTime = ''
                }
                let params = this.queryData
                this.loading = true
                getChilindoImages(this.filterData(params)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.total = res.total
                        _.forEach(res.image, item => {
                            item.checked = false
                        })
                        this.imgList = res.image
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            search() {
                this.checkedList = []
                this.getChilindoImageList()
            },
            resetSearch() {
                this.checkedList = []
                this.$refs.salesFilterForm.resetFields()
                this.getChilindoImageList()
            },
            handleRadioGroupChange() {},
            handleSizeChange(val) {
                this.checkedList = []
                this.queryData.page.pageSize = val
                this.getChilindoImageList()
            },
            handleCurrentChange(val) {
                this.checkedList = []
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getChilindoImageList()
            },
            handleDialogClose() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 15
                this.$emit('on-close')
            },
            choiceImgItem(item, index) {
                let checked = this.imgList[index].checked
                this.imgList[index].checked = checked === true ? false : true
                this.checkedList = []
                _.forEach(this.imgList, item => {
                    if (item.checked) {
                        this.checkedList.push(item.id)
                    }
                })
                console.log(this.checkedList)
            },
            tagChilindoImageStatus(type) {
                if (this.checkedList.length === 0) {
                    this.$message.warning('请选择图片')
                    return
                }
                let params = {
                    id: this.checkedList,
                    type: type
                }
                tagChilindoImage(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功')
                        this.getChilindoImageList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            downImg() {
                var blogTitle = '以图找货' + moment().format('YYYYMMDDHHmmss');
                var zip = new JSZip();
                var imgs = zip.folder(blogTitle);
                var baseList = [];
                var imgNameList = ['图片1', '图片2', '图片3'];
                var arr = ['https://cdn.chilindo.com/XML/Gfx/04-319V1/1_250.jpg', 'https://cbu01.alicdn.com/img/ibank/2017/907/202/4161202709_1064338004.jpg'];

                for (var i = 0; i < arr.length; i++) {
                    let image = new Image();
                    // 解决跨域 Canvas 污染问题
                    image.setAttribute('crossOrigin', 'Anonymous');

                    image.onload = function () {
                        let canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;

                        let context = canvas.getContext('2d');
                        context.drawImage(image, 0, 0, image.width, image.height);

                        let url = canvas.toDataURL(); // 得到图片的base64编码数据
                        canvas.toDataURL('image/png');

                        baseList.push(url.substring(22));    // 去掉base64编码前的 data:image/png;base64,
                        if (baseList.length === arr.length && baseList.length > 0) {
                            for (let k = 0; k < baseList.length; k++) {
                                imgs.file(imgNameList[k] + '.png', baseList[k], {base64: true})
                            }
                            zip.generateAsync({type: 'blob'}).then(function (content) {
                                // see FileSaver.js
                                FileSaver.saveAs(content, blogTitle + '.zip');
                            });
                        }

                    };
                    image.src = arr[i];
                }
            }
        }
    }
</script>

<style lang="scss">
    .search-product-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 50px 40px;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }
    }
</style>

<style lang="scss" scoped>
        .image-list {
            display: flex;
            flex-wrap: wrap;
            width: 950px;
            min-height: 300px;
            overflow: hidden;
            padding: 30px 50px;
            .tag-icon {
                position: absolute;
                display: block;
                height: 30px;
                color: #409EFF;
                width: 30px;
                z-index: 999;
                top: -64px;
                font-size: 22px;
                right: 6px;
            }
            .image-box {
                position: relative;
                height: 150px;
                width: 150px;
                margin: 10px;
                line-height: 170px;
                text-align: center;
                color: #fff;
                transition: transform .3s;
                .image-item {
                    width: 150px;
                    height: 150px;
                    border: 1px dashed #c0ccda;
                    border-radius: 6px;
                    padding: 4px;
                }
                .media-img {
                    width: 100%;
                }
                .active {
                    position: absolute;
                    background: #000000;
                    height: 40px;
                    line-height: 40px;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 0 10px;
                    box-sizing: border-box;
                    color: #fff;
                    font-size: 14px;
                    opacity: .5;
                    transition: opacity .3s;
                    border-bottom-left-radius: 6px;
                    border-bottom-right-radius: 6px;
                }
            }
        }
    // }
</style>

