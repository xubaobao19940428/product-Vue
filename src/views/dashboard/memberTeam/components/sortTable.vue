<template>
    <div class="sort-table">
        <el-table :data="tableList" style="width: 100%" border max-height="400">
            <el-table-column label="排名" type="index" width="50" align="center"></el-table-column>
            <!-- <el-table-column label="用户userId" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.userId }}</div>
                </template>
            </el-table-column> -->
            <el-table-column label="用户昵称" width="180" align="center">
                <template slot-scope="scope">
                    <div class="user-nick" @click="userClick(scope.row.userId)">{{ scope.row.userNickname }}</div>
                </template>
            </el-table-column>
            <el-table-column label="新增PS数" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.volume }}</div>
                </template>
            </el-table-column>
            <el-table-column label="环比变化" width="160" align="center">
                <template slot-scope="scope">
                    <div>{{ showNum(scope.row.changePP) }}<i class="iconfont increase" v-if="scope.row.changePP<0">&#xe6da;</i><i class="iconfont down" v-if="scope.row.changePP>0">&#xe6db;</i></div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: {
            tableList: Array
        },
        methods: {
            showNum (val) {
                if (val<0) {
                    let num = val.toString().split('-')[1]
                    return  `${num}%`
                }
                return `${val}%`
            },
            userClick (val) {
                this.$router.push({
                    name: 'memberInfo',
                    query: {
                        userId: val
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .sort-table{
        .increase{
            color: #f41c5e;
        }
        .down{
            color: #22dd14;
        }
        .user-nick{
            color: #409eff;
            cursor: pointer;
        }
    }
</style>