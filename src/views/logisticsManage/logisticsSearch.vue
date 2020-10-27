<template>
  <div class="app-container logistics-wrapper">

    <el-tabs v-model="currentTab"
             type="card"
             @tab-click="searchLogistics()">
      <el-tab-pane label="国内物流"
                   name="DOMESTIC">
        <div v-if="domesticLogistics.list.length == 0">
          暂无物流信息
        </div>
        <div v-else>
          <div class="mar-b-10">
            <el-select v-model="domesticLogistics.logisticsSingle"
                       style="width: 45%"
                       @change="searchLogistics('DOMESTIC')">
              <el-option
                  v-for="item in domesticLogistics.list"
                  :key="item.id"
                  :label="'物流号'+ item.logisticsSingleCode + '-' + getCompanyName(item.logisticsCompany) + '-' + item.splitOrderCode"
                  :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="iframe-wrapper">
            <iframe id="appIfm"
                    v-if="domesticLogistics.webUrl"
                    width="375"
                    height="667"
                    :src="domesticLogistics.webUrl"></iframe>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="国际物流" name="INTERNATIONAL">
        <div v-if="internationalLogistics.list.length == 0">
          暂无物流信息
        </div>
        <div v-else>
          <div class="mar-b-10">
            <el-select v-model="internationalLogistics.logisticsSingle"
                       style="width: 45%"
                       @change="searchLogistics('INTERNATIONAL')">
              <el-option
                  v-for="item in internationalLogistics.list"
                  :key="item.id"
                  :label="'物流单号' + item.logisticsSingleCode + '-订单号' + item.splitOrderCode"
                  :value="item">
              </el-option>
            </el-select>
          </div>
          <div>
            <el-timeline>
              <el-timeline-item
                  v-for="(item, i) in internationalLogistics.logisticsInfo"
                  :key="i"
                  :color="i == 0 ? '#0bbd87' : '#909399'"
                  placement="top"
                  :timestamp="item.DATE + ' ' + item.TIME">
                <div>位置： {{ item.POSITION }}</div>
                <div>状态： {{ item.podstatus }}</div>
                <div>目的地： {{ item.destinationCountry }}</div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="当地物流" name="LOCAL">
        <div v-if="localLogistics.list.length == 0">
          暂无物流信息
        </div>
        <div v-else>
          <div class="mar-b-10">
            <el-select v-model="localLogistics.logisticsSingle"
                       style="width: 45%"
                       @change="searchLogistics('DOMESTIC')">
              <el-option
                  v-for="item in localLogistics.list"
                  :key="item.id"
                  :label="'物流号'+ item.logisticsSingleCode + '-订单号' + item.splitOrderCode"
                  :value="item">
              </el-option>
            </el-select>
          </div>
          <div id="logistic-detail"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
    import logisticsCompany from '@/data/company.js'
    export default {
        data () {
            return {
                currentTab: 'DOMESTIC',
                logisticsSingleList: [],
                domesticLogistics: {
                    list: [],
                    webUrl: '',
                    logisticsSingle: {}
                },
                internationalLogistics: {
                    list: [],
                    logisticsSingle: {},
                    logisticsInfo: []
                },
                localLogistics: {
                    list: [],
                    logisticsSingle: {}
                }
            }
        },
        created () {
            this.logisticsSingleList = localStorage.logisticsSingleList ? JSON.parse(localStorage.logisticsSingleList) : []
            this.domesticLogistics.list = this.getLogistics('DOMESTIC')
            this.internationalLogistics.list = this.getLogistics('INTERNATIONAL')
            this.localLogistics.list = this.getLogistics('LOCAL')
            if (this.domesticLogistics.list.length > 0) {
                this.domesticLogistics.logisticsSingle = this.domesticLogistics.list[0]
                this.searchLogistics()
            }
            if (this.internationalLogistics.list.length > 0) {
                this.internationalLogistics.logisticsSingle = this.internationalLogistics.list[0]
            }
            if (this.localLogistics.list.length > 0) {
                this.localLogistics.logisticsSingle = this.localLogistics.list[0]
            }
        },
        methods: {
            // 获取物流公司名称
            getCompanyName (item) {
                let data = logisticsCompany.find((val) => {
                    return val.code == item
                })
                return data ? data.name : item
            },
            // 获取不同段物流
            getLogistics (type) {
                return this.logisticsSingleList.filter((item) => {
                    return item.logisticsType == type
                })
            },
            // 查看物流
            searchLogistics (type) {
                switch (type || this.currentTab) {
                    // 国内
                    case 'DOMESTIC':
                        let item = this.domesticLogistics.logisticsSingle
                        let url = `https://m.kuaidi100.com/index_all.html?type=${item.logisticsCompany}&postid=${item.logisticsSingleCode}#result`
                        this.domesticLogistics.webUrl = url
                        break
                    // 国际
                    case 'INTERNATIONAL':
                        if (this.internationalLogistics.list.length <= 0) {
                            return
                        }
                        break
                    // 当地
                    case 'LOCAL':
                        TrackButton.embed({
                            selector: '#logistic-detail',
                            tracking_no: this.localLogistics.logisticsSingle.logisticsSingleCode
                        })
                        break
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.logistics-wrapper{
  iframe{
    border: 0;
  }
  #logistic-detail{
    width: 500px;
  }
  .iframe-wrapper{
    position: relative;
    overflow: hidden;
    #appIfm{
      position: relative;
      top: -95px;
    }
  }
}
</style>
