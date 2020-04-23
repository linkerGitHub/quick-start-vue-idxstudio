<template>
  <the-manage-table
    src-url="/admin"
    :columns="columnDefine"
    :ops="ops()"
  >
    <template v-slot:editForm="scope">
      <el-form label-width="120px" :model="scope.data" status-icon :rules="passRule1()" ref="editForm">
        <el-form-item label="当前管理密码" prop="user_pass" v-if="!$store.getters.isSuperAdmin || scope.data.id === 'su_admin'">
          <el-input type="password" v-model="scope.data.user_pass"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="user_name">
          <el-input v-model="scope.data.user_name"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pass">
          <el-input type="password" v-model="scope.data.new_pass"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="new_pass_again">
          <el-input type="password" v-model="scope.data.new_pass_again"></el-input>
        </el-form-item>
      </el-form>
    </template>

    <template v-slot:newOneForm="scope">
      <el-form label-width="120px" :model="scope.data" status-icon :rules="passRule2()" ref="newForm">
        <el-form-item label="账户名" prop="user_name">
          <el-input v-model="scope.data.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="new_pass">
          <el-input type="password" v-model="scope.data.new_pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="new_pass_again">
          <el-input type="password" v-model="scope.data.new_pass_again"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </the-manage-table>
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
  methods: {
    ops: function () {
      if (this.$store.state.userInfo.ownerUid === 'su_admin') {
        return ['newOne', 'delete', 'edit', 'refresh']
      }
      return ['edit', 'refresh']
    }
  },
  data: function () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback(new Error('请输入密码'))
      } else {
        if (this.$refs[rule.options.form].model.new_pass_again !== '') {
          this.$refs[rule.options.form].validateField('checkPass')
        }
        callback()
      }
    }

    const validatePassAgain = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.$refs[rule.options.form].model.new_pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const ruleGen = function (formRef) {
      return {
        new_pass: [
          { validator: validatePass, trigger: 'blur', options: { form: formRef }, required: true, whitespace: true }
        ],
        new_pass_again: [
          { validator: validatePassAgain, trigger: 'blur', options: { form: formRef }, required: true, whitespace: true }
        ],
        user_name: [
          { type: 'string', required: true, whitespace: true, message: '账户名必填' }
        ]
      }
    }

    return {
      columnDefine: [
        {
          prop: 'user_name',
          label: '账户名',
          contentExpress: function (val, h, row) {
            if (row.id === 'su_admin') {
              return val + '(当前账号)'
            }
            return val
          }
        },
        {
          prop: 'user_pass',
          label: '密码',
          editable: true,
          tableVisibility: false
        },
        {
          prop: 'created_at',
          label: '建立于',
          editable: false
        },
        {
          prop: 'updated_at',
          label: '更新于',
          editable: false
        }
      ],
      passRule1: function () {
        return ruleGen('editForm')
      },
      passRule2: function () {
        return ruleGen('newForm')
      }
    }
  }
}
</script>

<style scoped>

</style>
