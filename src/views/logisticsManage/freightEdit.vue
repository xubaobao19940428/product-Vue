<template>
  <div class="app-container">
      <el-form :rules="rules" ref="freightTemplate" :model="freightTemplate" label-position="right">
          <div class="filter-container">
              <el-button size="small" type="primary" @click="clickSaveTemplate()">保存</el-button>
          </div>
          <el-form-item label="模板名称：" prop="templateName" label-width="140px">
              <el-input v-model="freightTemplate.templateName" placeholder="请输入模板名称"></el-input>
          </el-form-item>
          <el-form-item label="运送方式：" label-width="140px">
              <span>买家承担运费</span>
          </el-form-item>
          <el-form-item label="国家：" label-width="140px" prop="countryCode">
              <el-select v-model="freightTemplate.countryCode" :disabled="$route.query.freightId ? true : false" filterable>
                  <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="计费规则：" prop="templateType" label-width="140px">
              <template>
                  <el-radio-group v-model="freightTemplate.templateType">
                      <el-radio :label="2">按件计费</el-radio>
                      <el-radio :label="1">按重计费</el-radio>
                  </el-radio-group>
              </template>
          </el-form-item>
          <!-- 默认邮费模板 -->
          <el-tag class="mar-t-10 mar-b-10">默认邮费模板</el-tag>
          <div>
              <el-form-item prop="firstAmount" class="elItemList">
                  <template>
                      <el-input
                          placeholder="请输入内容"
                          v-model="freightTemplate.firstAmount"
                          class="input-with-select">
                          <label slot="prepend" class="prependLabel">{{ tableTitles[freightTemplate.templateType].firstAmount }} :</label>
                          <label slot="append" class="appendLabel">{{ tableTitles[freightTemplate.templateType].amountUnit }}</label>
                      </el-input>
                  </template>
              </el-form-item>
              <el-form-item prop="firstPrice" class="elItemList">
                  <template>
                      <el-input
                          placeholder="请输入内容"
                          v-model="freightTemplate.firstPrice"
                          class="input-with-select">
                          <label slot="prepend" class="prependLabel">{{ tableTitles[freightTemplate.templateType].firstPrice }}:</label>
                          <label slot="append" class="appendLabel">{{ getCurrencyUnit(freightTemplate.countryCode, 'currencyUnit') }}</label>
                      </el-input>
                  </template>
              </el-form-item>
              <el-form-item prop="continueAmount" class="elItemList">
                  <template>
                      <el-input
                          placeholder="请输入内容"
                          v-model="freightTemplate.continueAmount"
                          class="input-with-select">
                          <label slot="prepend" class="prependLabel">{{ tableTitles[freightTemplate.templateType].continueAmount }}:</label>
                          <label slot="append" class="appendLabel">件</label>
                      </el-input>
                  </template>
              </el-form-item>
              <el-form-item prop="continuePrice" class="elItemList">
                  <template>
                      <el-input
                          placeholder="请输入内容"
                          v-model="freightTemplate.continuePrice"
                          class="input-with-select">
                          <label slot="prepend" class="prependLabel">{{ tableTitles[freightTemplate.templateType].continuePrice }}:</label>
                          <label slot="append" class="appendLabel">{{ getCurrencyUnit(freightTemplate.countryCode, 'currencyUnit') }}/件</label>
                      </el-input>
                  </template>
              </el-form-item>
          </div>
          <!-- 区域运费列表 -->
          <el-tag style="margin:10px 0;">区域运费列表</el-tag>
          <el-table :data="items" style="width: 100%" border>
              <el-table-column label="区域" align="center">
                  <template slot-scope="scope">
                      <span>{{ scope.row.stateCode.join(',') }}</span>
                  </template>
              </el-table-column>
              <el-table-column
                  :label="tableTitles[freightTemplate.templateType].firstAmount"
                  prop="firstAmount" align="center">
                  <template slot-scope="scope">
                      <div>{{ scope.row.itemType == 2 ? '不支持配送' : scope.row.firstAmount }}</div>
                  </template>
              </el-table-column>
              <el-table-column
                  :label="tableTitles[freightTemplate.templateType].firstPrice"
                  prop="firstPrice" align="center">
                  <template slot-scope="scope">
                      <div v-if="scope.row.itemType == 2">不支持配送</div>
                      <div v-else-if="scope.row.itemType == 4">-</div>
                      <div v-else>{{scope.row.firstPrice }}</div>
                  </template>
              </el-table-column>
              <el-table-column
                  :label="tableTitles[freightTemplate.templateType].continueAmount"
                  prop="continueAmount" align="center">
                  <template slot-scope="scope">
                      <div v-if="scope.row.itemType == 2">不支持配送</div>
                      <div v-else-if="scope.row.itemType == 4">-</div>
                      <div v-else>{{ scope.row.continueAmount }}</div>
                  </template>
              </el-table-column>
              <el-table-column
                  :label="tableTitles[freightTemplate.templateType].continuePrice"
                  prop="continuePrice"
                  align="center">
                  <template slot-scope="scope">
                      <div v-if="scope.row.itemType == 2">不支持配送</div>
                      <div v-else-if="scope.row.itemType == 4">-</div>
                      <div v-else>{{ scope.row.continuePrice }}</div>
                  </template>
              </el-table-column>
              <el-table-column label="区域是否包邮" align="center">
                  <template slot-scope="scope">
                      <span>{{ scope.row.itemType == 4 ? '是' : '否' }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="是否经济物流" align="center">
                  <template slot-scope="scope">
                      <span>{{ scope.row.itemType == 3 ? '是' : '否' }}</span>
                  </template>
              </el-table-column>
              <el-table-column width="150px" align="right">
                  <template slot-scope="scope">
                      <el-button size="mini" @click="showAddDialog('edit', scope.row, scope.$index)">编辑</el-button>
                      <el-button size="mini" type="danger" @click="makeSureDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>
          <el-button type="primary" plain class="mar-t-10" @click="showAddDialog('add')">新指定可配送区域和运费</el-button>
      </el-form>
      <!-- 编辑弹窗 -->
      <el-dialog
          title="编辑模板"
          :visible.sync="areaDialog.show"
          width="80%">
         <el-form ref="addDialog" :rules="areaDialog.rules" :model="areaDialogParam">
             <el-form-item label="区域列表：">
                 <span>{{ areaDialogParam.stateCode.join(',') }}</span>
                 <i class="el-icon-edit pointer" @click="showAddress()"></i>
             </el-form-item>
             <el-form-item>
                 <el-radio-group v-model="areaDialogParam.itemType" size="medium">
                     <el-radio :label="4" border  >包邮</el-radio>
                     <el-radio :label="2" border  >不可配送</el-radio>
                     <el-radio :label="1" border  >可配送-非经济物流</el-radio>
                     <el-radio :label="3" border  >可配送-经济物流</el-radio>
                 </el-radio-group>
             </el-form-item>
             <template v-if="areaDialogParam.itemType == 1 || areaDialogParam.itemType == 3">
                 <el-form-item prop="firstAmount">
                     <template>
                         <el-input
                             placeholder="请输入内容"
                             v-model="areaDialogParam.firstAmount"
                             class="input-with-select">
                             <label slot="prepend" class="prependLabel">{{ tableTitles[freightTemplate.templateType].firstAmount }} :</label>
                             <label slot="append" class="appendLabel">{{ tableTitles[freightTemplate.templateType].amountUnit }}</label>
                         </el-input>
                     </template>
                 </el-form-item>
                 <el-form-item prop="firstPrice">
                     <template>
                         <el-input
                             placeholder="请输入内容"
                             v-model="areaDialogParam.firstPrice"
                             class="input-with-select">
                             <label slot="prepend" class="prependLabel">{{ tableTitles[freightTemplate.templateType].firstPrice }}:</label>
                             <label slot="append" class="appendLabel">{{ getCurrencyUnit(freightTemplate.countryCode, 'currencyUnit') }}</label>
                         </el-input>
                     </template>
                 </el-form-item>
                 <el-form-item prop="continueAmount">
                     <template>
                         <el-input
                             placeholder="请输入内容"
                             v-model="areaDialogParam.continueAmount"
                             class="input-with-select">
                             <label slot="prepend" class="prependLabel">{{ tableTitles[freightTemplate.templateType].continueAmount }}:</label>
                             <label slot="append" class="appendLabel">件</label>
                         </el-input>
                     </template>
                 </el-form-item>
                 <el-form-item prop="continuePrice">
                     <template>
                         <el-input
                             placeholder="请输入内容"
                             v-model="areaDialogParam.continuePrice"
                             class="input-with-select">
                             <label slot="prepend" class="prependLabel">{{ tableTitles[freightTemplate.templateType].continuePrice }}:</label>
                             <label slot="append" class="appendLabel">{{ getCurrencyUnit(freightTemplate.countryCode, 'currencyUnit') }}/件</label>
                         </el-input>
                     </template>
                 </el-form-item>
             </template>
         </el-form>
          <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="areaDialog.show = false">取 消</el-button>
                <el-button size="small" type="primary" @click="makeSureAdd()">确 定</el-button>
            </span>
      </el-dialog>
      <select-address :propShowDialog="address.show" :propStateList="address.list" :countryCode="freightTemplate.countryCode" @close="address.show = false" @confirm="confirmSelectAddress"></select-address>
  </div>
</template>
<script>
    import { getTemplate, addTemplate, updateTemplate } from '@/request/freight.js'
    import selectAddress from '@/components/addressSelect/backAddress'
    export default {
        data () {
            return {
                tableTitles: {
                    2: {
                        firstAmount: '首件',
                        amountUnit: '件',
                        firstPrice: '首件运费',
                        priceUnit: 'RM',
                        continueAmount: '每增加产品数',
                        continuePrice: '续加费用'
                    },
                    1: {
                        firstAmount: '首重',
                        amountUnit: 'KG',
                        firstPrice: '首重运费',
                        priceUnit: 'RM',
                        continueAmount: '每增加重量',
                        continuePrice: '续加费用'
                    },
                    firstAmount2: '首件(件)',
                    firstPrice2: '首件运费(RM)',
                    continueAmount2: '每增加产品数(件)',
                    continuePrice2: '续加费用',
                    firstAmount1: '首重(KG)',
                    firstPrice1: '首重运费(RM)',
                    continueAmount1: '每增加重量(KG)',
                    continuePrice1: '续加费用(RM)'
                },
                freightTemplate: {
                    countryCode: 'MY',
                    templateId: null,
                    templateType: 2, // 计费规则
                    templateName: '', // 模板名称
                    firstAmount: '',
                    firstPrice: '',
                    continueAmount: '', // 续加重量/件数
                    continuePrice: '', // 续加运费
                    item: []
                },
                areaDialogParam: { // dialog区域模板数据
                    stateCode: [],
                    itemType: 1,
                    firstAmount: '',
                    firstPrice: '',
                    continueAmount: '', // 续加重量/件数
                    continuePrice: ''// 续加运费
                },
                areaDialog: {
                    show: false,
                    index: -1,
                    rules: {
                        firstAmount: [{ required: true, message: '请输入首件件数', trigger: 'change' }],
                        firstPrice: [{ required: true, message: '请输入首重运费', trigger: 'change' }],
                        continueAmount: [{ required: true, message: '请输入每增加重量', trigger: 'change' }],
                        continuePrice: [{ required: true, message: '请输入续加运费', trigger: 'change' }]
                    }
                },
                items: [],
                rules: {
                    templateName: [
                        { required: true, message: '请输入模版名称', trigger: 'change' },
                        { min: 0, max: 20, message: '长度在20个字符内', trigger: 'change' }
                    ],
                    support: [{ required: true, message: '请设置运费类型', trigger: 'change' }],
                    templateType: [{ required: true, message: '请选择计费规则', trigger: 'change' }],
                    countryCode: [{ required: true, message: '请选择', trigger: 'change' }],
                    firstAmount: [{ required: true, message: '请输入', trigger: 'change' }],
                    firstPrice: [{ required: true, message: '请输入', trigger: 'change' }],
                    continueAmount: [{ required: true, message: '请输入', trigger: 'change' }],
                    continuePrice: [{ required: true, message: '请输入', trigger: 'change' }]
                },
                address: {
                    show: false,
                    index: -1,
                    list: []
                }
            }
        },
        created () {
            if (this.$route.query.freightId) {
                this.getTemplateList()
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        components: {
            selectAddress
        },
        methods: {
            // 获取详情
            getTemplateList  () {
                getTemplate({
                    templateId: this.$route.query.freightId
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.freightTemplate = res.freightTemplateUnit
                        this.format(res.freightTemplateUnit.item)
                    }
                })
            },
            // 区域地址选择
            showAddress () {
                this.address.show = true
                this.address.list = this.areaDialogParam.stateCode
            },
            confirmSelectAddress (data) {
                this.areaDialogParam.stateCode = data
                this.address.show = false
            },
            // 删除
            makeSureDelete (index) { // 确认删除行
                this.$confirm('确认删除?请谨慎操作', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.items.splice(index, 1)
                })
            },
            // 添加区域
            makeSureAdd () { // 确认添加
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        if (this.areaDialogParam.itemType == 2 || this.areaDialogParam.itemType == 4) {
                            this.areaDialogParam.firstAmount = '-1'
                            this.areaDialogParam.firstPrice = '0'
                            this.areaDialogParam.continueAmount = '0'
                            this.areaDialogParam.continuePrice = '0'
                        }
                        if (this.areaDialog.index != -1) {
                            Object.assign(this.items[this.areaDialog.index], JSON.parse(JSON.stringify(this.areaDialogParam)))
                        } else {
                            this.items.push(JSON.parse(JSON.stringify(this.areaDialogParam)))
                        }
                        this.areaDialog.show = false
                    }
                })
            },
            // 显示新增编辑区域
            showAddDialog (type, row, index) {
                this.areaDialogParam = {
                    stateCode: [],
                    itemType: 1,
                    firstAmount: '',
                    firstPrice: '',
                    continueAmount: '', // 续加重量/件数
                    continuePrice: ''// 续加运费
                }
                if (type == 'add') {
                    this.areaDialog.index = -1
                } else {
                    let data = JSON.parse(JSON.stringify(row))
                    Object.assign(this.areaDialogParam, data)
                    this.areaDialog.index = index
                }
                this.areaDialog.show = true
            },
            // 保存
            clickSaveTemplate () {
                this.$refs['freightTemplate'].validate((valid) => {
                    if (valid) {
                        let param = JSON.parse(JSON.stringify(this.freightTemplate))
                        // 区域运费列表转数组(后台接收区域运费列表时需每个区域单独一个对象)
                        if (this.items.length > 0) {
                            let arr = []
                            this.items.map((item) => {
                                item.stateCode.map((value) => {
                                    let data = {}
                                    data.continueAmount = item.continueAmount
                                    data.continuePrice = item.continuePrice
                                    data.firstAmount = item.firstAmount
                                    data.firstPrice = item.firstPrice
                                    data.stateCode = value
                                    data.stateName = value
                                    data.itemType = item.itemType
                                    arr.push(data)
                                })
                            })

                            param.item = arr
                            console.log(arr)
                        }
                        let data = {
                            freightTemplate: this.filterData(param)
                        }
                        if (this.$route.query.freightId) {
                            updateTemplate(data).then(res => {
                                if (res.ret.errcode === 1) {
                                    this.$message.success('操作成功')
                                    this.$router.go(-1)
                                }
                            })
                        } else {
                            addTemplate(data).then(res => {
                                if (res.ret.errcode === 1) {
                                    this.$message.success('操作成功')
                                    this.$router.go(-1)
                                }
                            })
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            format (item) { // 格式化列表区域运费列表
                if (!item) { return }
                item.map((value) => {
                    value.str = String(value.firstAmount) + String(value.firstPrice) + String(value.continueAmount) + String(value.continuePrice) + String(value.itemType)
                    let flag = true
                    this.items.map((obj) => {
                        if (obj.str === value.str) {
                            flag = false
                            obj.stateCode.push(value.stateCode)
                        }
                    })
                    if (flag) {
                        value.stateCode = [value.stateCode]
                        this.items.push(value)
                    }
                })
            }
        }
    }
</script>
<style>
.prependLabel {
  text-align: center;
  width: 70px;
  display: inline-block;
}
.appendLabel {
  text-align: center;
  width: 60px;
  display: inline-block;
}
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.elItemList {
  display: inline-block;
  width: 45%;
  margin-right: 5%;
}
</style>
