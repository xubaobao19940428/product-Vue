<template>
  <div class="sub-menu-content-wrapper">
      <!--<el-tabs v-model="activeRouter"-->
               <!--type="card"-->
               <!--closable-->
               <!--@tab-click="triggerRouter"-->
               <!--@tab-remove="removeTab">-->
          <!--<el-tab-pane-->
              <!--v-for="item in viewRouterList"-->
              <!--:key="item.fullPath"-->
              <!--:label="item.meta.title"-->
              <!--:name="item.fullPath"-->
          <!--&gt;-->
          <!--</el-tab-pane>-->
      <!--</el-tabs>-->
      <keep-alive>
          <router-view :key="$route.fullPath" v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view :key="$route.fullPath" v-if="!$route.meta.keepAlive"/>
  </div>
</template>
<script>
    import { mapState } from 'vuex'

    export default {
        data () {
            return {
                activeRouter: ''
            }
        },
        computed: {
            ...mapState({
                viewRouterList: state => state.app.viewRouterList
            })
        },
        created () {
            this.activeRouter = this.$route ? this.$route.fullPath : ''
        },
        methods: {
            removeTab (targetName) {
                let data = this.viewRouterList.find((val) => {
                    return val.fullPath == targetName
                })
                this.$store.dispatch('updateViewRouter', {
                    action: 'del',
                    data: {
                        name: data.name,
                        fullPath: data.fullPath
                    }
                })
            },
            triggerRouter () {
                let data = this.viewRouterList.find((val) => {
                    return val.fullPath == this.activeRouter
                })
                this.$router.push({
                    path: data.fullPath
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
  .sub-menu-content-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 10px;
  }
</style>
