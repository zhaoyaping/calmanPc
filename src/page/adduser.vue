<template>
    <div>
        <p class="add">{{title}}</p>
        <div class="input">
            <el-form :model="addForm" label-width="90px" :rules="addFormRules" ref="addForm">
                <el-form-item label="公司名称：" prop="name">
                    <el-input v-model="addForm.name" placeholder="请输入公司名称（中文，英文，数字2-20位）"></el-input>
                </el-form-item>
                <el-form-item label="客户账号：" prop="userId">
                    <el-input id="user" v-model="addForm.userId" placeholder="请输入客户账号（英文数字下划线5-20位）"></el-input>
                </el-form-item>
                <el-form-item label="联系人：" prop="contacts">
                    <el-input v-model="addForm.contacts" placeholder="请输入联系人（中文，英文，数字2-10位）"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="tel">
                    <el-input v-model="addForm.tel" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="地址：" prop="address">
                    <el-input v-model="addForm.address" placeholder="请输入地址（2-32位）"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100px; margin-left:35%!important" @click="add('addForm')">提交</el-button>
                </el-form-item>
            </el-form>
             
        </div>
    </div>
</template>
<script>
import local from '@/API/local.js'
export default {
    name: 'Adduser',
    data() {
        // 验证名字
        let checkName = (rule, value, callback) => {
            let regName = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/  
            if (!value) {
                return callback(new Error('公司名字不能为空'))
            } else if (!(regName.test(value))) {
                return callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }
        // 验证账号
        let checkUser = (rule, value, callback) => {
            let regUser = /^[a-zA-Z0-9_]{3,20}$/  
            if (!value) {
                return callback(new Error('账号不能为空'))
            } else if (!(regUser.test(value))) {
                return callback(new Error('格式不正确!'))
            } else {
                callback()
            }
        }
        // 验证联系人
        let checkContacts = (rule, value, callback) => {
            let regContacts = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/  
            if (!value) {
                return callback(new Error('联系人不能为空'))
            } else if (!(regContacts.test(value))) {
                return callback(new Error('格式不正确!'))
            } else {
                callback()
            }
        }
        // 验证手机号
        let checkTel = (rule, value, callback) => {
            let regContacts = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
            if (!value) {
                return callback(new Error('手机号不能为空!'))
            } else if (!(regContacts.test(value))) {
                return callback(new Error('格式不正确！'))
            } else {
                callback()
            }
        }
        // 验证地址
        let checkAddress = (rule, value, callback) => {
            let regAddress = /^[^\'\"]{2,32}$/ 
            if (!value) {
                return callback(new Error('地址不能为空!'))
            } else if (!(regAddress.test(value))) {
                return callback(new Error('格式不正确,不能输入\'或\"'))
            } else {
                callback()
            }
        }
        return {
            title: '',
            prompt: '',
            msg: '',
            addForm: {
                name: this.$route.query.name,
                userId: this.$route.query.username,
                contacts: this.$route.query.contacts,
                tel: this.$route.query.tel,
                address: this.$route.query.address
            },
            addFormRules: {
                name: [
                    {required: true, validator: checkName, trigger: 'blur'}
                ],
                userId: [
                    {required: true, validator: checkUser, trigger: 'blur'}
                ],
                contacts: [
                    {required: true, validator: checkContacts, trigger: 'blur'}
                ],
                tel: [
                    {required: true, validator: checkTel, trigger: 'blur'}
                ],
                address: [
                    {required: true, validator: checkAddress, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        add(fromName) {
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
            // 如果是从用户列表跳转过来的，就发送修改的请求
            if (this.$route.query.name) {
                let data = {
                    'id': _this.$route.query.id,
                    'name': _this.addForm.name,
                    'username': _this.addForm.userId,
                    'contacts': _this.addForm.contacts,
                    'tel': _this.addForm.tel,
                    'address': _this.addForm.address
                }
                $.post(local.localhost + '/index.php/Home/User/SetUser',data).then(function(response) {
                    if (response.status == '1') {
                        // 执行成功后再跳转回到用户列表界面
                        _this.$router.push({path: '/manageuser'})
                    } else if(response.status == '-1') {
                        _this.$message.error(response.msg);
                        _this.$router.push({path: '/login'})  
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(function(error) {
                })
                // 如果不是从用户列表跳转过来的，就发送添加的请求                
            } else {
                let data = {
                    'name': _this.addForm.name,
                    'username': _this.addForm.userId,
                    'contacts': _this.addForm.contacts,
                    'tel': _this.addForm.tel,
                    'address': _this.addForm.address
                }
                $.post(local.localhost + '/index.php/Home/User/AddUser',data).then(function(response) {
                    if (response.status == '1') {
                        // 执行成功后跳转到用户列表界面
                        _this.$message(response.msg);
                        _this.$router.push({path: '/manageuser'})
                    } else if(response.status == '-1') {
                        _this.$message.error(response.msg);
                        _this.$router.push({path: '/login'})  
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(function(error) {
                }) 
            }
            
        }
    },
    mounted() {
        if (this.$route.query.name) {
            this.title = '客户编辑'
            $("#user").attr("readOnly","true");
        } else {
            this.title = '新增客户'
        }
        // 获取到用户列表页面传过来的参数，在表单中渲染出来
        // this.addForm.name = this.$route.query.name
        // this.addForm.userId = this.$route.query.username
        // this.addForm.contacts = this.$route.query.contacts
        // this.addForm.tel = this.$route.query.tel
        // this.addForm.address = this.$route.query.address
    }
}
</script>

<style>
.add {
    height: 50px;
    width: 100%;
    line-height: 50px;
    background: rgb(238, 235, 235);
    text-align: center;
    margin-bottom: 50px    
}

.input {
    width: 35%;
    margin: 0 auto;
}

.el-form-item__label {
    padding: 0 8px 0 0!important;
}


</style>


