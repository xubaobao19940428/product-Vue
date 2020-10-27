<template>
  <div class="nav-wrapper">
    <el-menu mode="vertical"
             unique-opened
             :default-active="activePath"
             :collapse="isCollapse"
             background-color="#304156"
             text-color="#fff"
             active-text-color="#409EFF">
      <template v-for="item in routes">
        <el-menu-item :index="item.path"
                      v-preventReClick="300"
                      v-if="!item.children || item.children.length <= 0 || item.notShowChildren"
                      :key="item.path">
          <router-link :to="item.path"
                       :key="item.path">
            <i v-if="item.meta.icon" class="iconfont" v-html="item.meta.icon"></i>
            <span>{{ item.meta.title }}</span>
          </router-link>
        </el-menu-item>
        <el-submenu v-else
                    :index="item.path"
                    :key="item.path">
          <template slot="title">
            <i v-if="item.meta.icon" class="iconfont" v-html="item.meta.icon"></i>
            <span v-if="item.meta && item.meta.title">{{item.meta.title}}</span>
          </template>

          <el-menu-item v-for="child in item.children"
                        v-preventReClick="300"
                        v-if="!child.hidden"
                        :index="item.path + '/' + child.path"
                        :key="item.path + '/' + child.path">
            <router-link :to="item.path + '/' + child.path"
                         :key="item.path + '/' + child.path">
              <i v-if="child.meta.icon" class="iconfont" v-html="child.meta.icon"></i>
              <span v-if="child.meta && child.meta.title">{{child.meta.title}}</span>
            </router-link>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        computed: {
            routersList () {
                return this.$router.options.routes
            },
            activePath () {
                return this.$route.path
            },
            routes () {
                let routers = []
                let userInfo = localStorage.adminUserInfo ? JSON.parse(localStorage.adminUserInfo) : {
                    account: ''
                }
                for (let router of this.routersList) {
                    if (!router.hidden && !router.redirect) {
                        if (router.children) {
                            let flg = false
                            let currentRouter = JSON.parse(JSON.stringify(router))
                            currentRouter.children = []
                            for (let children of router.children) {
                                let item = this.permissionKey[children.meta.key]
                                if (item || userInfo.account == 'admin') {
                                    flg = true
                                    currentRouter.children.push(children)
                                }
                            }
                            if (flg) {
                                routers.push(currentRouter)
                            }
                        } else {
                            routers.push(router)
                        }
                    }
                }
                return routers
            },
            ...mapState({
                isCollapse: state => state.app.isCollapse,
                permissionKey: state => state.user.permissionKey
            })
        }
    }
</script>
<style lang="scss">
.nav-wrapper{
  height: 100%;
  background: #304156;
  overflow-y: auto;
  .el-menu{
    border-right: 0;
    i{
      margin-right: 20px;
      font-size: 18px;
      color: #fff;
    }
    a{
      text-decoration: none;
      color: #fff;
      width: 100%;
      height: 100%;
      display: flex;
    }
    .el-submenu__title{
      box-sizing: border-box;
      padding-right: 40px;
    }
    .el-submenu__icon-arrow{
      right: 0;
      font-size: 14px;
    }
    .el-menu-item.is-active a{
      color: #409EFF;
    }
    .router-link-active i{
      color: #409EFF;
    }
  }
}
</style>
