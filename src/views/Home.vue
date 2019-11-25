<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo"></div>

        <h3>后台管理系统</h3>
        <div class="logout">
          欢迎你：admin
          <a href="javascript:;" @click="logout">退出</a>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu
            unique-opened
            :default-active="defaultActive"
            router
            background-color="#1D2531"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu :index="subMenu.path" v-for="subMenu in menuList" :key="subMenu.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{subMenu.authName}}</span>
              </template>

              <el-menu-item :index="item.path" v-for="item in subMenu.children" :key="item.id">
                <i class="el-icon-location"></i>
                {{item.authName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  data () {
    return {
      menuList: []
    }
  },

  async created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.menuList = data
      console.log(this.menuList)
    }
  },

  methods: {
    async logout () {
      try {
        await this.$confirm('你确定要退出吗？', '提示', {
          type: 'warning'
        })
        this.$router.push('/login')
        localStorage.removeItem('token')
        this.$message.success('退出成功')
      } catch {
        this.$message.info('操作取消')
      }
    }
  },

  computed: {
    defaultActive () {
      return this.$route.path.slice(1)
    }
  }
}
</script>

<style lang = "less" scoped>
.home {
  height: 100%;

  .el-header {
    display: flex;
    background: #545c64;
    .logo,
    .logout {
      width: 180px;
      /* background-color: orangered; */
    }
    .logo {
      background: url("../assets/22.png") no-repeat 44px center;
      background-size: contain;
    }

    h3 {
      flex: 1;
      text-align: center;
      color: rgb(255, 255, 255);
      font-size: 38px;
      font-weight: 100;
      line-height: 65px;
      font-family: "方正像素12";
    }
    .logout {
      text-align: center;
      line-height: 62px;
      color: white;
      a {
        color: rgb(232, 230, 238);
      }
      a:hover {
        color: #00a8ff;
      }
    }
  }
  .el-container {
    height: 100%;
  }

  .el-aside {
    background-color: #222c3c;
    .el-submenu {
      width: 200px;

      .el-menu-item {
        box-shadow: inset 3px 0 0 0 #00a8ff;
      }
    }
  }

  .el-main {
    background-color: #eaeef1;
  }
}
</style>
