<template>
  <el-container>
    <el-container>
      <el-aside width="auto">
        <the-side-menu></the-side-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import TheSideMenu from '@/components/TheSideMenu'
export default {
  name: 'AdminFramework',
  components: { TheSideMenu },
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {},
  data: function () {
    return {}
  },
  computed: {}
}
</script>

<style scoped>

</style>
