<template>
    <div class="app-container app-puchase">
        <el-tabs v-model="tabActive" type="card" @tab-click="switchTab">
            <el-tab-pane v-for="(val, key) in tabTypeMap" :key="key" :label="val" :name="key"></el-tab-pane>
        </el-tabs>
        <div class="filter-container">
            <el-form ref="purchaseOrderFilter" inline :model="queryData">
                <el-form-item label="商品：" class="product" prop="value">
                    <el-input placeholder="请输入" size="medium" clearable v-model="queryData.value" class="input-with-select" @keyup.enter.native="search()">
                        <el-select v-model="queryData.choseType" slot="prepend" placeholder="请选择" >
                            <el-option v-for="(item, index) in productOptionList" :key="index" :label="item.name" :value="item.code" ></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="采购单号：">
                    <el-input v-model="queryData.purchaseOrderNo" clearable placeholder="请输入采购单号" size="medium" style="width: 230px" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="queryData.orderNo" placeholder="请输入订单号" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                 <el-form-item label="后台类目：" class="filter-item" prop="cateId">
                    <el-cascader  style="width: 300px"
                        clearable
                        filterable
                        :props="{label: 'cateName', children: 'levelValue', value: 'cateId', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true,emitPath:false}"
                        placeholder="请选择商品后台分组"
                        :options="backCategoryOptions"
                        v-model="queryData.cateId"
                        @change="setBackCateId"
                        class="normalOperatorBox"
                        size="medium">
                    </el-cascader>
                </el-form-item>
                <span v-show="drop">
                     <!-- <el-form-item label="采购员：">
                        <el-select v-model="queryData.buyerId" filterable clearable placeholder="请选择采购员" size="medium" @change="search()">
                            <el-option v-for="(item, index) in buyerList" :key="item.sysUserId" :label="item.nickName" :value="item.sysUserId"></el-option>
                        </el-select>
                     </el-form-item> -->
                    <el-form-item label="供应商：">
                        <el-select v-model="queryData.supplierId" filterable clearable remote reserve-keyword :remote-method="getSupplierList" placeholder="请输入供应商" @change="search()" v-el-select-loadmore="loadMore">
                            <el-option v-for="(item, index) in supplierLists" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物流单号：">
                        <el-input v-model="queryData.logiCode" placeholder="请输入物流单号" size="medium" @keyup.enter.native="search()"></el-input>
                    </el-form-item>
                    <el-form-item label="关联采购单号：">
                        <el-input placeholder="请输入关联采购单号" size="medium" @keyup.enter.native="search()" v-model="queryData.refPurchaseOrderNo" ></el-input>
                    </el-form-item>
                        <template v-if="tabActive === 'ALL' || tabActive ===  'SHORTAGE' || tabActive === 'CANCLE' || tabActive === 'WARNING'">
                            <el-form-item label="采购单状态：" class="filter-item" prop="purchaseOrderStatus">
                                <el-select v-model="queryData.purchaseOrderStatus" filterable clearable placeholder="请选择采购单状态" size="medium" @change="search()">
                                    <el-option v-for="(val, key) in purchaseOrderStatusMap" :key="key" :label="val" :value="key"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    <el-form-item label="采购单来源：">
                        <el-select v-model="queryData.type" filterable multiple clearable size="medium" @change="search()">
                            <el-option v-for="(val, key) in purchaseOrderSource" :key="key" :label="val" :value="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Fingo系统：">
                        <el-select v-model="queryData.isUseFingoSystem" filterable clearable size="medium" @change="search()">
                            <el-option v-for="(val, key) in FingoSystem" :key="key" :label="val" :value="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收货仓库：">
                        <el-select v-model="queryData.warehouseNo" clearable size="medium" placeholder="请选择仓库" @change="search()">
                            <el-option v-for="(val, key) in warehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发货方式：">
                        <el-select v-model="queryData.deliveWay" clearable placeholder="发货方式" size="medium" @change="search()">
                            <el-option v-for="item in deliveWayList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="自动采购状态：" v-if="tabActive === 'ALL' || tabActive === 'UN_PURCHASE' || tabActive === 'ALL_DELIVER'">
                        <el-select v-model="queryData.externalStatus" clearable placeholder="请选择" size="medium" @change="search()">
                            <el-option v-for="item in automaticProcurementList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="timeList" label="创建时间：">
                        <el-date-picker v-model="queryData.timeList"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        size="medium"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" size="medium" @click="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" size="medium" @click="resetSearch">重置</el-button>
                    <el-button icon="el-icon-aim" size="medium" @click="buttonLocation">定位</el-button>
                    <el-button  v-if="hasPermission('BTN_PURCHASE_ORDER_EXPORT_ADD')" icon="el-icon-plus" type="primary" size="medium" @click="showDialog('add')">
                        新增采购单
                    </el-button>
                    <el-button   v-if="hasPermission('BTN_PURCHASE_LIST_EXPORT')" :loading="exportLoading" icon="el-icon-download" type="primary" size="medium" @click="exportPurchaseOrder('yes')">
                        导出订单
                    </el-button>
                    <el-button   v-if="hasPermission('BTN_PURCHASE_LIST_EXPORT')" :loading="exportNoImgLoading" icon="el-icon-download" type="primary" size="medium" @click="exportPurchaseOrder('noImg')">
                        导出（不带图）
                    </el-button>
                    <el-button v-if="tabActive === 'HAS_PURCHASE' && hasPermission('BTN_PURCHASE_SHIP_EXPORT')" icon="el-icon-download" type="primary" size="medium" @click="exportShipOrder">
                        导出发货单
                    </el-button>
                    <el-upload v-if="tabActive === 'HAS_PURCHASE'" action="" multiple
                               :http-request="uploadFile" :show-file-list="false" style="display: inline; margin-left: 10px;">
                        <el-button
                            v-if="hasPermission('BTN__IMPORT_SHIPMENT_ORDER')"
                            icon="el-icon-upload"
                            :loading="uploadLoading"
                            :disable="uploadLoading"
                            type="primary"
                            size="medium">导入发货订单
                        </el-button>
                    </el-upload>
                    <el-button
                        v-if="hasPermission('BTN_IMPORT_COMFIRM_PURCHASE') && tabActive === 'UN_PURCHASE'"
                        @click="uploadClick"
                        icon="el-icon-upload"
                        type="primary"
                        size="medium">导入确认采购
                    </el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table v-loading="loading" :data="dataListNew"    height="100%" style="width: 100%; font-size: 12px" ref="table"
                      :row-key="getRowKeys"
                      :default-expand-all="true">
                <el-table-column fixed="left" prop="details" type="expand" stripe style="width: 100%" >
                    <template slot-scope="scope">
                        <el-table :data="scope.row.details"  style="width: 100%; font-size: 10px" :header-cell-style="{background:'#F9FAFD'}" >
                            <!-- <el-table-column type="expand" fixed="left"></el-table-column> -->
                            <el-table-column label="商品名称" width="170px" :show-overflow-tooltip="true" align="center" prop="productName" fixed="left"></el-table-column>
                            <el-table-column label="skuCode" align="center" prop="skuCode" width="120px"></el-table-column>
                            <el-table-column label="SKU图片" align="center" min-width="100px">
                                <template slot-scope="scope">
                                    <el-popover placement="top-start" trigger="hover">
                                        <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage">
                                        <img :src="dealShowFileSrc(scope.row.productCover)" class="thumbnail image-box" slot="reference">
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="SKU属性" prop="skuDesc" align="center" min-width="100px">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.skuDesc }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购单价" align="center" min-width="80px">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.purchasePrice || '-'}}</div>
                                </template>
                            </el-table-column>
<!--                            <el-table-column label="采购金额" min-width="80px" align="center">-->
<!--                                <template slot-scope="scope">-->
<!--                                    <div>{{ scope.row.totalPrice  || '-' }}</div>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
                            <el-table-column label="系统数量" align="center" min-width="80px">
                                <template slot-scope="scope">
                                    {{ scope.row.systemCount || '0'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="采购数量" align="center" min-width="80px">
                                <template slot-scope="scope">
                                    {{ scope.row.purchaseCount || '0' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="商品链接" :show-overflow-tooltip='true' prop="productLink" min-width="100px" align="center">
                                <template slot-scope="scope">
                                    <a :href="scope.row.productLink" style="color: #66b1ff" target="_blank">{{ scope.row.productLink }}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="第三方订单号" align="center" :show-overflow-tooltip='true' prop="thirdOrderNo" min-width="160px">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.thirdOrderNo || '-' }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="发货数" align="center" min-width="60px">
                                <template slot-scope="scope">
                                    {{ scope.row.shipCount || '0'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="入库数" prop="incomeNum" align="center" min-width="60px">
                                <template slot-scope="scope">
                                    {{ scope.row.incomeNum || '0'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="入库异常数" prop="incomeAbnormalNum" align="center" min-width="85px">
                                <template slot-scope="scope">
                                    {{ scope.row.incomeAbnormalNum || '0'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="缺货数" align="center" min-width="60px">
                                <template slot-scope="scope">
                                    {{ scope.row.stockoutNum || '0'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="取消数" align="center" min-width="60px">
                                <template slot-scope="scope">
                                    {{ scope.row.cancelCount || '0'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="物流信息" align="center" prop="logisticsSingle" min-width="250px">
                                <template slot-scope="scope">
                                    <div>
                                        <div v-for="(item, index) in scope.row.logi" :key="index">
                                            <div class="block-right">
                                                <div>{{getCompanyName(item.logiCompany || '-')}}：{{ item.logiCode }}</div>
                                                <!-- <div>{{ item.logiCode }}</div> -->
                                                <div>发货数量：{{item.count}}</div>
                                                <div v-if="scope.row.logi.length==1"></div>
                                                <!-- <hr v-else> -->
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column  label="单个sku操作" align="center" min-width="120px" fixed="right">
                                <template slot-scope="scope">
                                    <div>
                                        <!--编辑： 未采购-->
                                        <el-button v-if="scope.row.purchaseOrderStatus === 'WAIT_PURCHASE' && hasPermission('BTN_SKU_PURCHASE_ORDER_EDIT')"
                                                    type="text" size="mini"
                                                   @click="showEditDialog(scope.row, 'edit')"
                                                   :loading="loading">
                                            编辑
                                        </el-button>
                                        <!--原订单信息-->
                                        <el-button
                                             type="text" size="mini"
                                            @click="showOriginalDialog(scope.row)"
                                            :loading="loading"
                                            v-if="scope.row.purchaseType==='SYSTEM' && hasPermission('BTN_SKU_ORIGINAL_ORDER')"
                                        >
                                            原订单信息
                                        </el-button>
                                        <!--补单：  缺货数量>0 -->
                                        <el-button v-if="scope.row.stockoutNum > 0 && hasPermission('BTN_SKU_PURCHASE_ORDER_MAKE_UP')"
                                                    type="text" size="mini"
                                                   @click="showEditDialog(scope.row, 'makeup')"
                                                   :loading="loading">
                                            补单
                                        </el-button>
                                        <!--取消采购数量：  缺货数量>0 -->
                                        <el-button v-if="scope.row.stockoutNum > 0 && hasPermission('BTN_SKU_PURCHASE_ORDER_CANCEL')"
                                                    type="text" size="mini"
                                                   @click="showCancelnum(scope.row)"
                                                   :loading="loading">
                                            取消采购数量
                                        </el-button>
                                        <!-- 缺货: 不使用fingo && (已采购|部分发货) -->
                                        <el-button v-if="(scope.row.purchaseOrderStatus != 'WAIT_PURCHASE' && scope.row.purchaseOrderStatus != 'STORAGED') &&
                                         scope.row.availableStockoutCount > 0 && hasPermission('BTN_SKU_SHORTAGE')"
                                                    type="text" size="mini"
                                                   @click="confirmhandleStockout(scope.row)"
                                                   :loading="loading">
                                            缺货
                                        </el-button>
                                        <!-- 发货: 不使用fingo && (已采购|部分发货) -->
                                        <el-button v-if="(scope.row.purchaseOrderStatus == 'PURCHASED' || scope.row.purchaseOrderStatus == 'PART_SHIPPED') &&
                                    scope.row.isUseFingoSystem === 2 && scope.row.availableShipCount > 0 && hasPermission('BTN_SKU_DELIVER_GOODS')"
                                                   type="text" size="mini"
                                                   @click="showDeliver(scope.row,1)"
                                                   :loading="loading">
                                            发货
                                        </el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column fixed="left" label="采购单号"  align="center" prop="purchaseOrderNo" min-width="180px">
                </el-table-column>
                <el-table-column label="收货仓库" align="center" min-width="80px" prop="warehouseName">
                </el-table-column>
                <el-table-column label="发货方式" align="center" min-width="80px" prop="deliveWay">
                    <template slot-scope="scope">
                        <div v-if="scope.row.deliveWay === 2">空运</div>
                        <div v-else>海运</div>
                    </template>
                </el-table-column>
                <el-table-column label="剩余处理时间" min-width="135px" align="center">
                    <template slot-scope="scope">
                        <div :class="judgeTime(scope.row.retainTime)"> {{ scope.row.retainTime || '-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="供应商名称" prop="supplierName" align="center" min-width="120px"></el-table-column>
                <el-table-column label="采购来源" prop="fingoSkuCode" align="center" min-width="80px">
                    <template slot-scope="scope">
                        <div>{{ purchaseOrderSource[scope.row.purchaseType] }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="采购总金额" align="center" min-width="80px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.purchaseAmount ||'-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="运费" align="center" prop="freight" min-width="55px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.freight || '-' }}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="采购员" min-width="80px" align="center" prop="buyerName"> -->
                <!-- </el-table-column> -->
                <el-table-column label="采购单创建时间" prop="createTime" align="center" min-width="135px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.createTime | secondTimeFormat }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="入库时间" align="center" prop="incomeTime" min-width="135px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.incomeTime | secondTimeFormat }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="关联采购单号 " align="center" prop="refPurchaseOrderNo" min-width="150px">
                    <template slot-scope="scope">
                        {{ scope.row.refPurchaseOrderNo || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="供应商交货仓" align="center" min-width="120px" prop="warehouseName">
                    <template slot-scope="scope">
                        <div>{{ scope.row.transferName ||'-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="采购单状态" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.purchaseOrderStatus === 'WAIT_PURCHASE'" effect="dark" type="warning" size="mini">未采购</el-tag>
                        <el-tag v-if="scope.row.purchaseOrderStatus === 'PURCHASED'" effect="dark" size="mini">待发货</el-tag>
                        <el-tag v-if="scope.row.purchaseOrderStatus === 'STOCKOUT'" type="danger" size="mini">缺货</el-tag>
                        <!--                        <el-tag v-if="scope.row.purchaseOrderStatus === 'PART_SHIPPED'" type="success" size="mini">部分发货</el-tag>-->
                        <el-tag v-if="scope.row.purchaseOrderStatus === 'SHIPPED'" type="success" effect="dark" size="mini">待入库</el-tag>
                        <el-tag v-if="scope.row.purchaseOrderStatus === 'STORAGED'" effect="dark" size="mini">已入库</el-tag>
                        <el-tag v-if="scope.row.purchaseOrderStatus === 'CANCLE'" type="info" size="mini">取消</el-tag>
                        <el-tag v-if="scope.row.purchaseOrderStatus === 'CANCELED'" type="info" size="mini">已取消</el-tag>
                        <div>{{externalStatus[scope.row.externalStatus]}}</div>
                    </template>
                </el-table-column>
<!--                <el-table-column label="备注" align="center" prop="remark" min-width="80px">-->
<!--                    <template slot-scope="scope">-->
<!--                        <div>{{ scope.row.remark || '-' }}</div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column  label="整单操作" align="center" min-width="160px" min-height="30px" fixed="right">
                    <template slot-scope="scope">
                        <div class="order-btn-box">
                            <!--编辑： 未采购-->
                            <el-button v-if="hasPermission('BTN_ALL_PURCHASE_ORDER_EDIT') && (tabActive !== 'EXTERNAL_UN_PURCHASE' && tabActive !== 'EXTERNAL_PURCHASE_UN_PAY' && scope.row.purchaseOrderStatus == 'WAIT_PURCHASE')"
                               type="text" size="mini"
                                @click="editEntireOrder(scope.row)"
                                       :loading="loading">
                                编辑
                            </el-button>
                            <el-button v-if="hasPermission('BTN_ALL_PURCHASE_LIST_EXPORT') && tabActive !== 'EXTERNAL_UN_PURCHASE' && tabActive !== 'EXTERNAL_PURCHASE_UN_PAY'"
                                type="text" size="mini"
                                @click="exportEntireOrder(scope.row)"
                                       :loading="loading">
                                导出
                            </el-button>
                            <el-button  type="text" size="mini"
                                       v-if="hasPermission('BTN_ALL_VIEW_DETAILS') || tabActive === 'EXTERNAL_UN_PURCHASE' || tabActive === 'EXTERNAL_PURCHASE_UN_PAY'"
                                @click="showPurchaseOrderDetail(scope.row)">
                                查看详情
                            </el-button>
                            <el-button v-if=" (scope.row.purchaseOrderStatus == 'WAIT_PURCHASE' && tabActive !== 'EXTERNAL_UN_PURCHASE' && tabActive !== 'EXTERNAL_PURCHASE_UN_PAY') && hasPermission('BTN_ALL_CONFIRM_PURCHASE')"
                               type="text" size="mini"
                                @click="confirmPurchase(scope.row)">
                                确认采购
                            </el-button>
                            <el-button v-if="(scope.row.purchaseOrderStatus == 'WAIT_PURCHASE' || tabActive === 'EXTERNAL_UN_PURCHASE' || tabActive === 'EXTERNAL_PURCHASE_UN_PAY') && hasPermission('BTN_ALL_CANCEL')"
                                 type="text" size="mini"
                                @click="confirmAllCancel(scope.row)">
                                整单取消
                            </el-button>
                            <el-button v-if="(scope.row.purchaseOrderStatus === 'PURCHASED' || scope.row.purchaseOrderStatus === 'PART_SHIPPED')
                                && scope.row.isUseFingoSystem === 2 && scope.row.isShip === 1 && hasPermission('BTN_ALL_DELIVER_GOODS')"
                                 type="text" size="mini"
                                @click="showDeliver(scope.row,2)">
                                发货
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-sizes="[5,10, 20, 30, 50]"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <!--新增采购单-->
        <add-edit-po v-if="addDialog.show" @getList="getListnew" :propWmsWarehouseList="wmsWarehouseList" :addDialog="addDialog">
           
        </add-edit-po>
        <!--单个sku编辑-->
        <single-sku-edit v-if="editDialog.show" :propWmsWarehouseList="wmsWarehouseList" :editDialog="editDialog" @on-confirm-edit="handleEditSingleSku" @on-confirm-makeup="handleSingleMakeup" ></single-sku-edit>
        <!--取消采购数量-->
        <cancel-purchaes-num @getList="getListnew" :editDialog="editDialog" @on-confirm="handleConfirmCancelPurchaseNum"></cancel-purchaes-num>
        <!--发货信息-->
        <shipping-information @refresh-list="getPurchaseOrderList" :deliver="deliver"> </shipping-information>
        <!--查看综合详情-->
        <comprehensive-details ref="purchaseOrderDetail" @getList="getListnew" :List="List"></comprehensive-details>
        <!--查看原订单详情页-->
        <original-order-details ref="originalDetail" :editDialog="editDialog"></original-order-details>
        <!--缺货数据-->
        <stock-out-details ref="stockDetail" @getList="getListnew" :editDialog="editDialog"></stock-out-details>
        <!--确认采购-->
        <confirm-purchase v-if="editDialog.confirmPurchase.show" ref="confirmPurchase" :editDialog="editDialog" @getList="getListnew" :purchaseList="purchaseList" :details="details" :transferList="transferList"></confirm-purchase>
        <upload-file :dialogVisible="uploadDialog" @on-cancle="cancelUpload"></upload-file>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { uploadFileRequest } from '@/request/file'
    import common from './common/common'
    import {
        purchaseOrderPageList,
        singlePoEdit,
        singleMakeup,
        partCancel,
        allCancel,
        ensurePurchase,
        stockout,
        deliver,
        importShip,
        exportoPo,
        exportoPos,
        exportShipOrder,
        GetStockoutData,
        PurchaseStockout
    } from '@/request/purchase'
    import {
        warehousePage,
        GetTransferAddress
    } from '@/request/warehouse'
    import {
        listSysUserByPage
    } from '@/request/staff'
    import {
        param,
        formatSeconds
    } from '@/utils/index'
    import { supplierBasePage } from '@/request/supplier'
    import { formatTime } from '@/js/common/filter'
    import logisticsCompany from '@/data/company.js'
    import addEditPo from '@/views/purchaseManage/purchaseOrder/components/addEditPo'
    import singleSkuEdit from '@/views/purchaseManage/purchaseOrder/components/singleSkuEdit'
    import cancelPurchaesNum from '@/views/purchaseManage/purchaseOrder/components/cancelPurchaesNum'
    import shippingInformation from '@/views/purchaseManage/purchaseOrder/components/shippingInformation'
    import comprehensiveDetails from '@/views/purchaseManage/purchaseOrder/components/comprehensiveDetails'
    import stockOutDetails from '@/views/purchaseManage/purchaseOrder/components/stockOutDetails'
    import confirmPurchase from '@/views/purchaseManage/purchaseOrder/components/confirmPurchase'
    import originalOrderDetails from '@/views/purchaseManage/purchaseOrder/components/originalOrderDetails'
    import UploadFile from './components/UploadFile'
    import {categoryListGet } from '@/request/product'
    export default {
        components: {
            addEditPo, // 新增采购单&编辑
            singleSkuEdit, // 单个SKU编辑
            cancelPurchaesNum, // 取消数量
            shippingInformation, // 发货信息
            comprehensiveDetails, // 查看综合详情
            stockOutDetails, // 缺货详情
            originalOrderDetails, // 原订单信息详情
            confirmPurchase, // 确认采购
            UploadFile
        },
        mixins: [common],
        data () {
            return {
                backCategoryOptions:[],
                uploadDialog: false,
                purchaseList: [],
                transferList: [],
                details: [],
                changeNo: '',
                expandNo: '',
                // 要展开的行，数值的元素是row的key值
                expands: [],
                dom: null,
                scrollTop: null,
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                tabActive: 'ALL',
                tabTypeMap: {
                    'ALL': '全部',
                    'UNGROUP':'未分组',
                    'EXTERNAL_UN_PURCHASE': '待自动下单',
                    'EXTERNAL_PURCHASE_UN_PAY': '已自动下单未付款',
                    'UN_PURCHASE': '未采购（手动）',
                    'HAS_PURCHASE': '待发货',
                    'SHORTAGE': '缺货',
                    // 'PARTIAL_DELIVER': '部分发货',
                    // 'ALL_DELIVER': '已发货',
                    'ALL_DELIVER': '待入库',
                    'HAS_INCOME': '已入库',
                    'CANCEL': '已取消',
                    'WARNING': '预警订单'
                },
                externalStatus:{
                    '1': '待自动下单',
                    '2': '已下单未付款',
                    '3': '采购成功',
                    '4': '自动下单失败',
                    '5': '采购取消',
                    '0': ''
                },
                purchaseOrderStatusMap: {
                    'WAIT_PURCHASE': '未采购',
                    'PURCHASED': '已采购',
                    // 'PART_SHIPPED': '部分发货',
                    'SHIPPED': '已发货',
                    'STORAGED': '已入库',
                    'CANCELED': '已取消'
                    // 'PART_ARRIVED': '部分到货',
                    // 'ARRIVED': '已到货',
                    // 'UNARRIVED': '未到货',
                    // 'PART_STORAGE': '部分入库',
                    // 'STORAGED_ABNORMAL': '入库异常',
                },
                queryData: {
                    choseType: '1',
                    value: '',
                    purchaseOrderNo: '', // 采购单号
                    refPurchase_orderNo: '', // 关联采购单号
                    supplierId: '', // 供应商id
                    supplierName: '', // 供应商名称
                    buyerId: '', // 采购员id
                    purchaseOrderStatus: '', // 采购单状态
                    type: [], // 采购单来源
                    isUseFingoSystem: '', // 是否使用fingo系统
                    deliveWay: '', // 发货方式
                    startTime: '', // 创建时间的开始时间
                    endTime: '', // 创建时间的结束时间
                    orderNo: '', // 订单号
                    thirdOrderNo: '', // 第三方订单号
                    productId: '', // 商品ID
                    logiCode: '', // 物流单号
                    productName: '', // 商品信息（商品名称和描述）
                    skuCode: '',
                    refPurchaseOrderNo: '',
                    warehouseNo: '',
                    isWarningSwith: null,
                    timeList: [],
                    incomeStatus: null,
                    externalStatus: '',
                    cateId:[],
                    page: {
                        pageSize: 10,
                        pageNum: 1
                    }
                },
                deliveWayList: [
                    {
                        value: '1',
                        label: '海运'
                    }, {
                        value: '2',
                        label: '空运'
                    }
                ],
                exportLoading: false,
                productOptionList: [{
                                        name: 'skuCode',
                                        code: '1'
                                    },
                                    {
                                        name: '商品名称',
                                        code: '2'
                                    },
                                    {
                                        name: '第三方订单号',
                                        code: '3'
                                    },
                                    {
                                        name: '商品ID',
                                        code: '4'
                                    }
                ],
                supplierLists: [],
                warehouseList: [],
                buyerList: [],
                page: 1,
                pageSize: 10,
                pagingSwitch: true,
                total: 0,
                showSearchParam: false,
                importLoading: false,
                uploadFileName: `${process.env.VUE_APP_UPLOAD_NAME}`,
                headers: this.$headers,
                load: false,
                check: '',
                oneKeySync: {
                    show: false
                },
                wmsWarehouseList: [],
                List: {
                    parcelAnomaly: '',
                    total: 0,
                    detailList: [],
                    productList: [],
                    relList1: [],
                    relList2: [],
                    show: false,
                    param: {
                        pageSize: 10,
                        pageNum: 1
                    },
                    // skuList: []
                },
                deliver: {
                    data: [],
                    List: [],
                    type: '',
                    ships: [],
                    show: false,
                    logisticsType: {
                        'DOMESTIC': '国内',
                        'INTERNATIONAL': '国际',
                        'LOCAL': '当地'
                    },
                    param: {
                        supplierOrderNo: '',
                        logisticsSingleCode: '',
                        purchaseOrderNo: '',
                        supplierId: '',
                        fingoSkuCode: ''
                    }
                },
                logisticsCompany: logisticsCompany,
                purchaseOrderSource: {
                    'SYSTEM': '系统',
                    'SUPPLEMENT': '补充单',
                    'ARTIFICIAL': '人工单'
                },
                orderSwitch: {
                    'false': '默认不排序',
                    'true': '按供应商名称，采购状态，创建时间排序'
                },
                logisticsType: {
                    'DOMESTIC': '国内',
                    'INTERNATIONAL': '国际',
                    'LOCAL': '当地'
                },
                automaticProcurementList: [{
                    value: 1,
                    label: '待自动下单'
                },{
                    value: 2,
                    label: '已下单未付款'
                },{
                    value: 3,
                    label: '采购成功'
                },{
                    value: 4,
                    label: '采购失败'
                },{
                    value: 5,
                    label: '采购取消'
                },{
                    value: 6,
                    label: '部分发货待处理'
                },
                // {
                //     value: 7,
                //     label: '待付款异常'
                // }
                ],
                timeList: [],
                dataList: [],
                dataListNew: [],
                tranlist: [],
                accountList: [],
                supplierIds: [],
                param: {
                    supplierIds: [],
                    purchaseOrderNo: '',
                    supplierName: '',
                    buyerId: '',
                    purchaseOrderProductSelectParam: '',
                    refPurchaseOrderNo: '',
                    purchaseOrderStatus: '',
                    purchaseSource: '',
                    WARNING: false,
                    queryFlag: '',
                    synSwitch: false
                },
                addDialog: {
                    show: false,
                    type: 'add',
                    title: '新增采购订单',
                    param: {
                        forwarderName: '广州仓',
                        deliveWay: '',
                        forwarderCode: '6',
                        warehouseNo: '',
                        warehouseName: '',
                        purchaseSource: '',
                        supplierId: '',
                        freight: '',
                        isUse: '',
                        purchaseOrderNo: '',
                        purchaseOrderProductAddInfos: [{
                            fingoSkuCode: '',
                            purchaseCount: '',
                            purchasePrice: ''
                        }]
                    },
                    rules: {
                        forwarderCode: [{
                            required: true,
                            message: '请选择中转仓',
                            trigger: 'change'
                        }],
                        deliveWay: [{
                            required: true,
                            message: '请选择发货方式',
                            trigger: 'change'
                        }],
                        supplierId: [{
                            required: true,
                            message: '请输入供应商id',
                            trigger: 'change'
                        }],
                        freight: [{
                            required: true,
                            message: '请输入运费',
                            trigger: 'change'
                        }],
                        isUse: [{
                            required: true,
                            message: '请选择是否推送供应商',
                            trigger: 'change'
                        }],
                        fingoSkuCode: [{
                            required: true,
                            message: '请输入fingo商品码',
                            trigger: 'change'
                        }],
                        purchaseCount: [{
                            required: true,
                            message: '请输入实际采购数量',
                            trigger: 'change'
                        }],
                        purchasePrice: [{
                            required: true,
                            message: '请输入采购价格',
                            trigger: 'change'
                        }],
                        warehouseNo: [{
                            required: true,
                            message: '请输入收货仓库',
                            trigger: 'change'
                        }]
                    }
                },
                editDialog: {
                    confirmPurchase: {
                        show: false
                    },
                    stockOutDetails: {
                        show: false
                    },
                    // 原订单信息详情页
                    Original: {
                        show: false
                    },
                    // 补单
                    Supplement: {
                        show: false
                    },
                    // 取消采购数量
                    cancelnum: {
                        show: false
                    },
                    show: false,
                    type: 'edit',
                    title: '采购订单编辑',
                    param: {
                        maxCount: '',
                        incomeNum: '',
                        storageCount: '',
                        purchaseOrderNo: '',
                        fingoSkuCode: '',
                        purchaseOrderStatus: '',
                        purchaseSource: '',
                        purchasePrice: '',
                        freight: '',
                        deliveWay: '',
                        forwarderCode: '',
                        systemCount: '',
                        purchaseCount: '',
                        purchaseActualCount: '',
                        logisticsSingle: '',
                        thirdOrderNo: '',
                        supplierId: '',
                        synSwitch: false,
                        content: '',
                        cancelCount: '',
                        count: '',
                        availableShipCount: '',
                        warehouseName: '',
                        warehouseNo: ''
                    }
                },
                deliverAlert: {
                    show: false,
                    purchaseOrderNo: '',
                    fingoSkuCode: '',
                    logisticsSingle: [],
                    synSwitch: false,
                    param: {
                        logisticsSingleCode: ''
                    }
                },
                uploadLoading: false,
                beginTime: '',
                endTime: '',
                exportNoImgLoading:false,
                supplierQuery:{
                    supplierName:'',
                    page:{
                        pageSize:20,
                        pageNum:1
                    }
                }
            }
        },
        computed: {
            nowEndDate () {
                return this.$store.state.globalNum.nowEndDate
            },
            lastMonthDate () {
                return this.$store.state.globalNum.lastMonthDate
            }
        },
        filters: {
            skuDescFilter: function (skuDesc) {
                let skuDescStr = ''
                if (skuDesc === '') {
                    skuDescStr = '-'
                } else {
                    let desc = JSON.parse(skuDesc)
                    let skuList = []
                    _.forEach(desc, item => {
                        skuList.push(`${item.attrName}: ${item.valueName}`)
                    })
                    skuDescStr = skuList.join('\n')
                }
                return skuDescStr
            }
        },
        created () {
            if (window.location.href.indexOf('?') !==-1) {
                this.queryData.purchaseOrderNo = window.location.href.split('?')[1].split('=')[1]
            }   
            this.queryData.purchaseOrderStatus = this.$route.query.purchaseOrderStatus
            this.queryData.warehouseNo = this.$route.query.warehouseNo
            this.queryData.type = this.$route.query.purchaseType
            this.queryData.deliveWay = this.$route.query.deliveWay
            this.beginTime = this.$route.query.lastMonthDate===undefined?'':formatTime(this.$route.query.lastMonthDate)
            this.endTime = this.$route.query.nowEndDate===undefined?'':formatTime(this.$route.query.nowEndDate)
            if (this.beginTime !== '' || this.endTime !== '') {
                this.queryData.timeList = [this.beginTime, this.endTime]
            } else {
                this.queryData.timeList = [this.lastMonthDate, this.nowEndDate]
            }
            if(this.$route.query.purchaseOrderNo){
                this.queryData.purchaseOrderNo=this.$route.query.purchaseOrderNo
            }
            this.getPurchaseOrderList()
            this.getBuyerList()
            this.getTransferList()
            this.wmsWarehouse()
            // this.getProductSupplierOption()
            this.getWarehouseList()
            this.getSupplierList('')
        },
        mounted () {
            this.scrollMonitor()
            this.fetchCategory({
                        level: 1,
                        cateType: 2,
                        resolve: (data) => {
                            this.backCategoryOptions = data
                        }
                    })
        },
        methods: {
            getBackSubCategory (data, resolve) {
                if (data.level == 0) {
                    return
                }
                let value = data.value
                this.fetchCategory({
                    pid: parseInt(value),
                    cateType: 2,
                    level: data.level + 1,
                    resolve
                })
            },
            // 获取分类
            fetchCategory ({ id, cateType, level, pid, page, resolve }) {
                categoryListGet(this.filterData({
                    pid: pid,
                    id: id,
                    level: level,
                    cateType: cateType,
                    page: page
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        for (let i = 0; i < res.categoryUnit.length; i++) {
                            res.categoryUnit[i]['levelValue'] = []
                            let item = res.categoryUnit[i].cateNameValue.find((val) => {
                                return val.languageCode == 'cn'
                            })
                            res.categoryUnit[i]['cateName'] = item ? item.name : ''
                            // res.categoryUnit[i]['cateId'] = String(res.categoryUnit[i]['cateId'])
                            if (cateType == 2) {
                                res.categoryUnit[i]['leaf'] = level > 2
                            } else {
                                res.categoryUnit[i]['leaf'] = level > 1
                            }
                        }
                        resolve && resolve(res.categoryUnit, res)
                    }
                })
                
            },
            /**
             * 获取供应商列表
            */
            getSupplierList (value) {
                this.supplierQuery.supplierName = value;
                    if (value != "") {
                    this.supplierQuery.page.pageNum = 1;
                    }
                    supplierBasePage(this.filterData(this.supplierQuery)).then(res => {
                    if (res.ret.errcode === 1) {
                    if (!value) {
                    this.supplierLists = this.deleteObject([
                    ...this.supplierLists,
                    ...res.list
                    ]);
                    } else {
                    this.supplierLists = res.list;
                    }
                    }
                });
            },
            loadMore() {
                if (this.supplierQuery.supplierName == "") {
                this.supplierQuery.page.pageNum++;
                this.getSupplierList("");
                }
            },
            //对象数组去重
            deleteObject(obj) {
                var uniques = [];
                var stringify = {};
                for (var i = 0; i < obj.length; i++) {
                var keys = Object.keys(obj[i]);
                keys.sort(function(a, b) {
                return Number(a) - Number(b);
                });
                var str = "";
                for (var j = 0; j < keys.length; j++) {
                str += JSON.stringify(keys[j]);
                str += JSON.stringify(obj[i][keys[j]]);
                }
                if (!stringify.hasOwnProperty(str)) {
                uniques.push(obj[i]);
                stringify[str] = true;
                }
                }
                uniques = uniques;
                return uniques;
            },
            uploadClick () {
                this.uploadDialog = true
            },
            cancelUpload () {
                this.uploadDialog = false
            },
            getWarehouseList () {
                let params = {
                    page: this.queryData.pageData
                }
                warehousePage(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.warehouseList = res.list
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            rowClick (row, event, column) {
                Array.prototype.remove = function (val) {
                    let index = this.indexOf(val)
                    if (index > -1) {
                        this.splice(index, 1)
                    }
                }
                if (this.expands.indexOf(row.purchaseOrderNo) < 0) {
                    this.expands = []
                    this.expands.push(row.purchaseOrderNo)
                } else {
                    this.expands.remove(row.purchaseOrderNo)
                }
            },
            getRowKeys (row) {
                return row.purchaseOrderNo
            },
            toggleRowExpansion (row) {
                // this.expandNo = row.purchaseOrderNo
                // this.setStore('expandNo', this.expandNo)
                // this.expandNo = row.purchaseOrderNo
                this.setStore('expandNo', row.purchaseOrderNo)
                if (this.changeNo != row.purchaseOrderNo) {
                    this.expands = []
                    this.expands.push(row.purchaseOrderNo)
                    this.changeNo = row.purchaseOrderNo
                } else {
                    this.expands = []
                    this.changeNo = ''
                }
            },
            // 获取
            scrollMonitor () {
                // 获取需要绑定的table
                this.dom = this.$refs.table.bodyWrapper
                this.dom.addEventListener('scroll', () => {
                    this.scrollTop = this.dom.scrollTop
                })
            },
            // 定位
            buttonLocation () {
                this.expands.push(this.getStore('expandNo'))
                this.dom.scrollTop = this.getStore('scrollTop')
            },
            // 获取物流公司名称
            getCompanyName (item) {
                let data = logisticsCompany.find((val) => {
                    return val.code == item
                })
                return data ? data.name : item
            },
            dropDown () {
                if (this.drop) {
                    this.dropDownContent = '展开'
                    this.dropDownIcon = 'el-icon-arrow-down'
                } else {
                    this.dropDownContent = '收起'
                    this.dropDownIcon = 'el-icon-arrow-up'
                }
                this.drop = !this.drop
            },
            /**
             * 获取采购负责人列表
             */
            getBuyerList () {
                let params = {
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    },
                    groupIds: [68,69,70]
                }
                listSysUserByPage(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.buyerList=res.sysUserPb
                    }
                }).catch(err => {
                    console.log(err)
                })
                console.log(this.buyerList)
            },
            // 获取物流公司名称
            getCompanyName (item) {
                let data = this.logisticsCompany.find((val) => {
                    return val.code == item
                })
                return data ? data.name : item
            },
            // 判断时间趋势
            judgeTime (time) {
                if (time.indexOf('订单') < 0) {
                    return 'security'
                } else {
                    return 'warning'
                }
            },
            // 判断状态趋势
            judgeStateTwo (state) {
                if (state == 1) {
                    return 'warning'
                } else {
                    return 'security'
                }
            },
            // 判断状态趋势
            judgeStateShortage (state) {
                if (state == 'STOCKOUT') {
                    return 'warning'
                } else {
                    return 'security'
                }
            },
            switchTab () {
                this.dom.scrollTop = 0
                this.queryData.incomeStatus = null
                // this.$refs['purchaseOrderFilter'].resetFields()
                this.getPurchaseOrderList(this.tabActive)
                // console.log('定位锚点' + this.dom.scrollTop)
            },
            // 查询列表接口
            getConfirmPurchaseList (data) {
                this.loading = true
                let params = data
                purchaseOrderPageList(params).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.purchaseList = res.list
                        for (let i = 0; i < this.purchaseList.length; i++) {
                            this.details = this.purchaseList[i].details
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                    this.loading = false
                })
            },
            /**
             * 获取交货仓列表
             */
            getTransferList () {
                GetTransferAddress().then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.transferList = res.twhList
                    }
                })
            },
            // 确认采购弹窗显示
            confirmPurchase (data) {
                this.editDialog.param = {
                    purchaseOrderNo: data.purchaseOrderNo,
                    deliveWay: data.deliveWay,
                    warehouseName: data.warehouseName,
                    supplierName: data.supplierName,
                    freight: data.freight,
                    isUseFingoSystem: data.isUseFingoSystem
                }
                this.getConfirmPurchaseList(this.editDialog.param)
                // deliveWay 1海运 2空运
                let resItem = this.transferList.find(item => (item.isDefault == 1 && item.deliveWay == data.deliveWay))
                if (resItem) {
                    Object.assign(this.editDialog.param, {
                        warehouseNo: resItem.transferId
                    })
                }
                this.editDialog.confirmPurchase.show = true
            },
            // 确认整单取消
            confirmAllCancel (data) {
                this.$confirm('确认取消此单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.allCancel(data)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            // 新缺货操作
            confirmhandleStockout (data) {
                this.editDialog.param = {
                    purchaseOrderNo: data.purchaseOrderNo,
                    skuCode: data.skuCode,
                    productName: data.productName,
                    purchaseCount: data.purchaseCount,
                    productCover: data.productCover,
                    incomeNum: data.incomeNum,
                    cancelCount: data.cancelCount,
                    skuDesc: data.skuDesc,
                    stockoutNum: data.stockoutNum
                }
                this.$refs.stockDetail.confirmhandleStockout()
                this.editDialog.stockOutDetails.show = true
            },
            arraySpanMethod ({
                row,
                column,
                rowIndex,
                columnIndex
            }) {
                let activeColumn = [0, 1, 2, 3, 22, 23, 24, 25, 26, 27, 31]
                let item = activeColumn.find((val) => {
                    return val == columnIndex
                })
                if (item || columnIndex == 0) {
                    if (row.rowspan) {
                        return {
                            rowspan: row.rowspan,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },
            resetSearch () {
                Object.assign(this.queryData, {
                    choseType: '1',
                    value: '',
                    purchaseOrderNo: '', // 采购单号
                    refPurchase_orderNo: '', // 关联采购单号
                    supplierId: '', // 供应商id
                    supplierName: '', // 供应商名称
                    buyerId: '', // 采购员id
                    purchaseOrderStatus: '', // 采购单状态
                    type: [], // 采购单来源
                    isUseFingoSystem: '', // 是否使用fingo系统
                    deliveWay: '', // 发货方式
                    startTime: '', // 创建时间的开始时间
                    endTime: '', // 创建时间的结束时间
                    orderNo: '', // 订单号
                    thirdOrderNo: '', // 第三方订单号
                    productId: '', // 商品ID
                    logiCode: '', // 物流单号
                    productName: '', // 商品信息（商品名称和描述）
                    skuCode: '',
                    refPurchaseOrderNo: '',
                    warehouseNo: '',
                    isWarningSwith: null,
                    timeList: [],
                    incomeStatus: null,
                    cateId:'',
                    page: {
                        pageSize: 10,
                        pageNum: 1
                    }
                })
                this.getPurchaseOrderList()
            },
            search () {
                this.getPurchaseOrderList()
            },
            // 分页
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getPurchaseOrderList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getPurchaseOrderList()
            },
            getListnew () {
                this.getPurchaseOrderList()
            },
            // 获取列表数据
            getPurchaseOrderList () {
                this.setStore('scrollTop', this.scrollTop)
                this.loading = true
                let params = this.queryData
                params.tabType = this.tabActive
                switch (this.queryData.choseType) {
                    case '1':
                        params.skuCode = this.queryData.value
                        params.productName = ''
                        params.thirdOrderNo = ''
                        params.productId = ''
                        break
                    case '2':
                        params.productName = this.queryData.value
                        params.skuCode = ''
                        params.thirdOrderNo = ''
                        params.productId = ''
                        break
                    case '3':
                        params.thirdOrderNo = this.queryData.value
                        params.skuCode = ''
                        params.productName = ''
                        params.productId = ''
                        break
                    case '4':
                        params.productId = this.queryData.value
                        params.thirdOrderNo = ''
                        params.skuCode = ''
                        params.productName = ''
                        break
                    default:
                        break
                }
                params.incomeStatus = params.incomeStatus ? parseInt(params.incomeStatus) : null
                params.startTime = params.timeList ? params.timeList[0] : null
                params.endTime = params.timeList ? params.timeList[1] : null
                this.dataList = []

                purchaseOrderPageList(this.filterData(params)).then((response) => {
                    console.log(response)
                    this.loading = false
                    if (response.ret.errcode === 1) {
                        this.total = response.total
                        this.dataListNew = response.list
                        let pageList = response.list
                        for (let i = 0; i < pageList.length; i++) {
                            let item = pageList[i]
                            if (!item.details) {
                                item.details = []
                            }
                            if (item.details.length == 0) {
                                this.dataList.push(Object.assign(item, {
                                    rowspan: 1,
                                    itemKey: i + '_'
                                }))
                            } else {
                                for (let j = 0; j < item.details.length; j++) {
                                    if (j == 0) {
                                        Object.assign(item.details[j], {
                                            rowspan: item.details.length
                                        })
                                    }
                                    Object.assign(item.details[j], {
                                        itemKey: i + '_' + j,
                                        purchaseOrderNo: item.purchaseOrderNo,
                                        refPurchaseOrderNo: item.refPurchaseOrderNo,
                                        supplierName: item.supplierName,
                                        buyerId: item.buyerId,
                                        buyerName: item.buyerName,
                                        purchaseOrderStatus: item.purchaseOrderStatus,
                                        purchaseType: item.purchaseType,
                                        isUseFingoSystem: item.isUseFingoSystem,
                                        warehouseNo: item.warehouseNo,
                                        warehouseName: item.warehouseName,
                                        retainTime: item.retainTime,
                                        freight: item.freight,
                                        isUse: item.isUseFingoSystem,
                                        deliveWay: item.deliveWay,
                                        createTime: item.createTime,
                                        updateTime: item.updateTime,
                                        purchaseOrderNo: item.purchaseOrderNo,
                                        purchaseOrderStatus: item.purchaseOrderStatus,
                                        supplierId: item.supplierId,
                                        isAbnormalProduct: item.isAbnormalProduct,
                                        incomeTime: item.incomeTime,
                                        allIncomeTime: item.allIncomeTime,
                                        purchaseAmount: item.purchaseAmount,
                                        refPurchaseOrderNo: item.refPurchaseOrderNo,
                                        details: item.details,
                                        isShip: item.isShip
                                    })
                                    this.dataList.push(item.details[j])
                                }
                            }
                        }
                    } else {
                        this.$message.error('获取失败！')
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            exportData (data) {
                this.param.purchaseOrderNo = data.purchaseOrderNo
                this.timeList = this.timeList || []
                let href = `${process.env.VUE_APP_API}/purchaseOrder/export?` + param(this.filterData(
                    Object.assign(this.param, {
                        supplierIds: this.supplierIds.join(','),
                        beginDate: !this.timeList[0] ? null : this.timeList[0],
                        endDate: !this.timeList[1] ? null : this.timeList[1]
                    })
                ))
                this.downLoadByUrl(href, '店小秘采购单.xls')
                this.param.purchaseOrderNo = ''
            },
            exportOutOrderData () {
                this.timeList = this.timeList || []
                let href = `${process.env.VUE_APP_API}/purchaseOrder/shoppingListExport?` + param(this.filterData(
                    Object.assign(this.param, {
                        supplierIds: this.supplierIds.join(','),
                        beginDate: !this.timeList[0] ? null : this.timeList[0],
                        endDate: !this.timeList[1] ? null : this.timeList[1]
                    })
                ))
                let a = document.createElement('a')
                a.href = href
                a.click()
            },
            showEditDialog (data, type) {
                // console.log(data)
                this.editDialog.type = type
                if (type == 'edit') {
                    this.editDialog.title = '采购单编辑'
                } else if (type == 'makeup') {
                    this.editDialog.title = '补采购单'
                }
                this.editDialog.param.maxCount = data.stockoutNum
                Object.assign(this.editDialog.param, {
                    purchaseOrderNo: data.purchaseOrderNo || '',
                    warehouseNo: data.warehouseNo || '',
                    warehouseName: data.warehouseName || '',
                    skuCode: data.skuCode || '',
                    purchaseOrderStatus: data.purchaseOrderStatus || '',
                    purchaseSource: data.purchaseSource || '',
                    purchasePrice: data.purchasePrice || '',
                    freight: data.freight || '',
                    purchaseType: data.purchaseType || '',
                    isUse: data.isUseFingoSystem || '',
                    deliveWay: data.deliveWay || '',
                    forwarderCode: data.forwarderCode || '',
                    systemCount: data.systemCount || '',
                    purchaseActualCount: data.purchaseActualCount || '',
                    logisticsSingle: data.logisticsSingle || '',
                    thirdOrderNo: data.thirdOrderNo || '',
                    synSwitch: data.synSwitch,
                    // purchaseCount: this.editDialog.param.maxCount,
                    purchaseCount: data.purchaseCount,
                    incomeNum: data.incomeNum,
                    cancelCount: data.cancelCount,
                    supplierId: data.supplierId || ''
                })
                // 单个编辑时，采购数量默认取系统数量
                // if (type == 'edit') {
                //     this.editDialog.param.purchaseCount = this.editDialog.param.systemCount
                // }
                // console.log(this.editDialog.param)
                this.editDialog.show = true
            },
            showOriginalDialog (data) {
                Object.assign(this.editDialog.param, {
                    purchaseOrderNo: data.purchaseOrderNo || '',
                    skuCode: data.skuCode || ''
                })
                this.$refs.originalDetail.getOrderDetail()
                this.editDialog.Original.show = true
            },
            showCancelnum (data) {
                this.editDialog.param = {
                    purchaseOrderNo: data.purchaseOrderNo,
                    supplierId: data.supplierId,
                    supplierName: data.supplierName,
                    skuCode: data.skuCode,
                    systemCount: data.systemCount,
                    purchaseCount: data.purchaseCount,
                    incomeNum: data.incomeNum,
                    shipCount: data.shipCount,
                    cancelCount: data.cancelCount,
                    count: data.stockoutNum
                }
                this.editDialog.cancelnum.show = true
            },
            showDialog (type, data) {
                this.addDialog.title = '新增采购单'
                this.addDialog.type = type
                Object.assign(this.addDialog.param, {
                    purchaseOrderStatus: '',
                    purchaseOrderNo: '',
                    supplierId: '',
                    freight: '',
                    isUse: 1,
                    forwarderName: '广州仓',
                    deliveWay: '',
                    forwarderCode: '6',
                    purchaseOrderProductAddInfos: []
                })
                console.log(this.addDialog.param)
                if (type == 'edit') {
                    this.addDialog.title = '编辑采购单'
                    this.addDialog.param.purchaseOrderNo = data.purchaseOrderNo
                    this.addDialog.param.thirdOrderNo = data.thirdOrderNo
                    this.addDialog.param.supplierId = data.supplierId
                    this.addDialog.param.freight = data.freight
                    this.addDialog.param.purchaseType = data.purchaseType
                    this.addDialog.param.isUse = data.isUseFingoSystem
                    this.addDialog.param.purchaseSource = data.purchaseSource
                    this.addDialog.param.forwarderCode = data.forwarderCode
                    this.addDialog.param.forwarderName = data.forwarderName
                    this.addDialog.param.deliveWay = data.deliveWay
                    this.addDialog.param.warehouseNo = data.warehouseNo
                    this.addDialog.param.warehouseName = data.warehouseName
                    for (let i = 0; i < data.details.length; i++) {
                        let item = data.details[i]
                        this.addDialog.param.purchaseOrderProductAddInfos.push({
                            skuCode: item.skuCode,
                            purchaseCount: item.purchaseCount,
                            purchasePrice: item.productPurchasePrice,
                            thirdOrderNo: item.refPurchaseOrderNo
                        })
                    }
                }
                console.log(this.addDialog.param)
                this.addDialog.show = true
            },
            clickToExportOrder () {
                if (!this.timeList || this.timeList.length !== 2) {
                    this.$message({
                        type: 'warning',
                        message: '请选择导出日期范围'
                    })
                    return
                }
                let time = new Date(this.timeList[1]) - new Date(this.timeList[0])
                let days = Math.floor(time / (24 * 3600 * 1000))
                if (!this.hasPermission('BTN_PURCHASE_LIST_EXPORT')) {
                    if (days > 7) {
                        this.$message({
                            type: 'warning',
                            message: '导出日期范围最多7天'
                        })
                        return
                    }
                }
                let href = `${process.env.VUE_APP_API}/purchaseOrder/purchaseOrderExport?` + param(this.filterData(
                    Object.assign(this.param, {
                        startTime: this.timeList[0],
                        endTime: this.timeList[1]
                    })))
                let a = document.createElement('a')
                a.href = href
                a.click()
            },
            formatSeconds (time) {
                return formatSeconds(time)
            },
            showDeliver (data, type) {
                // 判断发货数量小于零
                this.deliver.param.purchaseOrderNo = data.purchaseOrderNo
                this.deliver.ships = []
                if (type == 1) {
                    if (data.availableShipCount <= 0) {
                        return this.$message.warning('未发货数量小于零,不可发货')
                    }
                    // 单个发货
                    this.deliver.ships.push({
                        supplierId: data.supplierId,
                        skuCode: data.skuCode,
                        purchaseOrderNo: data.purchaseOrderNo,
                        availableShipCount: data.availableShipCount,
                        logiList: [{
                            logisticsType: 'DOMESTIC',
                            logiCompany: '',
                            logiCode: '',
                            count: data.availableShipCount
                        }]
                    })
                } else {
                    // 整单
                    for (let i = 0; i < data.details.length; i++) {
                        if (data.details[i].availableShipCount > 0) {
                            this.deliver.ships.push({
                                supplierId: data.details[i].supplierId,
                                skuCode: data.details[i].skuCode,
                                purchaseOrderNo: data.details[i].purchaseOrderNo,
                                availableShipCount: data.details[i].availableShipCount,
                                logiList: [{
                                    logisticsType: 'DOMESTIC',
                                    logiCompany: '',
                                    logiCode: '',
                                    count: data.details[i].availableShipCount
                                }]
                            })
                        }
                    }
                    if (this.deliver.ships.length <= 0) {
                        return this.$message.warning('未发货数量小于零,不可发货')
                    }
                }
                this.deliver.show = true
            },
            handleSizeChanges (val, type) {
                this[type].param.pageSize = val
                switch (type) {
                    case 'List':
                        break
                }
            },
            handleCurrentChanges (val, type) {
                this[type].param.pageNum = val
                switch (type) {
                    case 'List':
                        break
                }
            },
            // 采购订单导出发货
            clickToExportexportShip () {
                let href = `${process.env.VUE_APP_API}/purchaseOrder/exportShipTemplate?` + param(this.filterData(Object.assign(this.param, {
                    supplierIds: this.supplierIds.join(','),
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    beginDate: !this.timeList ? null : this.timeList[0],
                    endDate: !this.timeList ? null : this.timeList[1]
                })))
                this.downLoadByUrl(href, '采购订单发货导出.xls')
                // let a = document.createElement('a')
                // a.href = href
                // a.click()
            },
            uploadError (err) {
                console.log(err)
                this.importLoading = false
            },
            uploadBefore () {
                this.importLoading = true
            },
            /**
             * 单个缺货
             */
            handleStockout (data) {
                this.loading = true
                let params = {
                    purchaseOrderNo: data.purchaseOrderNo,
                    skuCode: data.skuCode,
                    supplierId: data.supplierId
                }
                stockout(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.getPurchaseOrderList()
                        this.loading = false
                        this.$message.success('操作成功')
                    } else {
                        this.loading = false
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            /**
             * 单个SKU采购单编辑
             */
            handleEditSingleSku (singleData) {
                console.log(singleData)
                this.loading = true
                let params = {
                    purchaseOrderNo: singleData.purchaseOrderNo,
                    skuCode: singleData.skuCode,
                    purchaseCount: Number(singleData.purchaseCount),
                    purchasePrice: singleData.purchasePrice,
                    thirdOrderNo: singleData.thirdOrderNo,
                    freight: singleData.freight
                }
                singlePoEdit(this.filterData(params)).then((res) => {
                    this.editDialog.show = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('更新成功！')
                        this.getPurchaseOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    this.editDialog.show = false
                    console.log(err)
                })
            },
            /**
             * 单个SKU补单
             */
            handleSingleMakeup (makeupData) {
                this.editDialog.show = true
                let params = {
                    purchaseOrderNo: makeupData.purchaseOrderNo,
                    skuCode: makeupData.skuCode,
                    supplierId: makeupData.supplierId,
                    purchaseCount: makeupData.purchaseCount,
                    purchasePrice: makeupData.purchasePrice,
                    thirdOrderNo: makeupData.thirdOrderNo,
                    freight: makeupData.freight
                }
                singleMakeup(this.filterData(params)).then((res) => {
                    this.editDialog.show = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('补单成功！')
                        this.getPurchaseOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    this.editDialog.show = false
                    console.log(err)
                })
            },
            /**
             * 缺货数量
             */
            handleStockOutDetails (data) {
                this.stockOutDetails.show = true
                let params = {
                    purchaseOrderNo: data.purchaseOrderNo,
                    skuCode: data.skuCode,
                    count: data.count // 未发货缺货数量
                }
                PurchaseStockout(this.filterData(params)).then((res) => {
                    this.stockOutDetails.show = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('缺货成功！')
                        this.getPurchaseOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    this.stockOutDetails.show = false
                    console.log(err)
                })
            },
            /**
             * 单个SKU取消采购数量
             */
            handleConfirmCancelPurchaseNum (purchaseNumData) {
                this.loading = true
                let params = {
                    purchaseOrderNo: purchaseNumData.purchaseOrderNo,
                    skuCode: purchaseNumData.skuCode,
                    cancelCount: purchaseNumData.count
                }
                partCancel(this.filterData(params)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.editDialog.cancelnum.show = false
                        this.$message.success('操作成功！')
                        this.getPurchaseOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            /**
             * 编辑整个采购单
             */
            editEntireOrder (data) {
                Object.assign(this.addDialog.param, {
                    purchaseOrderNo: '',
                    supplierId: '',
                    freight: '',
                    purchaseType: '',
                    isUse: null,
                    forwarderName: '广州仓',
                    deliveWay: '',
                    forwarderCode: '6',
                    purchaseOrderProductAddInfos: []
                })
                this.addDialog.param.type = 'editEntireOrder'
                this.addDialog.title = '编辑采购单'
                this.addDialog.param.purchaseOrderNo = data.purchaseOrderNo
                this.addDialog.param.thirdOrderNo = data.thirdOrderNo
                this.addDialog.param.supplierId = data.supplierId
                this.addDialog.param.freight = data.freight
                this.addDialog.param.purchaseType = data.purchaseType
                this.addDialog.param.isUse = data.isUseFingoSystem
                this.addDialog.param.purchaseSource = data.purchaseSource
                this.addDialog.param.forwarderCode = data.forwarderCode
                this.addDialog.param.forwarderName = data.forwarderName
                this.addDialog.param.deliveWay = data.deliveWay
                this.addDialog.param.warehouseNo = data.warehouseNo
                this.addDialog.param.warehouseName = data.warehouseName
                this.addDialog.param.purchaseOrderStatus = data.purchaseOrderStatus
                for (let i = 0; i < data.details.length; i++) {
                    let item = data.details[i]
                    this.addDialog.param.purchaseOrderProductAddInfos.push({
                        skuCode: item.skuCode,
                        purchaseCount: item.purchaseCount,
                        purchasePrice: item.purchasePrice,
                        thirdOrderNo: item.thirdOrderNo
                    })
                }
                console.log(this.addDialog)
                this.addDialog.show = true
            },
            /**
             * 导出整个采购单
             */
            exportEntireOrder (data) {
                this.loading = true
                let params = {
                    purchaseOrderNo: data.purchaseOrderNo
                }
                exportoPo(params).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        let fileUrl = res.fileUrl
                        window.open(this.dealShowFileSrc(fileUrl))
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            /**
             * 确认采购
             */
            ensurePurchase (data) {
                let params = {
                    purchaseOrderNo: data.purchaseOrderNo
                }
                ensurePurchase(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('采购成功！')
                        this.getPurchaseOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            /**
             * 整单取消
             */
            allCancel (data) {
                let params = {
                    purchaseOrderNo: data.purchaseOrderNo
                }
                allCancel(params).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.$message.success('整单取消成功！')
                        this.getPurchaseOrderList()
                    } else {
                        if (tabActive === 'EXTERNAL_PURCHASE_UN_PAY') {
                            this.$confirm('1688取消订单失败，请人工取消或退款。', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            })
                        }else if (tabActive === 'EXTERNAL_UN_PURCHASE') {
                            this.$confirm('采购单已取消，但第三方系统取消订单失败，请务必人工登录对方系统操作取消订单或退款。', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            })
                        }else {
                            this.$message.error(res.message)
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            /**
             * 查看详情
             */
            showPurchaseOrderDetail (data) {
                this.List.show = true
                this.List.purchaseOrderNo = data.purchaseOrderNo
                for (const iterator of data.details) {
                    this.$refs.purchaseOrderDetail.getAllSkuDeliveryDetail(iterator.skuCode)
                }
                for (const iterator of data.details) {
                    this.$refs.purchaseOrderDetail.getAllSkuAbnormalDetail(iterator.skuCode)
                }
                this.$refs.purchaseOrderDetail.getPurchaseOrderDetail()
                this.$refs.purchaseOrderDetail.getPurchaseLogiList()
                this.$refs.purchaseOrderDetail.getPurchaseAssociatedOrderList()
                this.$refs.purchaseOrderDetail.getPurchaseStatusRate()

            },
            // 导出订单
            exportPurchaseOrder (val) {
                     let params = this.queryData
                     params.startTime = params.timeList ? params.timeList[0] : null
                    params.endTime = params.timeList ? params.timeList[1] : null
                    if(new Date(params.endTime).getTime()-new Date(params.startTime).getTime()<24*60*60*93*1000){
                        if (val === 'noImg') {
                        this.exportNoImgLoading = true
                        params.exportImg = 2
                    } else {
                        this.exportLoading = true
                        params.exportImg = 1
                    }
                    exportoPos(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            this.exportLoading = false
                            this.exportNoImgLoading = false
                            this.$message.success('导出任务已建，请前往采购中心-任务列表下载')
                        } else {
                            this.exportLoading = false
                            this.exportNoImgLoading = false
                            this.$message.error(res.message)
                        }
                    }).catch(err => {
                        this.exportLoading = false
                        console.log(err)
                    })
                }else{
                     if (val === 'noImg') {
                        this.exportNoImgLoading = true
                        setTimeout(()=>{
                            this.exportNoImgLoading = false
                        },2000)
                    } else {
                        this.exportLoading = true
                        setTimeout(()=>{
                            this.exportLoading = false
                        },2000)
                    }
                    this.$message.warning('仅支持导出三个月的采购单数据，请调整创建时间')
                }
                
            },
            // 导出发货单
            exportShipOrder () {
                this.exportLoading = true
                let params = this.queryData
                params.startTime = params.timeList ? params.timeList[0] : null
                params.endTime = params.timeList ? params.timeList[1] : null
                exportShipOrder(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.exportLoading = false
                        let fileUrl = res.fileUrl
                        window.open(this.dealShowFileSrc(fileUrl))
                    } else {
                        this.exportLoading = false
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    this.exportLoading = false
                    console.log(err)
                })
            },
            uploadFile (file) {
                this.uploadLoading = true
                let params = new FormData()
                let fileInfo = {
                    fileName: file.file.name,
                    type: 'other'
                }
                params.append('file', file.file)
                params.append('param', JSON.stringify(fileInfo))
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    if (res.status === '600') {
                        this.importShipRequest(res.original_link)
                    } else {
                        this.$message.error('文件上传失败，请重试！')
                        this.uploadLoading = false
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            importShipRequest (url) {
                let params = {
                    fileUrl: url
                }
                importShip(params).then(res => {
                    this.uploadLoading = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('导入成功')
                        this.getPurchaseOrderList()
                    } else {
                        this.$message.error('导入失败，请重试')
                    }
                }).catch(err => {
                    console.log(err)
                    this.uploadLoading = false
                })
            }
        }
    }
</script>

<style lang="scss">
    .app-puchase{
        .el-table__expanded-cell[class*=cell] {
            padding: 1px 50px;
        }
        .filter-container {
            .product {
                .el-select .el-input {
                    width: 130px;
                }
            }
        }

        .input-with-select .el-input-group__prepend {
            background-color: #fff;
        }

        .item-card {
            margin-bottom: 20px;
        }

        .el-dropdown-link {
            cursor: pointer;
            color: #222;
        }

        .el-icon-arrow-down {
            font-size: 12px;
        }

        .demonstration {
            display: block;
            color: #8492a6;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .el-tooltip__popper {
            max-width: 200px;
        }
    }

</style>

<style lang="scss" scoped>
    .item-card {
        // margin-bottom: 20px;
    }

    .input-width {
        width: 300px;
    }

    .purchase-wrapper {
        overflow: auto;
    }

    .el-icon-circle-close {
        margin: 13px;
    }

    /*.order-btn-box {*/
    /*    display: flex;*/
    /*    flex-direction: column;*/
    /*    .el-button+.el-button {*/
    /*        margin-left: 0;*/
    /*    }*/
    /*    .el-button {*/
    /*        margin-bottom: 10px;*/
    /*    }*/
    /*}*/
    .el-table__header tr,
    .el-table__header th {
        padding: 0;
        height: 20px;
    }
    .el-table__body tr,
    .el-table__body td {
        padding: 0;
        height: 20px;
    }

    .product-info-wrapper {
        .product-info-item {
            align-items: center;
            position: relative;
            .delete-box {
                width: 100px;
                i {
                    margin-left: 10px;
                    cursor: pointer;
                }
            }
        }
        .el-input {
            flex: 1;
        }
    }
</style>
