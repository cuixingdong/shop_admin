<template>
  <div class="login">
    <div class="project-name">Vue后台管理系统</div>

    <el-form ref="form" :model="form" status-icon label-width="80px" :rules="rules">
      <img src="../assets/avatar2.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密  码" prop="password" >
        <el-input v-model="form.password" @keyup.enter.native = "login" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['change', 'blur'] },
          { min: 3, max: 10, message: '用户名只能是3-10位', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '密码只能是6-12位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
      // console.log(this.$refs.form)
    },
    login () {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$router.push('/home')
          this.$message.success('登陆成功')
        } else {
          this.$message.error('用户名或密码错误')
        }
      })
    }
  }
}
</script>

<style lang="less" >
.login {
  height: 100%;
  width: 100%;
  background: url("../assets/bg.jpg");
    overflow: hidden;
      .project-name{
        width:100%;
        font-size:38px;
        height:100px;
         color:#fff;
           line-height: 200px;
         text-align: center;

      }
  .el-form {
    background-color: #fff;
    width: 400px;
    margin: 140px auto;
    padding: 75px 40px 15px;
    border-radius: 10px;
    position: relative;
    img {
      position: absolute;
      top: -75px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
      width: 120px;
      height: 120px;
      box-shadow: 0 1px 5px #ccc;
    }
     .el-button:last-child {
      margin-left: 80px;
    }
  }
}
</style>
