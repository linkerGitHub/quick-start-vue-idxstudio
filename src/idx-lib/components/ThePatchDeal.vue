<template>
    <el-row>
        <el-tooltip class="item" effect="dark" content="编辑" placement="left"
                    :style="opButtonStyleSet('edit')">
            <el-button
                    size="mini"
                    circle
                    type="info"
                    icon="el-icon-edit"
                    @click="handleEdit()"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="启用" placement="left"
                    :style="opButtonStyleSet('enable')">
            <el-button
                    size="mini"
                    circle
                    type="success"
                    icon="el-icon-check"
                    @click="handleEnable()"></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="禁用" placement="left"
                    :style="opButtonStyleSet('disable')">
            <el-button
                    size="mini"
                    circle
                    type="warning"
                    icon="el-icon-close"
                    @click="handleDisable()"></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="删除" placement="left"
                    :style="opButtonStyleSet('delete')">
            <el-button
                    size="mini"
                    type="danger"
                    circle
                    icon="el-icon-delete"
                    @click="handleDelete()"></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="新建" placement="left"
                    :style="opButtonStyleSet('newOne')">
            <el-button
                    size="mini"
                    type="primary"
                    circle
                    icon="el-icon-plus"
                    @click="handleNewOne()"></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="刷新" placement="left"
                    :style="opButtonStyleSet('refresh')">
            <el-button
                    size="mini"
                    type="success"
                    circle
                    icon="el-icon-refresh"
                    @click="handleRefresh()"></el-button>
        </el-tooltip>
    </el-row>
</template>

<script>
/**
   * 3.所有的选项在patcheOptionsr porp属性内
   * 4.ops选项，数组，表示需要显示的操作按钮
   * 5.opEvent，对象，设置操作的回调执行函数
   * opEvent* : {
   *      allOpBefore: function(){
   *
   *      },
   *      edit: function (e) {
   *
   *      },
   *      enable: function (e) {
   *
   *      },
   *      disable: function (e) {
   *
   *      },
   *      delete: function (e) {
   *
   *      },
   *      newOne: function (e) {
   *
   *      }
   *    }
   * @type {null}
   */

export default {
  name: 'ThePatchDeal',
  beforeMount: function () {
  },
  methods: {
    opButtonStyleSet: function (opName) {
      let propAttrs = this.$attrs
      let innerStyle = ''
      innerStyle += propAttrs.patchOptions.ops.indexOf(opName) === -1 ? 'display: none' : ''
      return innerStyle
    },
    handleEdit: function () {
      let propAttrs = this.$attrs
      propAttrs.patchOptions.opEvent.edit()
    },
    handleEnable: function () {
      let propAttrs = this.$attrs
      propAttrs.patchOptions.opEvent.enable()
    },
    handleDisable: function () {
      let propAttrs = this.$attrs
      propAttrs.patchOptions.opEvent.disable()
    },
    handleDelete: function () {
      let propAttrs = this.$attrs
      propAttrs.patchOptions.opEvent.delete()
    },
    handleNewOne: function () {
      let propAttrs = this.$attrs
      propAttrs.patchOptions.opEvent.newOne()
    },
    handleRefresh: function () {
      let propAttrs = this.$attrs
      propAttrs.patchOptions.opEvent.refresh()
    }
  },
  data () {
    return {}
  },
  computed: {}
}
</script>

<style scoped>
    .el-row {
        position: fixed;
        left: 194px;
        top: 180px;
        width: 40px;
        z-index: 100;
    }

    .el-button {
        margin: 10px 0 0 0!important;
    }
</style>
