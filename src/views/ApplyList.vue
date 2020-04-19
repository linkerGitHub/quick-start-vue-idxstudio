<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>报名名单</span>
    </div>
    <the-manage-table
      ref="apply-table"
      :src-url="'/apply?activity_id=' + activity_id"
      :columns="columnDefine"
      :edit-box-before-confirm="beforeConfirm('edit-ref')"
      :new-one-box-before-confirm="beforeConfirm('new-one-ref')"
      :edit-box-opts="{width: '60%'}"
      :new-one-box-opts="{width: '60%'}"
      :modify-req-override="modifyOverride"
      :new-one-req-override="newOneOverride"
      :ops="['newOne', 'edit', 'delete', 'refresh']">
      <template v-slot:searchBar="scope">
        <el-form :inline="true">
          <el-form-item label="电话">
            <el-input v-model="scope.data.apply_phone_number"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="scope.data.apply_name"></el-input>
          </el-form-item>
          <el-form-item>
            <json-excel
              :fetch="getTableDataToExcel"
              :fields="jsonExcelFields"
              worksheet="签到记录"
              name="名单"
            >
              <el-button>导出</el-button>
            </json-excel>
          </el-form-item>
        </el-form>
      </template>

      <template v-slot:editForm="scope">
        <apply-edit ref="edit-ref" v-bind:fields-value.sync="scope.data"
                    :input-fields="activityInputFields"></apply-edit>
      </template>

      <template v-slot:newOneForm="scope">
        <apply-edit ref="new-one-ref" :activity-id="parseInt(activity_id)" v-bind:fields-value.sync="scope.data"
                    :input-fields="activityInputFields"></apply-edit>
      </template>
    </the-manage-table>
  </el-card>
</template>

<script>
import TheManageTable from '@/idx-lib/components/TheManageTable'
import RESTfulReq from '@/idx-lib/utils/RESTful-request'
import TableDataUtil from '@/idx-lib/utils/table-data'
import ApplyEdit from '@/components/ApplyEdit'
import { url } from '@/idx-lib/config'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'ApplyList',
  components: { ApplyEdit, TheManageTable, JsonExcel },
  props: {
    activity_id: {
      required: true
    }
  },
  mounted: function () {
  },
  beforeMount: function () {
    let req = new RESTfulReq('/activity')
    const thisView = this
    req.getReq({ id: this.activity_id })
      .then(function (response) {
        thisView.activityInputFields = response.data.data.rows[0].input_field
        let tableUtl = new TableDataUtil(response.data.data.rows[0].input_field)
        thisView.nameMarkLabelMap = tableUtl.convert2KeyVal('input_name_mark', {
          input_label: 'input_label',
          input_type: 'input_type'
        })
        // dynamic modify columnDefine
        for (let item in thisView.nameMarkLabelMap) {
          thisView.columnDefine.push({
            prop: 'input_value',
            label: thisView.nameMarkLabelMap[item].input_label + (thisView.nameMarkLabelMap[item].input_type === 'file' ? '(文件)' : ''),
            dangerouslyUseHTMLString: true,
            contentExpress: function (val) {
              let valObj = JSON.parse(val)
              if (thisView.nameMarkLabelMap[item].input_type === 'checkbox') {
                return valObj[item].join(',')
              } else if (thisView.nameMarkLabelMap[item].input_type === 'file') {
                if (valObj[item] !== undefined) {
                  return '<a target="_blank" href="' + url.server.hostname + '/RichFilemanager/userfiles/app_system/user_upload/' +
                    valObj[item].value + '">点击访问/下载</a>'
                } else {
                  return '用户没有上传'
                }
              }
              return valObj[item]
            }
          })
        }
      })
  },
  methods: {
    getTableDataToExcel: function () {
      let dUtil = new TableDataUtil(this.$refs['apply-table'].tableOptions.tableData)
      let jsonRet = dUtil.getColumns(['input_value', 'admin_comment'])
      const thisView = this
      let ret = []
      for (let item of jsonRet) {
        let parsedObj = JSON.parse(item.input_value)
        if (thisView.exportExcelFieldType.file) {
          for (let propName of thisView.exportExcelFieldType.file) {
            parsedObj[propName] = url.server.hostname + '/RichFilemanager/userfiles/app_system/user_upload/' + parsedObj[propName].value
          }
        }
        parsedObj['admin_comment'] = item.admin_comment === null ? '' : item.admin_comment
        ret.push(parsedObj)
      }
      return ret
    },
    beforeConfirm: function (ref) {
      let thisView = this
      return function () {
        return new Promise((resolve, reject) => {
          if (thisView.$refs[ref]) {
            thisView.$refs[ref].validForm()
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
    modifyOverride: function (reqData) {
      return new Promise((resolve, reject) => {
        let req = new RESTfulReq('/apply')
        let fdata = new FormData()
        for (let nameMark in reqData) {
          if (typeof reqData[nameMark] === 'string' || typeof reqData[nameMark] === 'number') {
            fdata.append(nameMark, reqData[nameMark])
          } else if (reqData[nameMark] instanceof Array) {
            for (let complexObj of reqData[nameMark]) {
              if (complexObj !== undefined) {
                if (complexObj.file instanceof File) {
                  fdata.append('file[]', complexObj.file, complexObj.dynamicName)
                }
              }
            }
          }
        }
        req.setConfig({
          headers: {
            'X-HTTP-Method-Override': 'PUT'
          }
        })
        req.postReq(fdata)
          .then(function (response) {
            resolve(response)
          })
          .catch(function (err) {
            reject(err)
          })
      })
    },
    newOneOverride: function (reqData) {
      return new Promise((resolve, reject) => {
        let req = new RESTfulReq('/apply')
        let fdata = new FormData()
        for (let nameMark in reqData) {
          if (typeof reqData[nameMark] === 'string' || typeof reqData[nameMark] === 'number') {
            fdata.append(nameMark, reqData[nameMark])
          } else if (reqData[nameMark] instanceof Array) {
            for (let complexObj of reqData[nameMark]) {
              if (complexObj !== undefined) {
                if (complexObj.file instanceof File) {
                  fdata.append('file[]', complexObj.file, complexObj.dynamicName)
                }
              }
            }
          }
        }
        req.postReq(fdata)
          .then(function (response) {
            resolve(response)
          })
          .catch(function (err) {
            reject(err)
          })
      })
    }
  },
  data: function () {
    return {
      activityInputFields: [],
      columnDefine: [
        {
          prop: 'admin_comment',
          label: '管理员备注'
        }
      ],
      nameMarkLabelMap: {}
    }
  },
  computed: {
    jsonExcelFields: function () {
      let ret = {}
      for (let prop in this.nameMarkLabelMap) {
        ret[this.nameMarkLabelMap[prop].input_label] = prop
      }
      ret['管理员备注'] = 'admin_comment'
      return ret
    },
    exportExcelFieldType: function () {
      let ret = {}
      for (let prop in this.nameMarkLabelMap) {
        if (ret[this.nameMarkLabelMap[prop].input_type] === undefined) {
          ret[this.nameMarkLabelMap[prop].input_type] = []
        }
        ret[this.nameMarkLabelMap[prop].input_type].push(prop)
      }
      return ret
    }
  }
}
</script>

<style>
</style>
