<template>
    <el-dialog
        title="展示商品设置"
        :visible="showDialog"
        @close="handleClose"
        :close-on-click-modal="false"
        class="show-product-dialog"
    >
        <el-form :model="param" :rules="rules" label-width="100px">
            <el-form-item label="奖品名称：" prop="name">
                <el-input v-model="param.name"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer" slot="footer">
            <el-button size="medium" @click="handleClose">取消</el-button>
            <el-button size="medium" type="primary" @click="handleConfirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { addBox, editBox } from '@/api/shake.js'
    export default {
        props: {
            showDialog: Boolean,
            propParam: Object,
            countryCode: String
        },
        data () {
            return {
                param: {
                    name: '',
                    countryCode: ''
                },
                rules: {
                    name: [{ required: true, message: '必填', trigger: 'change' }]
                }
            }
        },
        mounted () {
            if (this.propParam) {
                Object.assign(this.param, this.propParam)
            }
        },
        methods: {
            handleClose () {
                this.$emit('close')
            },
            handleConfirm () {
                this.param.countryCode = this.countryCode
                let fetchUrl = addBox
                if (this.param.id) {
                    fetchUrl = editBox
                }
                fetchUrl(this.param).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.$emit('confirm')
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .show-product-dialog {
        .lang-list {
            li {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
                .text {
                    width: 90px;
                }
            }
        }
    }
</style>
