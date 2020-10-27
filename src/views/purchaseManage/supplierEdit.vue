<template>
  <div class="app-container">
    <div class="filter-container flex-between--center">
      <span class="pageTitle">{{ this.title }}</span>
      <div>
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          size="small"
          :loading="saveLoading"
          @click="clickToSave('1')"
        >保存</el-button>
        <el-button type="primary" icon="el-icon-delete" size="small" @click="clickToCancel">取消</el-button>
      </div>
    </div>

    <el-form
      class="form"
      :rules="supplierRules"
      label-position="top"
      label-width="80%"
      :model="supplierDetail"
      ref="supplierDetail"
      v-loading="loading"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="font-size:20px;font-weight:900">
          <span>基本信息</span>
        </div>
        <el-row :gutter="12">
          <el-col :span="12">
            <div>供应商ID：{{supplierDetailId}}</div>
            <el-form-item prop="supplierName">
              <template slot="label">
                <span>供应商名称</span>
                <span style="color:#666666;margin-left:40px;">供应商生效后如需修改名称，请联系采购部门领导</span>
              </template>
              <el-input
                v-model="supplierDetail.supplierName"
                placeholder="请输入供应商名称/最多40个字"
                style="width:90%"
                :maxlength="40"
                size="medium"
                :readonly="readonly"
              ></el-input>
              <el-link
                v-if="readonly&&canModifyName==1"
                size="small"
                :underline="false"
                type="primary"
                @click="editSupplierReadonly"
                style="margin-left:5px;"
              >编辑</el-link>
              <el-link v-if="!readonly&&canModifyName==1" size="small" :underline="false" type="primary" @click="clickToSave('2')">保存</el-link>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="国家名称：" prop="countryCode">
                  <el-select
                    v-model="supplierDetail.countryCode"
                    filterable
                    clearable
                    size="medium"
                    class="col_select"
                  >
                    <el-option
                      v-for="item in countryList"
                      :key="item.shortCode"
                      :label="item.nameLocal"
                      :value="item.shortCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <el-form-item
                    v-if="supplierDetail.isUseFingoSystem==1"
                    prop="supplierContact"
                    label="供应商联系人"
                  >
                    <el-input
                      v-model="supplierDetail.supplierContact"
                      placeholder="请输入供应商联系人姓名"
                      class="col_select"
                      size="medium"
                    ></el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item v-if="supplierDetail.isUseFingoSystem!=1" label="供应商联系人">
                    <el-input
                      v-model="supplierDetail.supplierContact"
                      placeholder="请输入供应商联系人姓名"
                      class="col_select"
                      size="medium"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="type" label="供应商类型：">
                  <el-select v-model="supplierDetail.type" size="medium" class="col_select">
                    <el-option
                      v-for="(item, index) in supplierTypeList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <el-form-item
                    v-if="supplierDetail.isUseFingoSystem==1"
                    prop="supplierContactMobile"
                    :rules='[{
                   required: true,
                  message: "供应商联系人电话不能为空",
                  trigger: "blur"
                }]'
                    label="联系电话"
                  >
                    <el-input
                      v-model="supplierDetail.supplierContactMobile"
                      placeholder="请输入供应商联系人电话"
                      class="col_select"
                      size="medium"
                    ></el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="联系电话" v-if="supplierDetail.isUseFingoSystem!=1">
                    <el-input
                      v-model="supplierDetail.supplierContactMobile"
                      placeholder="请输入供应商联系人电话"
                      class="col_select"
                      size="medium"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="是否使用贴码：" label-width="120px" class="inline_label">
              <el-radio-group v-model="supplierDetail.isUseSticker">
                <el-radio :label="2">不使用</el-radio>
                <el-radio :label="1">使用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div>供应商简码：{{supplierDetailShortCode}}</div>
            <el-form-item label="供应商简称">
              <el-input
                v-model="supplierDetail.shortName"
                placeholder="请输入供应商简称/最多40个字"
                style="width:90%"
                :maxlength="40"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="合作状态：" prop="cooperativeStatus">
                  <el-select
                    v-model="supplierDetail.cooperativeStatus"
                    size="medium"
                    class="col_select"
                  >
                    <el-option
                      v-for="(item, i) in cooperativeStatus"
                      :key="i"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邮箱地址">
                  <el-input
                    v-model="supplierDetail.email"
                    placeholder="请输入供应商联系人邮箱地址"
                    size="medium"
                    class="col_select"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采购BD负责人：">
                  <el-select
                    v-model="supplierDetail.buyerUserId"
                    clearable
                    filterable
                    size="medium"
                    class="col_select"
                  >
                    <el-option
                      v-for="(item, index) in accountBDList"
                      :key="index"
                      :label="item.nickName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="是否使用fingo系统：" label-width="150px" class="inline_label">
              <el-radio-group v-model="supplierDetail.isUseFingoSystem">
                <el-radio :label="2">不使用</el-radio>
                <el-radio :label="1">使用</el-radio>
              </el-radio-group>
              <el-select
                v-model="supplierDetail.userIdList"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请选择系统账号"
                class="mar-l-10"
                v-if="supplierDetail.isUseFingoSystem == 1"
                size="medium"
                multiple
              >
                <el-option
                  v-for="(item, index) in accountBDList1"
                  :key="index"
                  :label="item.nickName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!--经营范围--->
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="font-size:20px;font-weight:900">
          <span>经营范围</span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="brandIdList" label="经营品牌" style="margin-top:45px;">
              <template slot="label">
                <span>经营品牌</span>
                <span style="color:#666666;margin-left:40px;">经营品牌数据将作为商家创建商品的品牌可选清单</span>
              </template>
              <el-select
                v-model="supplierDetail.brandIdList"
                multiple
                filterable
                placeholder="请选择"
                size="medium"
                style="width:90%;"
              >
                <el-option
                  v-for="item in brandList"
                  :key="item.brandId"
                  :label="item.nameCn"
                  :value="item.brandId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="businessCategory" label="经营品类">
              <div>
                <el-tag
                  v-for="(tag, i) in supplierDetail.businessCategory"
                  :key="tag.cateId"
                  @close="removeCategory(tag, i)"
                  closable
                >{{tag.cateName}}</el-tag>
              </div>
              <el-cascader
                style="width: 90%"
                filterable
                clearable
                remote
                @visible-change="clearSelectCategory"
                @change="addCategory"
                :props="{label: 'cateName',multiple: true, checkStrictly: false, children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getSubCategory}"
                placeholder="请选择商品后台分组"
                :options="categoryOptions"
                v-model="selectedOptions"
                class="normalOperatorBox"
                size="medium"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!--结算信息-->
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="font-size:20px;font-weight:900">
          <span>结算方式</span>
        </div>
        <el-row>
          <!---质量保证金-->
          <el-col :span="12">
            <el-row>
              <el-col :span="16">
                <el-form-item
                  :prop="supplierDetail.isUseFingoSystem==1?'retentionMoney':''"
                  label="质量保证金"
                >
                  <el-input
                    v-model="supplierDetail.retentionMoney"
                    placeholder="请输入质量保证金"
                    class="col_select"
                    size="medium"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="paymentWay" label="结算方式：">
                  <el-select
                    v-model="supplierDetail.paymentWay"
                    @change="supplierDetail.paymentWayDesc = ''"
                    size="medium"
                    class="col_select"
                  >
                    <el-option
                      v-for="(item, index) in paymentWayList"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item
                    v-if="supplierDetail.isUseFingoSystem==1"
                    prop="retentionMoneyCurrency"
                    label="."
                  >
                    <el-select
                      v-model="supplierDetail.retentionMoneyCurrency"
                      size="medium"
                      @change="selectCurrency"
                      class="col_select"
                      style="width:90%"
                    >
                      <el-option
                        v-for="(item, i) in paymentWayCurrency"
                        :key="i"
                        :label="item.name+item.unit"
                        :value="item.currencyCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item v-if="supplierDetail.isUseFingoSystem!=1" label=".">
                    <el-select
                      v-model="supplierDetail.retentionMoneyCurrency"
                      size="medium"
                      class="col_select"
                      style="width:90%"
                    >
                      <el-option
                        v-for="(item, i) in paymentWayCurrency"
                        :key="i"
                        :label="item.name+item.unit"
                        :value="item.currencyCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>

                <el-form-item label=".">
                  <el-input
                    v-model="supplierDetail.paymentWayDesc"
                    v-if="supplierDetail.paymentWay == 1 || supplierDetail.paymentWay == 4"
                    :placeholder="supplierDetail.paymentWay == 1 ? '0%-100%': '请输入'"
                    size="medium"
                    class="col_select"
                    style="width:90%"
                  ></el-input>
                  <el-select
                    v-model="supplierDetail.paymentWayDesc"
                    v-if="supplierDetail.paymentWay == 3"
                    size="medium"
                    class="col_select"
                    style="width:90%"
                  >
                    <el-option
                      v-for="(item, index) in timeList"
                      :key="index"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="收款信息">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="supplierDetail.collectionInfo"
                placeholder="请输入收款信息(银行名称，银行账号)"
                style="width:90%"
                :maxlength="120"
                class="col_select"
                size="medium"
              ></el-input>
            </el-form-item>
          </el-col>
          <!--结算货币-->
          <el-col :span="12">
            <el-row style="margin-top:100px">
              <el-col :span="12">
              <div>
                <el-form-item
                  v-if="supplierDetail.isUseFingoSystem==1"
                  prop="paymentWayCurrency"
                  label="结算货币"
                >
                  <el-select
                    v-model="supplierDetail.paymentWayCurrency"
                    size="medium"
                    class="col_select"
                  >
                    <el-option
                      v-for="(item, i) in paymentWayCurrency"
                      :key="i"
                      :label="item.name+item.unit"
                      :value="item.currencyCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
                <div>
                  <el-form-item v-if="supplierDetail.isUseFingoSystem!=1" label="结算货币">
                  <el-select
                    v-model="supplierDetail.paymentWayCurrency"
                    size="medium"
                    class="col_select"
                  >
                    <el-option
                      v-for="(item, i) in paymentWayCurrency"
                      :key="i"
                      :label="item.name+item.unit"
                      :value="item.currencyCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
                </div>
                
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
            <el-form-item label="联系方式">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="supplierDetail.contactInfo"
                placeholder="请输入联系方式(联系人，电话，地址)"
                style="width:90%"
                :maxlength="120"
                size="medium"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!---开票信息-->
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="font-size:20px;font-weight:900">
          <span>开票信息</span>
        </div>
        <el-row>
          <el-col :span="12">
            <div>
               <el-form-item
              v-if="supplierDetail.isUseFingoSystem==1"
              label="结算账户类型"
              prop="paymentWayType"
            >
              <el-select
                v-model="supplierDetail.paymentWayType"
                size="medium"
                @change="selsectValue"
                class="col_select"
                style="width:90%"
              >
                <el-option
                  v-for="(item, i) in balanceAccount"
                  :key="i"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            </div>
           <div>
              <el-form-item v-if="supplierDetail.isUseFingoSystem!=1" label="结算账户类型">
              <el-select
                v-model="supplierDetail.paymentWayType"
                size="medium"
                class="col_select"
                style="width:90%"
              >
                <el-option
                  v-for="(item, i) in balanceAccount"
                  :key="i"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
           </div>
           <div>
             <el-form-item
              label="抬头"
              v-if="supplierDetail.paymentWayType==1&&supplierDetail.isUseFingoSystem==1&&supplierDetail.type==2"
              prop="invoiceTitle"
            >
              <el-input
                style="width:90%"
                placeholder="请输入抬头"
                v-model="supplierDetail.invoiceTitle"
                class="col_select"
              ></el-input>
            </el-form-item>
           </div>
            <div>
              <el-form-item
              label="抬头"
              v-if="supplierDetail.paymentWayType!=1||supplierDetail.isUseFingoSystem!=1||supplierDetail.type!=2"
            >
              <el-input
                style="width:90%"
                placeholder="请输入抬头"
                v-model="supplierDetail.invoiceTitle"
                class="col_select"
              ></el-input>
            </el-form-item>
            </div>
            <div>
               <el-form-item
              label="银行名称"
              v-if="supplierDetail.isUseFingoSystem==1"
              prop="invoiceBankName"
            >
              <el-input
                style="width:90%"
                placeholder="请输入银行名称"
                v-model="supplierDetail.invoiceBankName"
                class="col_select"
              ></el-input>
            </el-form-item>
            </div>
           <div>
              <el-form-item label="银行名称" v-if="supplierDetail.isUseFingoSystem!=1">
              <el-input
                style="width:90%"
                placeholder="请输入银行名称"
                v-model="supplierDetail.invoiceBankName"
                class="col_select"
              ></el-input>
            </el-form-item>
           </div>
           
            <el-form-item label="联系电话">
              <el-input
                style="width:90%"
                placeholder="请输入联系电话"
                v-model="supplierDetail.invoiceMobile"
                class="col_select"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item
              label="纳税人识别号"
              style="margin-top:100px;"
              v-if="supplierDetail.paymentWayType==1&&supplierDetail.isUseFingoSystem==1&&supplierDetail.type==2"
              prop="invoiceRegistrationNumber"
            >
              <el-input
                style="width:90%"
                placeholder="请输入纳税人识别号"
                v-model="supplierDetail.invoiceRegistrationNumber"
              ></el-input>
            </el-form-item>
            </div>
            <div>
              <el-form-item
              label="纳税人识别号"
              style="margin-top:100px;"
              v-if="supplierDetail.paymentWayType!=1||supplierDetail.isUseFingoSystem!=1||supplierDetail.type!=2"
            >
              <el-input
                style="width:90%"
                placeholder="请输入纳税人识别号"
                v-model="supplierDetail.invoiceRegistrationNumber"
              ></el-input>
            </el-form-item>
            </div>
            <div>
               <el-form-item
              label="银行账号"
              v-if="supplierDetail.isUseFingoSystem==1"
              prop="invoiceBankAccount"
            >
              <el-input
                style="width:90%"
                placeholder="请输入银行账号"
                v-model="supplierDetail.invoiceBankAccount"
              ></el-input>
            </el-form-item>
            </div>
           <div>
              <el-form-item label="银行账号" v-if="supplierDetail.isUseFingoSystem!=1">
              <el-input
                style="width:90%"
                placeholder="请输入银行账号"
                v-model="supplierDetail.invoiceBankAccount"
              ></el-input>
            </el-form-item>
           </div>
           

            <el-form-item label="地址">
              <el-input
                style="width:90%"
                placeholder="请输入地址"
                v-model="supplierDetail.invoiceAddress"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!--资质&合同-->
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="font-size:20px;font-weight:900">
          <span>资质&合同</span>
        </div>
        <div>
          <el-form-item
          label="经营资质"
          v-if="supplierDetail.type==2&&supplierDetail.isUseFingoSystem==1"
          prop="imageUrl"
          class="el_uploadimg"
        >
          <c-upload
            :limit="1"
            style="margin-left:10px;"
            ref="businessImage"
            type="text"
            :fileList="supplierDetail.imageUrl"
            @setData="setCoverImg3"
          >
            <span>企业营业执照</span>
          </c-upload>
          <c-upload
            :limit="6"
            style="margin-left:10px;"
            ref="businessImg"
            type="other"
            :fileList="supplierDetail.businessQualification"
            @setData="setCoverImg"
          ></c-upload>
        </el-form-item>
        </div>
        <div>
          <el-form-item
          label="经营资质"
          v-if="supplierDetail.type!=2||supplierDetail.isUseFingoSystem!=1"
          class="el_uploadimg"
        >
          <c-upload
            :limit="1"
            style="margin-left:10px;"
            ref="businessImage"
            type="text"
            :fileList="supplierDetail.imageUrl"
            @setData="setCoverImg3"
          >
            <span>企业营业执照</span>
          </c-upload>
          <c-upload
            :limit="6"
            style="margin-left:10px;"
            ref="businessImg"
            type="other"
            :fileList="supplierDetail.businessQualification"
            @setData="setCoverImg"
          ></c-upload>
        </el-form-item>
        </div>
        <el-row>
          <el-col :span="12">
            <!-- <div>
                <el-form-item label="合同开始时间" v-if="supplierDetail.isUseFingoSystem==1" prop="contractBeginTime">
                <el-date-picker
                v-model="supplierDetail.contractBeginTime"
                @change="selectStartTime('supplierDetail')"
                value-format="timestamp"
                type="date"
                style="width:90%"
                placeholder="选择合同开始日期">
              </el-date-picker>
              </el-form-item>
            </div> -->
            <div>
                <el-form-item label="合同开始时间">
                <el-date-picker
                v-model="supplierDetail.contractBeginTime"
                type="date"
                value-format="timestamp"
                @change="selectStartTime('noValitor')"
                style="width:90%"
                placeholder="选择合同开始日期">
              </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <!-- <div>
                <el-form-item label="合同截止时间" v-if="supplierDetail.isUseFingoSystem==1" prop="contractEndTime">
              <el-date-picker
              style="width:90%"
              value-format="timestamp"
              v-model="supplierDetail.contractEndTime"
              @change="selectEndTime('supplierDetail')"
              type="date"
              placeholder="选择合同截止日期">
            </el-date-picker>
            </el-form-item>
            </div> -->
            <div>
              <el-form-item label="合同截止时间">
              <el-date-picker
              style="width:90%"
              value-format="timestamp"
              v-model="supplierDetail.contractEndTime"
              @change="selectEndTime('noValitor')"
              type="date"
              placeholder="选择合同截止日期">
            </el-date-picker>
            </el-form-item>
            </div>
            
          </el-col>
        </el-row>
        <el-form-item label="合作合同">
          <c-upload
            :limit="6"
            ref="cooperationImg"
            :fileList="supplierDetail.cooperativeContract"
            @setData="setCoverImg2"
          ></c-upload>
        </el-form-item>
      </el-card>
      <!--地址信息-->
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="font-size:20px;font-weight:900">
          <span>地址信息</span>
        </div>
        <el-form-item label="经营地址" prop="businessAddress">
          <div id="businessAddress" class="mar-b-20"></div>
          <el-cascader
            class="mar-b-20"
            v-model="businessAddress"
            :props="{value: 'label', label: 'label'}"
            :options="areaData"
            @change="(data) => { return addressChange(data, 'businessAddress')}"
          ></el-cascader>
          <el-input
            v-model="supplierDetail.businessAddress"
            clearable
            style="width:600px;"
            id="businessAddressInput"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="发货地址" prop="deliveryAddress">
          <div id="deliveryAddress" class="mar-b-20"></div>
          <el-cascader
            class="mar-b-20"
            v-model="deliveryAddress"
            :props="{value: 'label', label: 'label'}"
            :options="areaData"
            @change="(data) => { return addressChange(data, 'deliveryAddress')}"
          ></el-cascader>
          <el-input
            v-model="supplierDetail.deliveryAddress"
            clearable
            style="width:600px;"
            placeholder="请输入详细地址"
            id="deliveryAddressInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="退货地址" prop="returnAddress">
          <div id="returnAddress" class="mar-b-20"></div>
          <el-cascader
            class="mar-b-20"
            v-model="returnAddress"
            :props="{value: 'label', label: 'label'}"
            :options="areaData"
            @change="(data) => { return addressChange(data, 'returnAddress')}"
          ></el-cascader>
          <el-input
            v-model="supplierDetail.returnAddress"
            clearable
            style="width:600px;"
            id="returnAddressInput"
            @change="changeAddress"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
        <image-preview
          v-show="image.show"
          :fileType="image.fileType"
          :close="closePreview"
          :index="image.index"
          :list="image.list"
        ></image-preview>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import cUpload from "@/components/fileUpload/";
import _ from "lodash";
import imagePreview from "@/components/imagePreview";
import { saveSupplier, getSupplierDetail } from "@/request/supplier";
import { listSysUserByPage } from "@/request/staff";
import { brandInfoGet } from "@/request/product";
import { uploadFileRequest } from "@/request/file";
import { getProductEnumInfo } from "@/request/product";
import {
  arrayToString,
  stringToArray,
  divide,
  multiply
} from "@/js/common/filter";
import areaData from "@/data/area.json";
import productCommon from "../product/common/common.js";
export default {
  mixins: [productCommon],
  data() {
    const imgurlValitor = (rule, value, callback) => {
      // 图片验证
      if (!this.hasFmt) {
        callback(new Error("企业营业执照不能为空"));
      } else {
        callback();
      }
    };
    const startTimeValitor=(rule,value,callback)=>{
      if(value!=''&&value!=null){
        if(this.supplierDetail.contractEndTime!=''&&this.supplierDetail.contractEndTime!=null){
          if(value>=this.supplierDetail.contractEndTime){
            callback(new Error('合同开始时间不得大于等于合同截止时间'))
          }else{
            callback()
          }
        }else{
          callback()
        }
      }else{
        callback('合同开始时间不能为空')
      }
      
    }
    const endTimeValitor=(rule,value,callback)=>{
      if(value!=''&&value!=null){
        if(this.supplierDetail.contractBeginTime!=''&&this.supplierDetail.contractBeginTime!=null){
          if(value<=this.supplierDetail.contractBeginTime){
            callback(new Error('合同截止时间不得小于等于合同开始时间'))
          }else{
            callback()
          }
        }
      }else{
        callback('合同截止时间不能为空')
      }
      
    }
    return {
      canModifyName:2,
      uploadFileUrl: `${process.env.VUE_APP_FILE_URL}/file/rest/uploadservices/uploadfile`,
      uploadParam: {},
      readonly: false,
      loading: false,
      title: "新增供应商",
      timeList: ["7天", "15天", "30天"],
      selectedOptionsBack: [],
      backCategoryList: [],
      areaData: areaData,
      balanceAccount: [
        {
          name: "对公账户",
          value: 1
        },
        {
          name: "对私账户",
          value: 2
        }
      ],
      cooperativeStatus: [
        {
          name: "正常合作",
          value: 1
        },
        {
          name: "终止合作",
          value: 2
        },
        {
          name: "黑名单",
          value: 9
        }
      ],
      image: {
        show: false,
        index: 0,
        fileType: "image",
        list: []
      },
      businessAddress: [],
      deliveryAddress: [],
      returnAddress: [],
      supplierDetail: {
        email:'',
        countryCode: "",
        cooperativeContract: "",
        businessQualification: "",
        userIdList: [],
        balanceAccount: 1,
        cooperativeStatus: 1,
        businessAddress: "",
        businessAddressCoordinates: "",
        deliveryAddress: "",
        deliveryAddressCoordinates: "",
        returnAddress: "",
        returnAddressCoordinates: "",
        id: 0,
        supplierName: "",
        buyerUserId: "",
        type: "",
        shortName: "",
        retentionMoney: 0,
        businessCategoryIdList: [],
        brandIdList: [],
        paymentWay: "",
        paymentWayDesc: "",
        isUseSticker: 1,
        isUseFingoSystem: 2,
        userList: [],
        businessCategory: [],
        supplierContact: "", //供应商联系人
        supplierContactMobile: "", //供应商联系人电话
        paymentWayCurrency: "", //结算货币单位
        retentionMoneyCurrency: "", //请输入质量保证金结算单位
        paymentWayType: "", //结算账户类型
        invoiceRegistrationNumber: "", //纳税人识别号
        invoiceTitle: "", //抬头
        invoiceBankAccount: "", //银行账号
        invoiceBankName: "", //账户名称
        invoiceMobile: "", //联系电话
        invoiceAddress: "", //地址
        imageUrl: "",
        invoiceInfo: {
          address: "",
          bankAccount: "",
          bankName: "",
          code: "",
          phone: "",
          title: ""
        },
        address: "",
        bankAccount: "",
        bankName: "",
        code: "",
        phone: "",
        title: "",
        collectionInfo: "",
        contactInfo: "",
        contractBeginTime:'',
        contractEndTime:'',
      },
      supplierTypeList: [
        {
          name: "个人",
          value: 1
        },
        {
          name: "企业",
          value: 2
        }
      ],

      paymentWayList: [
        {
          name: "预付",
          value: 1
        },
        {
          name: "到付",
          value: 2
        },
        {
          name: "账期",
          value: 3
        },
        {
          name: "其他",
          value: 4
        }
      ],
      cooperationModelList: [
        {
          name: "自营采购",
          value: "PROPRIETARY"
        },
        {
          name: "一件代发",
          value: "ONE_PRODUCT_DROP_SHIPPING"
        }
      ],
      paymentWayType: [
        {
          name: "对公",
          value: "1"
        },
        {
          name: "对私",
          value: "2"
        }
      ],
      brandList: [],
      accountList: [],
      accountBDList: [],
      accountBDList1: [],
      hasFmt: false,
      supplierRules: {
        imageUrl: {
          required: true,
          trigger: "change",
          validator: imgurlValitor
        },
        supplierName: {
          required: true,
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (value.length === 0) {
              callback(new Error("不能为空"));
            } else if (value.length > 40) {
              callback(new Error("供应商名称最多40个字"));
            } else {
              callback();
            }
          }
        },
        shortName: {
          required: true,
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (value.length === 0) {
              callback(new Error("不能为空"));
            } else if (value.length > 40) {
              callback(new Error("供应商简称最多40个字"));
            } else {
              callback();
            }
          }
        },
        buyerUserId: {
          required: true,
          message: "请选择采购负责人"
        },
        paymentWayType: {
          required: true,
          message: "结算账户类型不能为空",
          trigger: "change"
        },
        code: {
          required: true,
          message: "请输入银行卡号",
          trigger: "blur"
        },
        paymentWayCurrency: {
          required: true,
          message: "结算货币不能为空",
          trigger: "change"
        },
        invoiceTitle: {
          required: true,
          message: "对公账户抬头信息不能为空"
        },
        invoiceBankName: {
          required: true,
          message: "银行名称不能为空",
          trigger: "blur"
        },
        supplierContact: {
          required: true,
          message: "供应商联系人不能为空",
          trigger: "blur"
        },
        supplierContactMobile: [
          {
            required: true,
            message: "供应商联系人电话不能为空",
            trigger: "blur"
          }
        ],
        retentionMoneyCurrency:[
          {
            required: true,
            message: "质量保证金的货币单位不能为空",
            trigger: "change"
          }
        ],
        invoiceBankAccount: {
          required: true,
          message: "银行账号不能为空",
          trigger: "blur"
        },
        type: {
          required: true,
          message: "请选择供应商类型"
        },
        countryCode: {
          required: true,
          message: "请选择国家"
        },
        invoiceRegistrationNumber: {
          required: true,
          message: "对公纳税人识别号不能为空"
        },
        paymentWay: {
          required: true,
          message: "请选择结算方式"
        },
        cooperationModel: {
          required: true,
          message: "请选择合作模式"
        },
        businessCategory: { required: true, message: "请选择经营品类" },
        brandIdList: {
          required: true,
          message: "请选择经营品牌"
        },
        businessAddress: {
          required: true,
          message: "请输入经营地址"
        },
        deliveryAddress: {
          required: true,
          message: "请输入发货地址"
        },
        returnAddress: {
          required: true,
          message: "请输入退货地址"
        },
        cooperativeStatus: {
          required: true,
          message: "请选择"
        },
        retentionMoney: {
          required: true,
          message: "请输入"
        },
        contractBeginTime: [
            { type: 'date', required: true, validator:startTimeValitor, trigger: 'change' }
          ],
          contractEndTime: [
            { type: 'date', required: true, validator:endTimeValitor, trigger: 'change' }
          ],
      },
      businessAddressMap: null,
      deliveryAddressMap: null,
      returnAddressMap: null,
      saveLoading: false,
      categoryOptions: [],
      selectedOptions: [],
      supplierDetailId: "",
      supplierDetailShortCode: "",
      paymentWayCurrency: [],
      contractEndTime:'',
    };
  },
  created() {
    this.getBDUserList();
    this.getBrandList();
    this.fetchCategory({
      cateType: 2,
      level: 1,
      resolve: data => {
        this.categoryOptions = data;
      }
    });
  },
  mounted() {
    this.initAddressMap("businessAddress");
    this.initAddressMap("deliveryAddress");
    this.initAddressMap("returnAddress");
    if (this.$route.query.supplierId != 0) {
      this.getSupplierDetailById(this.$route.query.supplierId);
    }
    if (this.$route.query.type) {
      this.readonly = false;
    } else {
      this.readonly = true;
    }
    this.getProductEnumInfo();
  },
  components: {
    cUpload,
    imagePreview
  },
  computed: {
    countryList() {
      let list = this.$store.state.dict.countryList;
      list.unshift({
        shortCode: "CN",
        nameLocal: "中国"
      });
      let List = _.uniqWith(list, _.isEqual);
      return List;
    }
  },
  methods: {
    //去校验开始时间以及截止时间
    selectStartTime(formName){
      // this.$refs[formName].validateField('startTime',errMsg=>{
      //   if(errMsg){
      //     return false
      //   }else{

      //   }
      // })
       if(formName=='noValitor'){
         if(this.supplierDetail.contractEndTime!=''&&this.supplierDetail.contractEndTime!=null){
          if(this.supplierDetail.contractBeginTime>=this.supplierDetail.contractEndTime){
            this.$message.warning('合同结束时间不能小于等于合同截止时间')
            this.supplierDetail.contractBeginTime=''
          }
        }
      }
       
    },
    selectEndTime(formName){
      console.log(this.supplierDetail.contractBeginTime)
      if(formName!='noValitor'){
          this.$refs[formName].validateField('contractBeginTime',errMsg=>{
          if(errMsg){
            return false
          }else{
            
          }
        })
      }else{
        
        if(this.supplierDetail.contractBeginTime!=''&&this.supplierDetail.contractBeginTime!=null){
          if(this.supplierDetail.contractBeginTime>=this.supplierDetail.contractEndTime){
            this.$message.warning('合同结束时间不能小于等于合同截止时间')
            this.supplierDetail.contractEndTime=''
          }
        }
      }
      
    },
    changeAddress(val){
      console.log(val)
    },
    selsectValue(value) {
      console.log(value);
    },
    selectCurrency(value){
      console.log(value)
      console.log(this.supplierDetail.retentionMoneyCurrency)
    },
    getProductEnumInfo() {
      let params = {};
      getProductEnumInfo(this.filterData(params)).then(response => {
        console.log(response);
        if (response.ret.errcode === 1) {
          console.log('货币单位',response.currency)
          this.paymentWayCurrency = response.currency;
        }
      });
    },
    setCoverImg(res) {
      this.supplierDetail.businessQualification = res.data;
    },
    setCoverImg3(res) {
      this.supplierDetail.imageUrl = res.data;
      if (res.data != "") {
        this.hasFmt = true;
        this.$refs["supplierDetail"].validateField("imageUrl");
      } else {
        this.hasFmt = false;
        this.$refs["supplierDetail"].validateField("imageUrl");
      }
    },
    setCoverImg2(res) {
      this.supplierDetail.cooperativeContract = res.data;
    },
    /**
     * 获取采购负责人列表
     */
    getBDUserList() {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 1000
        },
        groupIds: [68, 69, 70]
      };
      let params1 = {
        page: {
          pageNum: 1,
          pageSize: 1000
        },
        groupId: 83
      };
      listSysUserByPage(params)
        .then(res => {
          console.log(res);
          if (res.ret.errcode === 1) {
            this.accountBDList = res.sysUserPb;
          }
        })
        .catch(err => {
          console.log(err);
        });
      listSysUserByPage(params1)
        .then(res => {
          console.log(res);
          if (res.ret.errcode === 1) {
            this.accountBDList1 = res.sysUserPb;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 获取品牌列表
     */
    getBrandList() {
      let params = {
        page: {
          pageSize: 10000,
          pageNum: 1
        }
      };
      brandInfoGet(params)
        .then(response => {
          if (response.ret.errcode === 1) {
            this.brandList = response.brandInfo;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    initAddressMap(key) {
      this[key + "Map"] = new AMap.Map(key, {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        zoom: 11, // 初始化地图层级
        dragEnable: true,
        keyboardEnable: true,
        doubleClickZoom: true,
        zoomEnable: true,
        rotateEnable: true
      });
      let scale = new AMap.Scale({
        visible: true
      });
      let toolBar = new AMap.ToolBar({
        visible: true
      });
      let placeSearch = new AMap.PlaceSearch({
        map: this[key + "Map"]
      });
      let overView = new AMap.OverView({
        visible: true
      });
      this[key + "Map"].addControl(scale);
      this[key + "Map"].addControl(toolBar);
      this[key + "Map"].addControl(overView);
      let auto = new AMap.Autocomplete({
        input: key + "Input"
      });
      AMap.event.addListener(auto, "select", e => {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
        // console.log(e.poi.name)
        // if(key=="returnAddress"){
        //   console.log(e)
        //   this.supplierDetail.returnAddress = this.supplierDetail.returnAddress+e.poi.name
        // }
      });
      this[key + "Map"].on("click", e => {
        let geocoder = new AMap.Geocoder({
          radius: 1000
        });
        geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
          if (status === "complete" && result.info === "OK") {
            this.supplierDetail[key + "Coordinates"] =
              e.lnglat.lng + "," + e.lnglat.lat;
            this.changeBusinessAddress(result.regeocode, key);
            
          }
        });
      });
      this[key + "Map"].plugin("AMap.Geolocation", () => {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          buttonOffset: new AMap.Pixel(10, 20),
          zoomToAccuracy: true,
          buttonPosition: "RB"
        });
        geolocation.getCurrentPosition();
      });
    },
    changeBusinessAddress(data, key) {
      this.supplierDetail[key] = data.formattedAddress;
    },
    addressChange(data, type) {
      console.log(data,type)
      this.supplierDetail[type] = "";
      for (let i = 0; i < data.length; i++) {
        this.supplierDetail[type] += data[i] + " ";
      }
      this.$refs["supplierDetail"].validate();
      
    },
    // 关闭预览
    closePreview() {
      this.image.show = false;
    },
    getSupplierDetailById(supplierId) {
      this.loading = true;
      this.title = "编辑供应商";
      let params = {
        supplierId: supplierId
      };
      getSupplierDetail(params)
        .then(response => {
          console.log(1111)
          if (response.ret.errcode === 1) {
            this.canModifyName = response.canModifyName
            // this.canModifyName = 1
            this.loading = false;
            let detail = {};
            detail = _.pick(response.supplier, [
              "supplierId",
              "supplierName",
              "shortName",
              "status",
              "type",
              "buyerUserId",
              "cooperativeStatus",
              "contactInfo",
              "collectionInfo",
              "isUseSticker",
              "isUseFingoSystem",
              "paymentWay",
              "retentionMoney",
              "paymentWayDesc",
              "invoiceId",
              "businessCategory",
              "cooperativeContract",
              "businessQualification",
              "countryCode",
              "supplierShortCode",
              "deliveryAddress",
              "supplierContact", //供应商联系人
              "supplierContactMobile", //供应商联系人电话
              "paymentWayCurrency", //结算货币单位
              "retentionMoneyCurrency", //请输入质量保证金结算单位
              "paymentWayType", //结算账户类型
              "invoiceRegistrationNumber", //纳税人识别号
              "invoiceTitle", //抬头
              "invoiceBankAccount", //银行账号
              "invoiceBankName", //账户名称
              "invoiceMobile", //联系电话
              "invoiceAddress", //地址
              "imageUrl",
              "email",
              "contractBeginTime",
              "contractEndTime"
            ]);
            this.supplierDetailShortCode = detail.supplierShortCode;
            this.supplierDetailId = detail.supplierId;
            
            detail.buyerUserId = parseInt(detail.buyerUserId);
            if (!response.supplier.invoiceInfo) {
              detail.invoiceInfo = {
                address: "",
                bankAccount: "",
                bankName: "",
                code: "",
                phone: "",
                title: ""
              };
            }

            _.forEach(response.address, address => {
              if (address.type === 1) {
                detail.deliveryAddress = `${address.address}`;
              }
              if (address.type === 2) {
                detail.returnAddress = `${address.address}`;
              }
              if (address.type === 3) {
                detail.businessAddress = `${address.address}`;
              }
            });

            let userId = [];
            _.forEach(response.userId, item => {
              userId.push(parseInt(item));
            });
            if (response.supplier.brandIds !== "") {
              detail.brandIdList = JSON.parse(response.supplier.brandIds);
            }
            detail.userIdList = userId;
            if (response.supplier.businessCategory !== "") {
              detail.businessCategory = JSON.parse(
                response.supplier.businessCategory
              );
            } else {
              detail.businessCategory = [];
            }
            detail.countryCode = response.supplier.countryCode;
            console.log(detail);
            // this.supplierDetail = detail;
            _.forEach(detail, (item, key) => {
              this.supplierDetail[key] = item;
            });
            if(detail.contractBeginTime){
                this.supplierDetail.contractBeginTime = this.timeTotimestamp(detail.contractBeginTime)
            }
            if(detail.contractEndTime){
              this.supplierDetail.contractEndTime = this.timeTotimestamp(detail.contractEndTime)
              this.contractEndTime = detail.contractEndTime
            }
            if(this.supplierDetail['paymentWayType']==0){
              this.supplierDetail['paymentWayType']=''
            }
            // if(!detail.deliveryAddress){
            //     this.supplierDetail.deliveryAddress = ''
            // }
            // if(!detail.returnAddress){
            //     this.supplierDetail.deliveryAddress =''
            // }
          } else {
            this.$message.error("供应商详情获取失败，请重试！");
          }
          if (response.galleries) {
            _.forEach(response.galleries, item => {
              if (item.infoType == 1) {
                this.hasFmt = true
                this.supplierDetail.imageUrl = item.urls[0];
                this.supplierDetail.businessQualification = item.urls.splice(1).join(",");
              } else if (item.infoType == 2) {
                this.supplierDetail.cooperativeContract = item.urls.join(",");
              }
            });
            this.$refs.businessImg.setFileList(
              this.supplierDetail.businessQualification
            );
            this.$refs.cooperationImg.setFileList(
              this.supplierDetail.cooperativeContract
            );
            this.$refs.businessImage.setFileList(
              this.supplierDetail.imageUrl
            )
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    clickToCancel() {
      this.$router.back();
    },
    //编辑名称按钮
    editSupplierReadonly(){
      this.readonly = false
    },
    //保存按钮方法
    addOrUpdate(type){
      let supplier = {};
          let address = [];
          let businessAddressItem = {
            type: 3, // '1发货地址 2退货地址 3经营地址',
            // countryName: this.businessAddress[0],
            // provinceName: this.businessAddress[1],
            // cityName: this.businessAddress[2],
            // areaName: this.businessAddress[3],
            address: this.supplierDetail.businessAddress,
            is_default: 0 // '是否为默认地址（0否，1是）',
          };
          let deliveryAddressItem = {
            type: 1, // '1发货地址 2退货地址 3经营地址',
            // countryName: this.deliveryAddress[0],
            // provinceName: this.deliveryAddress[1],
            // cityName: this.deliveryAddress[2],
            // areaName: this.deliveryAddress[3],
            address: this.supplierDetail.deliveryAddress,
            is_default: 0 // '是否为默认地址（0否，1是）',
          };
          let returnAddressItem = {
            type: 2, // '1发货地址 2退货地址 3经营地址',
            // countryName: this.returnAddress[0],
            // provinceName: this.returnAddress[1],
            // cityName: this.returnAddress[2],
            // areaName: this.returnAddress[3],
            address: this.supplierDetail.returnAddress,
            is_default: 0 // '是否为默认地址（0否，1是）',
          };
          address = [
            businessAddressItem,
            deliveryAddressItem,
            returnAddressItem
          ];
          supplier = _.pick(this.supplierDetail, [
            "supplierId",
            "supplierName",
            "shortName",
            "type",
            "contactInfo",
            "collectionInfo",
            "invoiceId",
            "businessCategoryIdList",
            "brandIdList",
            "businessCategory",
            "businessQualification",
            "paymentWay",
            "buyerUserId",
            "isUseFingoSystem",
            "userIdList",
            "isUseSticker",
            "paymentWayDesc",
            "retentionMoney",
            "cooperativeContract",
            "cooperativeStatus",
            "status",
            "invoiceInfo",
            "countryCode",
            "deliveryAddress",
            "supplierContact", //供应商联系人
            "supplierContactMobile", //供应商联系人电话
            "paymentWayCurrency", //结算货币单位
            "retentionMoneyCurrency", //请输入质量保证金结算单位
            "paymentWayType", //结算账户类型
            "invoiceRegistrationNumber", //纳税人识别号
            "invoiceTitle", //抬头
            "invoiceBankAccount", //银行账号
            "invoiceBankName", //账户名称
            "invoiceMobile", //联系电话
            "invoiceAddress", //地址
            "imageUrl",
            "email",
            "contractBeginTime",
            "contractEndTime"
          ]);
          supplier.buyerUserId = supplier.buyerUserId + "";
          supplier.brandIds = JSON.stringify(supplier.brandIdList);
          supplier.businessCategory = JSON.stringify(supplier.businessCategory);
          supplier.contractBeginTime = this.timestampToTime(supplier.contractBeginTime)
          if(this.$route.query.supplierId!=0&&supplier.contractEndTime==this.timestampToTime(this.contractEndTime)){
            supplier.contractEndTime = this.timestampToTime(supplier.contractEndTime)
          }else{
            supplier.contractEndTime = this.timestampToTime(supplier.contractEndTime+24*60*60*1000-1)
          }
          
          var galleries = [];
          if (
            this.supplierDetail.imageUrl &&
            this.supplierDetail.businessQualification.split(",").length > 1
          ) {
            var urls=this.supplierDetail.businessQualification.split(",")
            galleries.push({
              infoType: "1",
              urls: [this.supplierDetail.imageUrl,...urls]
            });
            
          } else if (
            this.supplierDetail.imageUrl &&
            this.supplierDetail.businessQualification.split(",").length == 1
          ) {
            galleries.push({
              infoType: "1",
              urls: [
                this.supplierDetail.imageUrl,
                this.supplierDetail.businessQualification
              ]
            });
          }else if(this.supplierDetail.imageUrl&&this.supplierDetail.businessQualification.split(",").length==0){
             galleries.push({
              infoType: "1",
              urls: [
                this.supplierDetail.imageUrl
              ]
            });
          }
          if (this.supplierDetail.cooperativeContract) {
            galleries.push({
              infoType: "2",
              urls: this.supplierDetail.cooperativeContract.split(",")
            });
          }
          console.log(galleries)
          _.forEach(galleries,item=>{
            _.forEach(item.urls,(imgsrc,index)=>{
              if(imgsrc==''){
                item.urls.splice(index,1)
              }
            })
          })
          let userId = [];
          _.forEach(supplier.userIdList, item => {
            userId.push(item + "");
          });
          let params = {
            supplier: supplier,
            address: address,
            userId: userId,
            galleries: galleries
          };
          this.editSupplier(params,type);
    },
    clickToSave(type) {
      if(type=='1'){
          this.$refs["supplierDetail"].validate(valid => {
          if (valid) {
             this.addOrUpdate(type)
          } else {
            this.$message.error('有必填项未填写')
          }
        });
      }else{
        this.addOrUpdate(type)
      }
      
    },
    // 新增或编辑供应商
    editSupplier(params,type) {
      saveSupplier(this.filterData(params))
        .then(response => {
          this.saveLoading = true;
          console.log(response);
          if (response.ret.errcode === 1) {

            this.$message.success("保存成功！");
            if(type=='1'){
              this.saveLoading = false;
              this.$router.back();
            }else{
              this.saveLoading = false
              this.getSupplierDetailById(this.$route.query.supplierId)
            }
            
          } else {
            this.saveLoading = false;
            this.$message.error("保存失败，请检查数据后重试！");
          }
        })
        .catch(err => {
          this.saveLoading = false;
          console.log(err);
        });
    },
    addCategory(value) {
      console.log(value, this.supplierDetail.businessCategory);
      for (let i = 0; i < this.selectedOptions.length; i++) {
        let data = JSON.parse(this.selectedOptions[i][2]);
        let item = this.supplierDetail.businessCategory.find(val => {
          return val.cateId == data.cateId;
        });
        if (!item) {
          this.supplierDetail.businessCategory.push(data);
        }
      }
    },
    clearSelectCategory(show) {
      if (!show) {
        this.selectedOptions = [];
      }
    },
    removeCategory(tag, i) {
      this.supplierDetail.businessCategory.splice(i, 1);
    }
  }
};
</script>
<style lang="scss">
.form {
  .upload-box {
    height: 100px;
    width: 100px;
    margin: 10px;
    line-height: 190px !important;
    .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 110px;
    }
  }
}
</style>
<style lang="scss" scoped>
.form {
  .image-box {
    position: relative;
    display: inline-block;
    height: 100px;
    width: 100px;
    margin: 10px;
    line-height: 170px;
    text-align: center;
    color: #fff;
    transition: transform 0.3s;
    .image-item {
      width: 100px;
      height: 100px;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      padding: 4px;
    }
    .media-img {
      width: 100%;
    }
    &:hover {
      .operate-area {
        opacity: 0.5;
        transition: opacity 0.3s;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
      }
    }
    .operate-area {
      position: absolute;
      opacity: 0;
      background: #000000;
      height: 40px;
      line-height: 40px;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      color: #fff;
      font-size: 14px;
      span {
        cursor: pointer;
      }
    }
  }
}
.pageTitle {
  font-size: 20px;
  color: black;
  font-weight: bold;
}

.amap-container {
  height: 300px;
  width: 800px;
}

.filter-container {
  height: 50px;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 10px;
}

// .filterButtons {
//   float: right;
// }
.form {
  width: 100%;
}

.verticalRadioItem {
  margin: 20px 20px;
  width: 100%;
  height: 30px;
}

.verticalButton {
  margin-left: 10px;
}

.normalOperatorBox {
  width: 30%;
  min-width: 100px;
}

.avatar-uploader {
  // display: inline-block;
  width: 148px;
  height: 148px;
  overflow: hidden;
}

.recommendProduct {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  width: 50%;
  padding-left: 20px;
  .checkGroup {
    border: 1px solid #ebebeb;
    padding-left: 20px;
  }
}

.districtManage {
  background: white;
  margin-top: 10px;
  border: 1px solid #ebebeb;
  .title {
    padding-left: 18px;
    font-size: 16px;
    line-height: 60px;
    font-weight: 600;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    margin: 0;
    .showAll {
      cursor: pointer;
    }
  }
  .showDistrict {
    width: 100%;
    height: 400px;
    margin: 0 auto;
    margin-bottom: 20px;
    overflow: auto;
    .chooseTitle {
      text-align: center;
      line-height: 45px;
      margin: 0;
      .chooseAll {
        margin-left: 18px;
        float: left;
      }
      .confimButton {
        float: right;
      }
    }
    .chooseDistrict {
      width: 100%;
      line-height: 40px;
      .directly {
        display: flex;
        span {
          display: inline-block;
          width: 25%;
          border: 1px solid #ebebeb;
          padding-left: 18px;
        }
      }
      .otherDirectly {
        padding: 0;
        li {
          border: 1px solid #ebebeb;
          padding-left: 18px;
          list-style: none;
        }
      }
    }
  }
}

.input-new-tag {
  margin-right: 5px;
  // width: calc((100% - 70px)/2);
}

.tabs {
  width: 60%;
  text-align: center;
  margin: 10px auto;
  background: #f8f4f3;
  span {
    width: 50%;
    display: inline-block;
    padding: 5px;
    color: #606266;
    font-size: 14px;
    cursor: pointer;
  }
  .active {
    background: #fde3de;
  }
}

.title {
  display: inline-block;
  width: 30%;
  text-align: left;
  margin-left: 20px;
}

.draggable {
  // float: left;
  position: absolute;
  top: 0;
}

.draggable__item {
  width: 148px;
  height: 148px;
  margin-right: 8px;
  display: inline-block;
  opacity: 0.4;
  cursor: pointer;
}
/deep/ .col_select {
  width: 80%;
}
/deep/ .inline_label {
  .el-form-item__content {
    display: inline-block;
  }
}
/deep/ .el_uploadimg {
  .el-form-item__content {
    display: flex;
    .el-upload {
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border: 1px dashed #d9d9d9;
      width: 148px;
      height: 148px;
    }
  }
}
.el-card {
  margin-bottom: 20px;
}
</style>
<style scoped>
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px dashed #d9d9d9;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
