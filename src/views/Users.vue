<template>
  <div class="users">

    <el-breadcrumb >
  <el-breadcrumb-item to="/users">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

  <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
<el-button slot="append" icon="el-icon-search" @click= "search"></el-button>
  </el-input>
    <el-button type="success" plain @click = "addVisible = true">添加用户</el-button>

    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

      <el-table-column  label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUser(row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
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
          <el-button type="success" icon="el-icon-edit" @click="showAssign(row)" round plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

      <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

 <el-dialog title="添加用户" :visible.sync="addVisible" width="35%">
  <el-form :model="form" ref = "form" label-width="80px"  status-icon :rules="rules">
    <el-form-item label="用户名"  prop="username" >
      <el-input v-model="form.username" placeholder="请输入用户名"  autocomplete="off"></el-input>
    </el-form-item>

        <el-form-item label="密码"  prop="password" >
      <el-input v-model="form.password" placeholder="请输入密码"  autocomplete="off"></el-input>
    </el-form-item>

        <el-form-item label="邮箱"  prop="email" >
      <el-input v-model="form.email" placeholder="请输入邮箱"  autocomplete="off"></el-input>
    </el-form-item>

        <el-form-item label="手机号码"  prop="mobile" >
      <el-input v-model="form.mobile" placeholder="请输入手机号码"  autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </div>
</el-dialog>

 <el-dialog title="修改用户" :visible.sync="editVisible" width="35%">
  <el-form :model="editForm" ref = "editForm" label-width="80px"  status-icon :rules="rules">
    <el-form-item label="用户名"  >
        <el-tag type="info">{{editForm.username}}</el-tag>
    </el-form-item>

        <el-form-item label="邮箱"  prop="email" >
      <el-input v-model="editForm.email" placeholder="请输入邮箱"  autocomplete="off"></el-input>
    </el-form-item>

        <el-form-item label="手机号码"  prop="mobile" >
      <el-input v-model="editForm.mobile" placeholder="请输入手机号码"  autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="edit">确 定</el-button>
  </div>
</el-dialog>

 <el-dialog title="分配角色" :visible.sync="assignVisible" width="35%">
  <el-form :model="assignForm" ref = "assignForm" label-width="80px"  status-icon :rules="rules">
    <el-form-item label="用户名"  >
        <el-tag type="info">{{assignForm.username}}</el-tag>
    </el-form-item>

        <el-form-item label="角色列表"  prop="rid" >
       <el-select v-model="assignForm.rid" placeholder="请选择">
      <el-option
      v-for = "item in roleList"
       :label="item.roleName"
       :key = "item.id"
       :value="item.id">
       </el-option>

    </el-select>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="assignVisible = false">取 消</el-button>
    <el-button type="primary" @click="assign">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      roleList: [],
      query: '',
      pagenum: 1,
      pagesize: 5,
      total: 0,
      addVisible: false,
      editVisible: false,
      assignVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''

      },
      editForm: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      assignForm: {
        id: '',
        rid: '',
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['change', 'blur'] },
          { min: 3, max: 10, message: '用户名只能是3-10位', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '密码只能是6-12位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { pattern: /^1[3,4,5,7,8]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ],
        rid: [
          { required: true, message: '角色不能为空', trigger: ['change', 'blur'] }
        ]
      }
    }
  },

  created () {
    this.getUserList()
  },

  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
        console.log(this.userList)
      }
    },

    async del (id) {
      try {
        await this.$confirm('你确定要删除吗?', '提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`user/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
        }
      } catch {
        this.$message.info('已取消删除')
      }
    },

    async changeUser (row) {
      const { meta } = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getUserList()
      }
    },

    handleSizeChange (val) {
      // this.pagenum = 1
      this.pagesize = val
      this.getUserList()
    },

    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },

    search () {
      this.pagenum = 1
      this.getUserList()
    },

    async add () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.$refs.form.resetFields()
          this.addVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },

    showEdit (row) {
      this.editVisible = true
      this.editForm = { ...row }
    },

    async edit () {
      try {
        await this.$refs.editForm.validate()
        const { meta } = await this.$axios.put(`users/${this.editForm.id}`, this.editForm)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.$refs.editForm.resetFields()
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },

    async showAssign (row) {
      this.assignVisible = true
      this.assignForm.id = row.id
      this.assignForm.username = row.username
      const { meta, data } = await this.$axios.get(`users/${row.id}`)
      if (meta.status === 200) {
        this.assignForm.rid = data.rid
        if (data.rid === -1) {
          this.assignForm.rid = ''
        }
      }
      const res = await this.$axios.get('roles')
      if (res.meta.status === 200) {
        this.roleList = res.data
      }
      console.log(this.roleList)
    },

    async assign () {
      try {
        const { id, rid } = this.assignForm
        await this.$refs.assignForm.validate()
        const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
        // const { meta } = await this.$axios.put(`users/${this.assignForm.id}/role`, this.assignForm.rid)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          // this.$refs.assignForm.resetFields()
          this.assignVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    }
  }
}
</script>

<style lang= "less" scoped>
.el-breadcrumb{
        margin-bottom:20px;
}
.input-with-select{
  width:300px;
   margin-bottom:20px;
   margin-right:20px;
}
</style>
