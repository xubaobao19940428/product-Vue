(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-69d94c06"],{1487:function(e,t,a){"use strict";var l=a("6dbe"),r=a.n(l);r.a},"6dbe":function(e,t,a){},c087:function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-form",{attrs:{inline:""}},[a("el-form-item",[a("el-button",{attrs:{plain:"",size:"medium"},on:{click:e.goBack}},[e._v("返回")])],1),a("el-form-item",{staticClass:"filter-item"},[e.hasPermission("I18nModulePageService.ModuleAdd")?a("el-button",{attrs:{icon:"el-icon-plus",plain:"",type:"primary",size:"medium"},on:{click:function(t){return e.moduleAction("add")}}},[e._v("添加模块")]):e._e()],1),a("el-form-item",{staticClass:"mar-l-50",attrs:{label:"导入设置："}},[a("div",{staticClass:"flex align-center"},[a("el-radio-group",{staticClass:"mar-r-20",model:{value:e.uploadParam.isUpdateAll,callback:function(t){e.$set(e.uploadParam,"isUpdateAll",t)},expression:"uploadParam.isUpdateAll"}},e._l(e.selectList,(function(t,l){return a("el-radio",{key:l,attrs:{label:t.key}},[e._v(e._s(t.name))])})),1),e.hasPermission("I18nTranslationService.ImportVariableTranslationTemplate")?a("el-upload",{staticClass:"avatar-uploader",attrs:{action:e.uploadFileUrl,data:e.uploadParam,headers:e.headers,name:e.uploadFileName,"show-file-list":!1,"on-error":e.uploadError,"before-upload":e.uploadBefore,"on-success":e.importModule}},[a("el-button",{attrs:{icon:"el-icon-upload",loading:e.loading,plain:"",size:"medium"}},[e._v("导入模板和翻译项")])],1):e._e()],1)])],1),a("el-table",{attrs:{data:e.moduleList,height:"100%",border:""}},[a("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"detail-table-wrapper"},[a("el-table",{attrs:{data:t.row.pageInfo,border:""}},[a("el-table-column",{attrs:{prop:"pageName",label:"页面名称"}}),a("el-table-column",{attrs:{label:"翻译项",prop:"variableItemSum",align:"center"}}),a("el-table-column",{attrs:{label:"添加时间","min-width":"180px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                                "+e._s(e._f("formatTime")(t.row.createTime))+"\n                            ")]}}],null,!0)}),a("el-table-column",{attrs:{label:"操作","min-width":"100px",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasPermission("I18nModulePageService.ModulePageUpdate")?a("el-button",{attrs:{plain:"",size:"mini",type:"success"},on:{click:function(a){return e.pageAction("edit",t.row,t.$index)}}},[e._v("编辑页面")]):e._e()]}}],null,!0)})],1)],1)]}}])}),a("el-table-column",{attrs:{prop:"moduleName","min-width":"120px",label:"模板名称"}}),a("el-table-column",{attrs:{label:"页面数",prop:"pageSum",align:"center"}}),a("el-table-column",{attrs:{label:"翻译项",prop:"variableItemSum",align:"center"}}),a("el-table-column",{attrs:{label:"添加时间","min-width":"180px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e._f("formatTime")(t.row.createTime))+"\n            ")]}}])}),a("el-table-column",{attrs:{label:"更新时间","min-width":"180px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e._f("formatTime")(t.row.updateTime))+"\n            ")]}}])}),a("el-table-column",{attrs:{label:"操作",fixed:"right","min-width":"200px",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasPermission("I18nModulePageService.ModulePageAdd")?a("el-button",{attrs:{plain:"",type:"primary",size:"small"},on:{click:function(a){return e.pageAction("add",t.row,t.$index)}}},[e._v("添加页面")]):e._e(),e.hasPermission("I18nModulePageService.ModuleUpdate")?a("el-button",{attrs:{plain:"",size:"small",type:"success"},on:{click:function(a){return e.moduleAction("edit",t.row,t.$index)}}},[e._v("编辑模块")]):e._e()]}}])})],1),a("module-edit",{attrs:{propShowAlert:e.moduleAlert.show,title:e.moduleAlert.title,propParam:e.moduleAlert.param,platform:this.$route.query.platform},on:{close:e.closeModuleAlert}}),a("page-module-edit",{attrs:{propShowAlert:e.pageModuleAlert.show,title:e.pageModuleAlert.title,propParam:e.pageModuleAlert.param},on:{close:e.closePageModuleAlert}})],1)},r=[],o=(a("7f7f"),a("d6eb")),i=a("c8c2"),s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.title,visible:e.propShowAlert,width:"500px"},on:{close:e.close}},[a("div",[a("el-form",{ref:"moduleAlert",staticClass:"demo-ruleForm",attrs:{rules:e.rules,model:e.param,"label-position":"right","label-width":"110px"}},[a("el-form-item",{attrs:{label:"模块名称：",prop:"name"}},[a("el-input",{attrs:{size:"medium",placeholder:"请输入名称"},model:{value:e.param.moduleName,callback:function(t){e.$set(e.param,"moduleName",t)},expression:"param.moduleName"}})],1)],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:e.close}},[e._v("取 消")]),a("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(t){return e.confirmUpdateModule()}}},[e._v("确 定")])],1)])},n=[],u={props:{propShowAlert:Boolean,title:String,source:String,platform:String,propParam:{type:Object,default:function(){return{}}}},data:function(){return{param:{moduleName:"",moduleId:""},rules:{moduleName:{required:!0,trigger:"blur",message:"请输入"}}}},watch:{propParam:function(e){e&&Object.assign(this.param,this.propParam)},propShowAlert:function(e){e&&Object.assign(this.param,this.propParam)}},methods:{close:function(){this.$emit("close")},confirmUpdateModule:function(){var e=this;this.$refs.moduleAlert.validate((function(t){if(t){var a=o["n"];e.param.moduleId&&(a=o["q"]),e.param=Object.assign(e.param,{platform:e.platform}),console.log(e.param),a(e.filterData(e.param)).then((function(t){1===t.ret.errcode&&(e.$message.success("操作成功"),e.close())}))}}))}}},m=u,c=a("2877"),p=Object(c["a"])(m,s,n,!1,null,null,null),d=p.exports,f=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.title,visible:e.propShowAlert,width:"500px"},on:{close:e.close}},[a("div",[a("el-form",{ref:"pageModuleAlert",staticClass:"demo-ruleForm",attrs:{rules:e.rules,model:e.param,"label-position":"right","label-width":"110px"}},[a("el-form-item",{attrs:{label:"页面名称：",prop:"name"}},[a("el-input",{attrs:{size:"medium",placeholder:"请输入名称"},model:{value:e.param.pageName,callback:function(t){e.$set(e.param,"pageName",t)},expression:"param.pageName"}})],1)],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:e.close}},[e._v("取 消")]),a("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(t){return e.confirmUpdatePageModule()}}},[e._v("确 定")])],1)])},h=[],g={props:{propShowAlert:Boolean,title:String,source:String,propParam:{type:Object,default:function(){return{}}}},data:function(){return{param:{pageName:"",moduleId:"",pageId:""},rules:{pageName:{required:!0,trigger:"blur",message:"请输入"}}}},watch:{propParam:function(e){e&&Object.assign(this.param,this.propParam)},propShowAlert:function(e){e&&Object.assign(this.param,this.propParam)}},methods:{close:function(){this.$emit("close")},confirmUpdatePageModule:function(){var e=this;this.$refs.pageModuleAlert.validate((function(t){if(t){var a=o["o"];e.param.pageId&&(a=o["p"]),a(e.filterData(e.param)).then((function(t){1===t.ret.errcode&&(e.$message.success("操作成功"),e.close())}))}}))}}},b=g,v=Object(c["a"])(b,f,h,!1,null,null,null),A=v.exports,w={data:function(){return{uploadFileUrl:"".concat("https://file.fingo.shop","/file/rest/uploadservices/uploadfile"),uploadFileName:"file",headers:this.$headers,uploadParam:{isUpdateAll:!1},selectList:[{key:!0,name:"更新所有"},{key:!1,name:"仅更新翻译项"}],loading:!1,moduleAlert:{title:"新增模块",show:!1,param:{}},pageModuleAlert:{title:"新增页面",show:!1,param:{}}}},components:{moduleEdit:d,pageModuleEdit:A},mixins:[i["a"]],created:function(){this.getModuleList(this.$route.query.platform)},methods:{uploadBefore:function(e){this.loading=!0,Object.assign(this.uploadParam,{param:JSON.stringify({type:"other",fileName:e.name})})},goBack:function(){this.$router.push({name:"translate"})},importModule:function(e){var t=this;"600"==e.status?Object(o["l"])({fileDownloadUrl:e.original_link,isUpdateAll:this.uploadParam.isUpdateAll,platform:this.$route.query.platform}).then((function(e){t.loading=!1,1===e.ret.errcode&&t.$message.success("导入成功")})).catch((function(){t.loading=!1})):(this.$message.warning(e.message),this.loading=!1)},uploadError:function(e){this.$message.warning(e.message),this.loading=!1},moduleAction:function(e,t,a){switch(e){case"add":this.moduleAlert.title="新增模块",Object.assign(this.moduleAlert.param,{moduleName:"",moduleId:""});break;case"edit":this.moduleAlert.title="编辑模块",Object.assign(this.moduleAlert.param,{moduleName:t.moduleName,moduleId:t.moduleId});break}this.moduleAlert.show=!0},closeModuleAlert:function(){this.moduleAlert.show=!1,this.getModuleList(this.$route.query.platform)},pageAction:function(e,t,a){switch(e){case"add":this.pageModuleAlert.title="新增页面",Object.assign(this.pageModuleAlert.param,{pageName:"",moduleId:t.moduleId,pageId:""});break;case"edit":this.pageModuleAlert.title="编辑页面",Object.assign(this.pageModuleAlert.param,{pageName:t.pageName,pageId:t.pageId,moduleId:t.moduleId});break}this.pageModuleAlert.show=!0},closePageModuleAlert:function(){this.pageModuleAlert.show=!1,this.getModuleList(this.$route.query.platform)}}},P=w,_=(a("1487"),Object(c["a"])(P,l,r,!1,null,"fd58fa00",null));t["default"]=_.exports},c8c2:function(e,t,a){"use strict";a("7514");var l=a("d6eb");t["a"]={data:function(){return{searchParam:{languageCode:"",variableCodeKey:"",nameCnKey:"",nameEnKey:"",translationKey:"",pageId:"0",platform:"APP",page:{pageNum:1,pageSize:10,pagingSwitch:!0}},totals:0,moduleList:[],langList:[],pageTranslateList:[]}},computed:{languageList:function(){return this.$store.state.dict.languageList}},methods:{getSelectLangInfo:function(){var e=this,t=this.languageList.find((function(t){return t.code==e.searchParam.languageCode}));return t||{name:""}},getModuleList:function(e){var t=this;console.log(this.searchParam.platform),this.searchParam.platform=e||this.searchParam.platform,Object(l["i"])({platform:this.searchParam.platform}).then((function(e){1===e.ret.errcode&&(t.moduleList=e.moduleInfo)}))},handleSizeChange:function(e){this.searchParam.page.pageSize=e,this.getList()},getList:function(e,t){var a=this;setTimeout((function(){a.$refs.multipleTable&&a.$refs.multipleTable.doLayout()}),200),(this.searchParam.pageId||0==this.searchParam.pageId)&&(this.searchParam.page.pageNum=e||this.searchParam.page.pageNum,this.searchParam.platform=t||this.searchParam.platform,console.log(this.searchParam.platform),Object(l["k"])(this.filterData(this.searchParam)).then((function(e){1===e.ret.errcode&&(a.pageTranslateList=e.variableTranslation,a.totals=e.total)})))}}}}}]);