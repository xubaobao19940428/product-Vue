(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-849783c6"],{"23c8":function(e,t,r){"use strict";var a=r("fa05"),n=r.n(a);n.a},"70f7":function(e,t,r){"use strict";t["a"]={data:function(){return{list:[],page:1,pageSize:20,total:0}},methods:{handleSizeChange:function(e){this.pageSize=e,this.getList()},handleCurrentChange:function(e){this.page=e,this.getList()}}}},e2dd:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app-container"},[r("div",{staticClass:"filter-container"},[r("el-form",{ref:"afterSaleOrderFilter",attrs:{inline:"","label-width":"100px",model:e.queryData}},[r("el-form-item",{staticClass:"filter-item",attrs:{label:"订单号：",prop:"orderId"}},[r("el-input",{staticStyle:{width:"200px"},attrs:{clearable:"",placeholder:"请输入订单号",size:"medium"},model:{value:e.queryData.orderId,callback:function(t){e.$set(e.queryData,"orderId",t)},expression:"queryData.orderId"}})],1),r("span",{directives:[{name:"show",rawName:"v-show",value:e.drop,expression:"drop"}]},[r("el-form-item",{staticClass:"filter-item",attrs:{label:"商品名称：",prop:"productName"}},[r("el-input",{attrs:{clearable:"",placeholder:"请输入商品名称",size:"medium"},model:{value:e.queryData.productName,callback:function(t){e.$set(e.queryData,"productName",t)},expression:"queryData.productName"}})],1),r("el-form-item",{staticClass:"filter-item",attrs:{label:"买家手机号：",prop:"userPhone"}},[r("el-input",{attrs:{clearable:"",placeholder:"请输入买家手机号",size:"medium"},model:{value:e.queryData.userPhone,callback:function(t){e.$set(e.queryData,"userPhone",t)},expression:"queryData.userPhone"}})],1),r("el-form-item",{staticClass:"filter-item",attrs:{label:"收货人手机号：",prop:"receiverPhone"}},[r("el-input",{attrs:{clearable:"",placeholder:"请输入收货人手机号",size:"medium"},model:{value:e.queryData.receiverPhone,callback:function(t){e.$set(e.queryData,"receiverPhone",t)},expression:"queryData.receiverPhone"}})],1),r("el-form-item",{staticClass:"filter-item",attrs:{label:"上级手机号：",prop:"prarentPhone"}},[r("el-input",{attrs:{clearable:"",placeholder:"请输入上级手机号",size:"medium"},model:{value:e.queryData.prarentPhone,callback:function(t){e.$set(e.queryData,"prarentPhone",t)},expression:"queryData.prarentPhone"}})],1),r("el-form-item",{staticClass:"filter-item",attrs:{label:"订单状态：",prop:"afterStatus"}},[r("el-select",{attrs:{clearable:"",size:"medium"},model:{value:e.queryData.afterStatus,callback:function(t){e.$set(e.queryData,"afterStatus",t)},expression:"queryData.afterStatus"}},e._l(e.afterStatusList,(function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1)],1),r("el-form-item",{staticClass:"filter-item",attrs:{label:"售后时间：",prop:"timeList"}},[r("el-date-picker",{attrs:{"value-format":"timestamp",type:"daterange","start-placeholder":"开始日期","end-placeholder":"结束日期","default-time":["00:00:00","23:59:59"]},model:{value:e.timeList,callback:function(t){e.timeList=t},expression:"timeList"}})],1),r("el-form-item",{staticClass:"filter-item",staticStyle:{"margin-left":"20px"}},[r("el-button",{attrs:{icon:"el-icon-search",type:"primary",size:"medium"},on:{click:e.search}},[e._v("搜索")]),r("el-button",{attrs:{icon:"el-icon-refresh-left",size:"medium"},on:{click:e.resetSearch}},[e._v("重置")]),e.hasPermission("BTN_AFTER_SALE_ORDER_EXPORT")?r("el-button",{attrs:{icon:"el-icon-download",plain:"",type:"primary",size:"medium"},on:{click:e.clickToExportOrder}},[e._v("导出")]):e._e(),r("el-link",{staticStyle:{"margin-left":"20px"},attrs:{type:"primary",underline:!1},on:{click:e.dropDown}},[e._v("\n                    "+e._s(e.dropDownContent)+"\n                    "),r("i",{class:e.dropDownIcon})])],1)],1)],1),r("div",{staticClass:"main-content-wrapper"},[r("el-table",{attrs:{data:e.orderList,height:"100%",border:""}},[r("el-table-column",{attrs:{fixed:"left",label:"售后单号",align:"center",prop:"afterId",width:"180px"}}),r("el-table-column",{attrs:{fixed:"left",label:"订单号",align:"center",prop:"orderId",width:"180px"}}),r("el-table-column",{attrs:{label:"商品信息",align:"center","min-width":"350px"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.productItem,(function(a,n){return r("div",{key:n,staticClass:"flex flex-item--center after-order-item"},[r("el-popover",{attrs:{placement:"top-start",trigger:"hover"}},[r("img",{staticClass:"previewImage",attrs:{src:e.dealShowFileSrc(a.skuCover)}}),r("img",{staticClass:"image-box thumbnail",attrs:{slot:"reference",src:e.dealShowFileSrc(a.skuCover)},slot:"reference"})]),r("div",{staticClass:"block-right"},[r("div",{staticClass:"pointer"},[r("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:a.productName,placement:"top"}},[r("span",{staticStyle:{display:"-webkit-box",overflow:"hidden","white-space":"normal !important","text-overflow":"ellipsis","word-wrap":"break-word","-webkit-line-clamp":"1","-webkit-box-orient":"vertical"}},[e._v("\n                                        名称："+e._s(a.productName||"-")+"\n                                    ")])])],1),r("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:a.attr.toString(),placement:"top"}},[r("span",{staticStyle:{display:"-webkit-box",overflow:"hidden","white-space":"normal !important","text-overflow":"ellipsis","word-wrap":"break-word","-webkit-line-clamp":"1","-webkit-box-orient":"vertical"}},[e._v("\n                                    规格："+e._s(a.attr.toString()||"-")+"\n                                ")])]),r("div",[e._v("数量："+e._s(a.num))]),r("div",[e._v("实际金额："+e._s(t.row.currency)+" "+e._s(a.paied))]),r("div",[e._v("下单时间："+e._s(e._f("secondTimeFormat")(a.orderTime)))])],1)],1)}))}}])}),r("el-table-column",{attrs:{label:"商品状态",prop:"",align:"center","min-width":"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.isReceived?r("span",[e._v("已收货")]):r("span",[e._v("未收货")])]}}])}),r("el-table-column",{attrs:{label:"退款信息","min-width":"240px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("div",[e._v("预计退款金额："+e._s(t.row.currency)+" "+e._s(t.row.refundInfo.applyRefund))]),r("div",[e._v("应退款金额："+e._s(t.row.currency)+" "+e._s(t.row.refundInfo.finalRefund))]),r("div",[e._v("应退运费："+e._s(t.row.currency)+" "+e._s(t.row.freight||"-"))]),r("div",[e._v("退款理由："+e._s(t.row.refundInfo.reason||"-"))]),r("div",[e._v("退款描述："+e._s(t.row.refundInfo.remark||"-"))])]}}])}),r("el-table-column",{attrs:{label:"退款方式",align:"center","min-width":"100px"},scopedSlots:e._u([{key:"default",fn:function(t){return[0===t.row.refundType?r("span",[e._v("退到银行卡")]):e._e(),1===t.row.refundType?r("span",[e._v("退到积分")]):e._e()]}}])}),r("el-table-column",{attrs:{label:"用户凭证",align:"center","min-width":"100px"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.pictures,(function(a,n){return 0==n?r("div",{key:n,staticClass:"list-img-box",on:{click:function(r){return e.previewImg(t.row.pictures,0)}}},[r("img",{attrs:{src:e.dealShowFileSrc(a)}}),r("span",[e._v(e._s(t.row.pictures.length))])]):e._e()}))}}])}),r("el-table-column",{attrs:{label:"银行信息","min-width":"360px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("div",[e._v("用户名： "+e._s(t.row.bankInfo.cardholder||"-"))]),r("div",[e._v("银行卡号： "+e._s(t.row.bankInfo.cardNo||"-"))]),r("div",[e._v("银行名称： "+e._s(t.row.bankInfo.bankName||"-"))])]}}])}),r("el-table-column",{attrs:{label:"用户Id",align:"center","min-width":"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("div",{staticClass:"pointer"},[e._v("\n                        "+e._s(t.row.userId)+"\n                    ")])]}}])}),r("el-table-column",{attrs:{label:"物流单号",prop:"expressNo",align:"center","min-width":"100px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                    "+e._s(t.row.expressNo||"-")+"\n                ")]}}])}),r("el-table-column",{attrs:{label:"状态","min-width":"100px",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[0===t.row.afterStatus?r("span",[e._v("审核中")]):e._e(),1===t.row.afterStatus?r("span",[e._v("审核通过")]):e._e(),2===t.row.afterStatus?r("span",[e._v("售后成功")]):e._e(),3===t.row.afterStatus?r("span",[e._v("售后关闭(用户取消)")]):e._e(),4===t.row.afterStatus?r("span",[e._v("售后驳回(拒绝)")]):e._e(),5===t.row.afterStatus?r("span",[e._v("售后失败(信息有误，重新填写)")]):e._e(),-1===t.row.afterStatus?r("span",[e._v("没有售后")]):e._e()]}}])}),r("el-table-column",{attrs:{label:"售后发起时间",prop:"applyTime",align:"center","min-width":"160px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("div",[e._v(" "+e._s(e._f("secondTimeFormat")(t.row.applyTime)))])]}}])}),r("el-table-column",{attrs:{fixed:"right",label:"操作",align:"center",width:"150px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("div",[t.row.afterStatus<1&&e.hasPermission("BTN_AFTER_SALE_ORDER_REFUND_REFUSED")?r("el-button",{attrs:{plain:"",type:"primary",size:"mini"},on:{click:function(r){return e.clickToRefusedOrder(t.row)}}},[e._v("拒绝售后")]):e._e()],1),r("div",{staticStyle:{"margin-top":"5px"}},[t.row.afterStatus<2&&e.hasPermission("BTN_AFTER_SALE_ORDER_REFUND_COMPLETED")?r("el-button",{attrs:{plain:"",type:"primary",size:"mini"},on:{click:function(r){return e.showRefund(t.row)}}},[e._v("完成退款")]):e._e()],1),r("div",{staticStyle:{"margin-top":"5px"}},[t.row.afterStatus<1&&e.hasPermission("BTN_AFTER_SALE_ORDER_REFUND_FAIL")?r("el-button",{attrs:{plain:"",type:"primary",size:"mini"},on:{click:function(r){return e.clickToRejectRefund(t.row)}}},[e._v("退款失败")]):e._e()],1)]}}])})],1)],1),r("div",{staticClass:"page-wrapper"},[r("el-pagination",{attrs:{"current-page":e.queryData.page.pageNum,"page-sizes":[10,20,30,50],"page-size":e.queryData.page.pageSize,layout:"total, sizes, prev, pager, next",total:e.totals},on:{"size-change":e.handleSizeChanges,"current-change":e.handleCurrentChanges}})],1),r("image-preview",{directives:[{name:"show",rawName:"v-show",value:e.image.show,expression:"image.show"}],attrs:{close:e.closePreview,index:e.image.index,list:e.image.list}}),r("el-dialog",{attrs:{title:e.title,visible:e.show,width:"700px"},on:{"update:visible":function(t){e.show=t},close:function(t){e.show=!1}}},[r("el-form",{ref:"Refund",attrs:{"label-width":"110px",model:e.param,rules:e.rules}},[r("el-form-item",{attrs:{label:"预计退款金额："}},[e._v("\n                "+e._s(e.applyRefund)+"\n            ")]),r("el-form-item",{attrs:{label:"退款金额：",prop:"amount"}},[r("el-input-number",{attrs:{clearable:"",min:0,controls:!1,size:"medium"},model:{value:e.param.amount,callback:function(t){e.$set(e.param,"amount",t)},expression:"param.amount"}})],1)],1),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.clickToResolveRefund}},[e._v("确认")]),r("el-button",{attrs:{size:"small"},on:{click:function(t){e.show=!1,e.param.amount=0}}},[e._v("取 消")])],1)])],1)],1)},n=[],i=(r("c5f6"),r("96cf"),r("3b8d")),s=r("70f7"),o=r("c229"),l=r("98a9"),c=(r("ed08"),{name:"orderList",components:{imagePreview:o["a"]},mixins:[s["a"]],extends:{},props:{},data:function(){return{drop:!1,dropDownContent:"展开",dropDownIcon:"el-icon-arrow-down",title:"退款方式",show:!1,orderList:[],queryData:{orderId:"",productName:"",userPhone:"",receiverPhone:"",prarentPhone:"",afterStatus:null,timeList:[],startTime:"",endTime:"",page:{pageNum:1,pageSize:20}},totals:0,afterStatusList:[{label:"审核中",value:0},{label:"审核通过",value:1},{label:"售后成功",value:2},{label:"售后关闭(用户取消)",value:3},{label:"售后驳回(拒绝)",value:4},{label:"售后失败(信息有误，重新填写)",value:5},{label:"售后驳回(拒绝)",value:-1}],statusList:{REFUND_SUCCESS:"退款成功",REFUND_FAIL:"退款失败",REFUND_CANCEL:"取消退款",APPLY_REJECTED:"申请驳回",WAIT_REFUND:"退款中"},paywayList:{ARTIFICIAL_MONEY:"人工打款",INTEGRAL:"积分支付"},orderDetail:{},saleOrderDialogVisible:!1,timeList:[],image:{show:!1,index:0,list:[]},param:{},afterId:"",applyRefund:"",rules:{amount:[{required:!0,message:"请输入退款金额",trigger:"blur"}]}}},computed:{lastPartMonth:function(){return this.$store.state.globalNum.lastPartMonth},nowEnd:function(){return this.$store.state.globalNum.nowEnd}},directives:{},filters:{},created:function(){this.timeList=[this.lastPartMonth,this.nowEnd],this.getAfterSaleOrderList()},methods:{dropDown:function(){this.drop?(this.dropDownContent="展开",this.dropDownIcon="el-icon-arrow-down"):(this.dropDownContent="收起",this.dropDownIcon="el-icon-arrow-up"),this.drop=!this.drop},getAfterSaleOrderList:function(){var e=this,t=this.queryData;Object(l["u"])(this.filterData(t)).then((function(t){1===t.ret.errcode&&(e.totals=t.total,e.orderList=t.afterItem)})).catch((function(e){console.log(e)}))},handleSizeChanges:function(e){this.queryData.page.pageSize=e,this.getAfterSaleOrderList()},handleCurrentChanges:function(e){this.queryData.page.pageNum=e,this.getAfterSaleOrderList()},search:function(){this.queryData.page.pageNum=1,this.queryData.page.pageSize=10,this.getAfterSaleOrderList()},showRefund:function(e){this.title="退款",this.orderId=e.orderId,this.afterId=e.afterId,this.applyRefund=e.refundInfo.applyRefund,Object.assign(this.param,{refundApplyCode:e.refundApplyCode,refundAmount:e.actualPayment,refundContent:e.refundReason,refundPayWay:e.refundWay}),this.show=!0},closePreview:function(){this.image.index=0,this.image.show=!1},previewImg:function(e,t){this.image.list=e,this.image.index=t,this.image.show=!0},resetSearch:function(){this.$refs.afterSaleOrderFilter.resetFields(),this.queryData.page.pageNum=1,this.queryData.page.pageSize=20,this.timeList=[],this.getAfterSaleOrderList()},clickToExportOrder:function(){if(this.timeList&&2===this.timeList.length){var e={id:this.queryData.orderId,startTime:this.timeList[0],endTime:this.timeList[1],page:this.queryData.page};console.log(e),Object(l["a"])(e).then((function(e){1===e.ret.errcode&&window.open("".concat(e.url))}))}else this.$message({type:"warning",message:"请选择导出日期范围"})},clickToRefusedOrder:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var r,a,n=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:r=t.orderId,a=t.afterId,this.$confirm("确认拒绝售后?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,n.handlerAfterRequest(r,a,2);case 2:case"end":return e.stop()}}),e)}))));case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),clickToRejectOrder:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var r,a=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:r=t.afterId,this.$confirm("确认驳回售后?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,a.handlerAfterRequest(r,3);case 2:case"end":return e.stop()}}),e)}))));case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),clickToResolveRefund:function(){var e=this;this.$refs["Refund"].validate((function(t){if(!t)return!1;Number(e.param.amount)>Number(e.applyRefund)?e.$message.warning("退款金额不能大于总金额！"):e.handlerAfterRequest(e.orderId,e.afterId,0,e.param.amount+"")}))},clickToRejectRefund:function(e){var t=this,r=e.orderId,a=e.afterId;this.$confirm("确认退款失败?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.handlerAfterRequest(r,a,1);case 2:case"end":return e.stop()}}),e)}))))},handlerAfterRequest:function(e,t,r,a){var n=this,i={orderId:e,afterId:t,handlerType:r,amount:a};Object(l["n"])(this.filterData(i)).then((function(e){1===e.ret.errcode&&(n.$message.success("操作成功！"),n.show=!1,n.getAfterSaleOrderList())})).catch((function(e){console.log(e)}))}}}),u=c,d=(r("23c8"),r("2877")),p=Object(d["a"])(u,a,n,!1,null,"49a43ad8",null);t["default"]=p.exports},fa05:function(e,t,r){}}]);