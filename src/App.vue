<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>

export default {
  created: function () {
    // global init
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    if (userInfo) {
      this.$store.commit('userInfo', userInfo)
    } else {
      this.$router.push('/Login')
    }
  }
}
</script>
<style lang="less">
</style>
