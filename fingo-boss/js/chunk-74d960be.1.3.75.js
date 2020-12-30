(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-74d960be"],{9063:function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return i})),n.d(t,"d",(function(){return l})),n.d(t,"c",(function(){return o}));var a=n("284b");function r(e){console.log(e);var t=a["a"].create("FreightTemplateListPageReq",e);return Object(a["a"])("product","FreightTemplateService.FreightTemplateListPage",t,"freight.FreightTemplateListPageResp")}function i(e){console.log(e);var t=a["a"].create("FreightTemplateAddReq",e);return Object(a["a"])("product","FreightTemplateService.FreightTemplateAdd",t,"freight.FreightTemplateAddResp")}function l(e){console.log(e);var t=a["a"].create("FreightTemplateUpdateReq",e);return Object(a["a"])("product","FreightTemplateService.FreightTemplateUpdate",t,"freight.FreightTemplateUpdateResp")}function o(e){console.log(e);var t=a["a"].create("FreightTemplateGetReq",e);return Object(a["a"])("product","FreightTemplateService.FreightTemplateGet",t,"freight.FreightTemplateGetResp")}},a246:function(e,t,n){"use strict";var a=n("d362"),r=n.n(a);r.a},d362:function(e,t,n){},d7e3:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-form",{attrs:{inline:""}},[n("el-form-item",{attrs:{label:"国家："}},[n("el-select",{attrs:{filterable:"",clearable:""},on:{change:function(t){return e.getList(1)}},model:{value:e.param.countryCode,callback:function(t){e.$set(e.param,"countryCode",t)},expression:"param.countryCode"}},e._l(e.countryList,(function(e){return n("el-option",{key:e.shortCode,attrs:{label:e.nameLocal,value:e.shortCode}})})),1)],1),n("el-form-item",{staticClass:"filter-item",staticStyle:{"margin-left":"20px"}},[e.hasPermission("BTN_FREIGHT_TEMPLATE_ADD")?n("el-button",{attrs:{size:"medium",type:"primary",icon:"el-icon-circle-plus"},on:{click:function(t){return e.clickAddTemplate()}}},[e._v("新增")]):e._e()],1),n("el-form-item",[e.hasPermission("BTN_FREIGHT_TEMPLATE_BATCH_DELETE")?n("el-button",{attrs:{size:"medium",type:"danger",icon:"el-icon-delete"},on:{click:e.clickMultipleDelete}},[e._v("批量删除")]):e._e()],1)],1),n("div",{staticClass:"main-content-wrapper"},[n("el-table",{ref:"multipleTable",attrs:{data:e.currentTemplates,border:""},on:{"selection-change":e.handleSelectionChange}},[n("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-form",{staticClass:"table-expand",attrs:{"label-position":"right",inline:""}},[n("el-form-item",{staticStyle:{width:"100%"},attrs:{label:"标题："}},[n("span",[e._v(e._s(t.row.templateName))])]),n("el-form-item",{attrs:{label:"运送方式："}},[n("span",[e._v("快递")])]),n("el-form-item",{attrs:{label:"计价方式："}},[n("span",[e._v(e._s(1==t.row.templateType?"按重计费":"按件计费"))])]),n("el-form-item",{attrs:{label:"首(单位)："}},[n("span",[e._v(e._s(t.row.firstAmount))])]),n("el-form-item",{attrs:{label:"运费(元)："}},[n("span",[e._v(e._s(e._f("divideFilter")(t.row.firstPrice)))])]),n("el-form-item",{attrs:{label:"续(单位)："}},[n("span",[e._v(e._s(t.row.continueAmount))])]),n("el-form-item",{attrs:{label:"续费(元)："}},[n("span",[e._v(e._s(e._f("divideFilter")(t.row.continuePrice)))])])],1)]}}])}),n("el-table-column",{attrs:{type:"selection",width:"55"}}),n("el-table-column",{attrs:{label:"标题","min-width":"50%",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.templateName))])]}}])}),n("el-table-column",{attrs:{label:"操作","min-width":"30%",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasPermission("BTN_FREIGHT_TEMPLATE_EDIT")?n("el-button",{attrs:{plain:"",type:"primary",size:"mini"},on:{click:function(n){return e.clickEditTemplate(t.$index,t.row)}}},[e._v("编辑")]):e._e(),e.hasPermission("BTN_FREIGHT_TEMPLATE_DELETE")?n("el-button",{attrs:{plain:"",size:"mini",type:"danger"},on:{click:function(n){return e.clickDeleteTemplate(t.$index,t.row)}}},[e._v("删除")]):e._e()]}}])})],1)],1),n("div",{staticClass:"pagination-box"},[n("el-pagination",{attrs:{"current-page":e.param.page.pageNum,"page-sizes":[5,10,20,50],"page-size":e.param.page.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.totals},on:{"size-change":e.handleSizeChange,"current-change":e.getList}})],1)],1)},r=[],i=(n("ac6a"),n("ac4d"),n("8a81"),n("5df3"),n("1c4c"),n("7f7f"),n("6b54"),n("9063"));function l(e,t){var n;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=o(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var a=0,r=function(){};return{s:r,n:function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,l=!0,c=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return l=e.done,e},e:function(e){c=!0,i=e},f:function(){try{l||null==n.return||n.return()}finally{if(c)throw i}}}}function o(e,t){if(e){if("string"===typeof e)return c(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(e,t):void 0}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}var s={data:function(){return{multipleSelection:[],dataListId:[],currentTemplates:[],totals:0,param:{countryCode:"",page:{pageNum:1,pageSize:10,pagingSwitch:!0}}}},watch:{multipleSelection:function(){var e=[];for(var t in this.multipleSelection)e.push(this.multipleSelection[t].templateId);this.dataListId=e}},computed:{countryList:function(){return this.$store.state.dict.countryList}},created:function(){this.getList()},methods:{handleSizeChange:function(e){this.param.page.pageSize=e,this.getList()},getList:function(e){var t=this;this.param.page.pageNum=e||this.param.page.pageNum,Object(i["b"])(this.filterData(this.param)).then((function(e){1===e.ret.errcode&&(t.currentTemplates=e.freightTemplateUnit,t.totals=e.total)}))},clickAddTemplate:function(){this.$router.push({name:"freightEdit"})},clickEditTemplate:function(e,t){this.$router.push({name:"freightEdit",query:{freightId:t.templateId}})},clickDeleteTemplate:function(e,t){var n=this;this.$confirm("此操作将永久删除改模版, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){})).catch((function(){n.$message({type:"info",message:"已取消删除"})}))},clickMultipleDelete:function(){var e=this;if(0!==this.dataListId.length){var t,n="",a=l(this.dataListId);try{for(a.s();!(t=a.n()).done;){var r=t.value;n+=r+"|"}}catch(i){a.e(i)}finally{a.f()}n=n.substr(0,n.length-1),this.$confirm("此操作将永久删除所选模版, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){})).catch((function(){e.$message({type:"info",message:"已取消删除"})}))}else this.$message("请先勾选您需操作的商品")},handleSelectionChange:function(e){this.multipleSelection=e}}},u=s,p=(n("a246"),n("2877")),m=Object(p["a"])(u,a,r,!1,null,null,null);t["default"]=m.exports}}]);