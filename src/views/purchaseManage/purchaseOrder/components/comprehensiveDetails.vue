<template>
  <el-dialog
    title="采购单详情"
    :visible.sync="List.show"
    width="60%"
    height="50%"
    @close="List.show = false"
    :close-on-click-modal="false"
    class="comprehensive-detail"
  >
    <el-card class="item-card">
      <div class="item-statue">
        <div class="progress-box">
          <div class="progress-line">
            <div class="progress-title">推送采购单</div>
            <div class="progress-time">{{statusRate.pushTime==""?'-':statusRate.pushTime}}</div>
            <div class="progress-show">
              <div v-if="statusRate.pushTime===''?false:true" class="push-b"></div>
              <div v-if="statusRate.pushTime===''?true:false" class="push-g"></div>
              <el-progress
                :percentage="statusRate.pushContinueTime==='0'?0:statusRate.confirmTime===''?50:100"
              ></el-progress>
            </div>
            <div class="progress-continue">{{formatSecondsTo(statusRate.pushContinueTime)}}</div>
          </div>
          <div class="progress-line">
            <div class="progress-title">确认采购单</div>
            <div class="progress-time">{{statusRate.confirmTime===''?'-':statusRate.confirmTime}}</div>
            <div class="progress-show">
              <div v-if="statusRate.confirmTime===''?false:true" class="confirm-b"></div>
              <div v-if="statusRate.confirmTime===''?true:false" class="confirm-g"></div>
              <el-progress
                :percentage="statusRate.confirmContinueTime==='0'?0:statusRate.detail && statusRate.detail.length!==0?100:50"
              ></el-progress>
            </div>
            <div class="progress-continue">{{formatSecondsTo(statusRate.confirmContinueTime)}}</div>
          </div>
        </div>
        <div v-if="statusRate.detail && statusRate.detail.length!==0" class="progress-product-list">
          <div v-for="(item,index) in statusRate.detail" :key="index">
            <div class="progress-detail">
              <div class="progress-line">
                <div class="progress-brige" v-if="index!==0"></div>
                <div class="progress-title" :style="{'padding-left':index!==0?'10px':'0px'}">商家发货</div>
                <div
                  class="progress-time"
                  :style="{'padding-left':index!==0?'10px':'0px'}"
                >{{item.deliveryTime==""?'-':item.deliveryTime}}</div>
                <div class="progress-show">
                  <div v-if="item.deliveryTime===''?false:true" class="push-b"></div>
                  <div v-if="item.deliveryTime===''?true:false" class="push-g"></div>
                  <el-progress
                    :percentage="item.deliveryContinueTime==='0'?0:item.signTime===''?50:100"
                  ></el-progress>
                </div>
                <div
                  class="progress-continue"
                  v-if="item.deliveryContinueTime!=='0'"
                >{{formatSecondsTo(item.deliveryContinueTime)}}</div>
                <div class="progress-continue"></div>
              </div>
              <div class="progress-line">
                <div class="progress-title">物流签收</div>
                <div class="progress-time">{{item.signTime==""?'-':item.signTime}}</div>
                <div class="progress-show">
                  <div v-if="item.signTime===''?false:true" class="push-b"></div>
                  <div v-if="item.signTime===''?true:false" class="push-g"></div>
                  <el-progress
                    :percentage="item.signContinueTime==='0'?0:item.incomeTime===''?50:100"
                  ></el-progress>
                </div>
                <div
                  class="progress-continue"
                  v-if="item.signContinueTime!=='0'"
                >{{formatSecondsTo(item.signContinueTime)}}</div>
                <div class="progress-continue"></div>
              </div>
              <div class="progress-line">
                <div class="progress-title">仓库入库</div>
                <div class="progress-time">{{item.incomeTime==""?'-':item.incomeTime}}</div>
                <div class="progress-show">
                  <div v-if="item.incomeTime===''?false:true" class="push-b" style="width:10px;"></div>
                  <div v-if="item.incomeTime===''?true:false" class="push-g" style="width:10px;"></div>
                </div>
                <div
                  class="progress-continue"
                  v-if="item.incomeContinueTime!=='0'"
                >{{formatSecondsTo(item.incomeContinueTime)}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="progress-product">
          <div class="progress-line">
            <div class="progress-title">商家发货</div>
            <div class="progress-time" style="height:12px;">-</div>
            <div class="progress-show">
              <div class="confirm-g"></div>
              <el-progress :percentage="0"></el-progress>
            </div>
            <div class="progress-continue"></div>
          </div>
          <div class="progress-line">
            <div class="progress-title">物流签收</div>
            <div class="progress-time" style="height:12px;">-</div>
            <div class="progress-show">
              <div class="confirm-g"></div>
              <el-progress :percentage="0"></el-progress>
            </div>
            <div class="progress-continue"></div>
          </div>
          <div class="progress-line">
            <div class="progress-title">仓库入库</div>
            <div class="progress-time" style="height:12px;">-</div>
            <div class="progress-show">
              <div class="confirm-g" style="width:10px;"></div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="item-card">
      <div slot="header" class="clearfix">
        <span>采购单信息</span>
      </div>
      <el-table :data="orderDetail" :loading="loading" style="width: 100%; font-size: 10px">
        <el-table-column label="采购单号" min-width="200px" fixed="left" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.purchaseOrderNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="收货仓库" align="center" min-width="100px" prop="warehouseName"></el-table-column>
        <el-table-column label="采购单创建时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | secondTimeFormat}}</div>
          </template>
        </el-table-column>
        <el-table-column label="供应商名称" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.supplierName || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="采购单状态" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ purchaseOrderStatus[scope.row.purchaseOrderStatus]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="剩余处理时间" min-width="110px" align="center">
          <template slot-scope="scope">
            <div :class="judgeTime(scope.row.retainTime)">{{ scope.row.retainTime || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="采购员" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.buyerName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="采购总金额" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.purchaseAmount || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="运费" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.freight || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="关联采购单号" min-width="240px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.relPurchaseOrderNo || '-'}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="item-card">
      <div slot="header" class="clearfix">
        <span>采购单商品列表</span>
      </div>
      <el-table :data="productList" :loading="loading" style="width: 100%; font-size: 10px">
        <el-table-column label="skuCode" prop="skuCode" min-width="200px" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="productName" min-width="200px" align="center"></el-table-column>
        <el-table-column label="SKU图片" min-width="140px" align="center">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover">
              <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage" />
              <img
                :src="dealShowFileSrc(scope.row.productCover)"
                class="thumbnail"
                slot="reference"
              />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="sku属性" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.skuDesc}}</div>
          </template>
        </el-table-column>
        <el-table-column label="采购单价" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.purchasePrice || '-'}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="销售单价" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.productSalePrice}}</div>
                    </template>
        </el-table-column>-->
        <el-table-column label="采购金额" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.totalPrice || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="系统采购数量" min-width="110px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.systemCount || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="采购数量" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.purchaseCount || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="取消数量" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.cancelCount || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="发货数量" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>
              <div
                v-if="scope.row.shipCount != 0"
                @click="showShip(scope.row)"
                class="ship-number"
              >{{ scope.row.shipCount}}</div>
              <div v-else>{{ scope.row.shipCount}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="入库数量" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.incomeNum || '0'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="异常数量" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>
              <div
                v-if="scope.row.incomeAbnormalNum != 0"
                @click="showAbnormal(scope.row)"
                class="abnormal-number"
              >{{ scope.row.incomeAbnormalNum}}</div>
              <div v-else>{{ scope.row.incomeAbnormalNum}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="缺货数量" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.stockoutNum || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品链接" min-width="240px" align="center">
          <template slot-scope="scope">
            <a
              :href="scope.row.productLink"
              target="_blank"
              style="color: #66b1ff"
            >{{ scope.row.productLink}}</a>
          </template>
        </el-table-column>
        <el-table-column label="第三方订单号" min-width="240px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.thirdOrderNo || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="发货时间" min-width="100px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.shipTime | secondTimeFormat}}</div>
          </template>
        </el-table-column>
        <el-table-column label="供应商编码" min-width="130px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.supplierCode || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品条码" min-width="130px" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.qrCode || '-'}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="item-card">
      <div slot="header" class="clearfix">
        <span>物流单信息</span>
      </div>
      <!-- <el-table :data="logiList"  :loading="loading" style="width: 100%; font-size: 10px">
                <el-table-column label="物流号" min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.logiCode}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="物流公司 " min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.logiCompany}}</div>
                        <div>{{ getCompanyName(scope.row.logisticsCompany)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="收货时间 " min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.signTime | secondTimeFormat}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间 " min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.createTime | secondTimeFormat}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="入库时间 " min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.incomeTime | secondTimeFormat}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="是否存在异常" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isAbnormal===2">否</div>
                        <div v-if="scope.row.isAbnormal===1">是</div>
                    </template>
                </el-table-column>
      </el-table>-->

      <el-table :data="shipListData" style="width: 100%; font-size: 10px">
        <el-table-column label="物流单号" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.logiCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="物流公司" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.logiCompany}}</div>
          </template>
        </el-table-column>
        <el-table-column label="发货数量" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.deliveryCount}}</div>
          </template>
        </el-table-column>
        <el-table-column label="入库数量" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.incomeNum}}</div>
          </template>
        </el-table-column>
        <el-table-column label="异常数量" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.abnormalNum}}</div>
          </template>
        </el-table-column>
        <el-table-column label="签收状态" align="center" min-width="120px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.signStatus === 1" type="success" size="mini">仓储签收</el-tag>
            <el-tag v-if="scope.row.signStatus === 2" size="mini">仓储未签收</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="incomeStatus" min-width="120px" align="center" label="入库状态">
          <template slot-scope="scope">
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 1" size="mini">已入库</el-tag>
            <el-tag
              effect="plain"
              v-if="scope.row.incomeStatus === 2"
              type="success"
              size="mini"
            >未入库</el-tag>
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 3" size="mini">已取消</el-tag>
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 4" size="mini">已完结</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="系统发货时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.deliveryTime}}</div>
            <div>{{formatSecondsTo(scope.row.deliveryTimeContinue)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="签收时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.signTime}}</div>
            <div>{{formatSecondsTo(scope.row.signTimeContinue)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="入库时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.incomeTime}}</div>
            <div>{{formatSecondsTo(scope.row.incomeTimeContinue)}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="item-card">
      <div slot="header" class="clearfix">
        <span>异常信息</span>
      </div>
      <!-- <el-table :data="exceptionInfo" style="width: 100%; font-size: 10px">
                <el-table-column label="是否有商品异常" min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.isAbnormalStr}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="全部入库时间" min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.allIncomeTime | secondTimeFormat}}</div>
                    </template>
                </el-table-column>
      </el-table>-->
      <el-table :data="abnormalListData" style="width: 100%; font-size: 10px">
        <el-table-column label="异常单号" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.abnormalNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="异常类型" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.abnormalType}}</div>
          </template>
        </el-table-column>
        <el-table-column label="异常数量" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.abnormalNum}}</div>
          </template>
        </el-table-column>
        <el-table-column label="异常状态" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.abnormalStatus===1?"处理中":scope.row.abnormalStatus===2?"待处理":"已完结"}}</div>
          </template>
        </el-table-column>
        <el-table-column label="异常发起时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.abnormalCreateTime}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="item-card">
      <div slot="header" class="clearfix">
        <span>关联订单需求</span>
      </div>
      <el-table :data="associatedOrder" style="width: 100%; font-size: 10px">
        <el-table-column label="主订单号" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.orderNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品" min-width="140px" align="center">
          <template slot-scope="scope">
            <img :src="dealShowFileSrc(scope.row.productCover)" class="thumbnail" />
          </template>
        </el-table-column>
        <el-table-column label="规格" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.skuDesc}}</div>
          </template>
        </el-table-column>
        <el-table-column label="购买数量" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.buyCount}}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.createTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.payTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="140px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.orderStatus | statusFilter}}</div>
            <div>{{formatSecondsTo(scope.row.continueTime)}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="售后状态" min-width="180px" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.afterStatus | afterStatusFilter}}</div>
                    </template>
        </el-table-column>-->
        <el-table-column label="关联出库单" min-width="180px" align="center">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.outInfo" :key="index">
              <div class="out-info">{{item.outNo}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="出库单状态" min-width="140px" align="center">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.outInfo" :key="index">
              <div>{{outOrderStatus[item.outStatus]}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="queryData.page.pageNum"
          :page-sizes="[5,10, 20, 30, 50]"
          :page-size="queryData.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryData.total"
        ></el-pagination>
      </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeall" size="small">关 闭</el-button>
    </div>
    <sku-ship-dialog
      :dialogVisible="shipDialog"
      :shipData="shipData"
      :shipItemData="shipItemData"
      @closeDialog="closeShipDialog"
    ></sku-ship-dialog>
    <sku-abnormal-dialog
      :dialogVisible="abnormalDialog"
      :abnormalData="abnormalData"
      :abnormalItemData="abnormalItemData"
      @closeDialog="closeAbnormalDialog"
    ></sku-abnormal-dialog>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import {
  getPurchaseOrder,
  getPurchaseRelationOrder,
  getSkuDeliveryDetail,
  getSkuAbnormalDetail,
  getPurchaseStatusRate,
} from "@/request/purchase";
import { purchaseLogiList } from "@/request/warehouse";
import common from "@/views/purchaseManage/common/common";
import logisticsCompany from "@/data/company.js";
import skuShipDialog from "./skuShipDialog";
import skuAbnormalDialog from "./skuAbnormalDialog";
import { formatTime } from "@/js/common/filter";

export default {
  name: "comprehensiveDetails",
  props: {
    List: {
      type: Object,
      default: function () {},
    },
  },
  mixins: [common],
  data() {
    return {
      loading: false,
      orderDetail: [],
      productList: [],
      logiList: [],
      exceptionInfo: [
        {
          isAbnormalStr: "",
          allIncomeTime: "",
        },
      ],
      associatedOrder: [],
      queryData: {
        page: {
          pageSize: 10,
          pageNum: 1,
          pagingSwitch: true,
        },
        total: 0,
      },
      skuCode: "",
      shipDialog: false,
      shipItemData: {},
      shipData: [],
      abnormalDialog: false,
      abnormalItemData: {},
      abnormalData: [],
      statusRate: {},
      shipListData: [],
      abnormalListData: [],
      outOrderStatus: {
        0: "-",
        1: "已出库",
        2: "未出库",
        3: "已取消",
      },
    };
  },
  components: {
    skuShipDialog,
    skuAbnormalDialog,
  },
  watch: {
    statusRate(val) {
      console.log(val);
    },
    deep: true,
  },
  methods: {
    // 获取物流公司名称
    getCompanyName(item) {
      let data = logisticsCompany.find((val) => {
        return val.code == item;
      });
      return data ? data.name : item;
    },
    // 判断时间趋势
    judgeTime(time) {
      if (time.indexOf("订单") < 0) {
        return "security";
      } else {
        return "warning";
      }
    },
    // 判断状态趋势
    judgeState(state) {
      if (state > 0) {
        return "warning";
      } else {
        return "security";
      }
    },
    formatSeconds(time) {
      return formatSeconds(time);
    },
    closeall() {
      this.List.show = false;
      if ((this.List.show = false)) {
        this.List.detailList = [];
      }
    },
    /**
     * 获取采购订单详情
     */
    getPurchaseOrderDetail() {
      this.loading = true;
      let params = {
        purchaseOrderNo: this.List.purchaseOrderNo,
      };
      getPurchaseOrder(params)
        .then((res) => {
          this.loading = false;
          this.orderDetail = [];
          if (res.ret.errcode === 1) {
            let orderDetailItem = {};
            let order = res.order;
            orderDetailItem.purchaseOrderNo = order.purchaseOrderNo;
            orderDetailItem.warehouseName = order.warehouseName;
            orderDetailItem.createTime = order.createTime;
            orderDetailItem.supplierName = order.supplierName;
            orderDetailItem.purchaseOrderStatus = order.purchaseOrderStatus;
            orderDetailItem.supplierName = order.supplierName;
            orderDetailItem.buyerName = order.buyerName;
            orderDetailItem.purchasePrice = order.purchasePrice;
            orderDetailItem.freight = order.freight;
            orderDetailItem.refPurchaseOrderNo = order.refPurchaseOrderNo;
            orderDetailItem.purchaseAmount = order.orderDetailItem;
            orderDetailItem.retainTime = order.retainTime;
            orderDetailItem.purchaseAmount = order.purchaseAmount;
            this.orderDetail.push(orderDetailItem);
            this.productList = order.details;
            this.skuCode = order.details[0].skuCode;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    /**
     * 获取物流单信息
     */
    getPurchaseLogiList() {
      this.loading = true;
      let params = {
        purchaseOrderNo: this.List.purchaseOrderNo,
      };
      purchaseLogiList(params)
        .then((res) => {
          this.loading = false;
          if (res.ret.errcode === 1) {
            this.logiList = res.logi;
            if (this.logiList.length > 0) {
              if (_.find(this.logiList, { isAbnormal: 1 })) {
                this.exceptionInfo[0].isAbnormalStr = "是";
              } else {
                this.exceptionInfo[0].isAbnormalStr = "否";
              }
            } else {
              this.exceptionInfo[0].isAbnormalStr = "-";
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    /**
     * 采购单详情状态进度
     */
    getPurchaseStatusRate() {
      let params = {
        purchaseOrderNo: this.List.purchaseOrderNo,
        // purchaseOrderNo: "PON460702700212850688"
      };
      getPurchaseStatusRate(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.$set(this.statusRate, "pushContinueTime", res.pushContinueTime);
          this.$set(this.statusRate, "pushTime", res.pushTime);
          this.$set(this.statusRate, "confirmTime", res.confirmTime);
          this.$set(
            this.statusRate,
            "confirmContinueTime",
            res.confirmContinueTime
          );
          this.$set(this.statusRate, "detail", res.detail);
          console.log(this.statusRate);
        }
      });
    },
    /**
     * 获取关联订单需求信息
     */
    getPurchaseAssociatedOrderList() {
      this.loading = true;
      let params = {
        purchaseOrderNo: this.List.purchaseOrderNo,
        page: this.queryData.page,
      };
      getPurchaseRelationOrder(params).then((res) => {
        this.loading = false;
        if (res.ret.errcode === 1) {
          console.log(res);
          this.associatedOrder = res.list;
          this.queryData.total = res.total;
        }
      });
    },
    outStatus(status) {
      switch (status) {
        case 0:
          return "-";
        case 1:
          return "已出库";
        case 2:
          return "未出库";
        case 3:
          return "已取消";
      }
    },
    formatSecondsTo(mss) {
      // console.log(mss)
      let duration;
      let days = parseInt(mss / (1000 * 60 * 60 * 24));
      let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = parseInt((mss % (1000 * 60)) / 1000);
      if (days > 0)
        duration =
          days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
      else if (hours > 0)
        duration = hours + "小时" + minutes + "分" + seconds + "秒";
      else if (minutes > 0) duration = minutes + "分" + seconds + "秒";
      else if (seconds > 0) duration = seconds + "秒";
      // console.log(duration)
      return duration;
    },
    // 分页
    handleSizeChange(val) {
      this.queryData.page.pageSize = val;
      this.getPurchaseAssociatedOrderList();
    },
    handleCurrentChange(val) {
      this.queryData.page.pageNum = val;
      this.getPurchaseAssociatedOrderList();
    },
    // 点击发货数量
    showShip(val) {
      console.log(val);
      this.shipDialog = true;
      this.skuCode = val.skuCode;
      this.getSkuDeliveryDetail();
      this.shipItemData.productCover = val.productCover;
      this.shipItemData.purchaseCount = val.purchaseCount;
      this.shipItemData.productName = val.productName;
      this.shipItemData.skuDesc = val.skuDesc;
    },
    /**
     * sku级别发货详情
     */
    getSkuDeliveryDetail(code) {
      console.log("ddd");
      this.loading = true;
      let params = {
        purchaseOrderNo: this.List.purchaseOrderNo,
        skuCode: this.skuCode,
      };
      getSkuDeliveryDetail(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.shipData = res.item;
          console.log(this.shipData);
        }
      });
    },
    getAllSkuDeliveryDetail(code) {
      this.shipListData.splice(0);
      console.log("fff");
      console.log(code);
      this.loading = true;
      let params = {
        purchaseOrderNo: this.List.purchaseOrderNo,
        skuCode: code,
      };
      getSkuDeliveryDetail(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          for (const iterator of res.item) {
            this.shipListData.push(iterator);
          }
          console.log(this.shipListData);
        }
      });
    },
    // 点击异常数量
    showAbnormal(val) {
      this.abnormalDialog = true;
      this.skuCode = val.skuCode;
      this.getSkuAbnormalDetail();
      this.abnormalItemData.productCover = val.productCover;
      this.abnormalItemData.purchaseCount = val.purchaseCount;
      this.abnormalItemData.productName = val.productName;
      this.abnormalItemData.skuDesc = val.skuDesc;
    },
    /**
     * 采购sku异常详情
     */
    getSkuAbnormalDetail() {
      this.loading = true;
      let params = {
        purchaseOrderNo: this.List.purchaseOrderNo,
        skuCode: this.skuCode,
      };
      getSkuAbnormalDetail(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.abnormalData = res.item;
        }
      });
    },
    getAllSkuAbnormalDetail(code) {
      this.abnormalListData.splice(0);
      this.loading = true;
      let params = {
        purchaseOrderNo: this.List.purchaseOrderNo,
        skuCode: code,
      };
      getSkuAbnormalDetail(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          for (const iterator of res.item) {
            this.abnormalListData.push(iterator);
          }
        }
      });
    },
    closeShipDialog() {
      this.shipDialog = false;
    },
    closeAbnormalDialog() {
      this.abnormalDialog = false;
    },
  },
};
</script>
<style lang="scss">
.comprehensive-detail {
  .el-progress {
    width: 200px;
    display: flex;
    align-items: center;
  }
  .el-progress__text {
    display: none;
  }
  .el-progress-bar__outer {
    width: 140px;
    height: 3px !important;
  }
}
</style>
<style lang="scss" scoped>
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 10px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 10px;
}
.item-card {
  margin-bottom: 20px;
}
.comprehensive-detail {
  .item-statue {
    display: flex;
  }
  .progress-box {
    display: flex;
  }
  .abnormal-number {
    cursor: pointer;
    color: #409eff;
  }
  .ship-number {
    cursor: pointer;
    color: #409eff;
  }
  .progress-line {
    position: relative;
    width: 150px;
    font-size: 12px;
  }
  .progress-show {
    display: flex;
    height: 10px;
  }
  .progress-title {
    font-weight: bold;
  }
  .progress-time {
    font-size: 10px;
    font-weight: 200;
    margin: 2px 0;
  }
  .push-b {
    width: 15px;
    height: 10px;
    border-radius: 50%;
    background-color: #409eff;
  }
  .push-g {
    width: 15px;
    height: 10px;
    border-radius: 50%;
    background-color: #ebeef5;
  }
  .confirm-b {
    width: 15px;
    height: 10px;
    border-radius: 50%;
    background-color: #409eff;
  }
  .confirm-g {
    width: 15px;
    height: 10px;
    border-radius: 50%;
    background-color: #ebeef5;
  }
  .progress-continue {
    text-align: center;
    font-size: 10px;
  }
  .progress-product-list {
    display: flex;
    flex-direction: column;
  }
  .progress-product {
    display: flex;
  }
  .progress-detail {
    display: flex;
  }
  .progress-brige {
    position: absolute;
    height: 2px;
    background-color: #409eff;
    width: 60px;
    left: -25px;
    top: 10px;
    transform: rotate(90deg);
  }
  .out-info {
    color: #409eff;
  }
}
</style>
