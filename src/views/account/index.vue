<template>
  <div class="app-container">
    <el-tabs v-model="currentView">
      <el-tab-pane label="用户管理" name="userManage">
          <user-manage v-if="currentView === 'userManage'"></user-manage>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="roleManage">
          <role-manage v-if="currentView === 'roleManage'"></role-manage>
      </el-tab-pane>
      <el-tab-pane label="组织管理" name="systemManage">
          <system-manage v-if="currentView === 'systemManage'"></system-manage>
      </el-tab-pane>
    </el-tabs>
    <!-- <keep-alive>
        <component v-bind:is="currentView" :roleList="roleList"></component>
    </keep-alive> -->
  </div>
</template>

<script>
import userManage from './components/userManage'
import roleManage from './components/roleManage'
import systemManage from './components/systemManage'
export default {
    components: {
        roleManage,
        userManage,
        systemManage
    },
    data () {
        return {
          currentView: 'userManage'
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
