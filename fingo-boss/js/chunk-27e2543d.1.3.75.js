(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-27e2543d"],{"3c69":function(e,t,a){},"554f":function(e,t,a){"use strict";var l=a("c188"),i=a.n(l);i.a},"73c5":function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"sales-filter-container"},[a("el-form",{ref:"salesFilterForm",attrs:{inline:"","label-width":"90px",model:e.queryData}},[a("el-form-item",{staticClass:"filter-item",attrs:{label:"商品：",prop:"value"}},[a("el-input",{staticClass:"input-with-select",attrs:{placeholder:"请输入",size:"medium",clearable:""},model:{value:e.queryData.value,callback:function(t){e.$set(e.queryData,"value",t)},expression:"queryData.value"}},[a("el-select",{attrs:{slot:"prepend",clearable:"",placeholder:"请选择"},slot:"prepend",model:{value:e.queryData.type,callback:function(t){e.$set(e.queryData,"type",t)},expression:"queryData.type"}},e._l(e.typeList,(function(e,t){return a("el-option",{key:t,attrs:{label:e.name,value:e.code}})})),1)],1)],1),a("el-form-item",{staticClass:"filter-item",attrs:{label:"增长倍数：",prop:"multiple"}},[a("el-input",{staticClass:"input-with-select",attrs:{placeholder:"请输入倍数值",size:"medium",clearable:""},model:{value:e.queryData.multiple,callback:function(t){e.$set(e.queryData,"multiple",t)},expression:"queryData.multiple"}},[a("el-select",{attrs:{slot:"prepend",clearable:"",placeholder:"请选择"},slot:"prepend",model:{value:e.queryData.multipleType,callback:function(t){e.$set(e.queryData,"multipleType",t)},expression:"queryData.multipleType"}},e._l(e.multipleTypeList,(function(e,t){return a("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1)],1),a("el-form-item",{staticClass:"filter-item",staticStyle:{"margin-left":"20px"}},[a("el-button",{attrs:{icon:"el-icon-search",type:"primary",size:"medium"},on:{click:e.search},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}}},[e._v("搜索")]),a("el-button",{attrs:{icon:"el-icon-refresh-left",size:"medium"},on:{click:e.resetSearch}},[e._v("重置")])],1)],1),a("div",{staticClass:"operation"})],1),a("div",{staticClass:"main-content-wrapper"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{border:"",height:"100%",data:e.dataList}},[a("el-table-column",{attrs:{prop:"productId",label:"商品ID",align:"center","min-width":"80px"}}),a("el-table-column",{attrs:{prop:"cover",label:"商品信息",align:"center","min-width":"180px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"flex flex-item--center"},[a("el-popover",{attrs:{placement:"top-start",trigger:"hover"}},[a("img",{staticClass:"previewImage",attrs:{src:e.dealShowFileSrc(t.row.cover)}}),a("img",{staticClass:"image-box",attrs:{slot:"reference",src:e.dealShowFileSrc(t.row.cover)},slot:"reference"})]),a("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:t.row.title,placement:"top"}},[a("span",{staticClass:"block-right",staticStyle:{display:"-webkit-box",overflow:"hidden","white-space":"normal !important","text-overflow":"ellipsis","word-wrap":"break-word","-webkit-line-clamp":"3","-webkit-box-orient":"vertical"}},[e._v("\n                                "+e._s(t.row.title)+"\n                            ")])])],1)]}}])}),a("el-table-column",{attrs:{prop:"growthStatus",label:"增长状态",align:"center","min-width":"100px"},scopedSlots:e._u([{key:"default",fn:function(t){return[1===t.row.growthStatus?a("el-tag",{attrs:{type:"danger",size:"mini"}},[e._v("增长中")]):e._e(),2===t.row.growthStatus?a("el-tag",{attrs:{type:"info",size:"mini"}},[e._v("停止")]):e._e()]}}])}),a("el-table-column",{attrs:{prop:"multiple",label:"增长倍数",align:"center",width:"270px"},scopedSlots:e._u([{key:"default",fn:function(t){var l=t.row;return[l.edit?[a("el-input-number",{attrs:{size:"mini",min:0,max:99999},model:{value:l.multiple,callback:function(t){e.$set(l,"multiple",t)},expression:"row.multiple"}}),a("el-button",{staticClass:"cancel-btn",attrs:{size:"small",type:"text"},on:{click:function(t){return e.cancelEdit(l)}}},[e._v("\n                          取消\n                        ")])]:a("span",[e._v(e._s(l.multiple))])]}}])}),a("el-table-column",{attrs:{prop:"grandTotal",label:"累计增长销量",align:"center",width:"170px"}}),a("el-table-column",{attrs:{fixed:"right",label:"操作",align:"center",width:"130px"},scopedSlots:e._u([{key:"default",fn:function(t){var l=t.row;return[l.edit&&e.hasPermission("BTN_SALES_MANAGE_EDIT_SAVE")?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(t){return e.confirmEdit(l)}}},[e._v("\n                        保存\n                    ")]):a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(e){l.edit=!l.edit}}},[e._v("\n                        编辑\n                    ")])]}}])})],1)],1),a("div",{staticClass:"pagination-box"},[a("el-pagination",{staticClass:"pagination",attrs:{"page-sizes":[10,20,50,100],"current-page":e.queryData.page.pageNum,"page-size":e.queryData.page.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"current-change":e.handleCurrentChange,"size-change":e.handleSizeChange}})],1)])},i=[],n=(a("ac6a"),a("2ef0")),r=a.n(n),s=a("284b");function o(e){console.log(e);var t=s["a"].create("GetProductSalesReq",e);return Object(s["a"])("product","SalesService.GetProductSales",t,"sales.GetProductSalesResp")}function c(e){console.log(e);var t=s["a"].create("SetProductSalesConfigReq",e);return Object(s["a"])("product","SalesService.SetProductSalesConfig",t,"sales.SetProductSalesConfigResp")}var u={name:"SalesManage",data:function(){return{loading:!1,total:0,queryData:{type:"",value:"",multipleType:null,multiple:null,page:{pageNum:1,pageSize:20}},typeList:[{name:"商品id",code:"1"},{name:"skuId",code:"2"},{name:"skuCode",code:"3"},{name:"商品名称",code:"4"}],multipleTypeList:[{label:"=",value:1},{label:">",value:2},{label:"<",value:3}],dataList:[{productId:"123",productName:"dddd",cover:"",growthStatus:"增长中",multiple:12,originalMultiple:12,grandTotal:1233,edit:!1}]}},components:{},computed:{},mounted:function(){this.getSalesManageList()},methods:{search:function(){this.getSalesManageList()},resetSearch:function(){this.$refs.salesFilterForm.resetFields(),this.queryData.type="",this.queryData.multipleType=null,this.getSalesManageList()},handleCurrentChange:function(e){this.queryData.page.pageNum=e||this.queryData.page.pageNum,this.getSalesManageList()},handleSizeChange:function(e){this.queryData.page.pageSize=e,this.getSalesManageList()},getSalesManageList:function(){var e=this;this.loading=!0;var t={};switch(this.queryData.type){case"1":t.productId=this.queryData.value;break;case"2":t.attrId=this.queryData.value;break;case"3":t.skuCode=this.queryData.value;break;case"4":t.title=this.queryData.value;break;default:break}t.multipleType=this.queryData.multipleType,t.multiple=this.queryData.multiple,t.page=this.queryData.page,o(this.filterData(t)).then((function(t){if(e.loading=!1,1===t.ret.errcode){var a=t.sales;r.a.forEach(a,(function(e){e.edit=!1,e.originalMultiple=e.multiple})),e.dataList=a,e.total=t.total}console.log(t)})).catch((function(t){console.log(t),e.loading=!1}))},cancelEdit:function(e){console.log(e),e.multiple=e.originalMultiple,e.edit=!1},confirmEdit:function(e){var t=this;e.edit=!1,e.originalMultiple=e.multiple;var a=e;c(a).then((function(e){console.log(e),1===e.ret.errcode&&(t.$message.success("修改成功"),t.getSalesManageList())})).catch((function(e){console.log(e)}))}}},p=u,d=(a("85cd"),a("554f"),a("2877")),m=Object(d["a"])(p,l,i,!1,null,"a2cdf6ac",null);t["default"]=m.exports},"85cd":function(e,t,a){"use strict";var l=a("3c69"),i=a.n(l);i.a},c188:function(e,t,a){}}]);