<template>
    <div class="webSet">
        <p class="title">网站设置</p>
        <div class="set">  
            <el-form :model="setData" label-width="130px" :rules="checkRule" ref="setData">
                <el-form-item label="提示语：" prop="tishi">
                    <el-input v-model="setData.tishi" placeholder="请输入提示语（2-20位）"></el-input>
                </el-form-item>
                <el-form-item label="客服电话：" prop="tel">
                    <el-input v-model="setData.tel" placeholder="请输入客服电话（11位数字）"></el-input>
                </el-form-item>
                <el-form-item label="设置默认密码：" prop="pwd">
                    <el-input v-model="setData.pwd" placeholder="请输入密码（英文，数字，下划线6-16位）"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="setSave('setData')" style="margin-left:130px!important">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import local from '@/API/local.js'
export default {
    name: 'webSet',
    data() {
        let checkPrompt = (rule, value, callback) => {
            let regPrompt = /^[^\'\"]{2,20}$/  
            if (!value) {
                return callback(new Error('提示语不能为空'))
            } else if (!(regPrompt.test(value))) {
                return callback(new Error('格式不正确,不能输入\'或\"'))
            } else {
                callback()
            }
        }
        let checkTel = (rule, value, callback) => {
            let regContacts = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ 
            if (!value) {
                return callback(new Error('联系电话不能为空'))
            } else if (!(regContacts.test(value))) {
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
            setData: {
                tishi: '',
                tel: '',
                pwd: ''
            },
            checkRule: {
                tishi: [
                    {required: true, validator: checkPrompt, trigger: 'blur'}
                ],
                tel: [
                    {required: true, validator: checkTel, trigger: 'blur'}
                ],
                pwd: [
                    {required: true, validator: checkPwd, trigger: 'blur'}
                ]
            },
            isShow: false,
            prompt: ''
        }
    },
    methods: {
        //点击保存的事件
        setSave(fromName) {
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
            this.$confirm('确认保存吗','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 点击确定后的操作
                let data = {'helptxt': this.setData.tishi, 'helptel': this.setData.tel, 'userpwd': this.setData.pwd}
                $.post(local.localhost + '/index.php/Home/User/SetHelp',data).then((response) => {
                    if (response.status == 1) {
                        this.$message(response.msg)
                    } else if(response.status == '-1') {
                        this.$message.error(response.msg);
                        this.$router.push({path: '/login'})  
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            }).catch(() => {
                // 点击取消后的操作
                this.$message({
                    type: 'info',
                    message: '已取消保存'
                })
            })
        },
        // 页面初始化的操作
        init() {
            // 请求到之前的提示语等信息，渲染到页面上
            $.post(local.localhost + '/index.php/Home/User/GetHelp').then((response) => {
                if (response.status == 1) {
                    this.setData.tishi = response.data.helptxt
                    this.setData.tel = response.data.helptel
                    this.setData.pwd = response.data.userpwd
                } else if(response.status == '-1') {
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    this.$message.error(response.msg);
                }
            })
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>
.webSet .title {
    height: 50px;
    width: 100%;
    line-height: 50px;
    background: rgb(238, 235, 235);
    text-align: center;
    margin-bottom: 30px
}

.webSet .set {
    width: 470px;
    height: 300px;
    margin: 50px auto 0;
}


</style>
