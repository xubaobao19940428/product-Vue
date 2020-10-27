<template>
    <div class="match-setting-wrapper app-container">
        <div class="operator-container">
            <el-button icon="el-icon-plus" type="primary"
                       size="medium"
                       @click="handleEdit('add')"
                       class="operator-item"
            >
                新增
            </el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList" v-loading="load">
                <el-table-column label="序号" type="index" width="100px" align="center" fixed="left"></el-table-column>
                <el-table-column label="金币兑换内容" align="center">
                    <template slot-scope="scope">
                        {{ getContentShow(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.created | secondTimeFormat }}</template>
                </el-table-column>
                <el-table-column label="修改时间" align="center">
                    <template slot-scope="scope">{{ scope.row.updated | secondTimeFormat }}</template>
                </el-table-column>
                <el-table-column label="排序" align="center" prop="sort"></el-table-column>
                <el-table-column align="center" label="更新人">
                    <template slot-scope="scope">
                        {{scope.row.operation || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEdit('edit', scope.row)">编辑</el-button>
                        <el-button type="text" @click="handleDel(scope.row, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination-box">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="page.pageNum"
                :page-size="page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>

        <el-dialog :visible="editShow" title="金币兑换" @close="editShow = false"
                   :close-on-click-modal="false"
                   width="600px"
        >
            <el-form label-width="180px" ref="editDialog" :rules="rules" :model="param">
                <el-form-item label="金币：" prop="number">
                    <el-input-number v-model="param.number" size="medium" placeholder="请输入" :min="1" :controls="false" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="兑换选择：" prop="type">
                    <el-radio-group v-model="param.type">
                        <el-radio v-for="item in typeEnum" :key="item.key" :label="parseInt(item.key)">{{ item.text }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="兑换图片：">
                    <multi-lang-file-upload :propFileList="imgList"  @setData="setImg"></multi-lang-file-upload>
                </el-form-item>
                <template v-if="param.type == 1">
                    <el-form-item label="优惠券ID：" prop="content">
                        <el-input v-model="param.content" size="medium" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="奖品名称：" prop="name">
                        <ul class="lang-list">
                            <li v-for="(val, key) in param.name"
                                class="flex mar-b-10"
                                :key="key"
                            >
                                <span class="text label-title">{{ getLangName(key) }}：</span><el-input class="flex1" v-model="param.name[key]"></el-input>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="说明：" prop="extJson">
                        <ul class="lang-list">
                            <li v-for="(val, key) in param.extJson"
                                class="flex mar-b-10"
                                :key="key"
                            >
                                <span class="text label-title">{{ getLangName(key) }}：</span><el-input class="flex1" v-model="param.extJson[key]"></el-input>
                            </li>
                        </ul>
                    </el-form-item>
                </template>
                <el-form-item label="积分值：" v-else-if="param.type == 2" prop="content">
                    <el-input-number v-model="param.content" size="medium" placeholder="请输入" :min="0.01" :precision="2" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="排序：" prop="sort">
                    <el-input-number v-model="param.sort" size="medium" placeholder="请输入" :controls="false" :min="1" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="当日最大限兑数量：" prop="dayMaxStock">
                    <el-input-number v-model="param.dayMaxStock" size="medium" placeholder="请输入" :min="0" :precision="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="每人每日最大兑换数量：" prop="eachStock">
                    <el-input-number v-model="param.eachStock" size="medium" placeholder="请输入" :min="0" :precision="0" :controls="false"></el-input-number>
                </el-form-item>
            </el-form>
            <div class="footer" slot="footer">
                <el-button @click="editShow = false">取消</el-button>
                <el-button type="primary" size="medium" @click="handleConfirm" :loading="saving">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { queryGoldList, delGold, updateGold, addGold } from '@/api/shake.js'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'

    export default {
        props: {
            countryCode: String
        },
        data () {
            return {
                dataList: [],
                sizeNum: 1,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                totals: 0,
                load: false,
                editShow: false,
                saving: false,
                rules: {
                    type: { required: true, trigger: 'change', message: '请选择' },
                    number: { required: true, trigger: 'change', message: '请输入' },
                    content: { required: true, trigger: 'change', message: '请输入' },
                    sort: { required: true, trigger: 'change', message: '请输入' },
                    name: [{ required: true, message: '必填', trigger: 'change' }],
                    extJson: [{ required: true, message: '必填', trigger: 'change' }],
                    dayMaxStock: { required: true, trigger: 'change', message: '请输入' },
                    eachStock: { required: true, trigger: 'change', message: '请输入' }
                },
                typeEnum: [
                    {
                        key: 2,
                        text: '积分'
                    },
                    {
                        key: 1,
                        text: '优惠券'
                    }
                ],
                curType: 'add',
                param: {
                    type: 2,
                    number: 1,
                    content: '',
                    sort: 100,
                    name: {},
                    extJson: {},
                    dayMaxStock: 0,
                    eachStock: 0
                },
                imgList: []
            }
        },
        components: {
            multiLangFileUpload
        },
        computed: {
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        methods: {
            handleSizeChange (val) {
                Object.assign(this.page, {
                    pageSize: val,
                    pageNum: 1
                })
                this.getList()
            },
            getContentShow (item) {
                let res = `${item.number}金币兑换`
                if (item.type === 2) {
                    res += `${item.content}个积分`
                } else {
                    res += '优惠券'
                }

                return res
            },
            handleEdit (type, data) {
                this.curType = type
                this.imgList = []
                if (type == 'edit') {
                    // 修改
                    let resName = JSON.parse(data.name)
                    let resExt = data.extJson ? JSON.parse(data.extJson) : {}
                    for (let i = 0, len = this.languageList.length; i < len; i++) {
                        let lang = this.languageList[i].code
                        let nameItem = resName[lang]
                        if (!resExt[lang]) {
                            resExt[lang] = ''
                        }
                        if (!nameItem) {
                            resName[lang] = ''
                        }
                    }
                    Object.assign(this.param, {
                        type: data.type,
                        number: data.number,
                        content: data.content,
                        sort: data.sort,
                        id: data.id,
                        name: resName,
                        extJson: resExt,
                        dayMaxStock: data.dayMaxStock,
                        eachStock: data.eachStock
                    })
                    let img = JSON.parse(data.icon)
                    for (let key in img) {
                        this.imgList.push({
                            languageCode: key,
                            name: img[key]
                        })
                    }
                } else {
                    // 新增
                    let name = {}
                    let extJson = {}
                    for (let i = 0, len = this.languageList.length; i < len; i++) {
                        let lang = this.languageList[i].code
                        name[lang] = ''
                        extJson[lang] = ''
                    }
                    Object.assign(this.param, {
                        type: 2,
                        number: 1,
                        content: '',
                        sort: 100,
                        dayMaxStock: 0,
                        eachStock: 0,
                        name,
                        extJson
                    })
                }
                this.editShow = true
            },
            getLangName (code) {
                let item = this.languageList.find((val) => {
                    return val.code == code
                })
                return item ? item.desc : ''
            },
            setImg (data) {
                this.imgList = data
            },
            getList (pageNum) {
                this.page.pageNum = pageNum ? pageNum : 1
                this.load = true
                queryGoldList(Object.assign({
                    countryCode: this.countryCode,
                    channel: 2
                }, this.page)).then(res => {
                    this.load = false
                    if (res.ret.errCode === 0) {
                        this.dataList = res.data.list
                        this.totals = res.data.total
                    }
                }).catch(() => {
                    this.load = false
                })
            },
            handleDel (item, index) {
                this.$confirm('确认删除该条设置吗？', '提示').then(() => {
                    delGold({
                        id: item.id
                    }).then(res => {
                        if (res.ret.errCode === 0) {
                            this.$message.success('删除成功')
                            this.getList()
                        }
                    })
                }).catch(() => {})
            },
            handleConfirm () {
                let param = JSON.parse(JSON.stringify(this.param))

                if (param.type == 1) {
                    if (!param.name['cn'] || !param.name['en']) {
                        return this.$message.warning('中英文奖品名称不能为空')
                    }
                    if (!param.extJson['cn'] || !param.extJson['en']) {
                        return this.$message.warning('中英文说明不能为空')
                    }
                }
                if (param.type == 2) {
                    // 选择了积分兑换
                    if (param.content > param.number) {
                        // 积分大于金币
                        return this.$message.warning('金币须大于或等于积分值')
                    }
                }
                let imgList = this.imgList.filter((val) => {
                    return (val.languageCode == 'cn' && val.name) || (val.languageCode == 'en' && val.name)
                })
                if (imgList.length < 2) {
                    return this.$message.warning('中英文图片不能为空')
                }
                let obj = {}
                for (let i = 0; i < this.imgList.length; i++) {
                    if (this.imgList[i].name) {
                        obj[this.imgList[i].languageCode] = this.imgList[i].name
                    }
                }
                param.icon = JSON.stringify(this.filterData(obj))
                param.name = this.filterData(param.name)
                param.extJson = this.filterData(param.extJson)
                param.countryCode = this.countryCode
                param.channel = 2 // 签到金币

                this.$refs['editDialog'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        let fetchUrl = addGold
                        if (this.curType === 'edit') {
                            fetchUrl = updateGold
                        }
                        fetchUrl(this.filterData(param)).then((res) => {
                            this.saving = false
                            if (res.ret.errCode === 0) {
                                this.editShow =false
                                this.$message.success('保存成功')
                                this.getList()
                            }
                        }).catch(() => {
                            this.saving = false
                        })
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
