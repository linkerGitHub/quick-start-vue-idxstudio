<template>
    <div>
        没有访问权限，请登陆后再试。
      <el-button type="primary" @click="goToLogin">登陆</el-button>
    </div>
</template>

<script>
export default {
  name: 'Err403',
  components: {},
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {
    goToLogin: function (e) {
      this.$router.push({
        path: '/Login'
      })
    }
  },
  data () {
    return {}
  },
  computed: {}
}
</script>

<style scoped>

</style>
