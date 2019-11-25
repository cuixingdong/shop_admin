<template>
<div class="categories">
<el-button type="success" plain @click = "showAddDialog" >添加分类</el-button>

<el-table :data="categoryList"
row-key ="cat_id"
  v-loading="loading"
style="width: 95%">

      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column  label="是否有效">
          <template v-slot="{row}">
                 {{row.cat_deleted ? '否': '是'}}
          </template>

      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
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

    <el-dialog title="添加商品分类" :visible.sync="addVisible" width="35%">
  <el-form :model="form" ref = "form" label-width="80px"  status-icon :rules="rules">
    <el-form-item label="分类名称"  prop="cat_name" >
      <el-input v-model="form.cat_name" placeholder="请输入分类名称"  autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item  label="父级名称" prop="cat_pid">
  <el-cascader
  clearable
    v-model="form.cat_pid"
    :options="options"
    :props = "props"
></el-cascader>
 </el-form-item>
</el-form>

  <div slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategory">确 定</el-button>
  </div>
</el-dialog>
</div>

</template>

<script>

export default {
  data () {
    return {
      categoryList: [],
      pagesize: 5,
      pagenum: 1,
      total: 0,
      loading: false,
      addVisible: false,
      form: {
        cat_name: '',
        cat_level: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: ['change', 'blur'] }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },

  created () {
    this.getCategoryList()
  },

  methods: {
    async getCategoryList () {
      this.loading = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
        // console.log(data.result)
      } else {
        this.$message.error(meta.msg)
      }
      this.loading = false
    },

    handleSizeChange (val) {
      // this.pagenum = 1
      this.pagesize = val
      this.getCategoryList()
    },

    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    async showAddDialog () {
      this.addVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },

    async  addCategory () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.form.cat_name,
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_level: this.form.cat_pid.length

        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.$refs.form.resetFields()
          this.addVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        this.$message.info('操作已取消')
      }
    }
  }

}
</script>

<style lang="less" >
.categories{
  .el-table{
       margin-top:20px;

  }
}
</style>
