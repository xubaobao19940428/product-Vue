<template>
  <div>
    <el-dialog title="商品返利比例" :visible.sync="visible" width="380px" @close="closeDialog">
      <el-form :rules="dialogRules" :model="dialogForm" ref="dialogForm">
        <el-form-item prop="rateO" label="自购：" :label-width="formLabelWidth">
          <!-- <el-input-number v-model="dialogForm.rateO" :controls="false" :min="0" :max="99999" :precision="2" size="medium"><i slot="suffix">%</i></el-input-number> -->
          <el-input placeholder="请输入内容" size="small" style="width:200px" v-model="dialogForm.rateO">
            <i slot="suffix">%</i>
          </el-input>
        </el-form-item>
        <el-form-item prop="rateS" label="S0~S6：" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" size="small" style="width:200px" v-model="dialogForm.rateS">
            <i slot="suffix">%</i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="sureDialog" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { divide, multiply } from '@/js/common/filter'
export default {
    name: 'profitDialog',
    components: {},
    mixins: [],
    extends: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dialogData: {
            type: Array,
            default: () => { return [{ rate: '' }, { rate: '' }] }
        }
    },
    data () {
        return {
            formLabelWidth: '90px',
            dialogForm: {
                rateO: '', // 自购
                rateS: '' // S0~S1
            },
            dialogRules: {
                rateO: {
                    required: true,
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (isNaN(value)) {
                            callback(new Error('请输入数字值'))
                        }
                        if (value < 0 || value > 9999999 || value === '' || value === undefined) {
                            callback(new Error('请输入大于等于0的数字'))
                        }
                        callback()
                    }
                },
                rateS: {
                    required: true,
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (isNaN(value)) {
                            callback(new Error('请输入数字值'))
                        }
                        if (value < 0 || value > 9999999 || value === '' || value === undefined) {
                            callback(new Error('请输入大于等于0的数字'))
                        }
                        callback()
                    }
                }
            }
        }
    },
    computed: {},
    directives: {},
    filters: {},
    created () {},
    mounted () {},
    watch: {
        dialogData (value) {
            value.forEach(item => {
                if (item.memberLevel === -1) {
                    this.dialogForm.rateO = divide(item.rate)
                } else if (item.memberLevel === 0) {
                    this.dialogForm.rateS = divide(item.rate)
                }
            })
        }
    },
    methods: {
        closeDialog () {
            this.$emit('closeDialog')
        },
        sureDialog () {
            this.$refs['dialogForm'].validate((valid) => {
                if (valid) {
                    this.dialogData.forEach(item => {
                        if (item.memberLevel === -1) {
                            item.rate = multiply(this.dialogForm.rateO)
                        } else if (item.memberLevel === 0) {
                            item.rate = multiply(this.dialogForm.rateS)
                        }
                    })
                    this.$emit('sureDialog', this.dialogData)
                } else {
                    return false
                }
            })
        }
    }
}
</script>
<style lang='scss' scoped>
  .title {
    display: inline-block;
    width: 110px;
    text-align: center;
  }
</style>
