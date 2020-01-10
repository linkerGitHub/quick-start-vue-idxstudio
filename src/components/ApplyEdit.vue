<template>
  <div>
    <el-form :model="fieldValTemp" :rules="validRule" ref="mainForm" label-width="120px">
      <el-form-item v-for="(field) in inputFields" :key="field.id" :label="field.input_label" :prop="field.input_name_mark">
        <el-date-picker
          v-if="field.input_type === 'date'"
          v-model="fieldValTemp[field.input_name_mark]"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>

        <el-radio-group v-model="fieldValTemp[field.input_name_mark]" v-else-if="field.input_type === 'radio'">
          <el-radio v-for="(opt, index) in JSON.parse(field.input_options)" :key="index" :label="opt">{{ opt }}</el-radio>
        </el-radio-group>

        <el-checkbox-group v-model="fieldValTemp[field.input_name_mark]" v-else-if="field.input_type === 'checkbox'">
          <el-checkbox v-for="(opt, index) in JSON.parse(field.input_options)" :key="index" :label="opt">{{ opt }}</el-checkbox>
        </el-checkbox-group>

        <el-select v-model="fieldValTemp[field.input_name_mark]" :placeholder="field.input_tip" v-else-if="field.input_type === 'select'">
          <el-option
            v-for="(opt, index) in JSON.parse(field.input_options)"
            :key="index"
            :label="opt"
            :value="opt">
          </el-option>
        </el-select>

        <el-input v-else-if="field.input_type === 'textarea'" type="textarea" :placeholder="field.input_tip" v-model="fieldValTemp[field.input_name_mark]"></el-input>

        <el-input v-else-if="field.input_type === 'input'" :placeholder="field.input_tip" v-model="fieldValTemp[field.input_name_mark]"></el-input>

        <el-input v-else-if="field.input_type === 'regexr'" :placeholder="field.input_tip" v-model="fieldValTemp[field.input_name_mark]"></el-input>

        <file-uploader v-else-if="field.input_type === 'file'"
                       v-bind:file="fileContainer[filePositionIndex.indexOf(field.id)]"
                       v-on:update:file="uploaderFileUpdate(field.id, $event, field.input_name_mark)"
                       v-model="fieldValTemp[field.input_name_mark]">{{ field.input_tip }}</file-uploader>

      </el-form-item>
      <el-form-item label="管理员备注">
        <el-input type="textarea" v-model="fieldsValue.admin_comment"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import FileUploader from '@/components/FileUploader'
export default {
  name: 'ApplyEdit',
  components: { FileUploader },
  props: {
    fieldsValue: {
      required: true
    },
    inputFields: {
      required: true
    },
    activityId: {
      required: false,
      type: Number
    }
  },
  mounted: function () {
  },
  beforeMount: function () {
    const thisView = this
    let tempInputVal = JSON.parse(this.fieldsValue.input_value ? this.fieldsValue.input_value : '{}')
    thisView.inputFields.forEach(function (item, index, arr) {
      let val = typeof tempInputVal[item.input_name_mark] === 'undefined' ? (item.input_type === 'checkbox' ? [] : '') : tempInputVal[item.input_name_mark]
      thisView.$set(thisView.fieldValTemp, item.input_name_mark, val)

      // valid rule
      let validator = [{
        validator: function (rule, value, callback) {
          let ret = true
          let regObj = new RegExp(item.input_valid_regexr)
          if (value instanceof Array) {
            ret = value.length !== 0
            for (let itemVal of value) {
              ret = ret && regObj.test(itemVal)
            }
          } else if (item.input_type === 'file') {
            if (value.isFile) {
              ret = regObj.test(value.value.split('.').pop())
            }
            if (value === '') {
              ret = false
            }
          } else {
            ret = ret && regObj.test(value)
          }
          if (ret) {
            callback()
          } else {
            callback(new Error(item.input_err_notice))
          }
        },
        required: item.input_require === '1',
        trigger: 'change'
      }]
      thisView.$set(thisView.validRule, item.input_name_mark, validator)
    })
    if (typeof this.activityId !== 'undefined') {
      thisView.$set(thisView.fieldsValue, 'activity_id', this.activityId)
    }

    for (let field of thisView.inputFields) {
      if (field.input_type === 'file') {
        this.filePositionIndex.push(field.id)
      }
    }

    this.$set(this.fieldsValue, 'file', [])
  },
  methods: {
    validForm: function () {
      return new Promise((resolve, reject) => {
        this.$refs['mainForm'].validate((valid) => {
          resolve(valid)
        })
      })
    },
    uploaderFileUpdate: function (fieldId, value, fieldName) {
      const thisView = this
      thisView.$set(thisView.fileContainer, thisView.filePositionIndex.indexOf(fieldId), value)
      thisView.$nextTick(function () {
        thisView.$refs['mainForm'].validateField(fieldName)
      })
    },
    reInit: function () {
      this.fileContainer = []
    }
  },
  data: function () {
    return {
      fieldValTemp: {},
      validRule: {},
      fileContainer: [],
      filePositionIndex: []
    }
  },
  computed: {
    fieldValTempJson: function () {
      return JSON.stringify(this.fieldValTemp)
    }
  },
  watch: {
    fieldValTempJson: function (newVal, oldVal) {
      this.fieldsValue.apply_name = this.fieldValTemp.name
      this.fieldsValue.apply_phone_number = this.fieldValTemp.phone
      this.fieldsValue.input_value = newVal
    },
    'fieldsValue.file': function (newVal, oldVal) {
      if (newVal === undefined) {
        this.fieldsValue.file = []
      }
    },
    fileContainer: function (newVal, oldVal) {
      this.fieldsValue.file = newVal
    }
  }
}
</script>

<style scoped>

</style>
