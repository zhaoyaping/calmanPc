 <template>
    <div class="box">
        <span class="title">修改密码</span>
        <div class="pwd">  
            <el-form ref="passwordData" :model="passwordData" label-width="130px" :rules="checkpwd">
                <el-form-item label="原密码：" prop="oldPwd" :rules="[{ required: true, message: '原密码不能为空', trigger: 'blur'}]">
                    <el-input type="password" v-model="passwordData.oldPwd" placeholder="请输入原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPwd">
                    <el-input type="password" v-model="passwordData.newPwd" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码：" prop="newPwds">
                    <el-input type="password" v-model="passwordData.newPwds" placeholder="请再次输入"></el-input>
                </el-form-item>
                <p v-show="isShow" style="color:red;margin-left:100px;margin-bottom:10px">{{prompt}}</p>
                <el-form-item>
                    <el-button type="primary" @click="save('passwordData')" style="margin-left:90px!important">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import md5 from 'js-md5';
import local from '@/API/local.js'
export default {
    name: 'password',
    data() {
        let checkPass = (rule, value, callback) => {
            let regPass = /^[0-9a-zA-Z]{6,16}$/
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (!(regPass.test(value))) {
                callback(new Error('格式不正确'))
            } else {
                callback()
            }
        };
        let checkPass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.passwordData.newPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            prompt: '',
            isShow: false,
            passwordData: {
                oldPwd: '',
                newPwd: '',
                newPwds: '',
            },
            pwdkey: '',
            checkpwd: {
                newPwd: [
                    {required: true, validator: checkPass, trigger: 'blur'}
                ],
                newPwds: [
                    {required: true, validator: checkPass2, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        save(fromName) {
            let _this = this
            let flag
            _this.$refs[fromName].validate((valid) => {
                if (valid) {
                    flag = true
                } else {
                    flag = false
                }
            })
            if (!flag) {
                return false
            }
            _this.isShow = false
            // 加密原密码并大写
            let pwd1 = md5(_this.passwordData.oldPwd).toUpperCase() 
            //然后与密钥拼接
            let pwd2 = pwd1 + _this.pwdkey
            //二次加密
            let pwd3 = md5(pwd2)
            //二次加密大写转换
            let Pwd=pwd3.toUpperCase()
            let encrypt = md5(_this.passwordData.newPwd)
            let data = {'oldpwd': Pwd,'newpwd': encrypt}
            this.$confirm('确认保存吗','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.post(local.localhost + '/index.php/Home/Login/NewPwd',data).then(function(response) {
                    if (response.status == '1') {
                        _this.$message(response.msg)
                        _this.$router.push({path: '/login'})  
                    } else if(response.status == '-1') {
                        _this.$message.error(response.msg);
                        _this.$router.push({path: '/login'})  
                    } else {
                        _this.$message.error(response.msg);
                    }
                })
            }).catch(() => {
                // 点击取消后的操作
                this.$message({
                    type: 'info',
                    message: '已取消保存'
                })
            })
                
        }
    },
    mounted() {
        let _this = this;
        // 页面初始化时请求一个初始化密码
        $.post(local.localhost + '/index.php/Home/Login/pwdInit').then(function(response) {
            if (response.status == '1') {
                _this.pwdkey = response.data.pwdkey;
            } else if(response.status == '-1') {
                _this.$message.error(response.msg);
                _this.$router.push({path: '/login'})  
            } else {
                _this.$message.error(response.msg);
            }
        }).catch(function(error) {
            // alert(error)
        }) 
    }
}
</script>
<style>
.box {
    width: 100%;
    height: 100%;
}

.box .title {
    display: block;
    width: 100%;
    height: 50px;
    background: #f4f4f4;
    font-size: 25px;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid #e1e1e1;
}

.pwd {
    width: 460px;
    height: 300px;
    margin: 80px auto 0;
}
.pwd .el-input__inner {
    display: inline-block;
    width: 250px
}
</style>


