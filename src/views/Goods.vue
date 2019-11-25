<template>
  <div class="goods">

      <el-input placeholder="请输入内容"  @keyup.enter.native="getGoodList" v-model="query" class="input-with-select">
<el-button slot="append" icon="el-icon-search" @click= "getGoodList"   ></el-button>
  </el-input>
 <el-button type="success" plain @click = "goAdd">添加商品</el-button>

     <el-table :data="goodList" style="width: 97%">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
<el-table-column  label="创建时间">
  <template v-slot="{row}">
   <p>{{row.add_time | time}}</p>
  </template>
</el-table-column>
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodList: [],
      pagesize: 10,
      pagenum: 1,
      total: 0,
      query: '',
      editGoodsForm: {
        goods_id: '',
        goods_number: '',
        goods_name: '',
        goods_price: '',
        goods_weight: ''
      }

    }
  },

  created () {
    this.getGoodList()
  },

  methods: {
    async getGoodList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.query
        }
      })
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },

    handleSizeChange (val) {
      // this.pagenum = 1
      this.pagesize = val
      this.getGoodList()
    },

    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodList()
    },

    async del (id) {
      try {
        await this.$confirm('你确定要删除吗?', '提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`goods/${id}`)

        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getGoodList()
        }
      } catch {
        this.$message.info('已取消删除')
      }
    },

    showEdit (row) {
      this.$router.push('/goodsedit', { params: { row: row } })
    },

    goAdd () {
      this.$router.push('/goodsadd')
    },

    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    }
  }
}
</script>

<style lang="less">
.goods{
  .input-with-select{
  width:300px;
   margin-bottom:20px;
   margin-right:20px;
}
  .el-table{
       margin-top:5px;
}
}
</style>
