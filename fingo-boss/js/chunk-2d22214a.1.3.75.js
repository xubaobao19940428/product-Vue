(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d22214a"],{cca5:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"filter-container"},[a("el-form",{attrs:{inline:"","label-width":"90px"}},[a("el-form-item",{staticClass:"filter-item",attrs:{label:"用户ID："}},[a("el-input",{attrs:{type:"number",placeholder:"请输入用户id",size:"medium",clearable:"",maxlength:"12"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.queryData.userId,callback:function(t){e.$set(e.queryData,"userId",t)},expression:"queryData.userId"}})],1),a("el-form-item",{staticClass:"filter-item",attrs:{label:"昵称："}},[a("el-input",{attrs:{placeholder:"请输入昵称",size:"medium",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.queryData.nickName,callback:function(t){e.$set(e.queryData,"nickName",t)},expression:"queryData.nickName"}})],1),a("el-form-item",{staticClass:"filter-item",attrs:{label:"注册时间："}},[a("el-date-picker",{attrs:{"value-format":"timestamp",type:"daterange","start-placeholder":"开始日期","end-placeholder":"结束日期","default-time":["00:00:00","23:59:59"]},model:{value:e.timeList,callback:function(t){e.timeList=t},expression:"timeList"}})],1),a("el-form-item",{staticClass:"filter-item",attrs:{label:"邀请码："}},[a("el-input",{attrs:{placeholder:"请输入邀请码",size:"medium",clearable:"",maxlength:"6"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.queryData.inviteCode,callback:function(t){e.$set(e.queryData,"inviteCode",t)},expression:"queryData.inviteCode"}})],1),a("el-form-item",{staticClass:"filter-item",attrs:{label:"手机号："}},[a("el-input",{attrs:{type:"number",placeholder:"请输入手机号",clearable:"",size:"medium",maxlength:"12"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.queryData.mobile,callback:function(t){e.$set(e.queryData,"mobile",t)},expression:"queryData.mobile"}})],1),a("span",{directives:[{name:"show",rawName:"v-show",value:e.drop,expression:"drop"}]},[a("el-form-item",{staticClass:"filter-item",attrs:{label:"等级："}},[a("el-select",{attrs:{size:"medium",clearable:"",placeholder:"请选择"},model:{value:e.queryData.memberLevel,callback:function(t){e.$set(e.queryData,"memberLevel",t)},expression:"queryData.memberLevel"}},e._l(e.memberLevelList,(function(e){return a("el-option",{key:e.label,attrs:{label:e.label,value:e.value}})})),1)],1),a("el-form-item",{attrs:{label:"用户国家："}},[a("el-select",{attrs:{clearable:"",placeholder:"请选择",size:"medium"},model:{value:e.queryData.countryCode,callback:function(t){e.$set(e.queryData,"countryCode",t)},expression:"queryData.countryCode"}},[e._l(e.countryList,(function(e,t){return a("el-option",{key:t,attrs:{label:e.nameEn+"/"+e.nameCn,value:e.shortCode}})})),a("el-option",{attrs:{label:"印尼",value:"ID"}})],2)],1),a("el-form-item",{staticClass:"filter-item",attrs:{label:"上级id："}},[a("el-input",{attrs:{placeholder:"请输入上级id",size:"medium",clearable:"",maxlength:"12"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}},model:{value:e.queryData.parentId,callback:function(t){e.$set(e.queryData,"parentId",t)},expression:"queryData.parentId"}})],1)],1),a("el-form-item",{staticClass:"filter-item",staticStyle:{"margin-left":"20px"}},[a("el-button",{attrs:{icon:"el-icon-search",type:"primary",size:"medium"},on:{click:e.search},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}}},[e._v("搜索")]),a("el-button",{attrs:{icon:"el-icon-refresh-left",size:"medium"},on:{click:e.resetSearch}},[e._v("重置")]),a("el-link",{staticStyle:{"margin-left":"20px"},attrs:{type:"primary",underline:!1},on:{click:e.dropDown}},[e._v("\n                        "+e._s(e.dropDownContent)+"\n                        "),a("i",{class:e.dropDownIcon})])],1)],1)],1),a("div",{staticClass:"main-content-wrapper"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{border:"",height:"100%",data:e.dataList}},[a("el-table-column",{attrs:{fixed:"",prop:"userId",label:"用户ID",align:"center","min-width":"90px"}}),a("el-table-column",{attrs:{fixed:"",prop:"nickName",label:"昵称",align:"center","min-width":"120px"}}),a("el-table-column",{attrs:{prop:"mobile",label:"手机号",align:"center","min-width":"150px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.mobile||"-"))])]}}])}),a("el-table-column",{attrs:{prop:"inviteCode",label:"邀请码",align:"center","min-width":"100px"}}),a("el-table-column",{attrs:{label:"用户等级",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[2===t.row.memberLevel?a("el-tag",{attrs:{size:"mini","close-transition":""}},[e._v("\n                            "+e._s(e.memberLevel[t.row.memberLevel])+"\n                        ")]):e._e(),3===t.row.memberLevel?a("el-tag",{attrs:{type:"success",size:"mini","close-transition":""}},[e._v("\n                            "+e._s(e.memberLevel[t.row.memberLevel])+"\n                        ")]):e._e(),4===t.row.memberLevel?a("el-tag",{attrs:{type:"warning",size:"mini","close-transition":""}},[e._v("\n                            "+e._s(e.memberLevel[t.row.memberLevel])+"\n                        ")]):e._e(),5===t.row.memberLevel?a("el-tag",{attrs:{type:"danger",size:"mini","close-transition":""}},[e._v("\n                            "+e._s(e.memberLevel[t.row.memberLevel])+"\n                        ")]):e._e()]}}])}),a("el-table-column",{attrs:{prop:"countryCode",label:"国家",align:"center","min-width":"150px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                        "+e._s(e._f("countryFilter")(t.row.countryCode))+"\n                    ")]}}])}),a("el-table-column",{attrs:{prop:"createTime",label:"注册时间",align:"center","min-width":"170px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("secondTimeFormat")(t.row.createTime)))])]}}])}),a("el-table-column",{attrs:{prop:"createTime",label:"邀请时间",align:"center","min-width":"170px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("secondTimeFormat")(t.row.createTime)))])]}}])}),a("el-table-column",{attrs:{prop:"memberTime",label:"成为会员时间",align:"center","min-width":"170px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("secondTimeFormat")(t.row.memberTime)))])]}}])}),a("el-table-column",{attrs:{prop:"inviteTime",label:"绑定时间",align:"center","min-width":"170px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("secondTimeFormat")(t.row.inviteTime)))])]}}])}),a("el-table-column",{attrs:{prop:"parentId",label:"上级id",align:"center","min-width":"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.parentId||"-"))])]}}])}),e.hasPermission("BTN_USER_MEG_OPERATION_SEE_DETAIL")?a("el-table-column",{attrs:{fixed:"right",label:"操作",align:"center","min-width":"90px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("router-link",{attrs:{target:"_blank",to:{name:"memberInfo",query:{userId:t.row.userId}}}},[a("el-button",{attrs:{type:"text",size:"mini"}},[e._v("详情")])],1)]}}],null,!1,2886452003)}):e._e()],1)],1),a("div",{staticClass:"pagination-box"},[a("el-pagination",{staticClass:"pagination",attrs:{"page-sizes":[20,50,100],"current-page":e.queryData.page.pageNum,"page-size":e.queryData.page.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"current-change":e.handleCurrentChange,"size-change":e.handleSizeChange}})],1)])},r=[],i=(a("8e6e"),a("ac6a"),a("456d"),a("bd86")),l=a("7cd9"),s=a("5880");function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function u(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){Object(i["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var c={name:"memberManager",data:function(){return{drop:!1,dropDownContent:"展开",dropDownIcon:"el-icon-arrow-down",loading:!1,dataList:[],adminGrade:"",total:0,queryData:{page:{pageNum:1,pageSize:20},nickName:"",memberLevel:"",mobile:"",userId:"",inviteCode:"",parentId:"",parentNickName:"",parentMobile:"",countryCode:""},totals:0,inputValue:"",timeList:[]}},computed:u(u({},Object(s["mapState"])({memberLevel:function(e){return e.dict.memberLevel},memberLevelList:function(e){return e.dict.memberLevelList}})),{},{nowEndDate:function(){return this.$store.state.globalNum.nowEnd},countryList:function(){return this.$store.state.dict.countryList},nowEnd:function(){return this.$store.state.globalNum.nowEnd},lastWeek:function(){return this.$store.state.globalNum.lastWeek}}),created:function(){this.timeList=[this.lastWeek,this.nowEnd],this.queryData.userId=this.$route.query.userId?this.$route.query.userId:"",this.getUserList()},methods:{dropDown:function(){this.drop?(this.dropDownContent="展开",this.dropDownIcon="el-icon-arrow-down"):(this.dropDownContent="收起",this.dropDownIcon="el-icon-arrow-up"),this.drop=!this.drop},showInput:function(e){var t=this;this.dataList[e].editFlg=!0,this.inputValue=JSON.parse(JSON.stringify(this.dataList[e].operatingContent)),this.$nextTick((function(){t.$refs.saveTagInput.$refs.input.focus()}))},getUserList:function(){var e=this;this.loading=!0;var t=this.filterData(this.queryData);this.timeList=this.timeList?this.timeList:[],t.startTime=this.timeList[0]?this.timeList[0]+"":null,t.endTime=this.timeList[1]?this.timeList[1]+"":null,Object(l["p"])(this.filterData(t)).then((function(t){var a=t;e.dataList=a.userManagePb,e.total=a.total,e.loading=!1})).catch((function(t){e.loading=!1,console.error(t)}))},search:function(){this.queryData.page.pageNum=1,this.getUserList()},resetSearch:function(){this.queryData={page:{pageNum:1,pageSize:20},userId:"",nickName:"",mobile:"",inviteCode:"",memberLevel:"",parentId:"",parentNickName:"",parentMobile:"",countryCode:""},this.timeList=[],this.getUserList()},handleCurrentChange:function(e){this.queryData.page.pageNum=e||this.queryData.page.pageNum,this.getUserList()},handleSizeChange:function(e){this.queryData.page.pageSize=e,this.getUserList()}}},m=c,p=a("2877"),d=Object(p["a"])(m,n,r,!1,null,"b6f56210",null);t["default"]=d.exports}}]);