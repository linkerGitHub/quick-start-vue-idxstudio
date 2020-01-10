<template>
  <el-form label-width="120px">
    <el-form-item label="标签" prop="input_label">
      <el-input v-model="formData.input_label"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="input_type">
      <el-select v-model="formData.input_type">
        <el-option label="输入框" value="input"></el-option>
        <el-option label="多文本" value="textarea"></el-option>
        <el-option label="下拉" value="select"></el-option>
        <el-option label="多选" value="checkbox"></el-option>
        <el-option label="单选" value="radio"></el-option>
        <el-option label="数字" value="number"></el-option>
        <el-option label="日期" value="date"></el-option>
        <el-option label="文件" value="file"></el-option>
        <el-option label="自定义正则" value="regexr"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否必填" prop="input_require">
      <el-switch
        v-model="formData.input_require"
        active-value="1"
        inactive-value="0"
      ></el-switch>
    </el-form-item>
    <el-form-item label="填写提示" prop="input_tip">
      <el-input v-model="formData.input_tip"></el-input>
    </el-form-item>
    <el-form-item label="验证错误提示" prop="input_err_notice">
      <el-input v-model="formData.input_err_notice"></el-input>
    </el-form-item>
    <el-form-item :label="formData.input_type === 'file' ? '文件类型(后缀名)' : '选项'" prop="input_options" v-if="optionFormItemVisible">
      <el-tag
        :key="opt"
        v-for="opt in dynamicOptions"
        closable
        :disable-transitions="false"
        @close="handleOptionClose(opt)">
        {{ opt }}
      </el-tag>
      <el-input
        class="input-new-option"
        v-if="optionInputVisible"
        v-model="optionInputVal"
        ref="saveOptionInput"
        size="small"
        @keyup.enter.native="handleOptionInputConfirm"
        @blur="handleOptionInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-option" size="small" @click="showOptionInput">+ 选项</el-button>
    </el-form-item>
    <el-form-item label="验证正则表达式" prop="input_valid_regexr" v-show="formData.input_type === 'regexr'">
      <el-input v-model="formData.input_valid_regexr"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'InputFieldEdit',
  components: {},
  props: {
    formData: {
      required: true
    }
  },
  mounted: function () {
    this.dataObjReassignInit()
  },
  beforeMount: function () {
    if (this.formData.input_valid_regexr === undefined) {
      this.$set(this.formData, 'input_valid_regexr', '')
    }
  },
  methods: {
    handleOptionInputConfirm: function (e) {
      let optionInputVal = this.optionInputVal
      if (optionInputVal) {
        this.dynamicOptions.push(optionInputVal)
      }
      this.optionInputVisible = false
      this.optionInputVal = ''
    },
    showOptionInput: function (e) {
      this.optionInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveOptionInput.$refs.input.focus()
      })
    },
    handleOptionClose: function (opt) {
      this.dynamicOptions.splice(this.dynamicOptions.indexOf(opt), 1)
    },
    dataObjReassignInit: function () {
      this.dynamicOptions = JSON.parse(this.formData.input_options ? this.formData.input_options : '[]')
    },
    trigRegChange: function () {
      if (this.formData.input_type !== 'regexr') {
        let thisView = this
        let regText = '^(?:'
        let opts = ''
        if (thisView.formData.input_type === 'file' ||
          thisView.formData.input_type === 'select' ||
          thisView.formData.input_type === 'radio' ||
          thisView.formData.input_type === 'checkbox') {
          opts = thisView.dynamicOptions.join('|')
          if (thisView.formData.input_require === '0') {
            opts += '|'
          }
        } else {
          if (thisView.formData.input_require === '0') {
            opts += '.{1,}}|'
          } else {
            opts += '.{1,}'
          }
        }
        regText = regText + opts + ')$'
        thisView.formData.input_valid_regexr = regText
      }
    }
  },
  data: function () {
    return {
      dynamicOptions: [],
      optionInputVisible: false,
      optionInputVal: '',
      fileSize: 200
    }
  },
  watch: {
    dynamicOptions: function (newVal, oldVal) {
      this.formData.input_options = JSON.stringify(newVal)
      this.trigRegChange()
    },
    'formData.input_options': function (newVal, oldVal) {
      this.dataObjReassignInit()
    },
    'formData.input_type': function (newVal, oldVal) {
      this.trigRegChange()
    },
    'formData.input_require': function (newVal, oldVal) {
      this.trigRegChange()
    }
  },
  computed: {
    optionFormItemVisible: function () {
      let theType = this.formData.input_type
      return theType === 'select' || theType === 'checkbox' || theType === 'radio' || theType === 'file'
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-tag + .button-new-option,
  .el-tag + .input-new-option{
    margin-left: 10px;
  }
  .button-new-option {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-option {
    width: 90px;
    vertical-align: bottom;
  }
</style>
