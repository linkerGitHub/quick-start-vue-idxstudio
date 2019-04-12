<template>
  <div>
    <el-row>
      <el-col :span="23" style="text-align: right">
        <!--建立一个插槽供父组件补充，并将查询数据对象暴露在scope的data中-->
        <slot name="tableOperateHeader" :data="operateHeader"></slot>
      </el-col>
      <el-col :span="1" v-show="$scopedSlots.tableOperateHeader">
        <el-button icon="el-icon-search" circle @click="searchQuery()"></el-button>
      </el-col>
    </el-row>
    <el-table v-loading="tableOptions.loading" :data="tableOptions.tableData" border style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <!--根据tableOptions.columns构建渲染表格列-->
      <el-table-column v-for="(col, key) of tableOptions.columns"
                       :key="key+1"
                       :prop="col.prop"
                       :label="col.label"
                       :width="col.width">
        <template slot-scope="scope">
          <!--判定是否有根据值自定义内容表达的方法-->
          <span v-if="col.contentExpress === undefined && !col.dangerouslyUseHTMLString">
                        {{ scope.row[col.prop] }}
                    </span>
          <span v-else-if="col.contentExpress === undefined && col.dangerouslyUseHTMLString"
                v-html="scope.row[col.prop]">
                    </span>
          <span v-else-if="col.VNode">
                      <parent-render
                        :expressNode="handleContentExp(scope.row[col.prop], col.contentExpress)"></parent-render>
                    </span>
          <!--如果有自定义表达方法，判定是以html还是纯粹字符来展示-->
          <span v-else-if="!col.dangerouslyUseHTMLString">
                      {{ handleContentExp(scope.row[col.prop], col.contentExpress) }}
                    </span>
          <span v-else v-html="handleContentExp(scope.row[col.prop], col.contentExpress)"></span>
        </template>
      </el-table-column>
    </el-table>

    <!--使用翻页组件-->
    <the-table-pagination :paginationOptions="thePaginationOpt"></the-table-pagination>

    <!--使用侧边操作组件-->
    <the-patch-deal :patchOptions="patchDeal"></the-patch-deal>

    <!--编辑操作对话款-->
    <el-dialog title="编辑" :visible.sync="editBox.visible"
               :width="editBoxOpts.width">
      <!--建立一个插槽供父组件补充，并将编辑操作的数据对像暴露到scope的data中-->
      <slot name="editForm" :data="tableOptions.editData"></slot>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBox.visible = false">取 消</el-button>
        <el-button type="primary" @click="modifyReq()">确 认</el-button>
      </div>
    </el-dialog>

    <!--新建操作对话框-->
    <el-dialog title="新建" :visible.sync="newOneBox.visible"
               :width="newOneBoxOpts.width">

      <!--建立一个插槽供父组件补充，并将新建操作的数据对像暴露到scope的data中-->
      <slot name="newOneForm" :data="tableOptions.newOneData"></slot>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newOneBox.visible = false">取 消</el-button>
        <el-button type="primary" @click="newOneReq()">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TheTablePagination from './TheTablePagination'
import ThePatchDeal from './ThePatchDeal'
import RESTfulReq from '../utils/RESTful-request'
import TableDataUtil from '../utils/table-data'

export default {
  name: 'TheManageTable',
  components: {
    TheTablePagination,
    ThePatchDeal,
    parentRender: {
      props: {
        expressNode: {
          type: Object
        }
      },
      render: function (createElement) {
        return this.expressNode
      }
    }
  },
  props: {
    // 操作区按钮
    ops: {
      type: Array,
      default: function () {
        return ['edit', 'delete', 'newOne', 'refresh', 'enable', 'disable']
      }
    },
    // 请求数据的url地址
    srcUrl: {
      type: String
    },
    // 列定义
    columns: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        if (Array.isArray(value)) {
          value.forEach(function (element) {
            if (element.prop === undefined || element.label === undefined) {
              throw new Error('使用TheManageTable组件时，column内prop属性和label属性是必须的')
            }
          })
          return true
        } else {
          return false
        }
      }
    },
    // 新建对话框定义
    newOneBoxOpts: {
      type: Object,
      default: function () {
        return {
          width: '30%',
          submitSuccess: function (response, payload) {
          },
          beforeConfirm: function () {
            return true
          }
        }
      },
      validator: function (value) {
        return (typeof value.submitSuccess === 'function' || value.submitSuccess === undefined)
      }
    },
    editBoxOpts: {
      type: Object,
      default: function () {
        return {
          width: '30%',
          submitSuccess: function (response, payload) {
          }
        }
      },
      validator: function (value) {
        return (typeof value.submitSuccess === 'function' || value.submitSuccess === undefined)
      }
    }
  },
  mounted: function () {
  },
  beforeMount: function () {
    this.tableDataReq()
    this.patchDeal.ops = this.ops
  },
  data: function () {
    let theTab = this
    return {
      // 表格
      networkReq: new RESTfulReq(theTab.srcUrl, theTab),
      tableOptions: {
        columns: theTab.columns,
        tableData: [],
        tableSelected: [],
        loading: true,
        editData: {},
        newOneData: {}
      },
      // 翻页
      thePaginationOpt: {
        tableCurrentPage: 1,
        tablePageSize: 20,
        tableItemTotal: 1,
        handleTableCurrentChange: theTab.handleTableCurrentChange,
        handleTableSizeChange: theTab.handleTableSizeChange
      },
      // 顶部查询区域
      operateHeader: {},
      // 操作区
      patchDeal: {
        ops: ['edit', 'enable', 'disable', 'delete', 'newOne', 'refresh'],
        opEvent: {
          checkSelected: function () {
            if (theTab.tableOptions.tableSelected.length === 0) {
              theTab.$message({
                message: '请至少选择一项',
                type: 'warning'
              })
              return false
            }
            return true
          },
          edit: function (e) {
            if (this.checkSelected()) {
              if (theTab.tableOptions.tableSelected.length !== 1) {
                theTab.$message({
                  message: '请仅选择一项',
                  type: 'warning'
                })
              } else {
                theTab.editBoxToggle()
                theTab.tableOptions.editData = theTab.tableOptions.tableSelected[0]
              }
            }
          },
          enable: function (e) {
            if (this.checkSelected()) {
              let tableDataUtil = new TableDataUtil(theTab.tableOptions.tableSelected)
              theTab.tableOptions.tableSelected = tableDataUtil.changeColumnValue('status', '1')
              theTab.modifyReq(theTab.tableOptions.tableSelected)
            }
          },
          disable: function (e) {
            if (this.checkSelected()) {
              let tableDataUtil = new TableDataUtil(theTab.tableOptions.tableSelected)
              theTab.tableOptions.tableSelected = tableDataUtil.changeColumnValue('status', '0')
              theTab.modifyReq(theTab.tableOptions.tableSelected)
            }
          },
          delete: function (e) {
            if (this.checkSelected()) {
              theTab.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                theTab.deleteReq()
              })
            }
          },
          newOne: function (callBack) {
            theTab.newOneBoxToggle()
          },
          refresh: function (e) {
            theTab.tableDataReq()
          }
        }
      },
      // 编辑操作对话框
      editBox: {
        visible: false
      },
      // 新建操作对话框
      newOneBox: {
        visible: false
      }
    }
  },
  methods: {
    /**
       * 表格选择改变事件
       * @param val
       */
    handleSelectionChange: function (val) {
      this.tableOptions.tableSelected = val
    },
    /**
       * 表格的翻页的每页大小改变事件
       * @param val
       */
    handleTableSizeChange: function (val) {
      let theTab = this
      theTab.thePaginationOpt.tableCurrentPage = 1
      theTab.thePaginationOpt.tablePageSize = val
      theTab.tableDataReq()
    },
    /**
       * 表格翻页事件
       * @param val
       */
    handleTableCurrentChange: function (val) {
      let theTab = this
      theTab.thePaginationOpt.tableCurrentPage = val
      theTab.tableDataReq()
    },
    /**
       * 表格数据请求
       */
    tableDataReq: function () {
      let theTab = this
      theTab.tableOptions.loading = true
      theTab.networkReq.getReq(
        {
          start: theTab.currentStart,
          limit: theTab.thePaginationOpt.tablePageSize
        },
        function (response) {
          theTab.tableOptions.tableData = response.data.data.rows
          theTab.thePaginationOpt.tableItemTotal = response.data.data.total
          theTab.tableOptions.loading = false
        })
    },
    /**
       * post，新建一个条目
       */
    newOneReq: function () {
      let theTab = this
      if (theTab.editBoxOpts.beforeConfirm !== undefined) {
        theTab.editBoxOpts.beforeConfirm().then(function (value) {
          theTab.tableOptions.loading = true
          theTab.networkReq.postReq(theTab.tableOptions.newOneData, function (response) {
            theTab.tableOptions.tableData.push(response.data.data)
            theTab.tableOptions.loading = false
            theTab.thePaginationOpt.tableItemTotal += 1
            if (theTab.newOneBoxOpts.submitSuccess) {
              theTab.newOneBoxOpts.submitSuccess(response, theTab.tableOptions.newOneData)
            }
          })
          theTab.newOneBoxToggle(false)
        })
      } else {
        theTab.tableOptions.loading = true
        theTab.networkReq.postReq(theTab.tableOptions.newOneData, function (response) {
          theTab.tableOptions.tableData.push(response.data.data)
          theTab.tableOptions.loading = false
          theTab.thePaginationOpt.tableItemTotal += 1
          if (theTab.newOneBoxOpts.submitSuccess) {
            theTab.newOneBoxOpts.submitSuccess(response, theTab.tableOptions.newOneData)
          }
        })
        theTab.newOneBoxToggle(false)
      }
    },
    modifyReq: function (reqData = [this.tableOptions.editData]) {
      let theTab = this
      if (theTab.editBoxOpts.beforeConfirm !== undefined) {
        theTab.editBoxOpts.beforeConfirm().then(function (value) {
          theTab.tableOptions.loading = true
          theTab.networkReq.putReq(reqData, function (response) {
            theTab.tableOptions.loading = false
            if (theTab.editBoxOpts.submitSuccess) {
              theTab.editBoxOpts.submitSuccess(response, reqData)
            }
          })
          theTab.editBoxToggle(false)
        }).catch(function (error) {
          theTab.tableDataReq()
          throw error
        })
      } else {
        theTab.tableOptions.loading = true
        theTab.networkReq.putReq(reqData, function (response) {
          theTab.tableOptions.loading = false
          if (theTab.editBoxOpts.submitSuccess) {
            theTab.editBoxOpts.submitSuccess(response, reqData)
          }
        })
        theTab.editBoxToggle(false)
      }
    },
    deleteReq: function () {
      let theTab = this
      this.networkReq.deleteReq(
        {
          id: theTab.selectedIds
        }, function (response) {
          theTab.thePaginationOpt.tableItemTotal -= theTab.tableOptions.tableSelected.length
          let tableDataUtil = new TableDataUtil()
          theTab.tableOptions.tableData = tableDataUtil.diffByColumn(theTab.tableOptions.tableData, 'id', theTab.tableOptions.tableSelected, 'id')
        }
      )
    },
    /**
       * 弹出或关闭切换编辑对话框
       */
    editBoxToggle: function (status = !this.editBox.visible) {
      let theTab = this
      theTab.editBox.visible = status
    },
    /**
       * 弹出或关闭切换新建对话框
       */
    newOneBoxToggle: function (status = !this.newOneBox.visible) {
      let theTab = this
      theTab.newOneBox.visible = status
    },
    /**
       * 自定义内容表达
       * @param val
       * @param callBack
       * @returns {*}
       */
    handleContentExp: function (val, callBack) {
      return callBack(val)
    },
    searchQuery: function () {
      let theTab = this
      theTab.tableOptions.loading = true
      theTab.thePaginationOpt.tableCurrentPage = 1
      theTab.networkReq.getReq(
        {
          ...{
            start: theTab.currentStart,
            limit: theTab.thePaginationOpt.tablePageSize
          },
          ...theTab.operateHeader
        }
        ,
        function (response) {
          theTab.tableOptions.tableData = response.data.data.rows
          theTab.thePaginationOpt.tableItemTotal = response.data.data.total
          theTab.tableOptions.loading = false
        })
    }
  },
  computed: {
    currentStart: function () {
      let theTab = this
      return (theTab.thePaginationOpt.tableCurrentPage - 1) * theTab.thePaginationOpt.tablePageSize
    },
    selectedIds: function () {
      let theTab = this
      let selectedId = new TableDataUtil(theTab.tableOptions.tableSelected)
      return selectedId.concatColumn('id', ',')
    }
  }
}
</script>

<style scoped>

</style>
