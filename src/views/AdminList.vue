<template>
  <the-manage-table
    src-url="/admin"
    :columns="columnDefine"
    :ops="['newOne', 'delete', 'edit', 'refresh']"
  ></the-manage-table>
</template>

<script>
import TheManageTable from '@/idx-lib/components/TheManageTable'
export default {
  name: 'AdminList',
  components: { TheManageTable },
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {},
  data: function () {
    return {
      columnDefine: [
        {
          prop: 'user_name',
          label: '账户名',
          editable: true
        },
        {
          prop: 'user_pass',
          label: '密码',
          editable: true
        }
      ]
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
