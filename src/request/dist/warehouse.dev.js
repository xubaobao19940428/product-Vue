"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warehousePage = warehousePage;
exports.purchaseLogiList = purchaseLogiList;
exports.incomeOrderPage = incomeOrderPage;
exports.incomeOrderSign = incomeOrderSign;
exports.logiOrderPage = logiOrderPage;
exports.modifyIncomeOrderLogi = modifyIncomeOrderLogi;
exports.addSignAbnormal = addSignAbnormal;
exports.orderIncome = orderIncome;
exports.abnormalLogiPage = abnormalLogiPage;
exports.abnormalSkuPage = abnormalSkuPage;
exports.purchaseDealAbnormal = purchaseDealAbnormal;
exports.skuAbnormalType = skuAbnormalType;
exports.signAbnormalType = signAbnormalType;
exports.outOrderPage = outOrderPage;
exports.OutOrderNewPage = OutOrderNewPage;
exports.ExportList = ExportList;
exports.outOrderDetail = outOrderDetail;
exports.OutOrderNewDetail = OutOrderNewDetail;
exports.repushOutOrder = repushOutOrder;
exports.cannelOutOrder = cannelOutOrder;
exports.createOutOrder = createOutOrder;
exports.GetTransferWarehouse = GetTransferWarehouse;
exports.TransferOutOrder = TransferOutOrder;
exports.logiCompanyList = logiCompanyList;
exports.AbnormalPurchaseOrder = AbnormalPurchaseOrder;
exports.AbnormalMakeup = AbnormalMakeup;
exports.OverAbnormal = OverAbnormal;
exports.AbnormalProcess = AbnormalProcess;
exports.ExportAbnormalLogi = ExportAbnormalLogi;
exports.ExportAbnormalSku = ExportAbnormalSku;
exports.GetTransferAddress = GetTransferAddress;
exports.getSkuBarCode = getSkuBarCode;
exports.SpiltOutOrder = SpiltOutOrder;
exports.RevokeSpiltOutOrder = RevokeSpiltOutOrder;
exports.GetReissueWarehouse = GetReissueWarehouse;
exports.ReissueOutOrder = ReissueOutOrder;
exports.BarterOutOrder = BarterOutOrder;
exports.EditOutOrder = EditOutOrder;
exports.CancelOutOrder = CancelOutOrder;
exports.DiffInventoryRecordPage = DiffInventoryRecordPage;
exports.DiffInventoryRecordExport = DiffInventoryRecordExport;
exports.ValidateWarehouseInventoryReq = ValidateWarehouseInventoryReq;
exports.NewIncomeOrderPage = NewIncomeOrderPage;
exports.NewIncomeOrderExport = NewIncomeOrderExport;
exports.SyncLogicDetail = SyncLogicDetail;
exports.SyncIncome = SyncIncome;
exports.IncomeProductDetail = IncomeProductDetail;
exports.OrderIncomeCheck = OrderIncomeCheck;
exports.OrderIncome = OrderIncome;
exports.IncomeOrderAbnormalFeedback = IncomeOrderAbnormalFeedback;
exports.EnterAbnormalProduct = EnterAbnormalProduct;

var _request = _interopRequireDefault(require("./request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 仓库列表分页
 * @export
 * @param {*} params
 * @returns
 */
function warehousePage(params) {
  console.log(params);

  var req = _request["default"].create('WarehousePageReq', params);

  return (0, _request["default"])('erp', 'WarehouseBossService.WarehousePage', req, 'warehouse.WarehousePageResp');
}

;
/**
 * 云仓入库单列表
 * @export
 * @param {*} params
 * @returns
 */

function purchaseLogiList(params) {
  console.log(params);

  var req = _request["default"].create('PurchaseLogiListReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.PurchaseLogiList', req, 'warehouse.PurchaseLogiListResp');
}

;
/**
 * 云仓入库订单列表
 * @export
 * @param {*} params
 * @returns
 */

function incomeOrderPage(params) {
  console.log(params);

  var req = _request["default"].create('IncomeOrderPageReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.IncomeOrderPage', req, 'warehouse.IncomeOrderPageResp');
}

;
/**
 * 入库单签收
 * @export
 * @param {*} params
 * @returns
 */

function incomeOrderSign(params) {
  console.log(params);

  var req = _request["default"].create('IncomeOrderSignReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.IncomeOrderSign', req, 'warehouse.IncomeOrderSignResp');
}

;
/**
 * 采购物流列表
 * @export
 * @param {*} params
 * @returns
 */

function logiOrderPage(params) {
  console.log(params);

  var req = _request["default"].create('IncomeOrderPageReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.LogiOrderPage', req, 'warehouse.IncomeOrderPageResp');
}

;
/**
 * 修改物流单
 * @export
 * @param {*} params
 * @returns
 */

function modifyIncomeOrderLogi(params) {
  console.log(params);

  var req = _request["default"].create('ModifyIncomeOrderLogiReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.ModifyIncomeOrderLogi', req, 'warehouse.ModifyIncomeOrderLogiResp');
}

;
/**
 * 入库单签收
 * @export
 * @param {*} params
 * @returns
 */

function addSignAbnormal(params) {
  console.log(params);

  var req = _request["default"].create('AddSignAbnormalReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.AddSignAbnormal', req, 'warehouse.AddSignAbnormalResp');
}

;
/**
 * 确认入库
 * @export
 * @param {*} params
 * @returns
 */

function orderIncome(params) {
  console.log(params);

  var req = _request["default"].create('OrderIncomeReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.OrderIncome', req, 'warehouse.IncomeOrderSignResp');
}

;
/**
 * 包裹异常列表
 * @export
 * @param {*} params
 * @returns
 */

function abnormalLogiPage(params) {
  console.log(params);

  var req = _request["default"].create('AbnormalLogiPageReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.AbnormalLogiPage', req, 'warehouse.AbnormalLogiPageResp');
}

;
/**
 * 商品异常列表
 * @export
 * @param {*} params
 * @returns
 */

function abnormalSkuPage(params) {
  console.log(params);

  var req = _request["default"].create('AbnormalSkuPageReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.AbnormalSkuPage', req, 'warehouse.AbnormalSkuPageResp');
}

;
/**
 * 商品异常列表
 * @export
 * @param {*} params
 * @returns
 */

function purchaseDealAbnormal(params) {
  console.log(params);

  var req = _request["default"].create('PurchaseDealAbnormalReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.PurchaseDealAbnormal', req, 'warehouse.PurchaseDealAbnormalResp');
}

;
/**
 * sku异常类型列表
 * @export
 * @param {*} params
 * @returns
 */

function skuAbnormalType(params) {
  console.log(params);

  var req = _request["default"].create('SkuAbnormalTypeReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.SkuAbnormalType', req, 'warehouse.SkuAbnormalTypeResp');
}

;
/**
 * 签收异常类型列表
 * @export
 * @param {*} params
 * @returns
 */

function signAbnormalType(params) {
  console.log(params);

  var req = _request["default"].create('SignAbnormalTypeReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.SignAbnormalType', req, 'warehouse.SignAbnormalTypeResp');
}

;
/**
 * 仓库出库单分页
 * @export
 * @param {*} params
 * @returns
 */

function outOrderPage(params) {
  console.log(params);

  var req = _request["default"].create('OutOrderPageReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.OutOrderPage', req, 'warehouse.OutOrderPageResp');
}

;
/**
 * 出库单页面改造
 * @export
 * @param {*} params
 * @returns
 */

function OutOrderNewPage(params) {
  console.log(params);

  var req = _request["default"].create('OutOrderNewPageReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.OutOrderNewPage', req, 'warehouse.OutOrderNewPageResp');
}

;
/**
 * 导出出库单
 * @export
 * @param {*} params
 * @returns
 */

function ExportList(params) {
  console.log(params);

  var req = _request["default"].create('OutOrderNewPageReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.ExportList', req, 'warehouse.ExportPoResp');
}

;
/**
 * 仓库出库单分页
 * @export
 * @param {*} params
 * @returns
 */

function outOrderDetail(params) {
  console.log(params);

  var req = _request["default"].create('OutOrderDetailReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.OutOrderDetail', req, 'warehouse.OutOrderDetailResp');
}

;
/**
 * 出库单页面改造后的详情
 * @export
 * @param {*} params
 * @returns
 */

function OutOrderNewDetail(params) {
  console.log(params);

  var req = _request["default"].create('OutOrderNewDetailReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.OutOrderNewDetail', req, 'warehouse.OutOrderNewDetailResp');
}

;
/**
 * 出库单重推
 * @export
 * @param {*} params
 * @returns
 */

function repushOutOrder(params) {
  console.log(params);

  var req = _request["default"].create('RepushOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.RepushOutOrder', req, 'warehouse.RepushOutOrderResp');
}

;
/**
 * 取消出库单
 * @export
 * @param {*} params
 * @returns
 */

function cannelOutOrder(params) {
  console.log(params);

  var req = _request["default"].create('CannelOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.CannelOutOrder', req, 'warehouse.CannelOutOrderResp');
}

;
/**
 * 创建出库单
 * @export
 * @param {*} params
 * @returns
 */

function createOutOrder(params) {
  console.log(params);

  var req = _request["default"].create('CreateOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.CreateOutOrder', req, 'warehouse.CreateOutOrderResp');
}

;
/**
 * 获取出库单可调的仓库
 * @export
 * @param {*} params
 * @returns
 */

function GetTransferWarehouse(params) {
  console.log(params);

  var req = _request["default"].create('GetTransferWarehouseReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.GetTransferWarehouse', req, 'warehouse.GetTransferWarehouseResp');
}

;
/**
 * 出库单调仓
 * @export
 * @param {*} params
 * @returns
 */

function TransferOutOrder(params) {
  console.log(params);

  var req = _request["default"].create('TransferOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.TransferOutOrder', req, 'warehouse.TransferOutOrderResp');
}

;
/**
 * 物流公司列表
 * @export
 * @param {*} params
 * @returns
 */

function logiCompanyList(params) {
  var req = _request["default"].create('LogiCompanyReq', params);

  return (0, _request["default"])('erp', 'WarehouseBossService.LogiCompany', req, 'warehouse.LogiCompanyResp');
}

;
/**
 * 获取异常单采购单列表*
 * @export
 * @param {*} params
 * @returns
 */

function AbnormalPurchaseOrder(params) {
  var req = _request["default"].create('AbnormalPurchaseOrderReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.AbnormalPurchaseOrder', req, 'warehouse.AbnormalPurchaseOrderResp');
}

;
/**
 * 异常补单
 * @export
 * @param {*} params
 * @returns
 */

function AbnormalMakeup(params) {
  var req = _request["default"].create('AbnormalMakeupReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.AbnormalMakeup', req, 'warehouse.AbnormalMakeupResp');
}

;
/**
 * 异常完结
 * @export
 * @param {*} params
 * @returns
 */

function OverAbnormal(params) {
  var req = _request["default"].create('OverAbnormalReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.OverAbnormal', req, 'warehouse.OverAbnormalResp');
}

;
/**
 * 异常处理列表
 * @export
 * @param {*} params
 * @returns
 */

function AbnormalProcess(params) {
  var req = _request["default"].create('AbnormalProcessReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.AbnormalProcess', req, 'warehouse.AbnormalProcessResp');
}

;
/**
 *  导出异常包裹
 * @export
 * @param {*} params
 * @returns
 */

function ExportAbnormalLogi(params) {
  var req = _request["default"].create('AbnormalLogiPageReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.ExportAbnormalLogi', req, 'warehouse.ExportAbnormalLogiResp');
}

;
/**
 * 导出异常sku
 * @export
 * @param {*} params
 * @returns
 */

function ExportAbnormalSku(params) {
  var req = _request["default"].create('AbnormalSkuPageReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.ExportAbnormalSku', req, 'warehouse.ExportAbnormalSkuResp');
}

;
/**
 *  获取中转仓库
 * @export
 * @param {*} params
 * @returns
 */

function GetTransferAddress(params) {
  var req = _request["default"].create('GetTransferAddressReq', params);

  return (0, _request["default"])('erp', 'WarehouseBossService.GetTransferAddress', req, 'warehouse.GetTransferAddressResp');
}

; // 获取条形码

function getSkuBarCode(params) {
  var req = _request["default"].create('GetSkuBarCodeReq', params);

  return (0, _request["default"])('erp', 'WarehouseBossService.GetSkuBarCode', req, 'warehouse.GetSkuBarCodeResp');
}

;
/**
 *  拆单
 * @export
 * @param {*} params
 * @returns
 */

function SpiltOutOrder(params) {
  var req = _request["default"].create('SpiltOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.SpiltOutOrder', req, 'warehouse.SpiltOutOrderResp');
}

;
/**
 * 撤销拆单
 * @export
 * @param {*} params
 * @returns
 */

function RevokeSpiltOutOrder(params) {
  var req = _request["default"].create('RevokeSpiltOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.RevokeSpiltOutOrder', req, 'warehouse.RevokeSpiltOutOrderResp');
}

;
/**
 * 获取补发的仓库列表
 * @export
 * @param {*} params
 * @returns
 */

function GetReissueWarehouse(params) {
  var req = _request["default"].create('GetReissueWarehouseReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.GetReissueWarehouse', req, 'warehouse.GetReissueWarehouseResp');
}

;
/**
 * 补发
 * @export
 * @param {*} params
 * @returns
 */

function ReissueOutOrder(params) {
  var req = _request["default"].create('ReissueOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.ReissueOutOrder', req, 'warehouse.ReissueOutOrderResp');
}

;
/**
 * 换货
 * @export
 * @param {*} params
 * @returns
 */

function BarterOutOrder(params) {
  var req = _request["default"].create('BarterOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.BarterOutOrder', req, 'warehouse.BarterOutOrderResp');
}

;
/**
 * 编辑出库单 （m目前只支持编辑未出库的 补发、换货 出库单）
 * @export
 * @param {*} params
 * @returns
 */

function EditOutOrder(params) {
  var req = _request["default"].create('EditOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.EditOutOrder', req, 'warehouse.EditOutOrderResp');
}
/**
 * B2C跨境订单单详情
 * @export
 * @param {*} params
 * @returns
 */
// export function OutOrderNewDetail (params) {
//     const req = request.create('OutOrderNewDetailReq', params)
//     return request('erp', 'OutOrderBossService.OutOrderNewDetail', req, 'warehouse.OutOrderNewDetailResp')
// }

/**
 * 取消出库单
 * @export
 * @param {*} params
 * @returns
 */


function CancelOutOrder(params) {
  var req = _request["default"].create('CancelOutOrderReq', params);

  return (0, _request["default"])('erp', 'OutOrderBossService.CancelOutOrder', req, 'warehouse.CancelOutOrderResp');
} //库存校验

/**
 * 库存校验列表
 * @export
 * @param {*} params
 * @returns
 */


function DiffInventoryRecordPage(params) {
  var req = _request["default"].create('DiffInventoryRecordPageReq', params);

  return (0, _request["default"])('erp', 'DiffInventoryRecordBossService.DiffInventoryRecordPage', req, 'warehouse.DiffInventoryRecordPageResp');
}
/**
 * 导出库存校验列表
 * @export
 * @param {*} params
 * @returns
 */


function DiffInventoryRecordExport(params) {
  var req = _request["default"].create('DiffInventoryRecordPageReq', params);

  return (0, _request["default"])('erp', 'DiffInventoryRecordBossService.DiffInventoryRecordExport', req, 'warehouse.DiffInventoryRecordExportResp');
}
/**
 * 重新校验
 * @export
 * @param {*} params
 * @returns
 */


function ValidateWarehouseInventoryReq(params) {
  var req = _request["default"].create('ValidateWarehouseInventoryReq', params);

  return (0, _request["default"])('erp', 'DiffInventoryRecordBossService.ValidateWarehouseInventory', req, 'warehouse.ValidateWarehouseInventoryResp');
} //新入库单接口

/**
 * 新入库单列表
 * @params
 */


function NewIncomeOrderPage(params) {
  var req = _request["default"].create('NewIncomeOrderPageReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.NewIncomeOrderPage', req, 'warehouse.NewIncomeOrderPageResp');
}
/**
 *  NewIncomeOrderExport 导出入库单
 * @params
 *
 */


function NewIncomeOrderExport(params) {
  var req = _request["default"].create('NewIncomeOrderPageReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.NewIncomeOrderExport', req, 'warehouse.NewIncomeOrderExportResp');
}
/**
 * 同步物流信息
 * @params
 *
 */


function SyncLogicDetail(params) {
  var req = _request["default"].create('SyncLogicDetailReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.SyncLogicDetail', req, 'warehouse.SyncLogicDetailResp');
}
/**
 * 同步入库信息
 * @params
 *
 */


function SyncIncome(params) {
  var req = _request["default"].create('SyncIncomeReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.SyncIncome', req, 'warehouse.SyncIncomeResp');
}
/**
 * 入库单详情
 * @params
 *
 */


function IncomeProductDetail(params) {
  var req = _request["default"].create('IncomeProductDetailReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.IncomeProductDetail', req, 'warehouse.IncomeProductDetailResp');
}
/**
 * 确认入库校验
 * @params
 *
 */


function OrderIncomeCheck(params) {
  var req = _request["default"].create('OrderIncomeCheckReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.OrderIncomeCheck', req, 'warehouse.OrderIncomeCheckResp');
}
/**
 * 入库
 * @params
 *
 */


function OrderIncome(params) {
  var req = _request["default"].create('OrderIncomeReq', params);

  return (0, _request["default"])('erp', 'IncomeOrderBossService.OrderIncome', req, 'warehouse.OrderIncomeResp');
}
/**
 * 异常商品以及包裹
 * @param
 * 
 */
//输入物流单号异常信息


function IncomeOrderAbnormalFeedback(params) {
  var req = _request["default"].create('IncomeOrderAbnormalFeedbackReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.IncomeOrderAbnormalFeedback', req, 'warehouse.IncomeProductDetailResp');
} //输入异常商品信息


function EnterAbnormalProduct(params) {
  var req = _request["default"].create('EnterAbnormalProductReq', params);

  return (0, _request["default"])('erp', 'AbnormalBossService.EnterAbnormalProduct', req, 'warehouse.EnterAbnormalProductResp');
}