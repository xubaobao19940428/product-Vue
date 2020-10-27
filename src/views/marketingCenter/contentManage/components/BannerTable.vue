<template>
    <div class="banner-table">
        <span class="sync-other-country" @click="articleSynchronize"><i class="el-icon-refresh"></i>同步选中的内容</span>
        <el-button icon="el-icon-plus" type="primary" size="medium" @click="addBanner" style="marginLeft:0px;marginBottom:10px">添加Banner</el-button>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;height:100%" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="bannerCode" label="banner_id" width="150" fixed="left">
                <template slot-scope="scope">
                    {{scope.row.bannerCode}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="bannerName" label="名称" width="150" fixed="left">
                <template slot-scope="scope">
                    {{scope.row.bannerName}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="bannerPicInfo" label="Banner" width="150" fixed="left">
                <template slot-scope="scope">
                    <div class="contnent-img">
                        <img :src="scope.row.bannerPicInfo?dealShowFileSrc(scope.row.bannerPicInfo[0].name):''">
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="bannerBrowserNumber" label="打开次数" width="150">
                <template slot-scope="scope">
                    {{scope.row.bannerBaseNumber}} + {{scope.row.bannerBrowserNumber}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="articleCode" label="文章id" width="200">
                <template slot-scope="scope">
                    {{scope.row.articleCode}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间(北京)" width="180">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="startTime" :label="'开始时间('+initData.countryName+')'" width="180">
                <template slot-scope="scope">
                    {{scope.row.startTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="endTime" :label="'结束时间('+initData.countryName+')'" width="180">
                <template slot-scope="scope">
                    {{scope.row.endTime | formatTime}}
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" prop="operate" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="editBanner(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteBanner(scope.row)" type="text" size="small" class="banner-delete">删除</el-button>
                    <el-button @click="copyBanner(scope.row)" type="text" size="small">复制</el-button>
                    
                </template>
            </el-table-column>
        </el-table> 
        <div class="pagination-box">
            <el-pagination
                v-if="tableData.lenght!==0"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50]"
                :current-page="page.pageNum"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <banner-dialog :dialogVisible="bannerVisible" v-if="bannerVisible" :isAddBanner="isAddBanner" :bannerInfo="bannerInfo" @on-cancle="handleCancleBanner" @on-confirm="handleConfirmBanner"></banner-dialog>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancleConfirm" @on-confirm="confirmDelete"></confirm-dialog>
        <synchronize-dialog v-if="synchronizeVisible" :dialogVisible="synchronizeVisible" :contentType="1" :isChoseBanner="true" :synchronizeArticle="synchronizeArticle" :synChronizeBanner="synChronizeBanner" @on-cancle="handleCancleSynchronize" @on-confirm="handleComfirmSynchronize"></synchronize-dialog>
    </div>
</template>
<script>
    import { PageBanner, SaveBanner, DeleteBannerByBannerCode, EditBanner, GetBannerWatched, CopyBannerByBannerCode } from '@/request/manage'
    import { mapState } from 'vuex'
    import { formatTime } from '../../../../js/common/filter'
    import ConfirmDialog from '@/components/ConfirmDialog'
    import BannerDialog from './BannerDialog'
    import { dealShowFileSrc } from '@/js/common/globalMethod'
    import SynchronizeDialog from './SynchronizeDialog'

    export default {
        data(){
            return{
                tableData: [],//列表数据
                loading:true,
                bannerVisible:false,//banner弹窗
                page: {
                    pageSize: 10,
                    pageNum: 1,
                    pagingSwitch: true
                },
                bannerInfo:{
                    name:'',
                    id:'',
                    bannerPic:[],
                    bannerCode:''
                },
                total:0,
                confirmVisible:false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                bannerCode:'',
                synChronizeBanner:[],
                synchronizeVisible:false
            }
        },
        props:{
            specialColumnId:String
        },
        created () {
            this.languageList = JSON.parse(this.getStore('languageList'))
        },
        mounted(){
            this.getBannerData()
        },
        components:{
            BannerDialog,
            ConfirmDialog,
            SynchronizeDialog
        },
        computed:{
            ...mapState({
                initData:state=>state.contentManage.initData
            })
        },
        methods:{
            // 同步文章选择
            handleSelectionChange (val) {
                console.log(val)
               let synchronize=[]
                for (const i in val) {
                    synchronize.push(val[i].bannerCode)
                }
                this.synChronizeBanner=synchronize
            },
            // 点击同步按钮
            articleSynchronize () {
                if (this.synChronizeBanner.length === 0) {
                    this.$message.error('请选择同步内容！')
                    return
                }
                this.synchronizeVisible = true
            },
            handleCancleSynchronize () {
                this.synchronizeVisible = false
            },
            handleComfirmSynchronize () {
                this.synchronizeVisible = false
                this.$message({
                    message: `同步成功！`,
                    type: 'success'
                })
            },
            handleSizeChange (val) {
                this.page.pageSize = val
                this.getBannerData()
            },
            handleCurrentChange (val) {
                this.page.pageNum = val ? val : this.page.pageNum
                this.getBannerData()
            },
            //获取banner数据
            getBannerData(val){
                this.loading=true
                let params={
                    country:this.initData.countryCode,
                    specialColumnId:val?val:this.specialColumnId,
                    pageInfo: this.page,
                }
                PageBanner(params).then(res=>{
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData=res.data
                        this.total=res.total
                        this.loading=false
                    } 
                })
            },
            //点击添加banner
            addBanner(){
                this.bannerVisible=true
                this.isAddBanner=true
            },
            //编辑banner
            editBanner(val){
                console.log(val)
                this.bannerVisible=true
                this.bannerInfo.name=val.bannerName,
                this.bannerInfo.id=val.articleCode,
                this.bannerInfo.bannerCode=val.bannerCode
                // let banner=[]
                // for (const i in this.languageList) {
                //     banner[i]={}
                // }
                // for (const key in val.bannerPicInfo) {
                //     banner[key].languageCode=val.bannerPicInfo[key].language
                //     banner[key].name=this.dealShowFileSrc(val.bannerPicInfo[key].bannerPicValue)   
                // }
                // console.log(banner)
                // this.bannerInfo.bannerPic=banner
                this.bannerInfo.bannerPic=val.bannerPicInfo
                this.isAddBanner=false
            },
            //删除banner
            deleteBanner(val){
                this.confirmDialogTitle = '删除本条banner'
                this.confirmDialogText = '删除后将无法恢复,确认删除？'
                this.confirmVisible = true,
                this.bannerCode=val.bannerCode
            },
            cancleConfirm () {
                this.confirmVisible = false
            },
            confirmDelete(){
                let params={
                    bannerCode:this.bannerCode
                }
                DeleteBannerByBannerCode(params).then(res=>{
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.confirmVisible = false
                        this.$message.success('banner删除成功！')
                        this.getBannerData()
                    }
                })
            },
            //复制banner
            copyBanner(val){
                let params={
                    bannerCode:val.bannerCode,
                    country:this.initData.countryCode,
                    specialColumnId:this.specialColumnId,
                }
                CopyBannerByBannerCode(params).then(res=>{
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$message.success('banner复制成功！')
                        this.getBannerData()
                    }
                })
            },
            //banner-diaolog取消
            handleCancleBanner(){
                this.bannerVisible=false
            },
            //banner-diaolog确认
            handleConfirmBanner(){
                this.bannerVisible=false
                // let banner=[]
                // for (const i in this.languageList) {
                //     banner[i]={}
                // }
                // for (const key in this.bannerInfo.bannerPic) {
                //     banner[key].language=this.bannerInfo.bannerPic[key].languageCode
                //     banner[key].bannerPicValue=this.dealShowFileSrc(this.bannerInfo.bannerPic[key].name)   
                // }
                // console.log(banner)
                if(this.isAddBanner){
                    let params={
                        country:this.initData.countryCode,
                        specialColumnId:this.specialColumnId,
                        bannerName:this.bannerInfo.name,
                        articleCode:this.bannerInfo.id,
                        bannerBaseNumber:'0',
                        bannerPicInfo:this.bannerInfo.bannerPic
                    }
                    SaveBanner(params).then(res=>{
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.bannerInfo.name=''
                            this.bannerInfo.id=''
                            this.bannerInfo.bannerPic=[]
                            this.bannerInfo.bannerCode=''
                            this.$message.success('banner添加成功！')
                            this.getBannerData()
                        }else if(res.ret.errcode === 25127){
                            this.$message.error('请输入已发送的文章id')
                        }
                    })
                }else{
                    let params={
                        bannerCode:this.bannerInfo.bannerCode,
                        bannerName:this.bannerInfo.name,
                        articleCode:this.bannerInfo.id,
                        bannerPicInfo:this.bannerInfo.bannerPic
                    }
                    EditBanner(params).then(res=>{
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.bannerInfo.name=''
                            this.bannerInfo.id=''
                            this.bannerInfo.bannerPic=[]
                            this.bannerInfo.bannerCode=''
                            this.$message.success('banner编辑成功！')
                            this.getBannerData()
                        }
                    })
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
    .banner-table{
        .sync-other-country{
            color: #409EFF;
            z-index: 1;
            color: #409EFF;
            position: absolute;
            right: 20px;
            top: 46px;
            width: 110px;
            font-size: 12px;
            cursor: pointer;
        }
        .contnent-img{
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                max-width: 100%;
                max-height: 100%;
            }
        }
        .banner-delete{
            color:red
        }
    }
</style>