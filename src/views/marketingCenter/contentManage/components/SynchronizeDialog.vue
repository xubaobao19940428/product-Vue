<template>
    <el-dialog
        :title="isChoseBanner?'同步选中banner':'同步选中文章'"
        :visible.sync="dialogVisible"
        width="800px"
        :before-close="handleClose">
        <el-tabs v-model="activecountryName" @tab-click="countrytabsClick" style="margin:0 5px 5px 0" class="content-manage-tab">
            <el-tab-pane
                v-for="(item, index) in countryList"
                :label="item.nameLocal"
                :name="item.shortCode"
                :key="index"
            >
                <el-tabs v-model="activecolumnTabs" type="border-card" @tab-click="columntabsClick">
                    <el-tab-pane
                        v-for="(item, index) in columnTabs"
                        :name="item.specialColumnId"
                        :label="item.specialColumnName"
                        :key="index"
                    >
                        <el-radio-group v-if="!isChoseBanner && contentType === 1" v-model="radio" @change="subjectChange">
                            <el-radio v-for="(item,i) in subjectList" :key="i" :label="item.specialSubjectId">{{item.specialSubjectName}}</el-radio>
                        </el-radio-group>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button v-if="contentType===1" :disabled="subjectList.length===0 && !isChoseBanner" type="primary" @click="confirm">同 步</el-button>
            <el-button v-if="contentType===3" :disabled="activecolumnTabs==0" type="primary" @click="confirm">同 步</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { FindAllSpecialColumn, CopyArticleToOther, CopyBannerToOther } from '@/request/manage'

    export default {
        name:'SynchronizeDialog',
        data(){
            return{
                countryList:[],
                activecountryName: 'MY',
                columnTabs: [],
                // activecolumnTabs: '23',
                activecolumnTabs: '',
                columnTabsName:'',
                subjectList: [],
                radio:''
            }
        },
        props:{
            dialogVisible: {
                type: Boolean,
                default: false
            },
            synchronizeArticle:Array,
            synChronizeBanner:Array,
            isChoseBanner:Boolean,
            contentType: Number
        },
        created () {
            this.countryList = JSON.parse(this.getStore('countryList'))
            this.languageList = JSON.parse(this.getStore('languageList'))
        },
        computed:{
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            },
        },
        mounted(){
            this.getAllSubjects()
        },
        methods:{
            handleClose(){
                this.$emit('on-cancle')
            },
            confirm(){
                if(!this.isChoseBanner && this.contentType === 1){
                    let params={
                        country:this.activecountryName,
                        specialColumnId:this.activecolumnTabs,
                        specialSubjectId:this.radio,
                        articleCode:this.synchronizeArticle
                    }
                    CopyArticleToOther(params).then(res=>{
                        if (res.ret.errcode === 1) {
                            this.$emit('on-confirm')
                        }
                    })
                }else if(!this.isChoseBanner && this.contentType === 3){
                    let params={
                        country:this.activecountryName,
                        specialColumnId:this.activecolumnTabs,
                        specialSubjectId:'',
                        articleCode:this.synchronizeArticle
                    }
                    CopyArticleToOther(params).then(res=>{
                        if (res.ret.errcode === 1) {
                            this.$emit('on-confirm')
                        }
                    })
                }else{
                    let params={
                        country:this.activecountryName,
                        specialColumnId:this.activecolumnTabs,
                        bannerCode:this.synChronizeBanner
                    }
                    CopyBannerToOther(params).then(res=>{
                        if (res.ret.errcode === 1) {
                            this.$emit('on-confirm')
                        }
                    })
                }
            },
            getAllSubjects () {
                let params = {
                    country: this.activecountryName
                }
                FindAllSpecialColumn(params).then(res => {
                    if (res.ret.errcode === 1) {
                        if(!this.isChoseBanner){
                            this.columnTabs = res.specialColumn
                            console.log(this.contentType)
                            console.log(this.columnTabs)
                            if (this.contentType === 1) {
                                for (let i = 0; i < this.columnTabs.length; i++){
                                    if(this.columnTabs[i].contentType==2 || this.columnTabs[i].contentType==3){
                                        this.columnTabs.splice(i--,1)
                                    }
                                }
                                let subjectList=[]
                                for (const i in res.specialColumn) {
                                    if(this.activecolumnTabs==res.specialColumn[i].specialColumnId){
                                        let currentColumnSubject = res.specialColumn[i]
                                        console.log(currentColumnSubject.specialSubject)
                                        if(currentColumnSubject.specialSubject.length!==0){
                                            _.forEach(currentColumnSubject.specialSubject, (item) => {
                                                let subjectItem = {
                                                    specialSubjectName: item.specialSubjectName,
                                                    specialSubjectId: item.specialSubjectId,
                                                    allowDel: true,
                                                    specialSubjectContent: item.specialSubjectContent
                                                }
                                                subjectList.push(subjectItem)
                                            })
                                        }else if(currentColumnSubject.specialSubject.length===0 && !this.isChoseBanner){
                                            this.$message.error('当前专栏下暂无专题，请添加专题。')
                                        }
                                        this.subjectList=subjectList
                                        this.radio=this.subjectList[0].specialSubjectId
                                        let columns=[]
                                        for (const i in res.specialColumn) {
                                            if(res.specialColumn[i].contentType==1 && res.specialColumn[i].specialColumnId===this.activecolumnTabs){
                                                columns.push(res.specialColumn[i])
                                            }
                                        }
                                    }
                                }
                            }
                            if (this.contentType === 3) {
                                for (let i = 0; i < this.columnTabs.length; i++){
                                    if(this.columnTabs[i].contentType==1 || this.columnTabs[i].contentType==2){
                                        this.columnTabs.splice(i--,1)
                                    }
                                }
                            }
                            console.log('==>',this.columnTabs)
                        }else{
                            this.columnTabs = res.specialColumn
                            for (let i = 0; i < this.columnTabs.length; i++){
                                if(this.columnTabs[i].contentType!==1){
                                    this.columnTabs.splice(i--,1)
                                }
                            }
                        }  
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 国家
            countrytabsClick (tab, event) {
                console.log(tab)
                this.activeCountryName = tab.name
                this.getAllSubjects()
            },
            // 专栏
            columntabsClick (tab, event) {
                console.log(tab)
                this.columnTabsName=tab.label
                this.activecolumnTabs=tab.name
                this.getAllSubjects()
            },
            subjectChange(val){
                console.log(val)
                this.radio=val
            }
        }
    }
</script>
<style scoped>

</style>