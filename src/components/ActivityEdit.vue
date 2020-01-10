<template>
  <div>
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
        <el-input-number v-model="activityData.involve_num_limit" controls-position="right"
                         placeholder="'0'表示无上限"></el-input-number>
      </el-form-item>
      <el-form-item label="报名口令" prop="apply_code">
        <el-input v-model="activityData.apply_code" placeholder="不设置留空即可" style="width: 180px;"></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="报名表单项" prop="input_field">
        <el-checkbox-group v-model="formInputFieldIndex">
          <el-checkbox v-for="field in theInputFields" :label="field.id" :disabled="field.id <= 2" :key="field.id" :value="field.id">
            {{ field.input_label }}
          </el-checkbox>
        </el-checkbox-group>
        <el-button icon="el-icon-sort" size="mini" type="primary" @click="fieldOrderDialogVisible = true">排序</el-button>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="详细介绍" prop="activity_content">
        <ckeditor :editor="theEditor" v-model="activityData.activity_content" :config="editorCfg"></ckeditor>
      </el-form-item>
    </el-form>

    <el-dialog
      append-to-body
      title="拖拽进行排序"
      :visible.sync="fieldOrderDialogVisible"
      width="400px">
      <draggable
        class="list-group"
        tag="ul"
        v-model="draggableFields"
        v-bind="dragOptions"
        @start="dragStart"
        @end="dragEnd">
        <transition-group type="transition" :name="!inDrag ? 'flip-list' : null">
          <li
            class="list-group-item"
            v-for="field in draggableFields"
            :key="field.id">
            {{ field.input_label }}
          </li>
        </transition-group>
      </draggable>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fieldOrderDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="fieldOrderDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import RESTfulReq from '@/idx-lib/utils/RESTful-request'
import ClassicEditor from 'ClassicEditor'
import { url } from '@/idx-lib/config'
import TableDataUtil from '@/idx-lib/utils/table-data'
import draggable from 'vuedraggable'

export default {
  name: 'ActivityEdit',
  components: { draggable },
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
    dragStart: function (e1) {
      this.inDrag = true
    },
    dragEnd: function (e1) {
      this.inDrag = false
    },
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
        this.activityData.input_field = tul.convert2KeyVal('id', { 'pivot.field_order': 'field_order' })
      }
    }
  },
  data: function () {
    let thisView = this
    return {
      inDrag: false,
      fieldOrderDialogVisible: false,
      apply_time: [
        thisView.activityData.activity_apply_start === '' ? '' : thisView.activityData.activity_apply_start,
        thisView.activityData.activity_apply_end === '' ? '' : thisView.activityData.activity_apply_end
      ],
      run_time: [
        thisView.activityData.activity_run_start === '' ? '' : thisView.activityData.activity_run_start,
        thisView.activityData.activity_run_end === '' ? '' : thisView.activityData.activity_run_end
      ],
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
          browser: url.server.hostname + '/RichFilemanager/'
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
          {
            validator: function (rule, value, callback) {
              if (['jpg', 'png', 'gif'].indexOf(value.split('.').pop()) !== -1) {
                callback()
              } else {
                callback(new Error('图片必选，\'jpg\', \'png\', \'gif\'格式'))
              }
            },
            required: true,
            trigger: 'change'
          }
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
        /* input_field: [
                {
                  type: 'object',
                  trigger: 'change',
                  validator: function (rule, value, callback) {
                    let
                  }
                }
              ], */
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
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    dataJson: function () {
      return JSON.stringify(this.activityData)
    },
    formInputFieldIndex: {
      get: function () {
        let ret = []
        let thisView = this
        for (let prop in thisView.activityData.input_field) {
          ret.push(parseInt(prop))
        }
        return ret
      },
      set: function (newVal) {
        // let thisView = this
        let ret = {}
        newVal.forEach(function (item, index) {
          ret[item] = { field_order: index }
        })
        this.activityData.input_field = ret
      }
    },
    draggableFields: {
      get: function () {
        let thisView = this
        let ret = thisView.theInputFields.filter(function (item) {
          return thisView.formInputFieldIndex.includes(item.id)
        }).sort(function (A, B) {
          return thisView.activityData.input_field[A.id].field_order - thisView.activityData.input_field[B.id].field_order
        })
        return ret
      },
      set: function (newVal) {
        let ret = {}
        newVal.forEach(function (item, index) {
          ret[item.id] = { field_order: index }
        })
        this.activityData.input_field = ret
      }
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

  .avatar-uploader {
    height: 120px !important;
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

  .ck.ck-balloon-panel.ck-balloon-panel_visible {
    z-index: 9999;
  }

  .button {
    margin-top: 35px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    cursor: move;
    position: relative;
    display: block;
    padding: .75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.125);
  }
  .list-group-item:first-child {
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
  }
  .list-group-item:last-child {
    margin-bottom: 0;
    border-bottom-right-radius: .25rem;
    border-bottom-left-radius: .25rem;
  }
</style>

<style scoped>
  .dragItem {
    margin: 8px;
    border: 1px solid #8c939d;
    padding: 6px;
    border-radius: 4px;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
</style>
