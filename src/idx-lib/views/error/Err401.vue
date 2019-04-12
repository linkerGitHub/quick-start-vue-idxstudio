<template>
    <div>
      <span>您的登陆已过期或者未授权访问改资源，你可以尝试重新登陆来刷新您的权限。</span>
      <el-button type="success" plain @click="goLogin" size="mini">登陆</el-button>
    </div>
</template>

<script>
export default {
  name: 'Err401',
  components: {},
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {
    goLogin: function () {
      this.$router.push({
        path: '/Login'
      })
    }
  },
  data: function () {
    return {}
  },
  computed: {}
}
</script>

<style scoped>

</style>
