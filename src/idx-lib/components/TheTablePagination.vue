<template>
    <el-row>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="$attrs.paginationOptions.tableCurrentPage"
                :page-sizes="[5, 20, 50, 100, 300, 500]"
                :page-size="$attrs.paginationOptions.tablePageSize"
                layout="total, sizes, prev, pager, next"
                :total="$attrs.paginationOptions.tableItemTotal">
        </el-pagination>
    </el-row>
</template>

<script>
export default {
  name: 'TheTablePagination',
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {
    handleSizeChange (val) {
      this.$attrs.paginationOptions.handleTableSizeChange(val)
    },
    handleCurrentChange (val) {
      this.$attrs.paginationOptions.handleTableCurrentChange(val)
    }
  },
  data () {
    return {}
  },
  computed: {}
}
</script>

<style scoped>
    .el-row {
        margin: 10px 0;
    }
</style>
