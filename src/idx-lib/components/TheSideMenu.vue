<template>
  <el-menu default-active="1"
           class="el-menu-vertical-demo"
           @open="handleOpen"
           @close="handleClose"
           :router="true"
           :collapse="!isCollapse" :style="{ top: fixedTop + 'px' }">
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-document"></i>
        <span>文章管理</span>
      </template>
      <el-menu-item index="/Article">文章列表</el-menu-item>
      <el-menu-item index="/ArticleType">文章类别</el-menu-item>
    </el-submenu>
    <el-menu-item index="" @click="openFileManager">
      <i class="el-icon-picture"></i>
      <span slot="title">文件管理</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">页面组件管理</span>
      </template>
        <el-menu-item index="/PageHeader">头部</el-menu-item>
        <!--<el-menu-item index="/Menu">菜单</el-menu-item>-->
        <!--<el-menu-item index="/Carousel">轮播</el-menu-item>-->
        <el-menu-item index="/PageFooter">尾部</el-menu-item>
        <el-menu-item index="/RelatedLink">相关链接</el-menu-item>
    </el-submenu>

    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span slot="title">系统管理</span>
      </template>
      <el-menu-item index="/AdminPassChange">修改密码</el-menu-item>
    </el-submenu>
    <!--<el-submenu index="4">-->
      <!--<template slot="title">-->
        <!--<font-awesome-icon icon="history" class="el-icon-"></font-awesome-icon>-->
        <!--<span slot="title">日志</span>-->
      <!--</template>-->
      <!--<el-menu-item index="/SysAccessLog">访问日志</el-menu-item>-->
    <!--</el-submenu>-->
    <el-menu-item index="4" :route="{path:''}" @click="Logout">
      <i class="el-icon-circle-close"></i>
      <span slot="title">注销</span>
    </el-menu-item>
    <!--<el-menu-item index="/About" >-->
      <!--<i class="el-icon-info"></i>-->
      <!--<span slot="title">关于</span>-->
    <!--</el-menu-item>-->
  </el-menu>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'TheSideMenu',
  components: {},
  mounted: function () {
    window.addEventListener('scroll', this.handlerMenuFix)
  },
  beforeMount: function () {
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    handlerMenuFix () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
          document.body.scrollTop
      if (scrollTop >= 0) {
        this.fixedTop = scrollTop
      } else {
        this.fixedTop = 0
      }
    },
    Logout () {
      this.$confirm('确认注销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.clear()
        Cookies.remove('PHPSESSID')
        this.$router.push({ path: '/Login' })
      }).catch(() => {

      })
    },
    openFileManager () {
      window.open(this.$store.state.serverHost + '/RichFilemanager/index.html?langCode=zh-CN', '_blank')
    }
  },
  data: function () {
    return {
      isCollapse: true,
      fixedTop: 0
    }
  },
  computed: {}
}
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-icon-{
    color: #909399;
  }
</style>
