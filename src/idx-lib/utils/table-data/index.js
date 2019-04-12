class TableDataUtil {
  constructor (tableData) {
    this.targetData = tableData
  }

  /**
   * 获取某一列
   * @param columnName
   * @param targetData
   * @returns {Array}
   */
  getColumn (columnName, targetData = this.targetData) {
    let ret = []
    for (let item of targetData) {
      ret.push(item[columnName])
    }
    return ret
  }

  /**
   * 将某一列的值拼接
   * @param columnName
   * @param joinMark
   * @returns {string}
   */
  concatColumn (columnName, joinMark) {
    let columnArray = this.getColumn(columnName)
    return columnArray.join(joinMark)
  }

  /**
   * 求两个表数据tabledata中各一列之间相比较的差，保留leftTableData
   * @param leftTableData
   * @param leftColumnName
   * @param rightTableData
   * @param rightColumnName
   * @returns {*}
   */
  diffByColumn (leftTableData, leftColumnName, rightTableData, rightColumnName) {
    let rightColumnSet = new Set(this.getColumn(rightColumnName, rightTableData))
    return leftTableData.filter(row => {
      return !rightColumnSet.has(row[leftColumnName])
    })
  }

  /**
   * 修改某一列的值
   * @param columnName 需要修改列的名称或者索引
   * @param newVal 需要修改的值
   * @param tableData 可选，默认为新建对象时传入的tabledata
   * @returns {*}
   */
  changeColumnValue (columnName, newVal, tableData = this.targetData) {
    tableData.forEach(function (item, index, array) {
      array[index][columnName] = newVal
    })
    return tableData
  }
}

export default TableDataUtil
