<template>
  <div style="position: relative; width: 100%;">
    <el-row style="padding-bottom: 6px">
      <el-col :span="3" v-if="colShowSetBtn">
        <el-popover
          placement="bottom"
          v-model="colShowSettingVisible">
          <div style="text-align: left; margin: 0">
            <el-checkbox :indeterminate="isIndeterminate" v-model="colShowCheckAll"
                         @change="handleColShowCheckAllChange">全选
            </el-checkbox>
            <div v-for="(col, index) in tableVisibleColumn" :key="index">
              <el-checkbox :label="col.label" v-model="colShow[index]" @change="handleColShowChange($event, index)">{{
                col.label }}
              </el-checkbox>
            </div>
          </div>
          <el-button slot="reference" type="primary" :plain="true" icon="el-icon-setting">显示</el-button>
        </el-popover>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <!--建立一个插槽供父组件补充，并将查询数据对象暴露在scope的data中-->
        <slot name="searchBar" :data="searchOperateData"></slot>
      </el-col>
      <el-col :span="1" v-if="$scopedSlots.searchBar">
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
      <el-table-column v-for="(col, key) of tableOptions.columns()"
                       :key="key+1"
                       :prop="col.prop"
                       :class-name="(col.className ? col.className : '') + ' ' + ('tbl-col-' + key) + ' ' + (colShow[key] ? 'col-show' : 'col-hide')"
                       :label="typeof col.label === 'string' ? col.label : col.label()"
                       :width="col.width">
        <template slot-scope="scope">
          <!--判定是否有根据值自定义内容表达的方法-->
          <span
            v-if="col.contentExpress === undefined && !col.dangerouslyUseHTMLString">{{ scope.row[col.prop] }}</span>
          <span v-else-if="col.contentExpress === undefined && col.dangerouslyUseHTMLString"
                v-html="scope.row[col.prop]">
          </span>
          <span v-else-if="col.VNode">
            <v-node-render :expressNode="handleContentExp(scope.row[col.prop], col.contentExpress, scope.row)"></v-node-render>
          </span>
          <!--如果有自定义表达方法，判定是以html还是纯粹字符来展示-->
          <span v-else-if="!col.dangerouslyUseHTMLString">
            {{ handleContentExp(scope.row[col.prop], col.contentExpress, scope.row) }}
          </span>
          <span v-else v-html="handleContentExp(scope.row[col.prop], col.contentExpress, scope.row)"></span>
        </template>
      </el-table-column>
    </el-table>

    <!--使用翻页组件-->
    <el-row :style="{'padding-top': '10px'}">
      <slot name="pagination" :method="{sizeChange: handleTableSizeChange, currentPageChange: handleTableCurrentChange}" :option="thePaginationOpt" :data="tableOptions.newOneData">
        <el-pagination
          background
          @size-change="handleTableSizeChange"
          @current-change="handleTableCurrentChange"
          :current-page="thePaginationOpt.tableCurrentPage"
          :page-sizes="[5, 20, 50, 100, 300, 500]"
          :page-size="thePaginationOpt.tablePageSize"
          layout="total, sizes, prev, pager, next"
          :total="thePaginationOpt.tableItemTotal">
        </el-pagination>
      </slot>

    </el-row>
    <!--使用侧边操作组件-->
    <the-patch-deal :patchOptions="patchDeal" :style="patchDealStyle"></the-patch-deal>

    <!--编辑操作对话款-->
    <el-dialog
      title="编辑"
      :visible.sync="editBox.visible"
      :width="editBoxOpts.width"
      :close-on-click-modal="false">
      <!--建立一个插槽供父组件补充，并将编辑操作的数据对像暴露到scope的data中-->
      <slot name="editForm" :data="tableOptions.editData">
        <el-form :model="tableOptions.editData" label-width="80px">
          <el-form-item v-for="(cl, index) in editableColumn" :key="index" :label="cl.label">
            <el-input v-model="tableOptions.editData[cl.prop]"></el-input>
          </el-form-item>
        </el-form>
      </slot>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBox.visible = false">取 消</el-button>
        <el-button type="primary" @click="editBoxConfirm">确 认</el-button>
      </div>
    </el-dialog>

    <!--新建操作对话框-->
    <el-dialog
      title="新建"
      :visible.sync="newOneBox.visible"
      :close-on-click-modal="false"
      :width="newOneBoxOpts.width">

      <!--建立一个插槽供父组件补充，并将新建操作的数据对像暴露到scope的data中-->
      <slot name="newOneForm" :data="tableOptions.newOneData">
        <el-form :model="tableOptions.newOneData" label-width="80px">
          <el-form-item v-for="(cl, index) in editableColumn" :key="index" :label="cl.label">
            <el-input v-model="tableOptions.newOneData[cl.prop]"></el-input>
          </el-form-item>
        </el-form>
      </slot>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newOneBox.visible = false">取 消</el-button>
        <el-button type="primary" @click="newOneBoxConfirm">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ThePatchDeal from './ThePatchDeal'
import RESTfulReq from '../utils/RESTful-request'
import TableDataUtil from '../utils/table-data'
import { Message } from 'element-ui'

export default {
  name: 'TheManageTable',
  components: {
    ThePatchDeal,
    VNodeRender: {
      props: {
        expressNode: {
          type: Object | Function
        }
      },
      render: function (createElement) {
        if (typeof (this.expressNode) === 'object') {
          return this.expressNode
        }
        if (typeof (this.expressNode) === 'function') {
          return this.expressNode(createElement)
        }
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
          width: '30%'
        }
      }
    },
    newOneBoxSuccess: {
      type: Function,
      default: function (response, payload) {
      }
    },
    newOneBoxBeforeConfirm: {
      default: function () {
        return function () {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      },
      validator: function (value) {
        return value() instanceof Promise
      }
    },
    editBoxOpts: {
      type: Object,
      default: function () {
        return {
          width: '30%'
        }
      }
    },
    editBoxSuccess: {
      type: Function,
      default: function (response, payload) {
      }
    },
    editBoxBeforeConfirm: {
      default: function () {
        return function () {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      },
      validator: function (value) {
        return value() instanceof Promise
      }
    },
    modifyReqOverride: {
      type: Function
    },
    newOneReqOverride: {
      type: Function
    },
    colShowSetBtn: {
      type: Boolean,
      default: true
    },
    patchDealStyle: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  mounted: function () {
  },
  beforeMount: function () {
    this.tableDataReq()
    this.patchDeal.ops = this.ops
    const thisView = this
    this.columns.forEach(function (item, index, arr) {
      thisView.$set(thisView.colShow, index, true)
    })
  },
  data: function () {
    let theTab = this
    return {
      isIndeterminate: false,
      colShowCheckAll: true,
      colShow: {},
      colShowSettingVisible: false,
      // 表格
      networkReq: new RESTfulReq(theTab.srcUrl),
      tableOptions: {
        columns: function () {
          return theTab.tableVisibleColumn
        },
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
        tableItemTotal: 1
      },
      // 顶部查询区域
      searchOperateData: {},
      // 操作区
      patchDeal: {
        ops: this.ops,
        opEvent: {
          edit: function (e) {
            if (theTab.checkSelected()) {
              if (theTab.tableOptions.tableSelected.length !== 1) {
                theTab.$message({
                  message: '请仅选择一项',
                  type: 'warning'
                })
              } else {
                theTab.editBoxToggle()
                theTab.tableOptions.editData = JSON.parse(JSON.stringify(theTab.tableOptions.tableSelected[0]))
              }
            }
          },
          newOne: function (e) {
            theTab.newOneBoxToggle()
          },
          enable: function (e) {
            if (theTab.checkSelected()) {
              let tableDataUtil = new TableDataUtil(theTab.tableOptions.tableSelected)
              theTab.tableOptions.tableSelected = tableDataUtil.changeColumnValue('status', '1')
              theTab.modifyReq(theTab.tableOptions.tableSelected)
            }
          },
          disable: function (e) {
            if (theTab.checkSelected()) {
              let tableDataUtil = new TableDataUtil(theTab.tableOptions.tableSelected)
              theTab.tableOptions.tableSelected = tableDataUtil.changeColumnValue('status', '0')
              theTab.modifyReq(theTab.tableOptions.tableSelected)
                .then(function (response) {

                })
            }
          },
          delete: function (e) {
            if (theTab.checkSelected()) {
              theTab.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                theTab.deleteReq()
              })
            }
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
    handleColShowCheckAllChange: function (val) {
      const thisView = this
      this.columns.forEach(function (item, index, arr) {
        thisView.$set(thisView.colShow, index, val)
      })
      this.isIndeterminate = false
    },
    handleColShowChange: function (val, index) {
      this.colShow[index] = val
      let trueCount = 0
      let falseCount = 0
      for (let colState in this.colShow) {
        trueCount += this.colShow[colState] ? 1 : 0
        falseCount += this.colShow[colState] ? 0 : 1
      }
      this.colShowCheckAll = (falseCount === 0)
      this.isIndeterminate = !(trueCount === 0 || falseCount === 0)
    },
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
        })
        .then(function (response) {
          theTab.tableOptions.tableData = response.data.data.rows
          theTab.thePaginationOpt.tableItemTotal = response.data.data.total
          theTab.tableOptions.loading = false
        })
    },
    /**
       * post，新建一个条目
       */
    newOneReq: function (reqData = this.tableOptions.newOneData) {
      let theTab = this
      theTab.tableOptions.loading = true
      if (theTab.newOneReqOverride) {
        theTab.newOneReqOverride(reqData)
          .then(function (response) {
            theTab.tableOptions.tableData.push(response.data.data)
            theTab.tableOptions.loading = false
            theTab.thePaginationOpt.tableItemTotal += 1
            theTab.newOneBoxSuccess(response, theTab.tableOptions.newOneData)
            theTab.tableDataReq()
          })
      } else {
        theTab.networkReq.postReq(reqData)
          .then(function (response) {
            theTab.tableOptions.tableData.push(response.data.data)
            theTab.tableOptions.loading = false
            theTab.thePaginationOpt.tableItemTotal += 1
            theTab.newOneBoxSuccess(response, theTab.tableOptions.newOneData)
            theTab.tableDataReq()
          })
      }

      theTab.newOneBoxToggle(false)
    },
    modifyReq: function (reqData = this.tableOptions.editData) {
      let theTab = this
      theTab.tableOptions.loading = true
      if (theTab.modifyReqOverride) {
        theTab.modifyReqOverride(reqData)
          .then(function (response) {
            theTab.tableOptions.loading = false
            theTab.editBoxSuccess(response, reqData)
            theTab.tableDataReq()
          })
      } else {
        theTab.networkReq.putReq(reqData)
          .then(function (response) {
            theTab.tableOptions.loading = false
            theTab.editBoxSuccess(response, reqData)
            theTab.tableDataReq()
          })
      }
      theTab.editBoxToggle(false)
    },
    deleteReq: function () {
      let theTab = this
      this.networkReq.deleteReq(
        { id: theTab.selectedIds }
      )
        .then(function (response) {
          theTab.thePaginationOpt.tableItemTotal -= theTab.tableOptions.tableSelected.length
          let tableDataUtil = new TableDataUtil()
          theTab.tableOptions.tableData = tableDataUtil.diffByColumn(theTab.tableOptions.tableData, 'id', theTab.tableOptions.tableSelected, 'id')
        })
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
    handleContentExp: function (val, callBack, row) {
      return callBack(val, this.$createElement, row)
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
          ...theTab.searchOperateData
        })
        .then(function (response) {
          theTab.tableOptions.tableData = response.data.data.rows
          theTab.thePaginationOpt.tableItemTotal = response.data.data.total
          theTab.tableOptions.loading = false
        })
    },

    checkSelected: function () {
      let theTab = this
      if (theTab.tableOptions.tableSelected.length === 0) {
        theTab.$message({
          message: '请至少选择一项',
          type: 'warning'
        })
        return false
      }
      return true
    },
    editBoxConfirm: function () {
      let theTab = this
      theTab.editBoxBeforeConfirm().then(function (response) {
        theTab.modifyReq()
      }).catch(function (err) {
        Message({
          //  饿了么的消息弹窗组件,类似toast
          showClose: true,
          message: err,
          type: 'error'
        })
      })
    },
    newOneBoxConfirm: function () {
      let theTab = this
      theTab.newOneBoxBeforeConfirm().then(function (response) {
        theTab.newOneReq()
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
      return selectedId.getColumn('id')
    },
    editableColumn: function () {
      let ret = []
      this.columns.forEach(function (ele) {
        if (ele.editable) {
          ret.push(ele)
        }
      })
      return ret
    },
    tableVisibleColumn: function () {
      let ret = []
      this.columns.forEach(function (element) {
        if (element.tableVisibility !== false) {
          ret.push(element)
        }
      })
      return ret
    }
  },
  watch: {
    columns: function () {
      const thisView = this
      this.columns.forEach(function (item, index, arr) {
        thisView.$set(thisView.colShow, index, true)
      })
    },
    srcUrl: function (newVal, oldVal) {
      this.networkReq.setReqUrl(newVal)
      this.tableDataReq()
    }
  }
}
</script>

<style>
  .col-hide {
    display: none;
  }
</style>
