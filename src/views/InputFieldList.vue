<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <el-card>
    <div slot="header" class="clearfix">
      <span>自定义表单项</span>
    </div>
    <the-manage-table
      :src-url="'/input_field?status=1'"
      :columns="columnDefine"
      :edit-box-opts="{width: '40%'}"
      :ops="['edit', 'delete', 'refresh', 'newOne']"
    >
      <template v-slot:editForm="scope">
        <input-field-edit :form-data.sync="scope.data"></input-field-edit>
      </template>
      <template v-slot:newOneForm="scope">
        <input-field-edit :form-data.sync="scope.data"></input-field-edit>
      </template>
    </the-manage-table>
  </el-card>
</template>

<script>

import TheManageTable from '@/idx-lib/components/TheManageTable'
import InputFieldEdit from '@/components/InputFieldEdit'

export default {
  name: 'inputFieldList',
  components: { InputFieldEdit, TheManageTable },
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {
  },
  data: function () {
    return {
      columnDefine: [
        {
          prop: 'input_label',
          label: '标签'
        },
        {
          prop: 'input_type',
          label: '类型'
        },
        {
          prop: 'input_require',
          label: '是否必填',
          contentExpress: function (val) {
            return val === '1' ? '是' : '否'
          }
        },
        {
          prop: 'input_valid_regexr',
          label: '验证正则表达式'
        },
        {
          prop: 'input_tip',
          label: '填写提示'
        },
        {
          prop: 'input_err_notice',
          label: '验证错误提示'
        }
      ]
    }
  }
}
</script>
