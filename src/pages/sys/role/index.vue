<template>
	<d2-container>
		<template slot="header">
			<el-row :gutter="20">
				<el-col :span="5">
					<el-input
						size="mini"
						placeholder="请输入角色名称"
						v-model="queryParam.roleName"
						clearable>
					</el-input>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" size="mini" icon="el-icon-search" @click="pageSearch">搜索</el-button>
				</el-col>
				<el-col :span="17">
					<el-button type="primary" style="float: right" size="mini" icon="el-icon-plus" @click="openDialog">新增</el-button>
				</el-col>
			</el-row>
		</template>
		<d2-crud
			ref="d2Crud"
			:columns="columns"
			:data="data"
			:rowHandle="rowHandle"
			:loading="loading"
			:options="options"
			@custom-emit-roleInfo="handleEditEvent"
			@custom-emit-remove="handleRemoveEvent"
			@custom-emit-permission="handlePermissionEvent"/>
		<template slot="footer">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page.sync="queryParam.page"
				:page-sizes="[10,20,30,50]"
				:page-size="queryParam.size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</template>
		<el-dialog
			:title="dialogTitle"
			:visible.sync="dialogVisible"
			@close="formClean"
			width="30%">
			<el-form ref="roleForm" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form.description"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSubmit">确定</el-button>
					<el-button @click="formClean">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog
			title="权限"
			:visible.sync="dialogMenuVisible"
			width="30%">
			<el-tree :data="treeData"
			         :props="defaultProps"
			         :default-checked-keys="roleMenuIds"
			         show-checkbox
			         node-key="id"
			         ref="menuTree"></el-tree>
			<el-row>
				<el-col :span="24">
					<el-button style="float: right; margin: 10px 10px" type="primary" icon="el-icon-search" @click="updatePermission">授权</el-button>
				</el-col>
			</el-row>
		</el-dialog>
	</d2-container>
</template>

<script>
import { search, getInfo, removeRole, addRole, editRole, getRoleMenu, updatePermission } from '@/api/sys/role'
import { getTree } from '@/api/sys/menu'
export default {
	data () {
		return {
			queryParam: {
				roleName: '',
				page: 1,
				size: 10
			},
			total: 0,
			data: [],
			loading: false,
			dialogVisible: false,
			dialogTitle: '',
			dialogMenuVisible: false,
			formStatus: '',
			treeData: [],
			roleMenuIds:[],
			roleId: undefined,
			defaultProps: {
				children: 'children',
				label: 'name'
			},
			form: {
				id: undefined,
				name: '',
				description: ''
			},
			rules: {
				name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' },
					{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
				]
			},
			columns: [
				{
					title: 'id',
					key: 'id',
					width: '0'
				},
				{
					title: '名称',
					key: 'name',
				},
				{
					title: '备注',
					key: 'description'
				}
			],
			rowHandle: {
				minWidth: 120,
				custom: [
					{
						size: 'mini',
						text: '编辑',
						type: 'primary',
						emit: 'custom-emit-roleInfo',
						icon: 'el-icon-edit'
					},
					{
						size: 'mini',
						text: '删除',
						type: 'danger',
						emit: 'custom-emit-remove',
						icon: 'el-icon-delete'
					},
					{
						size: 'mini',
						text: '权限',
						emit: 'custom-emit-permission',
						icon: 'el-icon-tickets'
					}
				]
			},
			options: {
				stripe: true,
				highlightCurrentRow: true
			},
			pagination: {
				pageSize: 5,
				layout: 'sizes, prev, pager, next, jumper, ->, total, slot'
			}
		}
	},
	methods: {
		pageSearch () {
			this.loading = true
			search(this.queryParam).then(res => {
				this.data = res.records
				this.total = res.total
				this.loading = false
			})
		},
		handleSizeChange (val) {
			this.queryParam.size = val
			this.pageSearch()
		},
		handleCurrentChange (val) {
			this.queryParam.page = val
			this.pageSearch()
		},
		handleRemoveEvent ({index, row}) {
			this.$confirm('确定删除该角色吗, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				removeRole(row.id).then(res => {
					this.$message({
						showClose: true,
						message: '删除成功',
						center: true,
						type: 'success'
					})
					this.pageSearch()
				})
			})
		},
		handleEditEvent ({index, row}) {
			getInfo(row.id).then(res => {
				this.form = res
				this.dialogVisible = true
				this.formStatus = 'update'
			})
		},
		handlePermissionEvent ({index, row}) {
			getRoleMenu(row.id).then(res => {
				this.dialogMenuVisible = true
				this.roleMenuIds = res
				this.roleId = row.id
			})
		},
		handleSubmit () {
			if(this.formStatus === 'create') {
				this.addRole()
			} else {
				this.editRole()
			}
		},
		addRole () {
			this.$refs['roleForm'].validate((valid) => {
				if (valid) {
					addRole(this.form).then(res => {
						this.$message({
							showClose: true,
							message: '添加成功',
							center: true,
							type: 'success'
						})
						this.formClean()
						this.pageSearch()
					})
				} else {
					return false;
				}
			});
		},
		editRole () {
			this.$refs['roleForm'].validate((valid) => {
				if (valid) {
					editRole(this.form.id, this.form).then(res => {
						this.$message({
							showClose: true,
							message: '编辑成功',
							center: true,
							type: 'success'
						})
						this.formClean()
						this.pageSearch()
					})
				} else {
					return false
				}
			});
		},
		formClean () {
			this.dialogVisible = false
			this.$refs['roleForm'].resetFields()
		},
		openDialog () {
			this.dialogVisible = true
			this.formStatus = 'create'
		},
		getMenuTree () {
			getTree().then(res => {
				this.treeData = res
			})
		},
		updatePermission () {
			if (this.roleId) {
				let menuCheckIds = this.$refs.menuTree.getCheckedKeys()
				let menuIds = []
				menuCheckIds.forEach(function(menuId) {
					menuIds.push({menuIds: menuId})
				})
				console.log(menuIds)
				updatePermission(this.roleId, menuCheckIds).then(res => {
					this.$message({
						showClose: true,
						message: '授权成功',
						center: true,
						type: 'success'
					})
          this.dialogMenuVisible = false
        })
      }
    }
  },
  mounted () {
    this.pageSearch()
    this.getMenuTree()
  },
  watch: {
    formStatus (status) {
      if (status === 'create') {
        this.dialogTitle = '新增'
      } else {
        this.dialogTitle = '编辑'
      }
    }
  }
}
</script>
