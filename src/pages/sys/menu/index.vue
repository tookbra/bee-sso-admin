<template>
  <d2-container>
    <template slot="header">
      <el-button-group>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addMenuPre">新 增</el-button>
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="editMenu">编 辑</el-button>
        <el-button size="mini" type="primary" icon="el-icon-delete" @click="removeMenu">删 除</el-button>
      </el-button-group>
    </template>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-tree :data="treeData"
                 :props="defaultProps"
                 node-key="id"
                 @node-click="getMenuInfo"
                 ref="menuTree" draggable></el-tree>
      </el-col>
      <el-col :span="18">
        <el-form :model="form" ref="menuForm" :rules="rules" label-width="80px" :disabled="formDisabled">
          <el-form-item label="父级菜单">
            <el-input v-model="form.parentName" placeholder="请输入父级菜单" :disabled="true"></el-input>
            <el-input v-model="form.parentId" v-show="false"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
            <el-input v-model="form.id" v-show="false"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="permission" placeholder="请输入权限标识">
            <el-input v-model="form.permission"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <d2-icon-select v-model="form.icon"/>
          </el-form-item>
          <el-form-item label="url" prop="url">
            <el-input v-model="form.url" placeholder="请输入url"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择菜单类型">
              <el-option v-for="item in typeOptions" :key="item" :label="item | typeFilter" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="0" placeholder="请输入序号"></el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="form.state" placeholder="请选择菜单状态">
              <el-option v-for="item in stateOptions" :key="item" :label="item | stateFilter" :value="item"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- footer -->
    <template slot="footer" v-if="formStatus == 'create'">
      <div style="margin:-5px; text-align:center">
        <el-button size="small" @click="onCancel" icon="el-icon-close">取消</el-button>
        <el-button size="small" type="primary" @click="addMenu" icon="el-icon-check">保 存</el-button>
      </div>
    </template>
    <template slot="footer" v-if="formStatus == 'update'">
      <div style="margin:-5px; text-align:center">
        <el-button size="small" @click="onCancel" icon="el-icon-close">取消</el-button>
        <el-button size="small" type="primary" @click="updateMenu" icon="el-icon-check">更 新</el-button>
      </div>
    </template>
  </d2-container>
</template>

<script>
import { getTree, getMenuInfo, delMenu, updateMenu, addMenu } from '@/api/sys/menu'
export default {
  data () {
    return {
      treeData: [],
      formDisabled: true,
      form: {
      	id: undefined,
        name: '',
        parentId: 0,
        parentName: '',
        permission: '',
        icon: '',
        url: '',
        type: undefined,
        sort: undefined,
        state: true
      },
	    rules: {
		    name: [
			    { required: true, message: '请输入菜单名称', trigger: 'blur' },
			    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
		    ],
		    permission: [
			    { required: true, message: '请输入权限标识', trigger: 'blur' },
			    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
		    ],
		    url: [
			    { required: true, message: '请输入url地址', trigger: 'blur' },
			    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
		    ],
		    type: [
			    { required: true, message: '请选择菜单类型', trigger: 'change' }
		    ]
	    },
	    typeOptions: [0, 1],
	    stateOptions: [true, false],
      menuId: undefined,
	    formStatus: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
	filters: {
		typeFilter (type) {
			const typeMap = {
				0: '菜单',
				1: '按钮'
			}
			return typeMap[type]
		},
		stateFilter (type) {
			const typeMap = {
				true: '启用',
				false: '关闭'
			}
			return typeMap[type]
		}
	},
  methods: {
    getTreeList () {
      getTree().then(res => {
        this.treeData = res
      })
    },
    getMenuInfo (data) {
    	if (data.id === this.menuId) {
    		return
      }
	    getMenuInfo(data.id).then(res => {
	    	this.form = res
        this.menuId = res.id
		    let parent = this.$refs.menuTree.getNode(data.pid)
        if (parent) {
        	this.form.parentName = parent.data.name
        } else {
        	this.form.parentName = '根节点'
	        this.form.parentId = 0
        }
        if (this.formStatus === 'create') {
	        this.editMenu()
        }
      })
    },
	  onCancel () {
    	this.formDisabled = true
		  this.formStatus = ''
	  },
	  editMenu () {
		  if (this.form.id) {
		  	this.formDisabled = false
			  this.formStatus = 'update'
		  }
	  },
    removeMenu () {
	    if (this.form.id) {
		    this.$confirm('确定删除该菜单吗, 是否继续?', '提示', {
			    confirmButtonText: '确定',
			    cancelButtonText: '取消',
			    type: 'warning'
		    }).then(() => {
			    delMenu(this.form.id).then(res => {
			    	this.getTreeList()
				    this.$message({
					    showClose: true,
					    message: '删除成功',
					    center: true,
					    type: 'success'
				    })
			    })
		    }).catch(() => {})
	    }
    },
    updateMenu () {
    	let vm = this
	    if (this.form.id) {
	    	this.validateForm(function () {
			    vm.$confirm('确定更新该菜单吗, 是否继续?', '提示', {
				    confirmButtonText: '确定',
				    cancelButtonText: '取消',
				    type: 'warning'
			    }).then(() => {
				    updateMenu(vm.form.id, vm.form).then(res => {
					    vm.getTreeList()
					    vm.cleanMenu()
					    vm.onCancel();
					    vm.$message({
						    showClose: true,
						    message: '更新成功',
						    center: true,
						    type: 'success'
					    })
				    })
			    }).catch(() => {})
		    })
	    }
    },
	  addMenuPre () {
		  this.cleanMenu()
		  this.formDisabled = false
		  this.formStatus = 'create'
    },
	  addMenu () {
    	let vm = this
		  this.validateForm(function () {
			  vm.$confirm('确定添加该菜单吗, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
			  }).then(() => {
			  	console.log(vm.form)
				  addMenu(vm.form).then(res => {
					  vm.getTreeList()
					  vm.cleanMenu()
					  vm.onCancel()
					  vm.$message({
						  showClose: true,
						  message: '添加成功',
						  center: true,
						  type: 'success'
					  })
				  })
			  }).catch(() => {})
		  })
	  },
    cleanMenu () {
    	this.form.id = undefined
    	this.form.name = ''
    	this.form.parentId = 0
    	this.form.parentName = ''
    	this.form.permission = ''
    	this.form.icon = ''
    	this.form.url = ''
    	this.form.type = 0
    	this.form.sort = undefined
    	this.form.state = true
    },
	  allowDrag(draggingNode) {
		  return draggingNode.data.pid !== 0
	  },
	  handleDrop (draggingNode, dropNode, dropType, ev) {
		  this.$confirm('确定把该菜单放置这里吗?', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
		  }).then(() => {
			 
		  }).catch(() => {
			
		  })
	  },
	  validateForm (callback) {
		  this.$refs['menuForm'].validate((valid) => {
			  if (valid) {
				  callback()
			  } else {
				  return false
			  }
		  })
	  }
  },
  mounted () {
    this.getTreeList()
  }
}
</script>
