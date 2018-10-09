<template>
    <d2-container>
        <template slot="header">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-input
                            placeholder="请输入员工姓名"
                            clearable>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </el-col>
                <el-col :span="6" :push="12">
                    <el-button type="primary" icon="el-icon-plus">新增</el-button>
                    <el-button type="primary" icon="el-icon-delete">删除</el-button>
                </el-col>
            </el-row>
        </template>
        <d2-crud
            ref="d2Crud"
            :columns="columns"
            :data="data"
            :options="options"
            selection-row/>
        <template slot="footer">
            <el-pagination
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400">
            </el-pagination>
        </template>
    </d2-container>
</template>

<script>
export default {
  name: 'user',
  data () {
    return {
      columns: [
        {
          title: '姓名',
          key: 'date',
          width: '180'
        },
        {
          title: '姓名',
          key: 'name',
          width: '180'
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      data: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      options: {
        stripe: true
      },
      pagination: {
        pageSize: 5,
        layout: 'sizes, prev, pager, next, jumper, ->, total, slot'
      }
    }
  }
}
</script>
