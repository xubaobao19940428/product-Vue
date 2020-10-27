<template>
  <div id="app">
    <div class="layout-nav-wrapper">
      <router-view name="cNav"></router-view>
    </div>
    <div class="layout-content-wrapper">
      <router-view name="cHeader"></router-view>
       <template v-if="hasPermission('BTN_IM_NOTICE_LIST') && token">
           <transition name="bounce">
               <customer-im v-show="showCustomerNotice"></customer-im>
           </transition>
           <notice-entrance></notice-entrance>
       </template>
      <div class="layout-content-box">
        <keep-alive >
          <router-view :key="$route.fullPath" v-if="$route.meta.keepAlive" :include="include"/>
        </keep-alive>
        <router-view :key="$route.fullPath" v-if="!$route.meta.keepAlive"/>
      </div>
    </div>
  </div>
</template>
<script>
    import customerIm from '@/views/customer/IM/index'
    import noticeEntrance from '@/views/customer/IM/noticeEntrance'
    import { mapState } from 'vuex'

    export default {
        components: {
            customerIm,
            noticeEntrance
        },
        provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
            return {
                reload: this.reload                                              
            }
        },
        data(){
          return{
            isRouterAlive:true,
            include:['productCheck']
          }
        },
        watch: {
          $route(to, from) {
            //如果 要 to(进入) 的页面是需要 keepAlive 缓存的，把 name push 进 include数组
            if (to.meta.keepAlive) {
              !this.include.includes(to.name) && this.include.push(to.name);
            }
            //如果 要 form(离开) 的页面是 keepAlive缓存的，
            //再根据 deepth 来判断是前进还是后退
            //如果是后退
            if (from.meta.keepAlive && to.meta.deepth < from.meta.deepth) {
              var index = this.include.indexOf(from.name);
              index !== -1 && this.include.splice(index, 1);
            }
          }
        },
        computed: {
            ...mapState({
                showCustomerNotice: state => state.app.showCustomerNotice
            }),
            token () {
                return localStorage.adminToken ? localStorage.adminToken : null
            }
        },
        created () {
            this.$store.dispatch('GetUserInfo')
            if (this.token) {
                this.$store.dispatch('getCountryList')
                this.$store.dispatch('getLanguageList')
                this.$store.dispatch('GetPermissionKeyMap')
            }
        },
        mounted () {
          let storage = window.localStorage
          storage.removeItem("specialColumnId");
          storage.removeItem("specialSubjectId");
          storage.removeItem("contentType");
          storage.removeItem("countryCode");
        },
        methods:{
          reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                  console.log(this.isRouterAlive)
                    this.isRouterAlive = true;         //再打开
                }) 
            }
        }
    }
</script>
<style lang="scss" scoped>
  #app {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    .layout-content-wrapper{
      flex: 1;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .layout-content-box{
        flex: 1;
        width: 100%;
        overflow: hidden;
      }
    }
      .bounce-enter-active {
          animation: bounce-in .3s;
      }
      .bounce-leave-active {
          animation: bounce-in .3s reverse;
      }
      @keyframes bounce-in {
          0% {
              transform: translate(100%, 100%);
              opacity: 0;
          }
          100% {
              opacity: 1;
              transform: translate(0, 0);
          }
      }
  }
</style>
