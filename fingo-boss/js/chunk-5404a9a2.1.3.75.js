(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5404a9a2"],{"1dd2":function(e,t,n){},"2dd9":function(e,t,n){"use strict";var r=n("1dd2"),a=n.n(r);a.a},"5e77":function(e,t,n){"use strict";var r=n("7458"),a=n.n(r);a.a},"60fb":function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return o}));var r=n("5c96"),a="https://file.fingo.shop";axios.defaults.timeout=45e3,axios.interceptors.request.use((function(e){return e}),(function(e){return r["Message"].error("请求超时"),Promise.resolve(e)}));var i=function(e,t){var n={headers:{"Content-Type":"multipart/form-data"}};return axios.post("".concat(a).concat(e),t,n).then((function(e){return e.data}))},o=function(e,t){var n={headers:{"Content-Type":"multipart/form-data"}};return axios.post("".concat(a).concat(e),t,n).then((function(e){return e.data}))}},6471:function(e,t,n){"use strict";n.d(t,"s",(function(){return a})),n.d(t,"t",(function(){return i})),n.d(t,"u",(function(){return o})),n.d(t,"v",(function(){return s})),n.d(t,"w",(function(){return c})),n.d(t,"y",(function(){return l})),n.d(t,"z",(function(){return u})),n.d(t,"x",(function(){return p})),n.d(t,"b",(function(){return d})),n.d(t,"a",(function(){return h})),n.d(t,"k",(function(){return f})),n.d(t,"h",(function(){return v})),n.d(t,"f",(function(){return g})),n.d(t,"d",(function(){return m})),n.d(t,"n",(function(){return b})),n.d(t,"i",(function(){return y})),n.d(t,"j",(function(){return D})),n.d(t,"m",(function(){return T})),n.d(t,"l",(function(){return S})),n.d(t,"c",(function(){return k})),n.d(t,"e",(function(){return C})),n.d(t,"q",(function(){return w})),n.d(t,"r",(function(){return G})),n.d(t,"p",(function(){return U})),n.d(t,"o",(function(){return I})),n.d(t,"g",(function(){return _}));var r=n("284b");function a(e){var t=r["a"].create("CancelTimingTaskReq",e);return Object(r["a"])("chat","PushTaskService.CancelTimingTask",t,"pushtask.CancelTimingTaskResp")}function i(e){var t=r["a"].create("CreatePushTaskReq",e);return Object(r["a"])("chat","PushTaskService.CreatePushTask",t,"pushtask.CreatePushTaskResp")}function o(e){var t=r["a"].create("DeletePushTaskReq",e);return Object(r["a"])("chat","PushTaskService.DeletePushTask",t,"pushtask.DeletePushTaskResp")}function s(e){var t=r["a"].create("EditPushTaskReq",e);return Object(r["a"])("chat","PushTaskService.EditPushTask",t,"pushtask.EditPushTaskResp")}function c(e){var t=r["a"].create("EditUserGroupReq",e);return Object(r["a"])("chat","PushTaskService.EditUserGroup",t,"pushtask.EditUserGroupResp")}function l(e){var t=r["a"].create("SendPushReq",e);return Object(r["a"])("chat","PushTaskService.SendPush",t,"pushtask.SendPushResp")}function u(e){var t=r["a"].create("SendTimingTaskNowReq",e);return Object(r["a"])("chat","PushTaskService.SendTimingTaskNow",t,"pushtask.SendTimingTaskNowResp")}function p(e){var t=r["a"].create("SearchPushTaskOrRecordReq",e);return Object(r["a"])("chat","PushTaskService.SearchPushTaskOrRecord",t,"pushtask.SearchPushTaskOrRecordResp")}function d(e){var t=r["a"].create("AddUserGroupBySpeRep",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.AddUserGroupBySpe",t,"datahouse.AddUserGroupBySpeResp")}function h(e){var t=r["a"].create("AddUserGroupByGroupReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.AddUserGroupByGroup",t,"datahouse.AddUserGroupByGroupResp")}function f(e){var t=r["a"].create("GetUserGroupInfoReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.GetUserGroupInfo",t,"datahouse.GetUserGroupInfoResp")}function v(e){var t=r["a"].create("GetUserGroupDetailInfoReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.GetUserGroupDetailInfo",t,"datahouse.GetUserGroupDetailInfoResp")}function g(e){var t=r["a"].create("EditUserGroupInfoReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.EditUserGroupInfo",t,"datahouse.EditUserGroupInfoResp")}function m(e){var t=r["a"].create("DeleteUserGroupInfoReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.DeleteUserGroupInfo",t,"datahouse.DeleteUserGroupInfoResp")}function b(e){var t=r["a"].create("GetUserPropertyListReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.GetUserPropertyList",t,"datahouse.GetUserPropertyListResp")}function y(e){var t=r["a"].create("GetUserGroupIdToExcelReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.GetUserGroupIdToExcel",t,"datahouse.GetUserGroupIdToExcelResp")}function D(e){var t=r["a"].create("GetUserGroupIdTotalReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.GetUserGroupIdTotal",t,"datahouse.GetUserGroupIdTotalResp")}function T(e){var t=r["a"].create("GetUserIdsExcelOnEditPageReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.GetUserIdsExcelOnEditPage",t,"datahouse.GetUserIdsExcelOnEditPageResp")}function S(e){var t=r["a"].create("GetUserIdsCountOnEditPageReq",e);return Object(r["a"])("datahouse","PushTaskUserGroupService.GetUserIdsCountOnEditPage",t,"datahouse.GetUserIdsCountOnEditPageResp")}function k(e){var t=r["a"].create("CreateAppVersionReq",e);return Object(r["a"])("chat","AppVersionBossService.CreateAppVersion",t,"CreateAppVersionResp")}function C(e){var t=r["a"].create("EditAppVersionReq",e);return Object(r["a"])("chat","AppVersionBossService.EditAppVersion",t,"EditAppVersionResp")}function w(e){var t=r["a"].create("SearchCurrentAppVersionInfoReq",e);return Object(r["a"])("chat","AppVersionBossService.SearchCurrentAppVersionInfo",t,"SearchCurrentAppVersionInfoResp")}function G(e){var t=r["a"].create("SearchLowestAppVersionInfoReq",e);return Object(r["a"])("chat","AppVersionBossService.SearchLowestAppVersionInfo",t,"SearchLowestAppVersionInfoResp")}function U(e){var t=r["a"].create("SearchAppVersionInfoWithPageReq",e);return Object(r["a"])("chat","AppVersionBossService.SearchAppVersionInfoWithPage",t,"SearchAppVersionInfoWithPageResp")}function I(e){var t=r["a"].create("PublishAppVersionOrNotReq",e);return Object(r["a"])("chat","AppVersionBossService.PublishAppVersionOrNot",t,"PublishAppVersionOrNotResp")}function _(e){var t=r["a"].create("GetAppVersionDetailReq",e);return Object(r["a"])("chat","AppVersionBossService.GetAppVersionDetail",t,"GetAppVersionDetailResp")}},7458:function(e,t,n){},c700:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"version-manage"},[n("el-card",{staticClass:"box-card card"},[n("div",{staticClass:"version-title"},[n("div",{staticClass:"title"},[e._v("版本记录")]),n("el-button",{staticClass:"add-btn",attrs:{type:"primary"},on:{click:e.addVersion}},[e._v("+ 添加版本")])],1),n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,border:""}},[n("el-table-column",{attrs:{label:"序号",align:"center",type:"index",width:"50"}}),n("el-table-column",{attrs:{label:"客户端类型",align:"center",width:"100",prop:"appName"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                    "+e._s(1===t.row.clientType?"安卓":"IOS")+"\n                ")]}}])}),n("el-table-column",{attrs:{label:"版本号",align:"center",width:"120",prop:"versionCode"}}),n("el-table-column",{attrs:{label:"更新描述（中文）",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:e.showContent(t.row.contentLang,"cn"),placement:"top"}},[n("div",{staticClass:"content-desc"},[e._v(e._s(e.showContent(t.row.contentLang,"cn")))])])]}}])}),n("el-table-column",{attrs:{label:"更新描述（英文）",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:e.showContent(t.row.contentLang,"en"),placement:"top"}},[n("div",{staticClass:"content-desc"},[e._v(e._s(e.showContent(t.row.contentLang,"en")))])])]}}])}),n("el-table-column",{attrs:{label:"更新类型",align:"center",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                    "+e._s(1===t.row.updateType?"非强制更新":"强制更新")+"\n                ")]}}])}),n("el-table-column",{attrs:{label:"更新国家",align:"center",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                    "+e._s(t.row.country)+"\n                ")]}}])}),n("el-table-column",{attrs:{label:"安卓安装包",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                    "+e._s(""===t.row.appUrl?"-":t.row.appUrl)+"\n                ")]}}])}),n("el-table-column",{attrs:{label:"创建时间",align:"center",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                    "+e._s(e._f("formatTime")(t.row.createTime))+"\n                ")]}}])}),n("el-table-column",{attrs:{label:"发布时间",align:"center",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                    "+e._s(e._f("formatTime")(t.row.updateTime))+"\n                ")]}}])}),n("el-table-column",{attrs:{label:"发布状态",align:"center",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                    "+e._s(0===t.row.status?"已发布":1===t.row.status?"未发布":"已撤销")+"\n                ")]}}])}),n("el-table-column",{attrs:{label:"操作",align:"center",width:"200",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[1===t.row.status||2===t.row.status?n("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(n){return e.revokeClick(t.row,0)}}},[e._v("发布")]):e._e(),1===t.row.status||2===t.row.status?n("el-button",{attrs:{size:"small"},on:{click:function(n){return e.versionEdit(t.row.id)}}},[e._v("编辑")]):e._e(),0===t.row.status?n("el-button",{attrs:{type:"danger",size:"small"},on:{click:function(n){return e.revokeClick(t.row,2)}}},[e._v("撤销")]):e._e()]}}])})],1),n("div",{staticClass:"page-wrapper"},[n("el-pagination",{attrs:{"current-page":e.page.pageNum,"page-sizes":[10,20,30,50],"page-size":e.page.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChanges,"current-change":e.handleCurrentChanges}})],1)],1),e.versionDialog?n("version-edit",{attrs:{dialogVisible:e.versionDialog,countryList:e.countryList,editType:e.editType,versionDetailModel:e.versionDetail},on:{closeDialog:e.closeDialog,confirmDialog:e.confirmDialog}}):e._e()],1)},a=[],i=(n("28a5"),n("7f7f"),n("7514"),n("6471")),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-dialog",{staticClass:"version-edit",attrs:{title:"版本信息",visible:e.toggle,width:"800px","before-close":e.cancel},on:{"update:visible":function(t){e.toggle=t}}},[n("el-form",{ref:"versionDetailForm",staticStyle:{width:"1000px"},attrs:{model:e.versionDetail,rules:e.ruleValidate,"label-width":"150px",size:"mini"}},[n("el-form-item",{attrs:{prop:"clientType",label:"客户端类型："}},[n("el-select",{attrs:{size:"medium",disabled:"edit"===e.editType},model:{value:e.versionDetail.clientType,callback:function(t){e.$set(e.versionDetail,"clientType",t)},expression:"versionDetail.clientType"}},e._l(e.clientTypeList,(function(e,t){return n("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1),1===e.versionDetail.clientType?n("el-form-item",{attrs:{prop:"versionCode",label:"安卓安装包："}},[n("div",{staticClass:"app-url"},[n("el-upload",{staticClass:"upload-wrapper",attrs:{action:"",multiple:"","http-request":e.uploadFile,"show-file-list":!1}},[n("el-button",{attrs:{icon:"el-icon-upload2",loading:e.uploadLoading,disable:e.uploadLoading,size:"medium",plain:""}},[e._v("\n                        上传文件\n                    ")])],1),n("div",{staticClass:"url-desc"},[e._v(e._s(""===e.versionDetail.appUrl?"":"文件名"+e.versionDetail.appUrl))])],1)]):e._e(),n("el-form-item",{attrs:{prop:"versionCode",label:"版本号："}},[n("el-input",{staticStyle:{width:"400px"},attrs:{disabled:"edit"===e.editType,clearable:"",placeholder:"请输入内容",size:"medium"},model:{value:e.versionDetail.versionCode,callback:function(t){e.$set(e.versionDetail,"versionCode",t)},expression:"versionDetail.versionCode"}})],1),n("el-form-item",{attrs:{prop:"updateType",label:"更新类型："}},[n("el-radio-group",{model:{value:e.versionDetail.updateType,callback:function(t){e.$set(e.versionDetail,"updateType",t)},expression:"versionDetail.updateType"}},[n("el-radio",{attrs:{label:1}},[e._v("常规更新")]),n("el-radio",{attrs:{label:2}},[e._v("强制更新")])],1)],1),n("el-form-item",{attrs:{prop:"country",label:"更新国家："}},[n("el-checkbox-group",{model:{value:e.versionDetail.country,callback:function(t){e.$set(e.versionDetail,"country",t)},expression:"versionDetail.country"}},e._l(e.countryList,(function(t){return n("el-checkbox",{key:t.shortCode,attrs:{label:t.shortCode}},[e._v(e._s(t.nameCn))])})),1)],1),e._l(e.languageList,(function(t,r){return n("span",{key:r},[n("el-form-item",{attrs:{prop:t.code,label:"更新描述("+t.desc+")："}},[n("el-input",{staticStyle:{width:"400px"},attrs:{type:"textarea",rows:3,placeholder:"请输入版本更新内容，限制字数300字符",clearable:"",size:"medium",maxlength:"300","show-word-limit":""},model:{value:e.versionDetail[t.code],callback:function(n){e.$set(e.versionDetail,t.code,n)},expression:"versionDetail[item.code]"}})],1)],1)}))],2),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:e.cancel}},[e._v("取 消")]),n("el-button",{attrs:{type:"primary"},on:{click:e.confirm}},[e._v("保 存")])],1)],1)},s=[],c=(n("ac6a"),n("60fb")),l={props:{dialogVisible:Boolean,countryList:Array,versionDetailModel:Object,editType:String},data:function(){return{versionDetail:{clientType:"",updateType:1,versionCode:"",appUrl:"",country:["MY","TH","ID","SG"],cn:"",en:"",th:"",ms:"",id:""},id:"",clientTypeList:[{value:1,label:"安卓"},{value:2,label:"IOS"}],fileUrl:"",uploadLoading:!1,ruleValidate:{clientType:[{required:!0,message:"请选择客户端类型",trigger:"change"}],updateType:[{required:!0,message:"请选择更新类型",trigger:"change"}],versionCode:[{required:!0,message:"请输入版本号",trigger:"blur"}],appUrl:[{required:!0,message:"请上传安卓安装包",trigger:"change"}],country:[{required:!0,message:"请选择更新货架",trigger:"change"}],cn:[{required:!0,message:"请输入更新描述（简体中文）",trigger:"blur"}],en:[{required:!0,message:"请输入更新描述（简体中文）",trigger:"blur"}]}}},computed:{toggle:{get:function(){return this.dialogVisible&&"add"!=this.editType&&this.fillContentData(),this.dialogVisible},set:function(){}},languageList:function(){return this.$store.state.dict.languageList}},watch:{versionDetail:{handler:function(e){},deep:!0}},methods:{fillContentData:function(){var e=this;this.versionDetail.clientType=this.versionDetailModel.clientType,this.versionDetail.updateType=this.versionDetailModel.updateType,this.versionDetail.versionCode=this.versionDetailModel.versionCode,this.versionDetail.appUrl=this.versionDetailModel.appUrl,this.versionDetail.country=this.versionDetailModel.country,this.id=this.versionDetailModel.id,_.forEach(this.languageList,(function(t){_.forEach(e.versionDetailModel.contentLang,(function(n){t.code==n.language&&(e.versionDetail[t.code]=n.content)}))}))},uploadFile:function(e){var t=this;console.log(e),this.fileName=e.file.name,this.uploadLoading=!0;var n=new FormData,r={fileName:e.file.name,type:"other"};n.append("file",e.file),n.append("param",JSON.stringify(r));var a="/file/rest/uploadservices/uploadfile";Object(c["a"])(a,n).then((function(e){t.uploadLoading=!1,"600"===e.status?(t.versionDetail.appUrl=e.original_link,console.log(t.fileUrl)):t.$message.error("文件上传失败，请重试！")})).catch((function(e){console.log(e)}))},cancel:function(){this.versionDetail=Object.assign(this.versionDetail,{clientType:"",updateType:1,versionCode:"",appUrl:"",country:["MY","TH","ID","SG"],cn:"",en:"",th:"",ms:"",id:""}),this.$emit("closeDialog"),console.log(this.versionDetail)},confirm:function(){var e=this;if(""!==this.versionDetail.clientType)if(""!==this.versionDetail.versionCode)if(""!==this.versionDetail.appUrl||1!=this.versionDetail.clientType)if(0!==this.versionDetail.country.length)if(0!==this.versionDetail.country.length)if(""!==this.versionDetail.cn)if(""!==this.versionDetail.en){for(var t=[{language:"cn",content:""},{language:"en",content:""},{language:"ms",content:""},{language:"th",content:""},{language:"id",content:""}],n=0,r=t;n<r.length;n++){var a=r[n];for(var o in this.versionDetail)a.language==o&&(a.content=this.versionDetail[o])}if("add"===this.editType){var s={clientType:this.versionDetail.clientType,versionCode:this.versionDetail.versionCode,updateType:this.versionDetail.updateType,country:this.versionDetail.country.join(","),appUrl:this.versionDetail.appUrl,lang:t};Object(i["c"])(s).then((function(t){1===t.ret.errcode&&(e.versionDetail=Object.assign(e.versionDetail,{clientType:"",updateType:1,versionCode:"",appUrl:"",country:["MY","TH","ID","SG"],cn:"",en:"",th:"",ms:"",id:""}),e.id="",e.$emit("confirmDialog"))}))}else{var c={id:this.id,updateType:this.versionDetail.updateType,country:this.versionDetail.country.join(","),appUrl:this.versionDetail.appUrl,lang:t};Object(i["e"])(c).then((function(t){1===t.ret.errcode&&(e.versionDetail=Object.assign(e.versionDetail,{clientType:null,updateType:1,versionCode:"",appUrl:"",country:["MY","TH","ID","SG"],cn:"",en:"",th:"",ms:"",id:""}),e.id="",console.log(e.versionDetail),e.$emit("confirmDialog"))}))}}else this.$message.error("请更新描述(英语)");else this.$message.error("请更新描述(简体中文)");else this.$message.error("请选择更新国家");else this.$message.error("请选择更新国家");else this.$message.error("请上传安卓安装包！");else this.$message.error("请输入版本号！");else this.$message.error("请选择客户端类型！")}}},u=l,p=(n("5e77"),n("2877")),d=Object(p["a"])(u,o,s,!1,null,"27dcc09a",null),h=d.exports,f={data:function(){return{activeCountry:"MY",lowerTableData:[],currentTableData:[],tableData:[],page:{pageNum:1,pageSize:10},total:0,versionDialog:!1,versionDetail:{},editType:"add"}},components:{versionEdit:h},mounted:function(){this.getSearchLowestAppVersionInfo(),this.getSearchCurrentAppVersionInfo(),this.getSearchAppVersionInfoWithPage()},computed:{countryList:function(){var e=[].concat(this.$store.state.dict.countryList),t=e.find((function(e){return"ID"==e.shortCode}));return t||e.push({nameCn:"印度尼西亚",nameLocal:"印度尼西亚",shortCode:"ID"}),e}},methods:{handleClick:function(e){console.log(e),this.activeCountry=e.name,this.getSearchLowestAppVersionInfo(),this.getSearchCurrentAppVersionInfo(),this.getSearchAppVersionInfoWithPage()},showContent:function(e,t){var n=e.find((function(e){return e.language===t}));return n.content},handleSizeChanges:function(e){this.page.pageSize=e,this.getSearchAppVersionInfoWithPage()},handleCurrentChanges:function(e){this.page.pageNum=e,this.getSearchAppVersionInfoWithPage()},getSearchLowestAppVersionInfo:function(){var e=this;Object(i["r"])({country:this.activeCountry}).then((function(t){1===t.ret.errcode&&(e.lowerTableData=t.lowestVersionInfo)}))},getSearchCurrentAppVersionInfo:function(){var e=this;Object(i["q"])({country:this.activeCountry}).then((function(t){1===t.ret.errcode&&(e.currentTableData=t.currentVersionInfo)}))},getSearchAppVersionInfoWithPage:function(){var e=this,t={page:this.page};Object(i["p"])(t).then((function(t){1===t.ret.errcode&&(e.tableData=t.allVersionInfo,e.total=t.total)}))},revokeClick:function(e,t){var n=this,r={id:e.id,status:t};Object(i["o"])(r).then((function(e){1===e.ret.errcode&&(0===t?(n.$message.success("发布成功!"),n.getSearchAppVersionInfoWithPage()):(n.$message.success("撤销成功!"),n.getSearchAppVersionInfoWithPage()))}))},addVersion:function(){this.editType="add",this.versionDialog=!0},versionEdit:function(e){var t=this;this.editType="edit",Object(i["g"])({id:e}).then((function(e){1===e.ret.errcode&&(t.versionDetail=Object.assign(t.versionDetail,e.currentVersionInfo,{country:e.currentVersionInfo.country.split(",")}),console.log(t.versionDetail),t.versionDialog=!0)}))},closeDialog:function(){this.versionDetail=Object.assign(this.versionDetail,{clientType:"",updateType:1,versionCode:"",appUrl:"",country:["MY","TH","ID","SG"],cn:"",en:"",th:"",ms:"",id:"",contentLang:[{language:"cn",content:""},{language:"en",content:""},{language:"ms",content:""},{language:"th",content:""},{language:"id",content:""}]}),this.versionDialog=!1},confirmDialog:function(){this.versionDialog=!1,this.versionDetail=Object.assign(this.versionDetail,{clientType:"",updateType:1,versionCode:"",appUrl:"",country:["MY","TH","ID","SG"],cn:"",en:"",th:"",ms:"",id:"",contentLang:[{language:"cn",content:""},{language:"en",content:""},{language:"ms",content:""},{language:"th",content:""},{language:"id",content:""}]}),this.getSearchAppVersionInfoWithPage()}}},v=f,g=(n("2dd9"),Object(p["a"])(v,r,a,!1,null,"086b603f",null));t["default"]=g.exports}}]);