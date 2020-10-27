<template>
    <div class="created-subject-dialog">
        <el-dialog title="编辑大奖专题" 
            :visible.sync="subjectDialogShow" 
            @close="handleClose"
            :close-on-click-modal="false"
            width="700px"
        >
            <table class="table table-bordered table-info">
                <tbody>
                    <tr v-for="(item, index) in languageList" :key="index">
                        <th><span class="required" v-if="item.code === 'cn' || item.code === 'en'">*</span> {{item.desc}}{{item.code}} </th>
                        <td>
                            <el-input v-model="prizeSubject[item.code]" clearable size="medium" placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="dialog-footer" slot="footer">
                <el-button @click="handleConfirm" type="primary" size="small">确定</el-button>
                <el-button size="small" @click="handleClose">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        subjectObject: {
            type: Object,
            default: {}
        },
        subjectDialogShow: Boolean
    },
    computed: {
        languageList() { 
            let languageList = JSON.parse(this.getStore('languageList'))
            return languageList
        },
        prizeSubject() {
            return this.subjectObject
        }
    },
    methods: {
        handleConfirm () {
            if (!this.prizeSubject.cn) {
                this.$message.error('大奖专题中文不能为空')
                return
            }
            if (!this.prizeSubject.en) {
                this.$message.error('大奖专题英文不能为空')
                return 
            }
            this.$meit('confirm', JSON.parse(JSON.stringify(this.prizeSubject)))
        },
        handleClose () {
            this.$emit('close')
        }
    }
}
</script>