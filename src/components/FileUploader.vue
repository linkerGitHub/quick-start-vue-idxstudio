<template>
    <div>
      <el-button type="primary" action-type="button" mini  v-on:click.native="uploadBtnClick">
        <slot></slot>
      </el-button>
      <input style="display: none;" ref="fileInput" type="file" v-on:click="iptClick" v-on:change="fileChange($event)" :accept="accept" />
    </div>
</template>

<script>
export default {
  name: 'FileUploader',
  components: {},
  props: {
    accept: {
      type: String,
      default: '*'
    },
    value: {
      required: true
    },
    file: {
      required: true
    }
  },
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {
    fileChange: function (e) {
      const thisView = this
      const timeStampName = Date.now() + thisView.$refs.fileInput.files[0].name
      thisView.$emit('update:file', {
        file: thisView.$refs.fileInput.files[0],
        dynamicName: timeStampName
      })
      this.$emit('input', { value: timeStampName, isFile: true })
    },
    uploadBtnClick: function () {
      const thisView = this
      if (thisView.clickActionFin) {
        thisView.clickActionFin = false
        let ipt = thisView.$refs.fileInput
        ipt.click()
        if (!thisView.fileInputClicked) {
          ipt.click()
        }
        thisView.$nextTick(function () {
          thisView.fileInputClicked = false
        })
        setTimeout(function () {
          thisView.clickActionFin = true
        }, 1000)
      }
    },
    iptClick: function () {
      this.fileInputClicked = true
    }
  },
  data: function () {
    return {
      clickActionFin: true,
      fileInputClicked: false
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
