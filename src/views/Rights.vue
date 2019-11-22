<template>
    <div class="rights">
       <el-breadcrumb >
  <el-breadcrumb-item to="/users">首页</el-breadcrumb-item>
   <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>

  <el-table :data="rightList" style="width: 95%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限管理"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template v-slot = "{row}">
            <p v-if = "row.level ==='0' ">一级</p>
              <p v-if = "row.level ==='1' ">二级</p>
                <p v-if = "row.level ==='2' ">三级</p>
        </template>
      </el-table-column>

    </el-table>

    </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },

  async created () {
    const { meta, data } = await this.$axios.get('rights/list')

    if (meta.status === 200) {
      this.rightList = data
      // console.log(this.rightList)
    } else {
      this.$message.error(meta.msg)
    }
  }

}
</script>

<style lang= "less" >

.el-breadcrumb{
        margin-bottom:20px;
}
.input-with-select{
  width:300px;
   margin-bottom:20px;
   margin-right:20px;
}

</style>
