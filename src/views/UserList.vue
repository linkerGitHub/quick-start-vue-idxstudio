<template>
  <the-manage-table
    src-url="/user"
    :columns="columnDefine"
    :ops="['newOne', 'delete', 'edit', 'refresh']"
  ></the-manage-table>
</template>

<script>
import TheManageTable from '@/idx-lib/components/TheManageTable'
export default {
  name: 'UserList',
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
          prop: 'id',
          label: '用户ID',
          editable: false
        },
        {
          prop: 'user_name',
          label: '用户名',
          editable: true
        },
        {
          prop: 'login_name',
          label: '登陆名',
          editable: true
        },
        {
          prop: 'user_pass',
          label: '密码',
          editable: true
        },
        {
          prop: 'created_by_uid',
          label: '创建者',
          contentExpress: (val) => {
            return val === this.$store.state.userInfo.ownerUid ? '本账号' : '其它'
          },
          tableVisibility: this.$store.getters.isSuperAdmin,
          editable: false
        }
      ]
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
