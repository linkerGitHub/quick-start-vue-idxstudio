<template>
  <el-menu default-active="1"
           class="el-menu-vertical-demo"
           @open="handleOpen"
           @close="handleClose"
           :router="true"
           :collapse="!isCollapse" :style="{ top: fixedTop + 'px' }">
    <el-menu-item index="/newActivity">
      <font-awesome-icon icon="cubes" class="el-icon-" />
      <span slot="title">发起活动</span>
    </el-menu-item>
    <el-menu-item index="/activityList">
      <font-awesome-icon icon="tags" class="el-icon-" />
      <span slot="title">活动列表</span>
    </el-menu-item>
    <el-menu-item index="/formItemList">
      <font-awesome-icon icon="question-circle" class="el-icon-" />
      <span slot="title">自定义表单项</span>
    </el-menu-item>
    <el-menu-item index="/admin">
      <font-awesome-icon icon="user-cog" class="el-icon-" />
      <span slot="title">管理员</span>
    </el-menu-item>
    <el-menu-item index="/user">
      <font-awesome-icon icon="users" class="el-icon-" />
      <span slot="title">用户</span>
    </el-menu-item>
    <el-menu-item @click="Logout">
      <font-awesome-icon icon="users" class="el-icon-" />
      <span slot="title">注销</span>
    </el-menu-item>
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
