(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8382ea5c"],{"293a":function(e,t,a){"use strict";var r=a("e914"),n=a.n(r);n.a},"375b":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"advisor-manage-container app-container"},[a("el-form",{attrs:{inline:"","label-width":"80px",model:e.searchParam}},[a("el-form-item",{attrs:{label:"导师昵称："}},[a("el-input",{attrs:{clearable:""},model:{value:e.searchParam.nickName,callback:function(t){e.$set(e.searchParam,"nickName",t)},expression:"searchParam.nickName"}})],1),a("el-form-item",{attrs:{label:"等级阶梯："}},[a("el-select",{attrs:{clearable:""},model:{value:e.searchParam.code,callback:function(t){e.$set(e.searchParam,"code",t)},expression:"searchParam.code"}},e._l(e.fingoMasterList,(function(e){return a("el-option",{key:e.key,attrs:{value:e.key,label:e.name}})})),1)],1),a("el-form-item",[a("el-button",{attrs:{size:"medium",type:"primary",icon:"el-icon-search"},on:{click:function(t){return e.getList(1)}}},[e._v("搜索")]),a("el-button",{attrs:{icon:"el-icon-refresh-left",size:"medium"},on:{click:e.resetSearch}},[e._v("重置")])],1)],1),a("div",{staticClass:"app-container"},[a("el-tabs",{attrs:{type:"card"},on:{"tab-click":e.handleCountryChange},model:{value:e.currentCountry,callback:function(t){e.currentCountry=t},expression:"currentCountry"}},e._l(e.countryList,(function(t){return a("el-tab-pane",{key:t.shortCode,attrs:{label:t.nameCn,name:t.shortCode}},[a("div",{staticClass:"operator-box"},[e.hasPermission("BTN_ADVISOR_MANAGE_ADD")?a("el-button",{attrs:{icon:"el-icon-plus",type:"primary",size:"medium"},on:{click:e.handleAdd}},[e._v("添加导师")]):e._e()],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.load,expression:"load"}],staticStyle:{width:"100%"},attrs:{data:e.dataList,border:"",height:"100%"}},[a("el-table-column",{attrs:{label:"导师昵称",align:"center",prop:"nickName",fixed:"left","min-width":"100px"}}),a("el-table-column",{attrs:{label:"头像",align:"center",fixed:"left",width:"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"img-box"},[a("img",{attrs:{Src:e.dealShowFileSrc(t.row.headImg)}})])]}}],null,!0)}),a("el-table-column",{attrs:{label:"等级阶梯",prop:"codeDesc",align:"center",width:"130px"}}),a("el-table-column",{attrs:{label:"微信号",prop:"wechatId",align:"center","min-width":"100px"}}),a("el-table-column",{attrs:{label:"WhatsApp",prop:"whatsApp",align:"center","min-width":"200px"}}),a("el-table-column",{attrs:{label:"WhatsApp链接",prop:"whatsAppLink",align:"center",width:"240px"}}),a("el-table-column",{attrs:{label:"Line",prop:"lineId",align:"center","min-width":"200px"}}),a("el-table-column",{attrs:{label:"Line链接",prop:"lineLink",align:"center",width:"240px"}}),a("el-table-column",{attrs:{label:"操作",align:"center",fixed:"right",width:"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasPermission("BTN_ADVISOR_MANAGE_EDIT")?a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.handleEdit(t.row,"edit")}}},[e._v("编辑")]):e._e(),e.hasPermission("BTN_ADVISOR_MANAGE_COPY")?a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.handleEdit(t.row,"copy")}}},[e._v("复制")]):e._e()]}}],null,!0)})],1)],1)})),1)],1),e.advisorShow?a("edit-advisor-dialog",{attrs:{countryCode:e.currentCountry,countryList:e.countryList,fingoMasterList:e.fingoMasterList,type:e.curType,propParam:e.propParam,advisorShow:e.advisorShow},on:{close:function(t){e.advisorShow=!1},confirm:e.handelConfirm}}):e._e()],1)},n=[],i=(a("8e6e"),a("ac6a"),a("456d"),a("bd86")),o=(a("20d6"),a("7cd9")),l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{staticClass:"edit-advisor-dialog",attrs:{visible:e.advisorShow,width:"650px",title:"edit"==e.type?"编辑导师信息":"新增导师信息"},on:{close:e.handleClose}},[a("el-form",{ref:"editAdvisorForm",attrs:{"label-position":"right","label-width":"130px",model:e.param,rules:e.rules}},[a("el-form-item",{attrs:{label:"等级：",prop:"code"}},[a("el-select",{attrs:{disabled:"edit"==e.type},model:{value:e.param.code,callback:function(t){e.$set(e.param,"code",t)},expression:"param.code"}},e._l(e.fingoMasterList,(function(e){return a("el-option",{key:e.key,attrs:{value:e.key,label:e.name}})})),1)],1),a("el-form-item",{attrs:{label:"国家：",prop:"countryCode"}},[a("el-select",{attrs:{disabled:"edit"==e.type,filterable:""},model:{value:e.param.countryCode,callback:function(t){e.$set(e.param,"countryCode",t)},expression:"param.countryCode"}},e._l(e.countryList,(function(e){return a("el-option",{key:e.shortCode,attrs:{label:e.nameCn,value:e.shortCode}})})),1)],1),a("el-form-item",{attrs:{label:"昵称：",prop:"nickName"}},[a("el-input",{model:{value:e.param.nickName,callback:function(t){e.$set(e.param,"nickName",t)},expression:"param.nickName"}})],1),a("el-form-item",{attrs:{label:"微信号："}},[a("el-input",{model:{value:e.param.wechatId,callback:function(t){e.$set(e.param,"wechatId",t)},expression:"param.wechatId"}})],1),a("el-form-item",{attrs:{label:"WhatsApp："}},[a("el-input",{model:{value:e.param.whatsApp,callback:function(t){e.$set(e.param,"whatsApp",t)},expression:"param.whatsApp"}})],1),a("el-form-item",{attrs:{label:"WhatsApp群链接："}},[a("el-input",{model:{value:e.param.whatsAppLink,callback:function(t){e.$set(e.param,"whatsAppLink",t)},expression:"param.whatsAppLink"}})],1),a("el-form-item",{attrs:{label:"line："}},[a("el-input",{model:{value:e.param.lineId,callback:function(t){e.$set(e.param,"lineId",t)},expression:"param.lineId"}})],1),a("el-form-item",{attrs:{label:"line群链接："}},[a("el-input",{model:{value:e.param.lineLink,callback:function(t){e.$set(e.param,"lineLink",t)},expression:"param.lineLink"}})],1),a("el-form-item",{attrs:{label:"头像："}},[a("c-upload",{attrs:{limit:1,accept:"image/jpeg,image/jpg,image/png,image/gif",fileList:e.param.headImg},on:{setData:e.setHeadImg}})],1)],1),a("div",{staticClass:"footer-box",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"medium"},on:{click:e.handleClose}},[e._v("取消")]),a("el-button",{attrs:{type:"primary",size:"medium"},on:{click:e.handleConfirm}},[e._v("确定")])],1)],1)},s=[],c=a("f09b");function p(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function d(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?p(Object(a),!0).forEach((function(t){Object(i["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var u={props:{advisorShow:Boolean,type:String,propParam:{type:Object,default:{}},countryCode:String,countryList:Array,fingoMasterList:Array},data:function(){return{param:{code:"",countryCode:"",nickName:"",headImg:"",whatsApp:"",whatsAppLink:"",lineId:"",lineLink:"",wechatId:""},rules:{nickName:[{required:!0,message:"必填",trigger:"change"}],code:[{required:!0,message:"必选",trigger:"change"}],countryCode:[{required:!0,message:"必选",trigger:"change"}]}}},created:function(){var e=d({},this.propParam);"edit"==this.type||"copy"==this.type?Object.assign(this.param,e):this.param.countryCode=this.countryCode},components:{cUpload:c["a"]},methods:{reset:function(){this.param={code:"",countryCode:"",nickName:"",headImg:"",whatsApp:"",whatsAppLink:"",lineId:"",lineLink:"",wechatId:""},this.$refs["editAdvisorForm"].clearValidate()},handleClose:function(){this.reset(),this.$emit("close")},handleConfirm:function(){var e=this;this.$refs["editAdvisorForm"].validate((function(t){t&&e.$emit("confirm",e.filterData(e.param))}))},setHeadImg:function(e){this.param.headImg=e.data}}},m=u,h=a("2877"),f=Object(h["a"])(m,l,s,!1,null,null,null),b=f.exports;function y(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function g(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?y(Object(a),!0).forEach((function(t){Object(i["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):y(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var w={data:function(){return{load:!1,dataList:[],currentCountry:"MY",propParam:{},advisorShow:!1,curType:"add",fingoMasterList:[{key:"V3_FINGO_MASTER",name:"PS导师（直推5，团队15）"},{key:"V4_FINGO_MASTER",name:"AM导师300以下"},{key:"V4_FINGO_MASTER2",name:"AM导师300以上"},{key:"V5_FINGO_MASTER",name:"AT导师"}],searchParam:{nickName:"",code:""}}},components:{editAdvisorDialog:b},computed:{countryList:function(){var e=JSON.parse(JSON.stringify(this.$store.state.dict.countryList)),t=e.findIndex((function(e){return"ID"==e.shortCode}));return-1==t&&e.push({nameCn:"印度尼西亚",shortCode:"ID"}),e}},created:function(){this.getList()},methods:{handleCountryChange:function(){this.dataList=[],this.getList()},getList:function(){var e=this;this.load=!0,Object(o["l"])(g({countryCode:this.currentCountry},this.searchParam)).then((function(t){1===t.ret.errcode&&(e.dataList=t.fingoMasterInfo),e.load=!1})).catch((function(){e.load=!1}))},handleAdd:function(){this.curType="add",this.advisorShow=!0},handleEdit:function(e,t){this.curType=t,Object.assign(this.propParam,{code:e.code,countryCode:e.countryCode,headImg:e.headImg,nickName:e.nickName,whatsApp:e.whatsApp,whatsAppLink:e.whatsAppLink,lineId:e.lineId,lineLink:e.lineLink,wechatId:e.wechatId}),this.propParam.id="edit"==t?e.id:"",this.advisorShow=!0},handelConfirm:function(e){var t=this;Object(o["u"])({fingoMasterInfo:e}).then((function(e){1===e.ret.errcode&&(t.$message.success("edit"===t.curType?"编辑成功":"新增成功"),t.advisorShow=!1,t.getList())}))}}},k=w,v=(a("5686"),a("293a"),Object(h["a"])(k,r,n,!1,null,"71fc6e15",null));t["default"]=v.exports},5686:function(e,t,a){"use strict";var r=a("d594"),n=a.n(r);n.a},d594:function(e,t,a){},e914:function(e,t,a){}}]);