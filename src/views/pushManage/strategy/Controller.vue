<template>
    <div class="controller">
        <div class="title">发送控制</div>
        <el-form inline :model="controllerFormData">
            <el-form-item required class="filter-item">
                <el-radio-group v-model="controllerFormData.taskStatus">
                    <el-radio :label="1">关闭</el-radio>
                    <el-radio :label="2">开启</el-radio>
                </el-radio-group>
            </el-form-item>
            <br />
            <el-form-item
                label="单人发送频次："
                required
                class="filter-item"
                v-if="controllerFormData.taskStatus == 2"
            >
                <el-input
                    v-model="controllerFormData.sendNum"
                    placeholder="时间间隔"
                    size="medium"
                    style="width: 120px"
                    @change="(val) => { controllerFormData.sendNum = val < 0 ? 0 : val }"
                />&nbsp;
                <el-select
                    v-model="controllerFormData.frequencyUnit"
                    placeholder="请选择"
                    size="medium"
                    style="width: 100px"
                >
                    <el-option value="hour" label="小时"></el-option>
                    <el-option value="day" label="日"></el-option>
                    <el-option value="week" label="周"></el-option>
                    <el-option value="month" label="月"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="tip">满足限制条件的用户，任务执行时不会被发送</div>
        <div class="tip-red">这里的发送频次指的是目标用户，若被其他任务触达后，多少时间内允许此任务触达</div>
    </div>
</template>
<script>
export default {
    name: "Controller",
    props: {
        datas: {
            //详情数据
            type: String,
            default: null
        },
        unit: {
            //单位
            type: String,
            default: null
        },
        check: {
            //检查数据方法
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            controllerFormData: {
                taskStatus: 1,
                sendNum: "",
                frequencyUnit: ""
            }
        };
    },
    watch: {
        datas: function(newVal) {
            if (newVal) {
                this.controllerFormData.taskStatus = 2;
                this.controllerFormData.frequencyUnit = this.unit;
                switch (this.unit) {
                    case "month":
                        this.controllerFormData.sendNum =
                            newVal / 60 / 60 / 24 / 30;
                        break;
                    case "week":
                        this.controllerFormData.sendNum =
                            newVal / 60 / 60 / 24 / 7;
                        break;
                    case "day":
                        this.controllerFormData.sendNum = newVal / 60 / 60 / 24;
                        break;
                    case "hour":
                        this.controllerFormData.sendNum = newVal / 60 / 60;
                        break;
                    default:
                        break;
                }
            }
        }
    },
    methods: {
        //获得模块数据
        getChunkData() {
            const isEmpty = value => !value; //是否为空
            //校验发送控制数据
            const pass =
                this.controllerFormData.taskStatus == 2
                    ? this.check(this.controllerFormData, {
                          sendNum: [
                              {
                                  test: isEmpty,
                                  errMsg: "请选择时间间隔"
                              }
                          ],
                          frequencyUnit: [
                              {
                                  test: isEmpty,
                                  errMsg: "请选择单人发送频次单位"
                              }
                          ]
                      })
                    : true;

            let second = 0;

            switch (this.controllerFormData.frequencyUnit) {
                case "hour":
                    second = 60 * 60 * this.controllerFormData.sendNum;
                    break;
                case "day":
                    second = 24 * 60 * 60 * this.controllerFormData.sendNum;
                    break;
                case "week":
                    second = 7 * 24 * 60 * 60 * this.controllerFormData.sendNum;
                    break;
                case "month":
                    second =
                        30 * 24 * 60 * 60 * this.controllerFormData.sendNum;
                    break;
                default:
                    break;
            }

            //如果校验通过返回模块数据，否则返回空
            if (pass) {
                return this.controllerFormData.taskStatus == 1
                    ? {
                          pushFrequency: 0,
                          frequencyUnit: this.controllerFormData.frequencyUnit
                      }
                    : {
                          pushFrequency: second,
                          frequencyUnit: this.controllerFormData.frequencyUnit
                      };
            } else {
                return null;
            }
        }
    }
};
</script>
<style scoped lang="scss">
.controller {
    margin-top: 25px;
}
.title {
    margin: 10px 0 20px 0;
    font-size: 16px;
    font-weight: 600;
}
.tip {
    font-size: 14px;
    opacity: 0.5;
}
.tip-red{
    margin-top: 10px;
    font-size: 14px;
    color: red;
    opacity: 0.5;
}
</style>