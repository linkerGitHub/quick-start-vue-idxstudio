<template>
  <textarea :id="this.id" :value="this.value" rows="10" cols="80"></textarea>
</template>

<script>
import CKEDITOR from 'CKEDITOR'
import StringDeal from '@/idx-lib/utils/string-deal'

export default {
  name: 'ArticleEditor',
  components: {},
  mounted: function () {
    let theComponent = this
    let ckeditorId = this.id
    let config = {
      height: this.height,
      width: this.width,
      toolbar: this.toolbar,
      language: this.language,
      // Configure your file manager integration.
      filebrowserBrowseUrl: this.filebrowserBrowseUrl,
      filebrowserImageBrowseUrl: this.filebrowserImageBrowseUrl,
      filebrowserUploadUrl: this.filebrowserUploadUrl,
      filebrowserImageUploadUrl: this.filebrowserImageUploadUrl,

      // Upload dropped or pasted images to the CKFinder connector (note that the response type is set to JSON).
      uploadUrl: this.uploadUrl,

      // Reduce the list of block elements listed in the Format drop-down to the most commonly used.
      // format_tags: 'p;h1;h2;h3;pre',
      // Simplify the Image and Link dialog windows. The "Advanced" tab is not needed in most cases.
      removeDialogTabs: 'image:advanced;link:advanced',
      // font_names: '微软雅黑;宋体;黑体;仿宋_GB2312;楷体_GB2312;隶书;幼圆;'
      indentation: '2em'
    }
    CKEDITOR.replace(ckeditorId, config)
    CKEDITOR.instances[ckeditorId].setData(this.value)
    CKEDITOR.instances[ckeditorId].on('change', () => {
      let ckeditorData = CKEDITOR.instances[ckeditorId].getData()
      if (ckeditorData !== this.value) {
        this.$emit('input', ckeditorData)
      }
    })
    CKEDITOR.instances[ckeditorId].on('fileUploadRequest', function (evt) {
      theComponent.onFileUploadRequest(evt)
    })
    CKEDITOR.instances[ckeditorId].on('fileUploadResponse', function (evt) {
      theComponent.onFileUploadResponse(evt)
    })
  },
  beforeMount: function () {
  },
  beforeUpdate () {
    const ckeditorId = this.id
    if (this.value !== CKEDITOR.instances[ckeditorId].getData()) {
      CKEDITOR.instances[ckeditorId].setData(this.value)
    }
  },
  destroyed () {
    const ckeditorId = this.id
    if (CKEDITOR.instances[ckeditorId]) {
      CKEDITOR.instances[ckeditorId].destroy()
    }
  },
  props: {
    value: {
      type: String
    },
    id: {
      type: String,
      default: function () {
        return 'idx_' + StringDeal.randomString(12) + new Date().getTime()
      }
    },
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '100%'
    },
    toolbar: {
      type: Array,
      default: () => [
        { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
        { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
        { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
        '/',
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
        { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'textindent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
        { name: 'insert', items: [ 'Image', 'Media', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak' ] },
        '/',
        { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
        { name: 'about', items: [ 'About' ] }
      ]
    },
    language: {
      type: String,
      default: 'zh-cn'
    },
    extraplugins: {
      type: String,
      default: ''
    },
    filebrowserBrowseUrl: {
      type: String,
      default: ''
    },
    filebrowserImageBrowseUrl: {
      type: String,
      default: ''
    },
    filebrowserUploadUrl: {
      type: String,
      default: ''
    },
    filebrowserImageUploadUrl: {
      type: String,
      default: ''
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    onFileUploadRequest: {
      type: Function,
      default: function (evt) {
      }
    },
    onFileUploadResponse: {
      type: Function,
      default: function (evt) {
      }
    }
  },
  methods: {

  },
  watch: {
    width: function (newVal, oldVal) {
      document.getElementById('cke_' + this.id).style.width = newVal
    }
  },
  data: function () {
    return {
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
