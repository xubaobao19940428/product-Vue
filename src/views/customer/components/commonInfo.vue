<template>
    <div class="common-work-order-info">
        <el-collapse v-if="Object.keys(detailInfo).length > 0" v-model="collapseArray">
            <el-collapse-item title="属性" name="1">
                <div class="flex-between">
                    <span>工单来源：{{ sourceList[detailInfo.workOrderSource] }}</span>
                    <span>标签：{{ detailInfo.tagName }}</span>
                    <span>紧急程度：{{ getNameByKey(detailInfo.emergencyLevel, 'emergencyLevel') }}</span>
                    <span>创建人：{{ detailInfo.createManagerName }}</span>
                </div>
            </el-collapse-item>
            <el-collapse-item title="详情" name="2">
                <div class="flex-between">
                    <span>用户昵称：{{ detailInfo.userNickName }}</span>
                    <span>用户ID：{{ detailInfo.userId }}</span>
                    <span>用户手机号：{{ detailInfo.userMobile }}</span>
                </div>
                <div class="mar-t-10">工单内容：{{ detailInfo.workOrderDescribe}} </div>
                <div class="mar-t-10">订单号：{{ detailInfo.orderNo }} </div>
                <div>子订单：{{ detailInfo.subOrderNo }}</div>
                <div class="mar-t-10" v-if="detailInfo.workOrderSource">工单来源：{{ sourceList[detailInfo.workOrderSource] }} </div>
                <div class="flex align-center mar-t-10" v-if="detailInfo.workOrderPic">
                    <span>附件：</span>
                    <div
                        v-for="url in formatImg(detailInfo.workOrderPic)"
                        :key="url"
                    >
                        <img v-if="isImg(url)"
                            class="list-img-box"
                            @click="previewImg([url], 0)"
                            :src="dealShowFileSrc(url)"/>
                        <a v-else
                            download="文件" :href="dealShowFileSrc(url)"
                            class="file-a"
                        >{{ getFileName(url) }}</a>
                    </div>
                </div>
                <div class="mar-t-10" v-if="detailInfo.workOrderContent">备注事项：{{ detailInfo.workOrderContent }}</div>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template slot="title">
                    <div class="flex-between">
                        <span>处理进度</span>
                        <span>{{ getDealInfo() }}</span>
                    </div>
                </template>
                <el-timeline>
                    <el-timeline-item v-for="(item, i) in detailInfo.processRecords"
                                      :key="i"
                                      :timestamp="WorkOrderDealTypeEnum[item[0].dealType]" placement="top">
                        <el-card>
                            <div class="flex-between">
                                <span>
                                    处理人：{{ item[0].dealManagerName }}
                                </span>
                                <span>{{ item[0].createDate | formatTime }}</span>
                            </div>
                            <div v-for="(subItem, subI) in item"
                                 v-if="subI != 0"
                                 :key="subI">
                                <div class="flex-between">
                                    <span>
                                      <template v-if="subItem.dealType == 7">
                                          抄送：{{  subItem.dealManagerName }}
                                      </template>
                                     <template v-else-if="subItem.dealType == 2">
                                         {{ subItem.dealContent }}
                                     </template>
                                     </span>
                                    <span>{{ subItem.createDate | formatTime }}</span>
                                </div>
                                <div v-if="subItem.dealPic" class="flex align-center mar-t-10">
                                    <span>附件：</span>
                                    <div
                                        v-for="url in formatImg(subItem.dealPic)"
                                        :key="url"
                                    >
                                        <img v-if="isImg(url)"
                                            class="list-img-box"
                                            :src="dealShowFileSrc(url)"
                                            @click="previewImg([url], 0)"
                                        />
                                        <a v-else
                                            download="文件" :href="dealShowFileSrc(url)"
                                            class="file-a"
                                        >{{ getFileName(url) }}</a>
                                        <!-- <span>{{ formatImg(subItem.dealPic).length }}</span> -->
                                    </div>
                                </div>
                            </div>
                            <!-- <div>工单编号：{{ item[0].workOrderNo }}</div> -->
                            <div v-if="item[0].dealContent">处理说明：{{ item[0].dealContent }}</div>
                            <div v-if="item[0].dealPic" class="flex align-center mar-t-10">
                                <span>附件：</span>
                                <div
                                    v-for="url in formatImg(item[0].dealPic)"
                                    :key="url"
                                >
                                    <img v-if="isImg(url)"
                                        @click="previewImg([url], 0)"
                                        class="list-img-box" :src="dealShowFileSrc(url)"/>
                                    <a v-else
                                        download="文件" :href="dealShowFileSrc(url)"
                                        class="file-a"
                                    >{{ getFileName(url) }}</a>
                                </div>
                            </div>
                            <div v-if="item[0].dealEvaluation && item[0].dealEvaluation.length > 0">
                                工单评价：{{ WorkOrderEvaluationEnum[item[0].dealEvaluation] }}
                                <span v-for="(val, index) in item[0].dealEvaluation"
                                      class="mar-l-10"
                                      :key="index">{{ WorkOrderEvaluationEnum[val] }}</span>
                            </div>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-collapse-item>
        </el-collapse>
        <image-preview v-show="image.show"
                       :close="closePreview"
                       :index="image.index"
                       :list="image.list">
        </image-preview>
    </div>
</template>
<script>
    import imagePreview from '@/components/imagePreview'
    import { formatTime } from '@/js/common/filter.js'
    import {
        ViewWorkOrder
    } from '@/request/workOrder.js'
    import common from './common.js'

    const imageType = ['bmp', 'jpg', 'png', 'jpeg', 'gif', 'tiff', 'pcx']
    export default {
        props: {
            workOrderNo: String,
            collapseArray: Array
        },
        data () {
            return {
                detailInfo: {},
                image: {
                    show: false,
                    index: 0,
                    list: []
                }
            }
        },
        mixins: [common],
        components: {
            imagePreview
        },
        watch: {
            workOrderNo (val) {
                if (val) {
                    this.getWorkOrderDetail()
                }
            }
        },
        created () {
            this.getWorkOrderDetail()
        },
        methods: {
            getWorkOrderDetail () {
                ViewWorkOrder({
                    workOrderNo: this.workOrderNo
                }).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        let item = {}
                        for (let i = 0; i < res.workOrderView.processRecords.length; i++) {
                            if (!item[res.workOrderView.processRecords[i].processNo]) {
                                item[res.workOrderView.processRecords[i].processNo] = []
                            }
                            item[res.workOrderView.processRecords[i].processNo].push(res.workOrderView.processRecords[i])
                        }
                        res.workOrderView.processRecords = item
                        this.detailInfo = res.workOrderView
                    }
                })
            },
            isImg (url) {
                let res = url.split('.')
                return imageType.includes(res[res.length - 1])
            },
            getFileName (data) {
                let resList = data.split('/')
                return resList[resList.length - 1] || '文件'
            },
            getDealInfo () {
                let name = ''
                if (Object.keys(this.detailInfo.processRecords).length > 0) {
                    let key = Object.keys(this.detailInfo.processRecords)[Object.keys(this.detailInfo.processRecords).length - 1]
                    name = '当前进度：'
                    let item = this.detailInfo.processRecords[key][0]
                    name += this.WorkOrderDealStatus[item.dealStatus]
                    name += ' ' + item.dealManagerName
                    name += ' ' + formatTime(item.createDate)
                }
                return name
            },
            previewImg (imgList, i) {
                this.image.list = imgList
                this.image.index = i
                this.image.show = true
            },
            closePreview () {
                this.image.index = 0
                this.image.show = false
            }
        }
    }
</script>
<style lang="scss">
    .common-work-order-info{
        .el-collapse-item__wrap{
            .el-timeline-item:last-child{
                .el-timeline-item__node{
                    background: #3a8ee6;
                }
                .el-card{
                    font-weight: bold;
                }
            }
        }
        .file-a {
            color: #4f91d8;
            margin:0 16px;
            &:hover {
                color: #0076f5;
            }
        }
        .flex-between{
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
        }
    }
</style>
