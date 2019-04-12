## components
### TheFooter
页脚组件，版权信息可以放在这里
### TheHeader
页面头部
### TheManageTable
封装好翻页、选择、网络请求、操作按钮的管理表格组件，
可以使用插槽来自定义`查询`、`新建`、`编辑`操作

#### 1. 数据源
##### 1.1 需满足以下条件：
1. 可以接受`get`、`post`、`delete`、`put`请求
2. 翻页参数为`start`、`limit`
3. 返回数据形式
* GET 获取数据
``` JSON
// HTTP status 200
{
    "status": true,
    "code": 200,
    "data": {
        "rows": [
            {
                "id": 111,
                "title": "儿童",
                "thumb_img": "http://localhost:8888/src/img/thumb_pic/数据库设计v1.0.jpg",
                "content": "<p>儿童v</p>",
                "description": "",
                "keyword": "",
                "type": "1",
                "status": "1",
                "created_at": "2019-01-21 18:17:54",
                "updated_at": "2019-01-21 22:11:59"
            },
            ...
        ],
        "total": 12 //表示条目总数
    },
    "error": ""
}
```
* POST 新建条目，返回刚才POST的内容，插入数据库后会多几个字段，比如ID
    
``` JSON
// HTTP status 200
{
    "status":true,
    "code":200,
    "data":{
        "title":"233",
        "keyword":"233",
        "content":"<p>233</p>",
        "status":"1",
        "type":"1",
        "updated_at":"2019-01-22 21:09:50",
        "created_at":"2019-01-22 21:09:50",
        "id":113
    },
    "error":""
}
```
* DELETE 删除一个条目
    
``` JSON
// HTTP status 200
{"status":true,"code":200,"data":"","error":""}
```

* PUT 更新条目
    
``` JSON
// HTTP status 200
{"status":true,"code":200,"data":"","error":""}
```


#### 2. 属性
##### 2.1 :columns
配置表格列
``` JavaScript
//例：
[
    {
      prop: 'title',
      label: '标题',
      width: '200'
    },
    {
      prop: 'thumb_img',
      label: '首图',
      width: '150',
      contentExpress: function (val) {
        return '<img style="width: 100%" src="' + val + '" />'
      },
      dangerouslyUseHTMLString: true
    },
    {
      prop: 'created_at',
      label: '创建于',
      width: '180'
    }
]
```
属性名                       | 值类型     | 用途 
------                      |--------   |------
prop                        |string     |该列绑定到数据源返回的rows数据中的哪一个
label                       |string     |该列的名称
width                       |string     |该列宽度
contentExpress              |function   |自定义值表达，回调值为对应该列的数据源的值，比如返回的数据是0/1，但你想将0显示为禁用，1显示为启用。
dangerouslyUseHTMLString    |bool       |渲染方式，纯字符串渲染还是HTML渲染，使用HTML渲染会有一定的安全风险

##### 2.2 :srcUrl
绑定的数据源地址，例如：http://example:8080/art

##### 2.3 :editBoxOpts
编辑弹出框的配置，例如：{width: '80%'}
* .width[string]    
    编辑对话款的宽度，css样式
##### 2.4 :newOneBoxOpts
新建弹出框的配置，例如：{width: '80%'}
* .width[string]    
    编辑对话款的宽度，css样式
##### 2.5 :ops
左侧操作栏的按钮，例如：['edit', 'delete', 'newOne', 'refresh', 'enable', 'disable']
* 对应关系：   
  
    配置值  | 描述 
    --------|-------
    edit    |编辑按钮
    delete  |删除按钮
    newOne  |新建按钮
    refresh |刷新按钮
    enable  |启用按钮
    disable |禁用按钮
    
#### 3. 构建顶部搜索栏
输入控件v-model绑定的值对数据源中查询参数名
``` Vue
<template slot="tableOperateHeader" slot-scope="scope">
  <el-form :inline="true" :model="scope.data" class="demo-form-inline" @submit.native.prevent>
    <el-form-item label="标题">
      <el-input v-model="scope.data.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="scope.data.type" placeholder="文章分类">
        <el-option label="所有" value=""></el-option>
        <el-option
          v-for="item in $store.state.articleType"
          :key="item.id"
          :label="item.type_text"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="scope.data.status">
        <el-option label="所有" value=""></el-option>
        <el-option value="1" label="启用"></el-option>
        <el-option value="0" label="禁用"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
```

