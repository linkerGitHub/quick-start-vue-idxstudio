<template>
  <div>
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
    <el-dialog
      title="提示"
      @opened="showQR"
      :visible.sync="QRCodeDialogVisible">
      <div style="text-align: center">
        <h1>二维码：</h1>
        <div id="qrcode" ref="qrcode"></div>
        <div>{{ QRCodeUrl }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="QRCodeDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { url } from '@/idx-lib/config'
import TheManageTable from '@/idx-lib/components/TheManageTable'
import ActivityEdit from '@/components/ActivityEdit'
import QRCode from 'qrcodejs2'

export default {
  name: 'activityList',
  components: { ActivityEdit, TheManageTable },
  mounted: function () {
  },
  beforeMount: function () {
  },
  created: function () {

  },
  methods: {
    showQR: function () {
      const thisView = this
      this.$nextTick(() => {
        if (thisView.qrCode === null) {
          thisView.qrCode = new QRCode('qrcode', {
            width: 200, // 设置宽度，单位像素
            height: 200, // 设置高度，单位像素
            text: thisView.QRCodeUrl // 设置二维码内容或跳转地址
          })
        } else {
          thisView.qrCode.makeCode(thisView.QRCodeUrl)
        }
      })
    },
    editBoxBeforeConfirm: function () {
      let thisView = this
      return new Promise((resolve, reject) => {
        if (thisView.$refs['actEdit']) {
          thisView.$refs['actEdit'].validForm()
            .then(function (res) {
              if (res) {
                return resolve(res)
              } else {
                return reject(new Error('表单填写有误，请检查'))
              }
            })
        }
      })
    }
  },
  data: function () {
    const thisView = this
    return {
      QRCodeUrl: '',
      QRCodeDialogVisible: false,
      qrCode: null,
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
          contentExpress: function (val) {
            if (val === 0) {
              return '无上限'
            } else {
              return val
            }
          },
          editable: true
        },
        {
          prop: 'id',
          label: '操作',
          editable: false,
          width: '300px',
          VNode: true,
          contentExpress: function (val, h) {
            return h('span', {}, [
              '',
              h('el-button', {
                props: {
                  plain: true,
                  size: 'mini',
                  type: 'primary'
                },
                on: {
                  click: function () {
                    thisView.$router.push({ name: 'applyList', params: { activity_id: val } })
                  }
                }
              }, '名单'),
              h('el-button', {
                props: {
                  plain: true,
                  size: 'mini',
                  type: 'primary'
                },
                on: {
                  click: function () {
                    thisView.QRCodeUrl = url.client.hostname + '/activity/' + val
                    thisView.QRCodeDialogVisible = true
                  }
                }
              }, '二维码'),
              h('el-button', {
                props: {
                  plain: true,
                  size: 'mini',
                  type: 'primary'
                },
                on: {
                  click: function () {
                    thisView.$router.push('checkIn/' + val)
                  }
                }
              }, '签到')
            ])
          }
        }
      ]
    }
  },
  computed: {}
}
</script>

<style scoped>
  #qrcode{
    text-align: center;
    width: 200px;
    margin: auto;
  }
</style>
