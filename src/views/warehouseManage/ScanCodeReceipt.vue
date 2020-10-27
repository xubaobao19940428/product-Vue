<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="物流单号：" fixed="left">
        <el-input
          v-model="logiCode"
          ref="logiCode"
          autofocus="true"
          clearable
          @keydown.native="keydownEvent"
          size="medium"
          style="width: 300px; margin-right: 10px;"
        ></el-input>
        <!-- <el-button
          type="primary"
          :disabled="logiCode === ''"
          v-preventReClick="300"
          @click="signSockInOrder"
          size="medium"
        >确认</el-button> -->
        <el-button
          type="primary"
          :disabled="logiCode === ''"
          v-preventReClick="300"
          @click="signSockInOrder1"
          size="medium"
        >确认</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <ul class="results-list">
      <li v-for="(item, i) in resultInfoList" :key="i">{{ item }}</li>
    </ul>
    <!-- <upload-exception-info-dialog
      :dialogVisible="uploadDialogVisible"
      :dialogTitle="uploadDialogTitle"
      :exception="exceptionInfo"
      @on-cancle="handleCancle"
      @on-confirm="handleConfirm"
    ></upload-exception-info-dialog>-->
    <upload-exception-info
      :dialogVisible="uploadInfoDialog"
      :sockInData="sockInData"
      :dialogTitle="uploadDialogTitle"
      :exception="exceptionInfo"
      @on-cancle="handleCancle1"
      @on-confirm="handleConfirmProduct"
    ></upload-exception-info>
    <abnormal-exception
      :dialogVisible="abnormalInfoDialog"
      :dialogTitle="abnormalInfoTitle"
      :exception="exceptionInfo"
      @on-cancle="handleCancleAbnormal"
      @on-confirm="handleConfirm"
    ></abnormal-exception>
  </div>
</template>

<script>
import {
  incomeOrderSign,
  addSignAbnormal,
  IncomeOrderAbnormalFeedback,
  EnterAbnormalProduct
} from "@/request/warehouse";
import UploadExceptionInfoDialog from "./components/UploadExceptionInfoDialog";
import UploadExceptionInfo from "./components/uploadExceptionInfo";
import { arrayToString, stringToArray } from "@/js/common/filter";
import abnormalException from "./components/abnormalException";
export default {
  data() {
    return {
      sockInData: [],
      abnormalInfoDialog: false,
      abnormalInfoTitle: "异常包裹信息",
      uploadInfoDialog: false,
      uploadDialogVisible: false,
      uploadDialogTitle: "异常商品信息",
      exceptionInfo: {
        logiCode: "",
        abnormalReason: "",
        content: "",
        imgs: "",
        groupName: "",
      },
      logiCode: "",
      lastTime: null,
      nextTime: null,
      resultInfoList: [],
      loading: false,
      dialog: {
        param: {
          imgs: "",
          errorMessage: "",
          remark: "",
          logisticsCompany: "",
          logiCode: "",
          companyId: "",
          type: "",
        },
        show: true,
        imgList: [],
      },
      uploadFileUrl: `${process.env.VUE_APP_UPLOAD_API}`,
      uploadFileName: `${process.env.VUE_APP_UPLOAD_NAME}`,
      headers: this.$headers,
      defaultLogi: "",
      sockInData: {},
    };
  },
  components: {
    UploadExceptionInfoDialog,
    UploadExceptionInfo,
    abnormalException,
  },
  methods: {
    signSockInOrder() {
      if (!this.logiCode) {
        return;
      }
      let params = {
        logiCode: this.logiCode,
      };
      incomeOrderSign(params)
        .then((res) => {
          let info = "";
          if (res.ret.errcode === 1) {
            info = this.logiCode + ": " + "签收成功！";
            this.resultInfoList.unshift(info);
          } else if (res.ret.errcode !== 20001 && res.ret.errcode !== -1) {
            info = this.logiCode + ": " + res.message;
            this.defaultLogi = this.logiCode;
            this.resultInfoList.unshift(info);
            this.uploadDialogVisible = true;
            this.exceptionInfo.logiCode = this.logiCode;
            this.exceptionInfo.abnormalReason = res.message;
          }
          this.logiCode = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    signSockInOrder1() {
      // this.uploadInfoDialog = true;
      // this.abnormalInfoDialog = true
      if (!this.logiCode) {
        return;
      }
      let params = {
        logiCode: this.logiCode,
      };
      incomeOrderSign(params)
        .then((resultes) => {
          let info = "";
          if (resultes.ret.errcode === 1) {
            info = this.logiCode + ": " + "签收成功！";
            this.resultInfoList.unshift(info);
          } else if (resultes.ret.errcode===20002) {
            info = this.logiCode + ": " + resultes.message;
            this.resultInfoList.unshift(info);
            this.abnormalInfoDialog = true;
            this.exceptionInfo.logiCode = this.logiCode;
            this.exceptionInfo.abnormalReason = resultes.message;
          }else{
            info = this.logiCode + ": " + resultes.message;
            this.resultInfoList.unshift(info);
          }
          this.logiCode = "";
        })
        //   let info = "";
        //   if (resultes.ret.errcode === 1) {
        //     info = this.logiCode + ": " + "录入异常商品！";
        //     var productLogiCode = this.logiCode
        //     this.resultInfoList.unshift(info);
        //     let scokInSkuList = [];
        //     let sourceList = resultes.incomeOrderProductDetail;
        //     _.forEach(sourceList, (item) => {
        //       let skuItem = {};
        //       skuItem.skuCode = item.skuCode;
        //       skuItem.standardAttr = item.standardAttr;
        //       skuItem.skuCover = item.productCover;
        //       skuItem.totalCount = item.totalCount;
        //       skuItem.count = 0;
        //       skuItem.nameCn = item.productName;
        //       skuItem.abnormalType = null;
        //       skuItem.abnormalCount = 0;
        //       skuItem.remark = item.remark;
        //       scokInSkuList.push(skuItem);
              
        //     });
        //     console.log(sourceList)
        //     this.sockInData = {
        //       logiCode: this.logiCode,
        //       // orderNo: sourceList.orderNo,
        //       scokInSkuList: scokInSkuList,
        //     };
        //     this.uploadDialogTitle = `异常商品信息(${productLogiCode})`
        //     this.uploadInfoDialog = true;
        //   } else if (resultes.ret.errcode === 20002) {
        //     info = this.logiCode + ": " + resultes.message;
        //     this.resultInfoList.unshift(info);
        //     this.abnormalInfoDialog = true;
        //     this.exceptionInfo.logiCode = this.logiCode;
        //     this.exceptionInfo.abnormalReason = resultes.message;
        //   } else {
        //     info = this.logiCode + ": " + resultes.message;
        //     this.resultInfoList.unshift(info);
        //   }
        //   this.logiCode = "";
        // })
        .catch((error) => {
          console.log(error);
        });
    },
    keydownEvent(e) {
      let keycode = e.keyCode || e.which || e.charCode;
      this.nextTime = new Date();
      if (keycode === 13) {
        if (this.lastTime && this.nextTime - this.lastTime < 30) {
          // 扫码枪
          // do something
          console.log("扫码枪");
        } else {
          // 键盘
          // do something
          console.log("键盘");
        }
        this.signSockInOrder1();
        console.log(this.logiCode);
        e.preventDefault();
      } else {
        if (this.lastTime && this.nextTime - this.lastTime < 30) {
          console.log("扫码枪1");
        } else {
          console.log("键盘1");
        }
        this.lastTime = this.nextTime;
      }
    },
    handleUploaderRemove(file, fileList, key) {
      let mappedFileList = fileList.map((mappingfile) => {
        if (mappingfile.response !== undefined) {
          mappingfile.url = mappingfile.response.data;
        }
        return mappingfile;
      });
      this.dialog.imgList = mappedFileList;
      this.dialog.param[key] = arrayToString(mappedFileList);
    },
    handleUploadSuccess(response, file, fileList, key) {
      if (response.data) {
        console.log(fileList);
        let mappedFileList = fileList.map((mappingfile) => {
          if (mappingfile.response !== undefined) {
            mappingfile.url = mappingfile.response.data;
          }
          return mappingfile;
        });
        this.dialog.imgList = mappedFileList;
        this.dialog.param[key] = arrayToString(mappedFileList);
      } else {
        let itemI = fileList.find((item) => {
          return item == file;
        });
        if (itemI != -1) {
          fileList.splice(itemI, 1);
        }
      }
    },
    handleCancle() {
      this.exceptionInfo.groupName = "";
      this.uploadDialogVisible = false;
    },
    handleCancle1() {
      this.uploadInfoDialog = false;
    },
    //录入异常包裹
    handleCancleAbnormal(data) {
      this.abnormalInfoDialog = false;
      this.exceptionInfo.logiCode = "";
      this.exceptionInfo.addSignAbnormal = "";
    },
    handleConfirm(data) {
      console.log(data);
      
      addSignAbnormal(this.filterData(data))
        .then((res) => {
          if (res.ret.errcode === 1) {
            this.$message.success("异常提交成功！");
            this.abnormalInfoDialog = false;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //录入异常商品信息
    handleConfirmProduct(data){
      console.log(data)
      var params={
        logiCode:data.logiCode,
        abnormalIncomeSku:data.scokInSkuList
      }
      EnterAbnormalProduct(params).then(response=>{
        if(response.ret.errcode==1){
          this.uploadInfoDialog = false;
          this.$message.success('异常商品录入成功')
        }
      }).catch(error=>{
        console.log(error)
      })

    }
  },
};
</script>

<style lang="scss" scoped>
.results-list {
  color: #333;
  line-height: 30px;
}
</style>