<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{ activityInfo.activity_name }} - 签到</span>
    </div>
    <el-container>
      <el-aside style="border-right: solid 1px lightgray;padding-right: 15px;padding-top: 30px;">
        <the-manage-table
          :patch-deal-style="{position: 'absolute', top: '-40px', width: '240px', left: '0'}"
          :col-show-set-btn="false"
          :src-url="'/check_in?activity_id='+activity_id"
          :new-one-box-opts="{width: '40%'}"
          :ops="['edit', 'delete', 'newOne', 'refresh']"
          :columns="columnDefine">
          <template v-slot:pagination="scope">
            <el-pagination
              background
              @current-change="scope.method.currentPageChange"
              :current-page="scope.option.tableCurrentPage"
              :page-size="scope.option.tablePageSize"
              layout="total, prev, next"
              :total="scope.option.tableItemTotal">
            </el-pagination>
          </template>
          <template v-slot:editForm="scope">
            <el-form label-width="80px">
              <el-form-item label="签到名">
                <el-input v-model="scope.data.check_in_name"></el-input>
              </el-form-item>
              <el-form-item label="签到范围">
                <el-select v-model="scope.data.check_in_range" placeholder="请选择">
                  <el-option
                    label="任何人"
                    value="1">
                  </el-option>
                  <el-option
                    label="仅申请过的人员"
                    value="2">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="scope.data.check_in_status" placeholder="请选择">
                  <el-option
                    label="开启"
                    value="1">
                  </el-option>
                  <el-option
                    label="关闭"
                    value="0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
          <template v-slot:newOneForm="scope">
            <el-form label-width="80px">
              <el-form-item label="活动id" v-show="false">
                {{ scope.data.activity_id = activity_id }}
              </el-form-item>
              <el-form-item label="签到名">
                <el-input v-model="scope.data.check_in_name"></el-input>
              </el-form-item>
              <el-form-item label="签到范围">
                <el-select v-model="scope.data.check_in_range" placeholder="请选择">
                  <el-option
                    label="任何人"
                    value="1">
                  </el-option>
                  <el-option
                    label="仅申请过的人员"
                    value="2">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="scope.data.check_in_status" placeholder="请选择">
                  <el-option
                    label="开启"
                    value="1">
                  </el-option>
                  <el-option
                    label="关闭"
                    value="0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </the-manage-table>
      </el-aside>
      <el-container style="padding-left: 20px;padding-top: 30px;">
        <the-manage-table
          ref="check-in-record"
          v-show="nowCheckInId !== 0"
          :patch-deal-style="{position: 'absolute', top: '-40px', width: '240px', left: '0'}"
          :ops="['edit', 'delete', 'refresh']"
          :col-show-set-btn="false"
          :src-url="'/check_in_record/' + nowCheckInId + '?activity_id=' + activity_id"
          :new-one-box-opts="{width: '40%'}"
          :columns="checkInListColumnDefine">
          <template v-slot:searchBar="scope">
            <el-form :inline="true">
              <el-form-item label="姓名">
                <el-input v-model="scope.data.apply_name"></el-input>
              </el-form-item>
              <el-form-item>
                <json-excel
                  :fetch="getTableDataToExcel"
                  :fields="jsonExcelFields"
                  worksheet="签到记录"
                  :name="activityInfo.activity_name"
                >
                  <el-button>导出</el-button>
                </json-excel>
              </el-form-item>
            </el-form>
          </template>
        </the-manage-table>
      </el-container>
    </el-container>
    <el-dialog
      title="提示"
      @opened="showQR"
      :visible.sync="QRCodeDialogVisible">
      <div style="text-align: center">
        <h1>签到二维码：</h1>
        <div id="qrcode" ref="qrcode"></div>
        <div>{{ QRCodeUrl }}</div>
      </div>
      <div style="text-align: center; display: none">
        <h1>手机号签到二维码：</h1>
        <div id="qrcode-phone" ref="qrcode-phone"></div>
        <div>{{ QRCodeUrlPhoneNum }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="QRCodeDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { url } from '@/idx-lib/config'
import QRCode from 'qrcodejs2'
import TheManageTable from '@/idx-lib/components/TheManageTable'
import RESTfulReq from '@/idx-lib/utils/RESTful-request'
import JsonExcel from 'vue-json-excel'
import TableDataUtil from '@/idx-lib/utils/table-data'

export default {
  name: 'CheckIn',
  components: { TheManageTable, JsonExcel },
  props: {
    activity_id: {
      type: String,
      required: true
    }
  },
  mounted: function () {
  },
  beforeMount: function () {
    const thisView = this
    const req = new RESTfulReq('/activity')
    req.getReq({
      id: this.activity_id
    }).then(function (response) {
      thisView.activityInfo = response.data.data.rows[0]
    })
  },
  methods: {
    getTableDataToExcel: function () {
      return this.$refs['check-in-record'].tableOptions.tableData
    },
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
        if (thisView.qrCodePhoneNum === null) {
          thisView.qrCodePhoneNum = new QRCode('qrcode-phone', {
            width: 200, // 设置宽度，单位像素
            height: 200, // 设置高度，单位像素
            text: thisView.QRCodeUrlPhoneNum // 设置二维码内容或跳转地址
          })
        } else {
          thisView.qrCodePhoneNum.makeCode(thisView.QRCodeUrlPhoneNum)
        }
      })
    }
  },
  data: function () {
    let thisView = this
    return {
      QRCodeUrl: '',
      QRCodeUrlPhoneNum: '',
      QRCodeDialogVisible: false,
      qrCode: null,
      qrCodePhoneNum: null,
      activityInfo: {},
      columnDefine: [
        {
          prop: 'id',
          label: '签到',
          VNode: true,
          contentExpress: function (val, h, row) {
            const range = {
              '1': '所有人',
              '2': '仅申请过的人员'
            }
            const checkInStatus = {
              '0': '已关闭',
              '1': '已开启'
            }
            return h('div',
              [
                h('el-button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    'text-align': 'left',
                    'color': thisView.nowCheckInId === val ? '' : 'gray'
                  },
                  on: {
                    click: function () {
                      thisView.nowCheckInId = val
                    }
                  }
                }, [
                  h('div', row.check_in_name),
                  h('div', row.created_at.split(' ')[0]),
                  h('div', range[row.check_in_range] + ' - ' + checkInStatus[row.check_in_status])
                ]),
                h('div', {
                  style: {
                    margin: '10px 0',
                    'border-top': '1px solid #DCDFE6'
                  }
                }),
                h('el-button', {
                  props: {
                    type: 'primary',
                    plain: true,
                    size: 'mini'
                  },
                  on: {
                    click: function (e) {
                      thisView.QRCodeUrl = url.client.hostname + '/checkIn/' + val
                      thisView.QRCodeUrlPhoneNum = url.client.hostname + '/checkInPhoneNum/' + val
                      thisView.QRCodeDialogVisible = true
                    }
                  }
                }, '签到二维码')
              ]
            )
          }
        }
      ],
      checkInListColumnDefine: [
        {
          prop: 'apply_name',
          label: '姓名'
        },
        {
          prop: 'apply_phone_number',
          label: '手机',
          width: '120px'
        },
        {
          prop: 'admin_comment',
          label: '管理员备注'
        },
        {
          prop: 'check_in_record',
          label: '签到方式',
          contentExpress: function (val) {
            if (val.length === 0) {
              return ''
            } else {
              switch (val[0].check_in_method) {
                case '1':
                  return '自主签到'
                case '2':
                  return '管理员代签'
              }
            }
          }
        },
        {
          prop: 'check_in_record',
          label: '签到时间',
          contentExpress: function (val) {
            if (val.length === 0) {
              return ''
            } else {
              return val[0].created_at
            }
          }
        },
        {
          prop: 'check_in_record',
          label: '状态',
          contentExpress: function (val) {
            return val.length === 0 ? '未签到' : '已签到'
          }
        },
        {
          prop: 'id',
          label: '操作',
          VNode: true,
          contentExpress: function (val, h, row) {
            return h('el-button', {
              props: {
                type: 'primary',
                size: 'mini',
                plain: true,
                disabled: row.check_in_record.length !== 0
              },
              on: {
                click: function (e) {
                  const req = new RESTfulReq('/check_in_record/' + thisView.nowCheckInId)
                  req.postReq({
                    check_in_id: thisView.nowCheckInId,
                    apply_list_id: val,
                    check_in_method: '2'
                  }).then(function (response) {
                    console.log(response)
                    thisView.$refs['check-in-record'].tableDataReq()
                  })
                }
              }
            }, '代签')
          }
        }
      ],
      nowCheckInId: 0
    }
  },
  computed: {
    jsonExcelFields: function () {
      const thisView = this
      let dUtil = new TableDataUtil(thisView.checkInListColumnDefine)
      let ret = dUtil.convert2KeyValPlain('label', 'prop')
      delete ret['操作']
      return ret
    }
  }
}
</script>

<style scoped>
  #qrcode, #qrcode-phone {
    text-align: center;
    width: 200px;
    margin: auto;
  }
</style>
