<template>
    <div class="roles">
       <el-breadcrumb >
  <el-breadcrumb-item to="/users">首页</el-breadcrumb-item>
   <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>

<el-button type="success" plain @click = "addVisible = true" >添加角色</el-button>

  <el-table :data="roleList" style="width: 95%">
      <el-table-column type="expand">
        <template v-slot="{row}">
             <el-row class="one" v-for = "one in row.children" :key="one.id">
                 <el-col :span = "4">
                   <el-tag  @close = "delRight(row,one.id)" closable >{{one.authName}}</el-tag>
                 </el-col>
                 <el-col :span="20">

                       <el-row class="two" v-for = "two in one.children" :key="two.id">
                           <el-col :span = "4">
                                  <el-tag @close = "delRight(row,two.id)" type="success"  closable >{{two.authName}}</el-tag>
                           </el-col>

                                 <el-col  :span = "20" >
                                       <el-tag @close = "delRight(row,three.id)" class="three"  closable  type="warning" v-for= "three in two.children" :key = "three.id">{{three.authName}}</el-tag>

                           </el-col>

                       </el-row>
                 </el-col>
             </el-row>
        </template>

      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column  label="操作">
      <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" @click ="showEdit(row)" circle plain size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            size="mini"
            @click="del(row.id)"
          ></el-button>
          <el-button @click= "showAssignDialog(row)" type="success" icon="el-icon-edit"  round plain size="mini">分配权限</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog title="分配权限" :visible.sync="assignVisible" width="30%">
 <el-tree
  :data="data"
  show-checkbox
  default-expand-all
  node-key="id"
  ref="tree"

  :props="defaultProps">
</el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="assignVisible = false">取 消</el-button>
    <el-button type="primary" @click = "assignRights">确 定</el-button>
  </span>
</el-dialog>

 <el-dialog title="修改角色" :visible.sync="editVisible" width="35%">
  <el-form :model="editForm" ref = "editForm" label-width="80px"  status-icon :rules="rules">

        <el-form-item label="角色名称"  prop="roleName" >
      <el-input v-model="editForm.roleName" placeholder="请输入角色名称"  autocomplete="off"></el-input>
    </el-form-item>

        <el-form-item label="角色描述"  prop="roleDesc" >
      <el-input v-model="editForm.roleDesc" placeholder="请描述角色"  autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="edit">确 定</el-button>
  </div>
</el-dialog>

 <el-dialog title="添加用户" :visible.sync="addVisible" width="35%">
  <el-form :model="form" ref = "form" label-width="80px"  status-icon :rules="rules">
    <el-form-item label="角色名称"  prop="roleName" >
      <el-input v-model="form.roleName" placeholder="请输入角色名称"  autocomplete="off"></el-input>
    </el-form-item>

        <el-form-item label="角色描述"  prop="roleDesc" >
      <el-input v-model="form.roleDesc" placeholder="请输入角色描述"  autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </div>
</el-dialog>

    </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      assignVisible: false,
      editVisible: false,
      addVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      data: [],
      roleId: '',
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: ['change', 'blur'] }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: ['change', 'blur'] }
        ]
      }
    }
  },

  created () {
    this.getRoleList()
  },

  methods: {
    async getRoleList () {
      const { meta, data } = await this.$axios.get('roles')

      if (meta.status === 200) {
        this.roleList = data
      } else {
        this.$message.error(meta.msg)
      }
    },

    async delRight (row, rightId) {
      const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        // this.getRoleList()
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },

    async showAssignDialog (row) {
      this.roleId = row.id
      this.assignVisible = true
      const { meta, data } = await this.$axios.get(`rights/tree`)
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(one => {
          one.children.forEach(two => {
            two.children.forEach(three => {
              ids.push(three.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },

    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')

      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getRoleList()
        this.assignVisible = false
      } else {
        this.$message.error(meta.msg)
      }
    },

    showEdit (row) {
      this.editVisible = true
      this.editForm = { ...row }
    },

    async edit () {
      await this.$refs.editForm.validate()
      const { meta } = await this.$axios.put(`roles/${this.editForm.id}`, this.editForm)
      if (meta.status === 200) {
        this.$message.success('修改成功')
        this.$refs.editForm.resetFields()
        this.editVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },

    async del (id) {
      try {
        await this.$confirm('你确定要删除该角色吗?', '提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        }
      } catch {
        this.$message.info('已取消删除')
      }
    },

    async add () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('roles', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.$refs.form.resetFields()
          this.addVisible = false
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    }

  }

}
</script >

<style lang="less" >
.roles{

   .el-table{
       margin-top:20px;
       .one{
            margin-bottom:10px;
             border-bottom: 1px dashed #ccc;
       }
            .two{
            margin-bottom:10px;

       }
            .three{
            margin-bottom:10px;
               margin-right: 5px;
       }
   }

   }
</style>
