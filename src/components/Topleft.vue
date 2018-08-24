<template>
    <el-container>
      <el-aside style="overflow-x:hidden!important">
        <div class="avatar">
            <span></span>
        </div>
        <div class="head">
          <p class="username">{{username}}</p>
        </div>
        <el-menu :default-active="$route.path" text-color="#fff" background-color="#036" :unique-opened="true">
          <el-submenu index='1'>
            <template slot="title" >
              <span><h3>实时监控</h3></span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/map" @click="jump('map')">
                <i class="points"></i>
                设备地图
              </el-menu-item>
              <el-menu-item index="/monitor" @click="jump('monitor')">
                <i class="points"></i>
                现场监控
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2" v-if="isShow">
            <template slot="title">
              <span><h3>项目管理</h3></span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/project" @click="jump('project')">
                <i class="points"></i>
                项目管理
              </el-menu-item>
              <el-menu-item index="/addProject" @click="jump('addProject')">
                <i class="points"></i>
                新增项目
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3" v-if="isShow">
            <template slot="title">
              <span><h3>客户管理</h3></span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/manageuser" @click="jump('manageuser')">
                <i class="points"></i>
                客户管理
              </el-menu-item>
              <el-menu-item index="/adduser" @click="jump('adduser')">
                <i class="points"></i>
                新增客户
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4" v-if="isShow">
            <template slot="title">
              <span><h3>网站设置</h3></span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/webSet" @click="jump('webSet')">
                <i class="points"></i>
                网站设置
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <span><h3>修改密码</h3></span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/password" @click="jump('password')">
                <i class="points"></i>
                修改密码
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index='6'>
            <template slot="title" >
              <span><h3 @click="dropOut">退出登录</h3></span>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside> 
      <el-container style="padding-left:200px">
        <el-header style="padding: 0" class="header">
          <span class="logo"></span>
          <span class="title">卡尔曼发电机组远程监控平台</span>
        </el-header>
        <el-main style="padding: 0!important; margin-top:100px!important">
          <router-view :key="count"></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import local from '@/API/local.js'
export default {
    name: 'Topleft',
    data () {
    return {
      username: '',
      isShow: true,
      name:this.$route.params.name,
      count: 1
    }
  },
  methods: {
    // 点击跳转
    jump(name) {
      this.$router.push({path: '/'+name})
      this.count++
    },
    // 退出登录事件
    dropOut() {
      this.$confirm('确认退出吗','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          // 点击确定后的操作
          $.post(local.localhost + '/index.php/Home/Login/LogOut').then((response) => {
            if (response.status == 1) {
              this.$router.push({path: '/Login'})
            } else if(response.status == '-1') {
                this.$message(response.msg);
                this.$router.push({path: '/login'})  
            } else {
                this.$message(response.msg);
            }
          })
      }).catch(() => {
          // 点击取消后的操作
          this.$message({
              type: 'info',
              message: '已取消退出'
          })
      })
    }
  },
  mounted() {
    // 如果不是管理员登录。隐藏掉不该出现的菜单
    console.log('par');
    this.username = window.sessionStorage.name
    if (window.sessionStorage.type != 'admin') {
      this.isShow = false
    } else {
      this.isShow = true
    }
  }
}
</script>

<style>
.header {
  height: 100px!important; 
  width: 100%;
  background: url(../assets/u371.jpg);
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  z-index: 99;
}

.el-header .title {
  color: #fff;
  font-size: 32px;
  position: relative;
  top: 40px
}

.el-header .logo {
  position: relative;
  top: 25px;
  float: left;
  display: block;
  width: 172px;
  height: 70px;
  background: url(../assets/u386.png) no-repeat; 
  background-size: 100% 100%;
}

.head {
  background: #036;
  text-align: center;
  padding-bottom: 20px;
}

.avatar {
  text-align: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #fff;
  margin: 55px auto 0;
  background: url(../assets/head.png) no-repeat;
  background-size: 100% 100%;
}

.el-aside {
  width: 200px!important;
  background: #036!important;
  position: fixed;
  top: 0;
  bottom: 0;
}

.el-aside a {
  color: #fff;  
}

.head .username {
  color: #fff;
  font-size: 18px;
  font-weight: 400
}

.el-submenu__title:hover {
  background: #369!important;
}

.el-menu-item:hover {
  background: #369!important;
}

.el-submenu {
  width: 200px!important
}

.points {
  width: 15px;
  height: 15px;
  display: inline-block;
  border-radius: 50%;
  background: #fff
}


</style>


