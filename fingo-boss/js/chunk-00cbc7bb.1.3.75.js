(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-00cbc7bb"],{"3e1f":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-tabs",{model:{value:e.currentView,callback:function(t){e.currentView=t},expression:"currentView"}},[a("el-tab-pane",{attrs:{label:"用户管理",name:"userManage"}},["userManage"===e.currentView?a("user-manage"):e._e()],1),a("el-tab-pane",{attrs:{label:"角色管理",name:"roleManage"}},["roleManage"===e.currentView?a("role-manage"):e._e()],1),a("el-tab-pane",{attrs:{label:"组织管理",name:"systemManage"}},["systemManage"===e.currentView?a("system-manage"):e._e()],1)],1)],1)},n=[],i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"operator-container"},[e.hasPermission("BTN_ACCOUNT_MANAGE_ADD_USER")?a("el-button",{staticClass:"operator-item",attrs:{icon:"el-icon-plus",type:"primary",size:"small"},on:{click:e.handleOptAccount}},[e._v("新增用户")]):e._e()],1),a("el-form",{attrs:{inline:""}},[a("el-form-item",{attrs:{label:"用户搜索："}},[a("el-input",{staticStyle:{width:"240px"},attrs:{placeholder:"请输入真实姓名/昵称/用户名",size:"medium",clearable:""},model:{value:e.searchParam.nickName,callback:function(t){e.$set(e.searchParam,"nickName",t)},expression:"searchParam.nickName"}})],1),a("el-form-item",{attrs:{label:"部门组织："}},[a("el-cascader",{staticStyle:{width:"100%"},attrs:{clearable:!1,filterable:"",props:{label:"groupName",checkStrictly:!0,value:"groupId",lazy:!0,lazyLoad:e.loadGroupData},options:e.groupOptions,size:"medium"},on:{change:function(t){return e.handleSelectGroup(t,1)}},model:{value:e.searchParam.groupId,callback:function(t){e.$set(e.searchParam,"groupId",t)},expression:"searchParam.groupId"}})],1),a("el-form-item",{attrs:{label:"对应角色："}},[a("el-select",{staticStyle:{"min-width":"240px"},attrs:{multiple:"",filterable:"","value-key":"roleId",placeholder:"可输入搜索",clearable:"",size:"medium"},model:{value:e.searchParam.roleIds,callback:function(t){e.$set(e.searchParam,"roleIds",t)},expression:"searchParam.roleIds"}},e._l(e.roleList,(function(e){return a("el-option",{key:e.roleId,attrs:{label:e.roleName,value:e.roleId}})})),1)],1),a("el-form-item",{staticClass:"filter-item",staticStyle:{"margin-left":"20px"}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-search",size:"medium"},on:{click:function(t){return e.getList(1)}}},[e._v("搜索")]),a("el-button",{attrs:{icon:"el-icon-refresh-left",size:"medium"},on:{click:e.resetSearchParam}},[e._v("重置")])],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.load,expression:"load"}],staticStyle:{width:"100%"},attrs:{data:e.dataList,border:""}},[a("el-table-column",{attrs:{fixed:"left",label:"ID",align:"center",prop:"id"}}),a("el-table-column",{attrs:{label:"用户名",align:"center",prop:"account"}}),a("el-table-column",{attrs:{label:"昵称",align:"center",prop:"nickName"}}),a("el-table-column",{attrs:{label:"真实姓名",align:"center",prop:"realName"}}),a("el-table-column",{attrs:{label:"部门组织",align:"center",prop:"groupName"}}),a("el-table-column",{attrs:{label:"对应角色",align:"center","min-width":"160px"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.roleName,(function(t){return a("el-tag",{key:t,attrs:{size:"small",type:"warning"}},[e._v("\n                    "+e._s(t)+"\n                ")])}))}}])}),a("el-table-column",{attrs:{label:"创建时间",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e._f("formatTime")(t.row.createTime))+"\n            ")]}}])}),a("el-table-column",{attrs:{label:"更新时间",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e._f("formatTime")(t.row.updateTime))+"\n            ")]}}])}),a("el-table-column",{attrs:{fixed:"right",width:"240px",label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasPermission("BTN_ACCOUNT_MANAGE_EDIT_USER")?a("el-button",{attrs:{plain:"",type:"primary",size:"mini"},on:{click:function(a){return e.handleOptAccount(t.row)}}},[e._v("编辑")]):e._e(),e.hasPermission("BTN_ACCOUNT_MANAGE_EDIT_USER")?a("el-button",{attrs:{plain:"",type:"success",size:"mini"},on:{click:function(a){return e.handleResetPassword(t.row)}}},[e._v("重置密码")]):e._e(),"admin"!=t.row.account&&e.hasPermission("BTN_ACCOUNT_MANAGE_DELETE_USER")?a("el-button",{attrs:{plain:"",type:"danger",size:"mini"},on:{click:function(a){return e.handleDeleteAccount(t.row)}}},[e._v("删除")]):e._e()]}}])})],1),a("div",{staticClass:"page-wrapper"},[a("el-pagination",{attrs:{"current-page":e.searchParam.page.pageNum,"page-size":e.searchParam.page.pageSize,layout:"sizes, total, prev, pager, next, jumper","page-sizes":[5,10,15,20],total:e.totals},on:{"current-change":e.getList,"size-change":e.handleSizeChange}})],1),e.dialog.show?a("user-opt-dialog",{attrs:{dialog:e.dialog},on:{close:e.handleCloseOpt,confirm:e.handleConfirmOpt}}):e._e()],1)},o=[],s=(a("96cf"),a("3b8d")),l=a("e7c2"),c=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.dialog.curEditId?"修改用户":"新增用户",visible:e.dialog.show,width:"540px"},on:{close:e.handleClose}},[a("el-form",{ref:"accountForm",attrs:{autoComplete:"off",model:e.param,rules:e.rules,"label-position":"right","label-width":"100px"}},[a("el-form-item",{attrs:{prop:"account",label:"用户名："}},[e.dialog.curEditId?a("span",{staticClass:"account-item"},[e._v(e._s(e.param.account))]):a("el-input",{staticClass:"edit__input",attrs:{placeholder:"请输入用户名",clearable:"",size:"medium",autocomplete:"off"},model:{value:e.param.account,callback:function(t){e.$set(e.param,"account",t)},expression:"param.account"}})],1),a("el-form-item",{staticClass:"is-required",attrs:{prop:"groupId",label:"部门组织："}},[e.groupName?a("span",[e._v("上一次设置的部门："),a("el-tag",[e._v(e._s(this.groupName))])],1):e._e(),a("el-cascader",{staticStyle:{width:"100%"},attrs:{filterable:"",props:{label:"groupName",checkStrictly:!0,value:"groupId",lazy:!0,lazyLoad:e.loadGroupData},options:e.groupList,size:"medium"},on:{change:function(t){return e.handleSelectGroup(t,1)}},model:{value:e.param.groupId,callback:function(t){e.$set(e.param,"groupId",t)},expression:"param.groupId"}})],1),a("el-form-item",{attrs:{prop:"realName",label:"真实姓名："}},[a("el-input",{attrs:{clearable:"",size:"medium"},model:{value:e.param.realName,callback:function(t){e.$set(e.param,"realName",t)},expression:"param.realName"}})],1),a("el-form-item",{attrs:{prop:"nickName",label:"用户昵称："}},[a("el-input",{staticClass:"edit__input",attrs:{placeholder:"请输入用户昵称",clearable:"",size:"medium",autocomplete:"off"},model:{value:e.param.nickName,callback:function(t){e.$set(e.param,"nickName",t)},expression:"param.nickName"}})],1),a("el-form-item",{attrs:{prop:"mobile",label:"手机号："}},[a("el-input",{staticClass:"edit__input",attrs:{placeholder:"请输入手机号",clearable:"",size:"medium",autocomplete:"off"},model:{value:e.param.mobile,callback:function(t){e.$set(e.param,"mobile",t)},expression:"param.mobile"}})],1),a("el-form-item",{attrs:{prop:"email",label:"邮箱："}},[a("el-input",{staticClass:"edit__input",attrs:{placeholder:"请输入邮箱",clearable:"",size:"medium",autocomplete:"off"},model:{value:e.param.email,callback:function(t){e.$set(e.param,"email",t)},expression:"param.email"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:e.handleClose}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.handleConfirm}},[e._v("确 定")])],1)],1)},u=[],p=(a("8e6e"),a("ac6a"),a("456d"),a("7514"),a("bd86"));function m(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function d(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?m(Object(a),!0).forEach((function(t){Object(p["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):m(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var h={props:{dialog:Object},created:function(){var e=this,t=d({},this.dialog);t.curEditId&&(Object.assign(this.param,{account:t.account,email:t.email,mobile:t.mobile,nickName:t.nickName,realName:t.realName,groupId:t.groupId}),this.groupName=t.groupName),this.loadGroupData({value:-1},(function(t){e.groupList=t}))},data:function(){return{groupList:[{groupId:-1}],groupName:"",param:{account:"",email:"",mobile:"",nickName:"",realName:"",groupId:""},rules:{account:[{required:!0,trigger:"blur",validator:function(e,t,a){0===t.length?a(new Error("不能为空")):t.length>100?a(new Error("用户名最多100个字符")):a()}}],nickName:[{required:!0,message:"必填",trigger:"blur"}],groupId:[{required:!0,message:"必选",trigger:"change"}]},dingUserList:[]}},methods:{reset:function(){this.groupName="",this.$refs["accountForm"].resetFields()},setDingUserInfo:function(){var e=this,t=this.dingUserList.find((function(t){return t.dingUserId==e.param.dingUserId}));t&&(this.param.realName=t.realName,this.param.nickName=t.realName+"("+t.position+"-"+t.dept+")")},handleClose:function(){this.reset(),this.$emit("close")},handleSelectGroup:function(e){var t=e.length;this.param.groupId=e[t-1]},loadGroupData:function(e,t){Object(l["j"])({fid:e.value}).then((function(e){if(1===e.ret.errcode){var a=e.groupSimple||[];a.length&&a.map((function(e){e.children=[]})),t(a)}})).catch((function(e){console.error(e)}))},handleConfirm:function(){var e=this;this.$refs["accountForm"].validate((function(t){t&&(e.dialog.curEditId?Object(l["r"])(d({selfUpdate:!1},e.filterData(e.param))).then((function(t){1===t.ret.errcode&&(e.$message.success("编辑用户成功！"),e.$emit("confirm"))})):Object(l["c"])(e.filterData(e.param)).then((function(t){1===t.ret.errcode&&(e.$message.success("新建用户成功！"),e.$emit("confirm"))})))}))}}},f=h,g=a("2877"),b=Object(g["a"])(f,c,u,!1,null,null,null),v=b.exports,y={components:{userOptDialog:v},data:function(){return{searchParam:{nickName:"",groupId:-1,roleIds:[],page:{pageNum:1,pageSize:10,pagingSwitch:!0}},load:!1,totals:0,dataList:[],roleList:[],dialog:{show:!1,curEditId:"",realName:"",nickName:"",groupId:"",account:"",email:"",mobile:""},groupOptions:[{groupId:-1,groupName:"全部",children:[]}]}},created:function(){this.getList(),this.getAllRoleList()},methods:{handleSizeChange:function(e){this.searchParam.page.pageSize=e,this.getList(1)},resetSearchParam:function(){this.searchParam={nickName:"",groupId:"",page:{pageNum:1,pageSize:10,pagingSwitch:!0}}},getAllRoleList:function(){var e=this;Object(l["i"])({}).then((function(t){1===t.ret.errcode&&(e.roleList=t.sysRoleSimplePb)}))},getList:function(e){var t=this;this.load=!0,this.searchParam.page.pageNum=e||this.searchParam.page.pageNum,Object(l["l"])(this.filterData(this.searchParam)).then((function(e){1===e.ret.errcode&&(t.dataList=e.sysUserPb,t.totals=e.total),t.load=!1})).catch((function(e){console.error(e),t.load=!1}))},handleSelectGroup:function(e){var t=e.length;this.searchParam.groupId=e[t-1]},handleResetPassword:function(e){var t=this,a=e.account;this.$confirm("此操作将初始化密码, 是否继续?","提示",{confirmButtonText:"继续",cancelButtonText:"取消",type:"warning"}).then(Object(s["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:Object(l["m"])({account:a}).then((function(e){1===e.ret.errcode&&t.$message.success("重置密码成功!")}));case 1:case"end":return e.stop()}}),e)})))).catch((function(){t.$message({type:"info",message:"已取消重置"})}))},handleOptAccount:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object.assign(this.dialog,{realName:e.realName||"",nickName:e.nickName||"",account:e.account||"",curEditId:e.id||"",groupId:e.groupId||"",show:!0,email:e.email||"",mobile:e.mobile||"",groupName:e.groupName||""})},handleCloseOpt:function(){Object.assign(this.dialog,{show:!1,realName:"",account:"",nickName:"",curEditId:"",groupId:"",email:"",mobile:"",groupName:""})},handleConfirmOpt:function(){this.handleCloseOpt(),this.getList()},loadGroupData:function(e,t){Object(l["j"])({fid:e.value}).then((function(e){if(1===e.ret.errcode){var a=e.groupSimple||[];a.length&&a.map((function(e){e.children=[]})),t(a)}})).catch((function(e){console.error(e)}))},handleDeleteAccount:function(e){var t=this,a=e.account;this.$confirm("此操作将永久删除该账户, 是否继续?","提示",{confirmButtonText:"继续",cancelButtonText:"取消",type:"warning"}).then((function(){Object(l["f"])({account:a}).then((function(e){1===e.ret.errcode&&(t.$message({type:"success",message:"删除用户成功!"}),t.getList())}))})).catch((function(){t.$message({type:"info",message:"已取消删除"})}))}}},O=y,_=Object(g["a"])(O,i,o,!1,null,null,null),k=_.exports,N=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"operator-container"},[e.hasPermission("BTN_ACCOUNT_MANAGE_ADD_ROLE")?a("el-button",{staticClass:"operator-item",attrs:{icon:"el-icon-plus",type:"primary",size:"small"},on:{click:e.handleOpt}},[e._v("新增角色")]):e._e()],1),a("el-form",{attrs:{inline:""}},[a("el-form-item",{attrs:{label:"角色搜索："}},[a("el-input",{attrs:{size:"medium"},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getList(1)}},model:{value:e.searchParam.roleName,callback:function(t){e.$set(e.searchParam,"roleName",t)},expression:"searchParam.roleName"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search",plain:"",placeholder:"请输入角色名",size:"medium"},on:{click:function(t){return e.getList(1)}}},[e._v("查询")])],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.load,expression:"load"}],staticStyle:{width:"100%"},attrs:{data:e.dataList,border:""}},[a("el-table-column",{attrs:{fixed:"left",label:"ID",align:"center",prop:"id"}}),a("el-table-column",{attrs:{label:"角色名",align:"center",prop:"roleName"}}),a("el-table-column",{attrs:{label:"创建时间",align:"center","min-width":"100px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e._f("formatTime")(t.row.createTime))+"\n            ")]}}])}),a("el-table-column",{attrs:{label:"更新时间",align:"center","min-width":"100px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e._f("formatTime")(t.row.updateTime))+"\n            ")]}}])}),a("el-table-column",{attrs:{label:"对应组织",align:"center","min-width":"200px"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.groupName,(function(t){return a("el-tag",{key:t,attrs:{type:"warning",size:"small"}},[e._v("\n                    "+e._s(t)+"\n                ")])}))}}])}),a("el-table-column",{attrs:{fixed:"right",label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasPermission("BTN_ACCOUNT_MANAGE_EDIT_ROLE")?a("el-button",{attrs:{plain:"",type:"primary",size:"mini"},on:{click:function(a){return e.handleOpt(t.row)}}},[e._v("编辑")]):e._e(),e.hasPermission("BTN_ACCOUNT_MANAGE_DELETE_ROLE")?a("el-button",{attrs:{plain:"",type:"danger",size:"mini"},on:{click:function(a){return e.handleDelete(t.row)}}},[e._v("删除")]):e._e()]}}])})],1),a("div",{staticClass:"pagination-box"},[a("el-pagination",{attrs:{"current-page":e.searchParam.page.pageNum,"page-size":e.searchParam.page.pageSize,layout:"sizes, total, prev, pager, next, jumper","page-sizes":[5,10,15,20],total:e.totals},on:{"current-change":e.getList,"size-change":e.handleSizeChange}})],1),e.dialog.show?a("role-opt-dialog",{attrs:{dialog:e.dialog},on:{close:e.handleCloseOpt,confirm:e.handleConfirmOpt}}):e._e()],1)},w=[],I=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.dialog.curEditId?"修改角色":"新增角色",width:"800px",visible:e.dialog.show},on:{close:e.handleClose}},[a("el-form",{ref:"roleForm",attrs:{autoComplete:"off",model:e.param,rules:e.rules,"label-position":"right","label-width":"80px"}},[a("el-form-item",{staticClass:"filter-item",attrs:{prop:"roleName",label:"角色名："}},[a("el-input",{staticClass:"edit__input",attrs:{placeholder:"请输入角色名",clearable:"",size:"medium",autocomplete:"off"},model:{value:e.param.roleName,callback:function(t){e.$set(e.param,"roleName",t)},expression:"param.roleName"}})],1),a("el-form-item",{staticClass:"filter-item",attrs:{prop:"permissionKeyList",label:"角色权限："}},[a("permission",{ref:"permission",attrs:{permissionKeyList:e.param.permissionKeyList},on:{permissionChange:e.setPermissionKeyList}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:e.handleClose}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.handleConfirm}},[e._v("确 定")])],1)],1)},C=[],L=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"permission-wrapper"},[a("div",{staticClass:"permission-container"},e._l(e.routersList,(function(t,r){return t.meta&&(!t.meta||t.meta.noPermission)||t.redirect?e._e():a("div",{key:r},[a("div",{staticClass:"header-wrapper"},[t.children?a("div",[t.path?a("div",{staticClass:"flex"},[a("div",{staticClass:"mar-r-20 herder-item"},[e._v(e._s(t.meta?t.meta.title:t.name))]),a("el-checkbox-group",{on:{change:function(a){return e.selectAll(t)}},model:{value:e.menuSelect,callback:function(t){e.menuSelect=t},expression:"menuSelect"}},[a("el-checkbox",{attrs:{label:t.path}},[e._v("全选")])],1)],1):e._e()]):a("div",{staticClass:"mar-t-10"},[a("el-checkbox-group",{model:{value:e.checkList,callback:function(t){e.checkList=t},expression:"checkList"}},[a("el-checkbox",{attrs:{label:t.meta.key},on:{change:e.routerSelectChange}},[e._v(e._s(t.meta.title))])],1)],1)]),t.children?a("div",{staticClass:"content-wrapper"},e._l(t.children,(function(t,r){return t.meta.noPermission?e._e():a("div",{key:r,staticClass:"router-item",attrs:{label:t.meta.key}},[a("div",{staticClass:"menu-item"},[a("el-checkbox-group",{model:{value:e.checkList,callback:function(t){e.checkList=t},expression:"checkList"}},[a("el-checkbox",{attrs:{label:t.meta.key},on:{change:function(a){return e.menuSelectChange(t)}}},[e._v(e._s(t.meta.title))])],1)],1),a("div",{staticClass:"btn-wrapper"},e._l(t.meta.btnPermission,(function(r,n){return a("div",{key:n,staticClass:"btn-item"},[a("el-checkbox-group",{model:{value:e.checkList,callback:function(t){e.checkList=t},expression:"checkList"}},[a("el-checkbox",{attrs:{label:r.key},on:{change:function(a){return e.btnSelectChange(r,t)}}},[e._v(e._s(r.title))])],1)],1)})),0)])})),0):e._e()])})),0)])},P=[],j=(a("ac4d"),a("8a81"),a("5df3"),a("1c4c"),a("7f7f"),a("6b54"),a("20d6"),a("5880"));function S(e,t){var a;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(a=x(e))||t&&e&&"number"===typeof e.length){a&&(e=a);var r=0,n=function(){};return{s:n,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,s=!1;return{s:function(){a=e[Symbol.iterator]()},n:function(){var e=a.next();return o=e.done,e},e:function(e){s=!0,i=e},f:function(){try{o||null==a.return||a.return()}finally{if(s)throw i}}}}function x(e,t){if(e){if("string"===typeof e)return E(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?E(e,t):void 0}}function E(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}function $(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function A(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?$(Object(a),!0).forEach((function(t){Object(p["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):$(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var D={props:{permissionKeyList:{default:[],type:Array}},computed:A(A({},Object(j["mapGetters"])(["userInfo"])),{},{routersList:function(){var e=this.$router.options.routes;return e}}),data:function(){return{menuSelect:[],checkList:JSON.parse(JSON.stringify(this.permissionKeyList))}},created:function(){},watch:{permissionKeyList:{handler:function(e){this.checkList=e}}},methods:{routerSelectChange:function(){this.$emit("permissionChange",this.checkList)},menuSelectChange:function(e){var t=this,a=this.checkList.findIndex((function(t){return t==e.meta.key}));if(-1==a&&e.meta.btnPermission){var r,n=S(e.meta.btnPermission);try{var i=function(){var e=r.value,a=t.checkList.findIndex((function(t){return t==e.key}));-1!=a&&t.checkList.splice(a,1)};for(n.s();!(r=n.n()).done;)i()}catch(o){n.e(o)}finally{n.f()}}this.$emit("permissionChange",this.checkList)},btnSelectChange:function(e,t){var a=this.checkList.findIndex((function(t){return t==e.key}));if(-1!=a){var r=this.checkList.findIndex((function(e){return e==t.meta.key}));-1==r&&this.checkList.push(t.meta.key)}this.$emit("permissionChange",this.checkList)},selectAll:function(e){var t,a=this,r=this.menuSelect.findIndex((function(t){return t==e.path})),n=S(e.children);try{var i=function(){var e=t.value,n=a.checkList.findIndex((function(t){return t==e.meta.key}));if(-1!=r?-1==n&&a.checkList.push(e.meta.key):-1!=n&&a.checkList.splice(n,1),e.meta.btnPermission){var i,o=S(e.meta.btnPermission);try{var s=function(){var e=i.value,t=a.checkList.findIndex((function(t){return t==e.key}));-1!=r?-1==t&&a.checkList.push(e.key):-1!=t&&a.checkList.splice(t,1)};for(o.s();!(i=o.n()).done;)s()}catch(l){o.e(l)}finally{o.f()}}};for(n.s();!(t=n.n()).done;)i()}catch(o){n.e(o)}finally{n.f()}this.$emit("permissionChange",this.checkList)}}},z=D,T=(a("f25b"),Object(g["a"])(z,L,P,!1,null,"7a6e0d2b",null)),M=T.exports;function G(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function U(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?G(Object(a),!0).forEach((function(t){Object(p["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):G(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var R={components:{permission:M},props:{dialog:Object},data:function(){return{rules:{roleName:[{required:!0,trigger:"blur",validator:function(e,t,a){0===t.length?a(new Error("不能为空")):t.length>20?a(new Error("角色名最多20个字符")):a()}}]},param:{roleName:"",permissionKeyList:[]}}},created:function(){var e=this.dialog,t=e.roleName,a=e.permissionKeyList;Object.assign(this.param,{roleName:t,permissionKeyList:a})},methods:{setPermissionKeyList:function(e){this.param.permissionKeyList=e},reset:function(){this.$refs["roleForm"].resetFields()},handleClose:function(){this.reset(),this.$emit("close")},handleConfirm:function(){var e=this;this.$refs["roleForm"].validate((function(t){if(t){var a=e.dialog.curEditId,r=JSON.parse(JSON.stringify(e.param));r.permissionKey=r.permissionKeyList.filter((function(e){return e})),delete r.permissionKeyList,a?Object(l["q"])(U({roleId:a},e.filterData(r))).then((function(t){1===t.ret.errcode&&(e.$message.success("修改成功!"),e.$emit("confirm"))})):Object(l["b"])(e.filterData(r)).then((function(t){1===t.ret.errcode&&(e.$message.success("新增成功!"),e.$emit("confirm"))}))}}))}}},K=R,B=Object(g["a"])(K,I,C,!1,null,null,null),F=B.exports,q={components:{roleOptDialog:F},data:function(){return{load:!1,dataList:[],totals:0,searchParam:{roleName:"",page:{pageNum:1,pageSize:10,pagingSwitch:!0}},groupList:[],dialog:{show:!1,curEditId:"",permissionKeyList:[],roleName:""}}},created:function(){this.getList()},methods:{handleSizeChange:function(e){this.searchParam.page.pageSize=e,this.getList(1)},getList:function(e){var t=this;this.load=!0,this.searchParam.page.pageNum=e||this.searchParam.page.pageNum,Object(l["k"])(this.filterData(this.searchParam)).then((function(e){1===e.ret.errcode&&(t.dataList=e.sysRolePb,t.totals=e.total),t.load=!1})).catch((function(e){console.error(e),t.load=!1}))},handleOpt:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object.assign(this.dialog,{curEditId:e.id||"",show:!0,roleName:e.roleName||"",permissionKeyList:e.permissionKey||[]})},handleDelete:function(e){var t=this,a=e.id;this.$confirm("此操作将永久删除该角色, 是否继续?","提示",{confirmButtonText:"继续",cancelButtonText:"取消",type:"warning"}).then((function(){Object(l["e"])({roleId:a}).then((function(e){1===e.ret.errcode&&(t.$message({type:"success",message:"删除角色成功!"}),t.getList())}))})).catch((function(){t.$message({type:"info",message:"已取消删除"})}))},handleCloseOpt:function(){Object.assign(this.dialog,{show:!1,curEditId:"",roleName:"",permissionKeyList:[]})},handleConfirmOpt:function(){this.handleCloseOpt(),this.getList()}}},V=q,J=Object(g["a"])(V,N,w,!1,null,null,null),Y=J.exports,H=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container system-manage"},[a("div",{staticClass:"operator-container"},[e.hasPermission("BTN_SYSTEM_MANAGE_ADD_GROUP")?a("el-button",{staticClass:"operator-item",attrs:{icon:"el-icon-plus",type:"primary",size:"small"},on:{click:function(t){return e.handleOpt()}}},[e._v("新增一级组织")]):e._e()],1),a("div",{staticClass:"main-content-wrapper"},[a("el-tree",{directives:[{name:"loading",rawName:"v-loading",value:e.load,expression:"load"}],ref:"groupTree",staticStyle:{height:"100%"},attrs:{data:e.groupList,props:e.props,"node-key":"groupId",load:e.loadData,lazy:""},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.node,n=t.data;return a("div",{staticClass:"custom-tree-node"},[a("div",{staticClass:"name-box"},[e._v(e._s(n.groupName))]),a("div",{staticClass:"action-btn-box"},[e.hasPermission("BTN_SYSTEM_MANAGE_ADD_GROUP")?a("el-button",{attrs:{plain:"",size:"mini",type:"primary"},on:{click:function(t){return t.stopPropagation(),e.handleOpt(r,"create")}}},[e._v("新建下级组织\n                    ")]):e._e(),e.hasPermission("BTN_SYSTEM_MANAGE_EDIT_GROUP")?a("el-button",{attrs:{plain:"",size:"mini",type:"primary"},on:{click:function(t){return t.stopPropagation(),e.handleOpt(r,"edit")}}},[e._v("编辑\n                    ")]):e._e(),e.hasPermission("BTN_SYSTEM_MANAGE_DELETE_GROUP")?a("el-button",{attrs:{plain:"",size:"mini",type:"danger"},on:{click:function(t){return t.stopPropagation(),e.handleDelete(r)}}},[e._v("删除")]):e._e()],1)])}}])})],1),e.dialog.show?a("system-opt-dialog",{attrs:{dialog:e.dialog,roleList:e.roleList},on:{close:e.handleCloseOpt,confirm:e.handleConfirmOpt}}):e._e()],1)},Q=[],W=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.dialog.groupId?"编辑组织":"新增组织",visible:e.dialog.show,width:"650px"},on:{close:e.handleClose}},[a("el-form",{ref:"systemManageForm",attrs:{model:e.param,rules:e.rules,"label-position":"right","label-width":"100px"}},[a("el-form-item",{attrs:{prop:"groupName",label:"组织名称："}},[a("el-input",{model:{value:e.param.groupName,callback:function(t){e.$set(e.param,"groupName",t)},expression:"param.groupName"}})],1),a("el-form-item",{staticClass:"is-required",attrs:{prop:"roleIds",label:"对应角色："}},[a("el-checkbox",{attrs:{indeterminate:e.isIndeterminate},on:{change:e.handleSelectedAll},model:{value:e.selectedAll,callback:function(t){e.selectedAll=t},expression:"selectedAll"}},[e._v("全选")]),a("div",[a("el-checkbox-group",{on:{change:e.handleSimpleSelected},model:{value:e.param.roleIds,callback:function(t){e.$set(e.param,"roleIds",t)},expression:"param.roleIds"}},e._l(e.roleList,(function(t){return a("el-checkbox",{key:t.roleId,attrs:{label:t.roleId}},[e._v(e._s(t.roleName))])})),1)],1)],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:e.handleClose}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.handleConfirm}},[e._v("确 定")])],1)],1)},X=[];function Z(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function ee(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(a),!0).forEach((function(t){Object(p["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Z(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var te={props:{dialog:Object,roleList:Array},created:function(){var e=ee({},this.dialog);e.groupId&&Object.assign(this.param,{roleIds:e.roleIds,groupName:e.groupName})},data:function(){var e=this;return{rules:{groupName:[{required:!0,message:"必填",trigger:"change"}],roleIds:[{validator:function(t,a,r){e.param.roleIds.length?r():r(new Error("必选"))}}]},param:{groupName:"",roleIds:[]},isIndeterminate:!1,selectedAll:!1}},methods:{reset:function(){this.$refs["systemManageForm"].resetFields()},handleClose:function(){this.reset(),this.$emit("close")},handleConfirm:function(){var e=this;this.$refs["systemManageForm"].validate((function(t){t&&(e.dialog.groupId?Object(l["p"])(ee({groupId:e.dialog.groupId},e.param)).then((function(t){1===t.ret.errcode&&(e.$message.success("修改组织成功！"),e.$emit("confirm",e.param))})):Object(l["a"])(ee({fid:e.dialog.fid},e.param)).then((function(t){if(1===t.ret.errcode){var a={groupId:t.groupId,groupName:t.groupName,roleIds:t.roleIds,leaf:!0};e.$message.success("新建组织成功"),e.$emit("confirm",a)}})))}))},handleSimpleSelected:function(e){var t=e.length;this.selectedAll=t===this.roleList.length,this.isIndeterminate=t>0&&t<this.roleList.length},handleSelectedAll:function(e){this.param.roleIds=e?this.roleList.map((function(e){return e.roleId})):[],this.isIndeterminate=!1}}},ae=te,re=Object(g["a"])(ae,W,X,!1,null,null,null),ne=re.exports,ie={components:{systemOptDialog:ne},data:function(){return{load:!1,props:{label:"groupName",value:"groupId",isLeaf:"leaf"},roleList:[],groupList:[],dialog:{show:!1,groupId:"",groupName:"",roleIds:[],fid:-1},currentNode:null}},created:function(){var e=this;this.getAllRoleList(),this.loadData({key:-1},(function(t){e.groupList=t}))},methods:{handleOpt:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{data:{}},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"create";this.currentNode=e,Object.assign(this.dialog,{show:!0,groupName:e.data.groupName||"",roleIds:e.data.roleIds||[],fid:e.data.groupId||-1,groupId:""}),"edit"===t&&(this.dialog.groupId=e.data.groupId)},handleCloseOpt:function(){Object.assign(this.dialog,{show:!1,groupId:"",groupName:"",fid:-1,roleIds:[]})},getAllRoleList:function(){var e=this;Object(l["i"])({}).then((function(t){1===t.ret.errcode&&(e.roleList=t.sysRoleSimplePb)}))},handleConfirmOpt:function(e){var t=this,a=this.dialog.groupId;if(a){var r=this.currentNode.parent.childNodes.findIndex((function(e){return e.data.groupId==a}));-1!=r&&(Object.assign(this.currentNode.parent.childNodes[r].data,e),this.$refs["groupTree"].updateKeyChildren(this.currentNode.parent.id,this.currentNode.parent.childNodes))}else this.currentNode.data.groupId?this.$refs["groupTree"].append(e,this.currentNode):this.loadData({key:-1},(function(e){t.groupList=e}));this.handleCloseOpt()},handleDelete:function(e){var t=this;this.$confirm("将永久删除此组织，确定删除？","提示",{type:"warning"}).then((function(){Object(l["d"])({groupId:e.data.groupId}).then((function(a){1===a.ret.errcode&&(t.$refs["groupTree"].remove(e),t.$message.success("删除组织成功！"))}))})).catch((function(){t.$message.info("已取消删除")}))},loadData:function(e,t){var a=this;0!=e.level&&(this.load=!0,Object(l["h"])({fid:e.key}).then((function(e){if(1===e.ret.errcode){var r=e.groupPb||[];r.length&&r.map((function(e){e.children=[],e.roleIds=e.roleSimplePb.map((function(e){return e.roleId}))})),t(r)}a.load=!1})).catch((function(e){console.error(e),a.load=!1})))}}},oe=ie,se=(a("7cea"),Object(g["a"])(oe,H,Q,!1,null,null,null)),le=se.exports,ce={components:{roleManage:Y,userManage:k,systemManage:le},data:function(){return{currentView:"userManage"}}},ue=ce,pe=Object(g["a"])(ue,r,n,!1,null,"37dc53f8",null);t["default"]=pe.exports},"7cea":function(e,t,a){"use strict";var r=a("c78d"),n=a.n(r);n.a},"985e":function(e,t,a){},c78d:function(e,t,a){},f25b:function(e,t,a){"use strict";var r=a("985e"),n=a.n(r);n.a}}]);