(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-97c16878"],{"339f":function(a,e,t){"use strict";t.r(e);var i=function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("div",{staticClass:"app-container label-set-wrapper"},[t("el-form",[t("el-form-item",[a.hasPermission("BTN_LABEL_SET_ADD")?t("el-button",{staticClass:"operator-item",attrs:{icon:"el-icon-plus",type:"primary",size:"small"},on:{click:function(e){return a.addLabel(0,1)}}},[a._v("新建一级标签\n            ")]):a._e()],1)],1),t("div",{staticClass:"main-content-wrapper"},[t("el-tree",{ref:"treeNode",attrs:{data:a.labelList,"node-key":"id",lazy:"","expand-on-click-node":!0,load:a.getSubTab,props:{label:"tagName",children:"subTags"}},scopedSlots:a._u([{key:"default",fn:function(e){var i=e.node,s=e.data;return t("div",{staticClass:"custom-tree-node"},[t("div",[a._v(a._s(s.tagName))]),0==s.status?t("div",[t("span",{staticClass:"mar-r-10"},[a._v("失效")]),t("i",{staticClass:"el-icon-warning warning"})]):t("div",[t("span",{staticClass:"mar-r-10"},[a._v("生效")]),t("i",{staticClass:"el-icon-success security"})]),t("div",{staticClass:"mar-l-10"},[1==i.level&&a.hasPermission("BTN_LABEL_SET_ADD_SUB")?t("el-button",{attrs:{plain:"",size:"mini"},on:{click:function(e){return e.stopPropagation(),a.addLabel(s.id,2,i)}}},[a._v("新建二级标签\n                    ")]):a._e(),2==i.level&&a.hasPermission("BTN_LABEL_SET_LOOK_MEMBER")?t("el-button",{attrs:{plain:"",size:"mini"},on:{click:function(e){return e.stopPropagation(),a.lookMember(s)}}},[a._v("查看处理小组成员\n                    ")]):a._e(),a.hasPermission("BTN_LABEL_SET_EDIT")?t("el-button",{attrs:{plain:"",size:"mini",type:"primary"},on:{click:function(e){return e.stopPropagation(),a.updateLabel(s,i)}}},[a._v("编辑\n                    ")]):a._e(),a.hasPermission("BTN_LABEL_SET_STATUS")?t("el-button",{attrs:{plain:"",size:"mini",type:0==s.status?"success":"info"},on:{click:function(e){return e.stopPropagation(),a.updateLabelStatus(s,i)}}},[a._v(a._s(0==s.status?"生效":"失效")+"\n                    ")]):a._e()],1)])}}])})],1),t("div",{staticClass:"pagination-box"},[t("el-pagination",{attrs:{"current-page":a.param.page.pageNum,"page-sizes":[5,10,20,50],"page-size":a.param.page.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:a.totals},on:{"size-change":a.handleSizeChange,"current-change":a.getList}})],1),t("el-dialog",{attrs:{title:a.addDialog.title,width:"500px",visible:a.addDialog.show},on:{close:function(e){a.addDialog.show=!1}}},[t("div",[t("el-form",{ref:"addDialog",attrs:{"label-position":"right","label-width":"110px","label-suffix":"：",rules:a.addDialog.rules,model:a.addDialog.param}},[t("el-form-item",{attrs:{label:"标签名称",prop:"tagName"}},[t("el-input",{attrs:{size:"medium",placeholder:"请输入标签名称"},model:{value:a.addDialog.param.tagName,callback:function(e){a.$set(a.addDialog.param,"tagName",e)},expression:"addDialog.param.tagName"}})],1),2==a.addDialog.param.tagLevel?t("el-form-item",{attrs:{label:"处理小组",prop:"superiorTagId"}},[t("el-select",{attrs:{placeholder:"请选择",size:"medium"},model:{value:a.addDialog.param.groupId,callback:function(e){a.$set(a.addDialog.param,"groupId",e)},expression:"addDialog.param.groupId"}},a._l(a.superiorTagList,(function(a,e){return t("el-option",{key:e,attrs:{label:a.groupName,value:a.id}})})),1)],1):a._e()],1)],1),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{attrs:{size:"small"},on:{click:function(e){a.addDialog.show=!1}}},[a._v("取 消")]),t("el-button",{attrs:{size:"small",type:"primary"},on:{click:a.confirm}},[a._v("确 定")])],1)]),t("el-dialog",{attrs:{title:"查看处理小组成员",width:"500px",visible:a.memberDialog.show},on:{close:function(e){a.memberDialog.show=!1}}},[t("div",[t("el-form",{attrs:{"label-position":"right","label-width":"100px","label-suffix":"："}},[t("el-form-item",{attrs:{label:"小组名称"}},[t("el-input",{attrs:{disabled:"",size:"medium"},model:{value:a.memberDialog.param.groupName,callback:function(e){a.$set(a.memberDialog.param,"groupName",e)},expression:"memberDialog.param.groupName"}})],1),t("el-form-item",{attrs:{label:"成员名称"}},a._l(a.memberDialog.param.managerUsers,(function(e,i){return t("el-tag",{key:i},[a._v(a._s(e.managerName))])})),1)],1)],1),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{attrs:{size:"small"},on:{click:function(e){a.memberDialog.show=!1}}},[a._v("取 消")]),t("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(e){a.memberDialog.show=!1}}},[a._v("确 定")])],1)])],1)},s=[],o=(t("7514"),t("6d47")),r={data:function(){return{labelList:[],totals:0,param:{tagLevel:1,page:{pageSize:10,pageNum:1,pagingSwitch:!0}},superiorTagList:[],memberDialog:{show:!1,param:{groupName:"",managerUsers:[]}},addDialog:{title:"",show:!1,type:"add",param:{id:null,groupId:null,tagName:"",superiorTagId:null,tagLevel:null},rules:{tagName:[{required:!0,message:"不能为空",trigger:"change"}],superiorTagId:[{required:!0,message:"请选择",trigger:"change"}]}}}},created:function(){this.getList(),this.getGroupData()},methods:{handleSizeChange:function(a){this.param.page.pageSize=a},getSubTab:function(a,e){0!=a.level&&this.getTagList({superiorTagId:a.key,level:a.level+1,resolve:e})},getTagList:function(a){var e=a.page,t=(a.pageSize,a.id),i=a.superiorTagId,s=a.level,r=a.resolve;Object(o["m"])(this.filterData({page:e,id:t,superiorTagId:i,tagLevel:s})).then((function(a){1===a.ret.errcode&&r(a.data,a)}))},getList:function(a){var e=this;this.param.page.pageNum=a||this.param.page.pageNum,this.getTagList({page:this.param.page,superiorTagId:0,level:1,resolve:function(a,t){e.labelList=a,e.totals=t.total}})},getGroupData:function(){var a=this;Object(o["l"])({page:1,pageSize:1e4,groupType:"2"}).then((function(e){1===e.ret.errcode&&(console.log(e.data),a.superiorTagList=e.data)}))},addLabel:function(a,e,t){switch(e){case 1:this.addDialog.title="新增一级标签";break;case 2:this.addDialog.title="新增二级标签",this.superiorTagList.length<=0&&this.getGroupData();break}Object.assign(this.addDialog.param,{id:null,groupId:null,tagName:"",superiorTagId:a,tagLevel:e}),this.addDialog.show=!0},updateLabel:function(a,e){switch(e.level){case 1:this.addDialog.title="编辑一级标签",this.addDialog.type="add";break;case 2:this.addDialog.title="编辑二级标签",this.addDialog.type="edit";break}Object.assign(this.addDialog.param,a),this.addDialog.show=!0},lookMember:function(a){var e=this.superiorTagList.find((function(e){return e.id==a.groupId}));e&&(this.memberDialog.param.groupName=e.groupName,this.memberDialog.param.managerUsers=e.managerUsers),this.memberDialog.show=!0},updateLabelStatus:function(a,e){var t=this;Object(o["d"])({id:a.id,status:0==a.status?1:0}).then((function(e){1===e.ret.errcode&&(a.status=0==a.status?1:0,t.getList(),t.$message.success("更改成功"))}))},confirm:function(){var a=this;this.$refs["addDialog"].validate((function(e){if(e){var t=o["c"];"edit"==a.addDialog.type&&(t=o["h"]),t(a.filterData(a.addDialog.param)).then((function(e){1===e.ret.errcode&&(a.addDialog.show=!1,a.getList(),a.$message.success("成功"))}))}}))}}},l=r,n=(t("e6c1"),t("2877")),g=Object(n["a"])(l,i,s,!1,null,"0507e1c2",null);e["default"]=g.exports},cec4:function(a,e,t){},e6c1:function(a,e,t){"use strict";var i=t("cec4"),s=t.n(i);s.a}}]);