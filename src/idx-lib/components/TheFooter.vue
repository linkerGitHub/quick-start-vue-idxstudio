<template>
  <el-row>
    <el-col :span="24">Copyright © 2018-{{ nowYear }} IDX network studio All Rights Reserved.</el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TheFooter',
  data: function () {
    return {
      nowYear: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
  .el-col {
    text-align: center;
  }
</style>
