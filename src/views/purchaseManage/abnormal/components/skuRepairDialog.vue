<template>
  <el-dialog title="入库异常补单" :visible="propShowDialog" width="800px" @close="close">
    <div v-for="(abnormalItem, i) in param.purchase" :key="i">
      <el-card>
        <el-form label-position="right" label-width="130px" :model="param" ref="requireForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="供应商："
                ref="requireForm"
                :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                :prop="`purchase[${i}].supplierId`"
              >
                <el-select
                  v-model="abnormalItem.supplierId"
                  :remote-method="getSupplierList"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请输入供应商"
                >
                  <el-option
                    v-for="(item, index) in supplierList"
                    :key="index"
                    :label="item.supplierName"
                    :value="item.supplierId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="异常类型：">
                <span>{{ param.abnormalReason }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="采购单号：">
                <span>{{ abnormalItem.purchaseOrderNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库异常数量：">
                <span>{{ abnormalItem.count }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="补单数量："
                ref="requireForm"
                :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                :prop="`purchase[${i}].count`"
              >
                <el-input
                  v-model="abnormalItem.count"
                  @blur="judgeInput(abnormalItem, i)"
                  size="medium"
                  style="width: 230px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="商品采购单价："
                ref="requireForm"
                :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                :prop="`purchase[${i}].purchasePrice`"
              >
                <el-input v-model="abnormalItem.purchasePrice" size="medium" style="width: 230px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="第三方单号：" ref="requireForm" :prop="`purchase[${i}].thirdOrderNo`">
                <el-input v-model="abnormalItem.thirdOrderNo" size="medium" style="width: 230px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="运费："
                ref="requireForm"
                :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                :prop="`purchase[${i}].freight`"
              >
                <el-input v-model="abnormalItem.freight" size="medium" style="width: 230px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="param.abnormalReason == '多货'">
            <el-col :span="12">
              <el-form-item
                label="物流公司："
                ref="requireForm"
                :prop="`purchase[${i}].logiCompany`"
                :rules="{ required: false, message: '请输入', trigger: 'blur' }"
              >
                <!--                                <el-input v-model="abnormalItem.logiCode" size="medium"  style="width: 230px" ></el-input>-->
                <span>{{getCompanyName(abnormalItem.logiCompany)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="补单物流单号："
                ref="requireForm"
                :rules="{ required: false, message: '请输入', trigger: 'blur' }"
                :prop="`purchase[${i}].logiCode`"
              >
                <el-input v-model="abnormalItem.logiCode" size="medium" style="width: 230px"></el-input>
              </el-form-item>
              <el-form-item v-if="errMsg" style="margin-bottom: -15px;margin-top: -20px">
                <span style="color: #cf9236">{{errMsg}},请修改后提交</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="small">取 消</el-button>
      <el-button
        type="primary"
        @click="submitRepair"
        v-preventReClick="500"
        size="small"
        :loading="loading"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { supplierBasePage } from "@/request/supplier";
import { AbnormalMakeup } from "@/request/warehouse";
import logiCompany from "@/data/company.js";
export default {
  props: {
    propShowDialog: Boolean,
    propParam: Object,
  },
  data() {
    return {
      errMsg: "",
      logiCompany: logiCompany,
      supplierList: [],
      loading: false,
      param: {
        abnormalNo: "",
        abnormalReason: "",
        purchaseOrderNo: "",
        abnormalCount: "",
        purchase: [],
      },
    };
  },
  created() {},
  watch: {
    propParam: {
      handler(val) {
        Object.assign(this.param, val);
      },
      deep: true,
    },
  },
  methods: {
    // 获取物流公司名称
    getCompanyName(item) {
      let data = logiCompany.find((val) => {
        return val.code == item;
      });
      return data ? data.name : item;
    },
    /**
     * 获取供应商列表
     */
    getSupplierList(query) {
      let params = {
        supplierName: query,
      };
      supplierBasePage(this.filterData(params)).then((res) => {
        console.log(res);
        if (res.ret.errcode === 1) {
        this.supplierList = res.list
        }
      });
    },
    judgeInput(item, i) {
      if (item.count > this.param.abnormalCount) {
        item.count = "";
        return this.$message.warning("补单数量不可以大于异常数量");
      }
    },
    reset() {
      this.param = {
        abnormalNo: "",
        abnormalReason: "",
        purchaseOrderNo: "",
        abnormalCount: "",
        purchase: [],
      };
      this.loading = false;
    },
    close() {
      this.reset();
      this.$emit("close");
    },
    submitRepair() {
      let canSubmit = true;
      for (let i = 0; i < this.$refs["requireForm"].length; i++) {
        this.$refs["requireForm"][i].validate((isValid) => {
          if (!isValid) {
            canSubmit = false;
          }
        });
      }
      console.log(canSubmit);
      if (canSubmit) {
        this.loading = true;
        AbnormalMakeup(this.filterData(this.param))
          .then((res) => {
            this.loading = false;
            if (res.ret.errcode === 1) {
              this.reset();
              this.$message.warning("成功补单");
              this.$emit("confirm");
            } else {
              this.errMsg = res.ret.msg;
              this.$message.error(res.ret.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      }
    },
   
  },
};
</script>
