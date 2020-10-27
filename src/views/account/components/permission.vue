<template>
  <div class="permission-wrapper">
    <div class="permission-container">
      <div v-for="(router, i) in routersList"
           v-if="(!router.meta || (router.meta && !router.meta.noPermission)) && !router.redirect"
           :key="i">
        <div class="header-wrapper">
          <div v-if="router.children">
            <div class="flex" v-if="router.path">
              <div class="mar-r-20 herder-item">{{ router.meta ? router.meta.title : router.name}}</div>
              <el-checkbox-group v-model="menuSelect"
                                 @change="selectAll(router)">
                <el-checkbox :label="router.path">全选</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div v-else class="mar-t-10">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="router.meta.key"
                           @change="routerSelectChange"
              >{{ router.meta.title }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="content-wrapper"
             v-if="router.children">
                <div v-for="(children, childrenI) in router.children"
                  :key="childrenI"
                  v-if="!children.meta.noPermission"
                  class="router-item"
                  :label="children.meta.key">
                  <div class="menu-item">
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox :label="children.meta.key"
                                  @change="menuSelectChange(children)"
                      >{{ children.meta.title }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="btn-wrapper">
                    <div v-for="(btn, btnI) in children.meta.btnPermission"
                        class="btn-item"
                        :key="btnI"
                    >
                      <el-checkbox-group v-model="checkList">
                        <el-checkbox :label="btn.key"
                                    @change="btnSelectChange(btn,children)"
                        >{{ btn.title }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        permissionKeyList: {
            default: [],
            type: Array
        }
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ]),
        routersList () {
          let routes = this.$router.options.routes

          return routes
        }
    },
    data () {
        return {
            menuSelect: [],
            checkList: JSON.parse(JSON.stringify(this.permissionKeyList))
        }
    },
    created () {},
    watch: {
        permissionKeyList: {
            handler (newValue) {
                this.checkList = newValue
            }
        }
    },
    methods: {
        routerSelectChange () {
            this.$emit('permissionChange', this.checkList)
        },
        menuSelectChange (menu) {
            let childI = this.checkList.findIndex((val) => {
                return val == menu.meta.key
            })
            if (childI == -1 && menu.meta.btnPermission) {
                // 未选择
                for (let btn of menu.meta.btnPermission) {
                    let btnI = this.checkList.findIndex((val) => {
                        return val == btn.key
                    })
                    if (btnI != -1) {
                        // 选择
                        this.checkList.splice(btnI, 1)
                    }
                }
            }
            this.$emit('permissionChange', this.checkList)
        },
        btnSelectChange (btn, menu) {
            let btnI = this.checkList.findIndex((val) => {
                return val == btn.key
            })
            if (btnI != -1) {
                // 选择
                let childI = this.checkList.findIndex((val) => {
                    return val == menu.meta.key
                })
                if (childI == -1) {
                    this.checkList.push(menu.meta.key)
                }
            }
            this.$emit('permissionChange', this.checkList)
        },
        selectAll (router) {
            let index = this.menuSelect.findIndex((val) => {
                return val == router.path
            })
            for (let children of router.children) {
                let childI = this.checkList.findIndex((val) => {
                    return val == children.meta.key
                })
                // 菜单
                if (index != -1) {
                    // 选择
                    if (childI == -1) {
                        this.checkList.push(children.meta.key)
                    }
                } else {
                    // 未选择
                    if (childI != -1) {
                        this.checkList.splice(childI, 1)
                    }
                }
                // 按钮
                if (children.meta.btnPermission) {
                    for (let btn of children.meta.btnPermission) {
                        let btnI = this.checkList.findIndex((val) => {
                            return val == btn.key
                        })
                        if (index != -1) {
                            // 选择
                            if (btnI == -1) {
                                this.checkList.push(btn.key)
                            }
                        } else {
                            // 未选择
                            if (btnI != -1) {
                                this.checkList.splice(btnI, 1)
                            }
                        }
                    }
                }
            }
            this.$emit('permissionChange', this.checkList)
        }
    }
}
</script>
<style lang="scss" scoped>
  .permission-wrapper{
    width: 100%;
    display: flex;
    .permission-container{
      flex: 1;
    }
    .herder-item{
      color: #222;
      display: flex;
      font-size: 16px;
      align-items: center;
    }
    .content-wrapper{
      margin-left: 16px;
      .router-item{
        display: flex;
        .menu-item{
          margin-right: 10px;
          min-width: 140px;
        }
        .btn-wrapper{
          display: flex;
          flex-wrap: wrap;
        }
        .btn-item{
          margin-left: 10px;
        }
      }
    }
  }
</style>
