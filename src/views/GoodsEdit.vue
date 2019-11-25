<template>
<div class="goodsedit">
  <el-card class="box-card">
 <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <el-tabs v-model="activeTab" tab-position="left" @tab-click="handleClick">
      <el-tab-pane name="0" label="基本信息">
        <el-form :model="form" ref="form" label-width="80px" status-icon>
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>

          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>

          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>

          <el-form-item label="商品分类">
            <el-cascader clearable v-model="form.goods_cat" :options="options" :props="props"></el-cascader>
          </el-form-item>

          <el-form-item label="是否促销">
            <el-radio-group v-model=" form.isSellGood">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <el-button @click="next" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="1" label="商品图片">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <br />
        <el-button @click="next" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="2" label="商品内容">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <br />
        <el-button type="primary" @click="addProduct">添加</el-button>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      active: 0,
      activeTab: '0',
      form: {
        id: '',
        goods_name: '',
        goods_cat: [], // 级联的分类
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        atts: [],
        isSellGood: 1
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },

  methods: {
    handleClick (tab, event) {
      this.active = +tab.index
    },

    next () {
      this.active++
      this.activeTab = this.active + ''
    },

    handleRemove (file, fileList) {
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    handleSuccess (response, file, fileList) {
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },

    async addProduct () {
      // 发送添加的ajax
      const { meta } = await this.$axios.put(`goods/id`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  },

  async created () {
    // let row = this.$route.params.row
    // this.form.id = row.goods_id
    // // console.log(row)
    // this.form.goods_name = row.goods_name
    // this.form.goods_price = row.goods_price
    // this.form.goods_number = row.goods_number
    // this.form.goods_weight = row.goods_weight
    const { meta, data } = await this.$axios.get('categories?type=3')
    if (meta.status === 200) {
      this.options = data
      // console.log(this.options)
    } else {
      this.$message.error(meta.msg)
    }
  }
}

</script>

<style>

</style>
