<template>
    <el-row gutter="10">
      <el-row>
          <el-alert
            title="注销"
            type="info"
            description="确认要注销退出？"
            center
            show-icon>
          </el-alert>
      </el-row>
      <el-col :span="2">
        <el-button size="medium" type="warning">确认</el-button>
      </el-col>
      <el-col :span="2">
        <el-button size="medium" type="warning">确认</el-button>
      </el-col>
    </el-row>
</template>

<script>
export default {
  name: 'Logout',
  components: {},
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
