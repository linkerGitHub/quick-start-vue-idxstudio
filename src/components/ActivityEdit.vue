<template>
  <el-form :model="activityData" :rules="rules" ref="mainForm" label-width="120px">
    <el-form-item label="活动名称" prop="activity_name">
      <el-input v-model="activityData.activity_name"></el-input>
    </el-form-item>
    <el-form-item label="封面图片" prop="activity_pic_url">
      <el-upload
        class="avatar-uploader"
        action="null"
        :show-file-list="false"
        :http-request="uploadPic">
        <img v-if="activityData.activity_pic_url" :src="activityData.activity_pic_url" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="报名时间" prop="activity_apply">
      <el-date-picker
        v-model="apply_time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :editable="false"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="进行时间" prop="activity_run">
      <el-date-picker
        v-model="run_time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :editable="false"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="活动地点" prop="activity_brief">
      <el-input v-model="activityData.activity_brief"></el-input>
    </el-form-item>
    <el-form-item label="人数上限" prop="involve_num_limit">
      <el-input-number v-model="activityData.involve_num_limit" controls-position="right" placeholder="'0'表示无上限"></el-input-number>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="报名表单项" prop="input_field">
      <el-checkbox-group v-model="activityData.input_field">
        <el-checkbox v-for="field in theInputFields" :label="field.id" :key="field.id" :value="field.id">{{ field.input_label }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="详细介绍" prop="activity_content">
      <ckeditor :editor="theEditor" v-model="activityData.activity_content" :config="editorCfg"></ckeditor>
    </el-form-item>
  </el-form>
</template>

<script>
import moment from 'moment'
import RESTfulReq from '@/idx-lib/utils/RESTful-request'
import ClassicEditor from 'ClassicEditor'
import { url } from '@/idx-lib/config'
import TableDataUtil from '@/idx-lib/utils/table-data'

export default {
  name: 'ActivityEdit',
  components: {},
  props: {
    activityData: {
      required: true
    }
  },
  mounted: function () {
    let thisView = this
    let restReq = new RESTfulReq('/input_field')
    restReq.getReq()
      .then(function (response) {
        thisView.theInputFields = response.data.data.rows
      })
    thisView.dataObjReassignInit()
  },
  beforeMount: function () {

  },
  methods: {
    uploadPic: function (params) {
      let theView = this
      let restReq = new RESTfulReq('/activity/pic')
      let fd = new FormData()
      fd.append('file', params.file)
      restReq.fileUpload(fd)
        .then(function (response) {
          theView.activityData.activity_pic_url = url.server.hostname + '/RichFilemanager/userfiles/app_system/act_cover_pic/' + response.data.data[0].url
        })
    },
    validForm: function () {
      return new Promise((resolve, reject) => {
        this.$refs['mainForm'].validate((valid) => {
          resolve(valid)
        })
      })
    },
    dataObjReassignInit: function () {
      if (this.activityData.input_field[0] && (this.activityData.input_field[0] instanceof Object)) {
        let tul = new TableDataUtil(this.activityData.input_field)
        this.activityData.input_field = tul.getColumn('id')
      }
    }
  },
  data: function () {
    let thisView = this
    return {
      apply_time: [moment().format('YYYY-MM-DD HH:mm:ss'),
        moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss')],
      run_time: [moment().format('YYYY-MM-DD HH:mm:ss'),
        moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss')],
      theEditor: ClassicEditor,
      editorCfg: {
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
          ]
        },
        media: {
          browser: 'http://localhost/richFileManager/'
        },
        language: 'zh-cn'
      },
      theInputFields: [],
      rules: {
        activity_name: [
          { type: 'string', required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'change' }
        ],
        activity_pic_url: [
          { type: 'url', required: true, message: '图片必选', trigger: 'change' }
        ],
        activity_apply: [
          {
            validator: function (rule, value, callback) {
              if (moment(thisView.apply_time[1]).isAfter(thisView.apply_time[0])) {
                callback()
              } else {
                callback(new Error('截至时间应迟于开始时间'))
              }
            },
            required: true,
            trigger: 'change'
          }
        ],
        activity_run: [
          {
            validator: function (rule, value, callback) {
              if (moment(thisView.run_time[1]).isAfter(thisView.run_time[0])) {
                callback()
              } else {
                callback(new Error('截至时间应迟于开始时间'))
              }
            },
            required: true,
            trigger: 'change'
          }
        ],
        activity_brief: [
          { type: 'string', required: true, message: '请输入活动地点', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'change' }
        ],
        involve_num_limit: [
          { type: 'number', required: true, message: '必填，0表示无上限', trigger: 'blur' }
        ],
        input_field: [
          { type: 'array', message: '请正确选择', trigger: 'change' }
        ],
        activity_content: [
          { type: 'string', required: true, message: '请填写活动详情介绍', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    dataJson: function (newVal, oldVal) {
    },
    apply_time: function (newVal, oldVal) {
      this.activityData.activity_apply_start = newVal[0]
      this.activityData.activity_apply_end = newVal[1]
    },
    run_time: function (newVal, oldVal) {
      this.activityData.activity_run_start = newVal[0]
      this.activityData.activity_run_end = newVal[1]
    },
    activityData: function (newVal, oldVal) {
      this.dataObjReassignInit()
    }
  },
  computed: {
    dataJson: function () {
      return JSON.stringify(this.activityData)
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader{
    height: 120px!important;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 120px;
    line-height: 120px !important;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 120px;
    display: block;
  }
  .ck.ck-balloon-panel.ck-balloon-panel_visible{
    z-index: 9999;
  }
</style>
