<template>
    <div class="login" >
        <span class="logo"></span>
        <el-row style="height: 100%">  
            <el-col :span="10" class="txt">
                <p>卡尔曼发电机组远程监控平台</p>
            </el-col>
            <el-col :span="6" class="login-v" v-show="showIn">
                <div class="login-vv">
                    <h3>用户登录</h3>
                    <div class="login-inpu">
                        <!-- <p style="color:red;font-size:14px" v-show="prompt">用户名或密码不能为空</p>
                        <el-input placeholder="登录名" prefix-icon="el-icon-npz-user-o" v-model="username"></el-input>
                        <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-npz-yypassword2" v-model="password" style="margin-top:15px"></el-input>
                        <el-button type="text" style="float: right" @click="forget">忘记密码</el-button>
                        <el-button @click="login" type="primary" style="display: block; width: 100%;margin-top: 60px">登录</el-button> -->
                        <el-form :model="loginData" :rules="loginRule" ref="loginData">
                            <el-form-item prop="userName">
                                <el-input placeholder="登录名" prefix-icon="el-icon-npz-user-o" v-model="loginData.userName"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-npz-yypassword2" v-model="loginData.password"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="text" style="float: right" @click="forget">忘记密码</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="login('loginData')" type="primary" style="display: block; width: 100%">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import md5 from 'js-md5';
import local from '@/API/local.js'
export default {
    name: 'Login',
    data() {
        let checkUser = (rule, value, callback) => {
            let regUser = /^[A-Za-z0-9_]{3,20}$/
            if (!value) {
                return callback(new Error('账号不能为空'))
            } else if (!(regUser.test(value))) {
                return callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }
        let checkPwd = (rule, value, callback) => {
            let regPwd = /^[a-zA-Z0-9_]{6,16}$/
            if (!value) {
                return callback(new Error('密码不能为空'))
            } else if (!(regPwd.test(value))) {
                return callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }
        return {
            loginData: {
                userName: '',
                password: '',
            },
            pwdkey: '',
            isShow: false,
            showIn: true,
            prompt: false,
            msg: '',
            tel: '',
            loginRule: {
                userName: [
                    {required: true, validator: checkUser, trigger: 'blur'}
                ],
                password: [
                    {required: true, validator: checkPwd, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        login(fromName) {
            let flag
            this.$refs[fromName].validate((valid) => {
                if (valid) {
                    flag = true
                } else {
                    flag = false
                }
            })
            // 如果验证不通过直接返回
            if (!flag) {
                return false
            }
            //密码加密大写转换
            let pwd1 = md5(this.loginData.password).toUpperCase()
            //加密密码与密钥拼接
            let pwd2 = pwd1 + this.pwdkey
            //二次加密
            let pwd3 = md5(pwd2)
            //二次加密大写转换
            let Pwd=pwd3.toUpperCase()
            let data={'user':this.loginData.userName,'pwd':Pwd}
            // if (this.loginData.username ==  '' || this.loginData.password == '') {
            //     this.prompt = true
            // } else {
                let _this = this
                _this.prompt = false
                $.post(local.localhost + '/index.php/Home/Login/Login',data).then(function(response) {
                    if (response.status == '1') {
                        // 执行成功后跳转到主界面
                        let name = response.data.name
                        let type = response.data.utype
                        window.sessionStorage.setItem('name', name);
                        window.sessionStorage.setItem('type', type);
                        _this.$router.push({path: '/Topleft'});
                    } else if(response.status == '-1') {
                        _this.$message.error(response.msg)
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(function(error) {
                    console.log(error)
                })
            // }
        },
        // 点击忘记密码 弹出提示框
        forget() {
            this.$router.push({path: '/Prompt'})
        }
    },
    mounted() {
        let _this = this;
        // 页面初始化时请求一个初始化密码
        $.post(local.localhost + '/index.php/Home/Login/pwdInit').then(function(response) {
            if (response.status == '1') {
                _this.pwdkey = response.data.pwdkey;
            }
        }).catch(function(error) {
            console.log(error)
        }) 
    }
}
</script>

<style>

.login {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: url(../assets/u376.jpg) no-repeat; 
    background-size: 100% 100%;  
}

.login .logo {
    position: absolute;
    display: block;
    width: 172px;
    height: 70px;
    top: 50px;
    left: 150px;
    background: url(../assets/u386.png) no-repeat; 
    background-size: 100% 100%;
}

.login .txt {
    position: absolute;
    top: 50%;
    left: 12%;
    transform: translateY(-50%)
}

.login .txt p {
    color: #fff;
    font-size: 40px;
}

.login-v {
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translateY(-50%);
}

.login-v .login-vv {
    height: 370px;
    background: #fff;
}

.login-v .login-vv h3 {
    padding-left: 20px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
    color: #1B1B1B;
    border-bottom: 1px solid #d7d7d7;
}

.login-v .login-vv .login-inpu {
    padding: 30px 20px 0; 
}

/* .login .el-input {
    margin-bottom: 15px!important;
} */

.el-button {
    margin-left: 0!important;
}

</style>
