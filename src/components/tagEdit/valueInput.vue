<template>
  <el-form :rules="inputRules"
           label-position="top"
           label-width="80%"
           :model="inputFrom"
           ref="inputFrom">
    <el-form-item prop="inputValueCn" label="" class="inline input-new-tag">
      <el-input
          placeholder="中文"
          v-model="inputFrom.inputValueCn"
          size="small"
          @keyup.enter.native="saveValue">
      </el-input>
    </el-form-item>
    <el-form-item prop="inputValueEn" label="" class="inline input-new-tag mar-l-10">
      <el-input
          placeholder="英文"
          v-model="inputFrom.inputValueEn"
          size="small"
          @keyup.enter.native="saveValue">
      </el-input>
    </el-form-item>
    <el-form-item label="" class="inline mar-l-10">
      <el-button class="button-new-tag" size="mini" type="primary"
                 @click="saveValue">保存
      </el-button>
    </el-form-item>
    <el-form-item label="" class="inline mar-l-10">
      <el-button class="button-new-tag" size="mini" type="info"
                 @click="cancelValue">取消
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
    props: {
        inputValueCn: {
            type: String,
            default: ''
        },
        inputValueEn: {
            type: String,
            default: ''
        },
        cnMaxLength: {
            type: Number,
            default: 100000
        },
        enMaxLength: {
            type: Number,
            default: 100000
        },
        showCancelButton: {
            type: Boolean,
            default: false
        },
        source: {
            type: String,
            default: ''
        }
    },
    watch: {
        inputValueCn: {
            handler (newValue) {
                this.inputFrom.inputValueCn = newValue
            }
        },
        inputValueEn: {
            handler (newValue) {
                this.inputFrom.inputValueEn = newValue
            }
        }
    },
    data () {
        return {
            inputFrom: {
                inputValueCn: this.inputValueCn,
                inputValueEn: this.inputValueEn
            },
            inputRules: {
                inputValueCn: {
                    required: false,
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback(new Error('不能为空'))
                        } else if (value.length > this.cnMaxLength) {
                            callback(new Error(`最多${this.cnMaxLength}个字`))
                        } else {
                            callback()
                        }
                    }
                },
                inputValueEn: {
                    required: false,
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback(new Error('不能为空'))
                        } else if (value.length > this.enMaxLength) {
                            callback(new Error(`最多${this.enMaxLength}个字`))
                        } else {
                            callback()
                        }
                    }
                }
            }
        }
    },
    methods: {
        saveValue () {
            this.$refs['inputFrom'].validate((valid) => {
                if (valid) {
                    this.$emit('saveValue', {
                        data: {
                            valueCn: this.inputFrom.inputValueCn.trim(),
                            valueEn: this.inputFrom.inputValueEn.trim()
                        },
                        source: this.source,
                        action: 'save'
                    })
                } else {
                    return false
                }
            })
        },
        cancelValue () {
            this.$emit('cancelValue')
        }
    }
}
</script>
<style lang="scss" scoped>
  .input-new-tag{
    width: 20%;
  }
</style>
