<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>活动列表</span>
    </div>
    <the-manage-table
      :src-url="'/activity'"
      :columns="columnDefine"
      :edit-box-opts="{width: '90%'}"
      :edit-box-before-confirm="editBoxBeforeConfirm"
      :ops="['edit', 'delete', 'refresh']"
    >
      <template v-slot:searchBar="scope">
        <el-form :inline="true" :model="scope.data" class="demo-form-inline">
          <el-form-item label="活动名称">
            <el-input v-model="scope.data.activity_name" placeholder="活动名称"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="scope.data.status" placeholder="状态">
              <el-option label="零" value="0"></el-option>
              <el-option label="一" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:editForm="scope">
        <activity-edit
          ref="actEdit"
          v-bind:activityData.sync="scope.data">
        </activity-edit>
      </template>
    </the-manage-table>
  </el-card>
</template>

<script>

import TheManageTable from '@/idx-lib/components/TheManageTable'
import ActivityEdit from '@/components/ActivityEdit'

export default {
  name: 'activityList',
  components: { ActivityEdit, TheManageTable },
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {
    editBoxBeforeConfirm: function () {
      let thisView = this
      return new Promise((resolve, reject) => {
        if (thisView.$refs['actEdit']) {
          thisView.$refs['actEdit'].validForm()
            .then(function (res) {
              if (res) {
                return resolve(res)
              }
            })
        } else {
          reject(new Error('not define or mount'))
        }
      })
    }
  },
  data: function () {
    return {
      columnDefine: [
        {
          prop: 'id',
          label: 'id',
          width: '45px',
          editable: false
        },
        {
          prop: 'activity_name',
          label: '活动名称',
          editable: true
        },
        {
          prop: 'activity_brief',
          label: '类别名称',
          editable: true
        },
        {
          prop: 'activity_pic_url',
          label: '封面图片url',
          editable: true,
          dangerouslyUseHTMLString: true,
          contentExpress: function (val, h) {
            return '<img style="max-width: 100%; max-height: 100px;" src="' + val + '" />'
          }
        },
        {
          prop: 'activity_apply_start',
          label: '报名开始时间',
          editable: true
        },
        {
          prop: 'activity_apply_end',
          label: '报名结束时间',
          editable: true
        },
        {
          prop: 'activity_run_start',
          label: '活动开始时间',
          editable: true
        },
        {
          prop: 'activity_run_end',
          label: '活动结束时间',
          editable: true
        },
        {
          prop: 'involve_num_limit',
          label: '人数上限',
          editable: true
        },
        {
          prop: 'status',
          label: '状态',
          editable: false
        }
      ]
    }
  },
  computed: {
  }
}
</script>
