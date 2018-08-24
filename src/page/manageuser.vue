<template>
    <div class="manageUser">
        <div class="search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="公司名称">
                    <el-input v-model="searchData.user" placeholder="请输入要查询的公司名称" style="width:230px"></el-input>
                </el-form-item>
                <el-form-item label="客户账号">
                    <el-input v-model="searchData.username" style="width:230px"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="find">查找</el-button>
                    <el-button type="primary" @click="toAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <el-table :data="userData" :header-cell-style="{'text-align':'center'}">
            <el-table-column prop="name" label="公司名称" align="center"></el-table-column>
            <el-table-column prop="created" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="username" label="客户账号" align="center"></el-table-column>
            <el-table-column prop="address" label="地址" align="center"></el-table-column>
            <el-table-column prop="contacts" label="主要联系人" align="center"></el-table-column>
            <el-table-column prop="tel" label="主要联系人电话" align="center"></el-table-column>
            <el-table-column prop="operate" label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleRest(scope.row)">重置密码</el-button>
                    <!-- 启用停用按钮,以此用户的status来控制按钮是开或关的状态 -->
                    <div class="on" v-bind:class="{bagOn: isbagOn = scope.row.status == '1' ? true : false, bagOff: isbagOff=scope.row.status == '1' ? false : true}" @click="change(scope.$index, scope.row)">
                        <i class="point-v" v-bind:class="{pointOn: ispointOn=scope.row.status == '1' ? true : false, pointOff: ispointOff=scope.row.status == '1' ? false : true}"></i>
                    </div>
                    <i class="el-icon-edit-outline" style="cursor: pointer;color: blue" @click="handleEdit(scope.row)"></i>
                    <i class="el-icon-delete" style="cursor: pointer;color: blue" @click="handleDele(scope.$index, scope.row)"></i>
                     <!-- <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDele(scope.$index, scope.row)"></el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total">
        </el-pagination>
    </div>
</template>
<script>
import local from '@/API/local.js'
export default {
    name: 'ManageUser',
    data() {
        return {
            date: [],
            isbagOn: '',
            isbagOff: '',
            ispointOn: '',
            ispointOff: '',
            searchData: {
                user: '',
                username: '',
            },
            userData: [
                // {
                //     name: '111'
                // }
            ],
            currentPage:1,
            total: null,
            pageSize: null
        }
    },
    methods: {
        // 查找事件
        find() {
            let _this = this
            // 取到用户输入的开始时间和结束时间并转换成简化格式
            let start
            let end
            let flag
            if (_this.date == null || _this.date.length == 0) {
                flag = false
            } else {
                flag = true
            }
            if (flag) {
                start = _this.date[0].getFullYear() + "-" + (_this.date[0].getMonth() + 1 < 10 ? '0' + (_this.date[0].getMonth() + 1) : (_this.date[0].getMonth() + 1)) + "-" + (_this.date[0].getDate() < 10 ? '0' + _this.date[0].getDate() : _this.date[0].getDate());
                end = _this.date[1].getFullYear() + "-" + (_this.date[1].getMonth() + 1 < 10 ? '0' + (_this.date[1].getMonth() + 1) : (_this.date[1].getMonth() + 1)) + "-" + (_this.date[1].getDate() < 10 ? '0' + _this.date[1].getDate() : _this.date[1].getDate());
            } else{
                start = ''
                end = ''
            }
            let data = {
                'userkey': this.searchData.username,
                'namekey': this.searchData.user,
                'start': start,
                'end': end
            }
            // 发送请求，成功后，将请求到的用户数据重新渲染到表格中
            // 失败后，跳转到登录界面或弹框
            $.post({'url':local.localhost + '/index.php/Home/User/GetList',xhrFields: {withCredentials: true},data:data}).then(function(response) {
                if (response.status == '1') {
                    _this.userData = response.data.list
                    _this.total = parseInt(response.data.total)
                    _this.pageSize = parseInt(response.data.pageSize)
                } else if(response.status == '-1') {
                    _this.$message.error(response.msg);
                    _this.$router.push({path: '/login'})  
                } else {
                    _this.$message.error(response.msg)
                    _this.userData = []
                }
            }).catch(function(error) {
                console.log(error)
            })
        },
        // 跳转到新增界面
        toAdd() {
            this.$router.push({path:'/adduser'})
        },
        // 启用停用事件
        change(index, row) {
            let _this = this
            // 初始化一个空的要发给后端的数据
            let res     
            //status为1的数据             
            let data = {             
                'id': row.id,
                'status': 1
            }
            //status为0的数据
            let data1 = {           
                'id': row.id,
                'status': 0
            }
            // 如果目前是开着的状态，则发送status为0的数据，告诉后端应该停用
            if (row.status == '1') {
                res = data1  
            // 反之则发送status为1的数据，告诉后端应该启用
            } else {
                res = data
            }
            $.post(local.localhost + '/index.php/Home/User/StopUser',res).then(function(response) {
                    if (response.status == '1') {
                        if (row.status == '1') {
                            _this.userData[index].status = '0'
                            _this.$message('停用成功');
                        } else {
                            _this.userData[index].status = '1'
                            _this.$message('启用成功');
                        }
                    } else if(response.status == '-1') {
                        _this.$message.error(response.msg);
                        _this.$router.push({path: '/login'})  
                    } else {
                        _this.$message.error(response.msg);
                    }
                }).catch(function(error) {
                    console.log(error)
                })
            
            
        },
        // 重置按钮事件
        handleRest(row) {
            let data = {'id':row.id}
            let _this = this
            $.post(local.localhost + '/index.php/Home/User/InitUser',data).then(function(response) {
                if (response.status == '1') {
                    _this.$message(response.msg);
                }else if(response.status == '-1') {
                    _this.$message.error(response.msg);
                    _this.$router.push({path: '/login'})  
                } else {
                    _this.$message.error(response.msg);
                }
            }).catch(function(error) {
                console.log(error)
            })
        },
        // 编辑事件
        handleEdit(row) {
            // 携带此用户的信息跳转到添加用户界面
            this.$router.push({path: '/adduser',query: {id:row.id, name:row.name, username: row.username, contacts: row.contacts, tel: row.tel, address: row.address}})
        },
        // 删除事件
        handleDele(index, row) {
            let _this = this
            // 弹出对话框
            _this.$confirm('确认删除吗','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 点击确定后的操作
                let data = {'id': row.id}
                $.post(local.localhost + '/index.php/Home/User/DelUser',data).then(function(response) {
                    if (response.status == '1') {
                        _this.$message({
                            type: 'success',
                            message: response.msg
                        })
                        // 将此用户的信息从页面中删除
                       _this.userData.splice(index,1) 
                    } else if(response.status == '-1') {
                        _this.$message.error(response.msg);
                        _this.$router.push({path: '/login'})  
                    } else {
                        _this.$message.error(response.msg);
                    }
                })
            }).catch(() => {
                // 点击取消后的操作
                _this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        handleCurrentChange(currentPage) {
            let data = {'curPage': currentPage}
            let _this = this
            $.post(local.localhost + '/index.php/Home/User/GetList', data).then((response) => {
                if (response.status == 1) {
                    _this.userData = response.data.list
                } else if(response.status == '-1') {
                    _this.$message.error(response.msg);
                    _this.$router.push({path: '/login'})  
                } else {
                    _this.$message.error(response.msg);
                }
            })
        },
        loading() {
            window.loading = this.$loading({
                lock: true,
                text: '马上就好',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        },
        init() {
            // 页面初始化时，发送请求用户资料的请求，渲染在表格中
            $.post(local.localhost + '/index.php/Home/User/GetList').then((response) => {
                if (response.status == '1') {
                    // 请求成功后将获取到的数据给到data中的userdata
                    this.userData = response.data.list
                    console.log(this.userData)
                    this.total = parseInt(response.data.total)
                    this.pageSize = parseInt(response.data.pageSize)
                    window.loading.close()
                } else if(response.status == '-1') {
                    window.loading.close()
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    window.loading.close()
                    this.$message.error(response.msg);
                }
            }).catch(function(error) {
                // alert(error)
            })
        }
    },
    mounted() {
        this.loading()
        this.init()
    }
}
</script>

<style>
.manageUser {
    margin-left: 20px;
    margin-top: 20px;
}

.manageUser .search .el-form-item {
    margin-bottom: 15px;
}

.on {
    width: 40px;
    height: 20px;
    border-radius: 40px;
    display: inline-block;
    position: relative;
    top: 5px;
    cursor: pointer;
}

.bagOn {
    background: blue;
}

.bagOff {
    background: #d6d4d4;
}

.pointOff {
    left: -10px;
    background: red;
}

.pointOn {
    left: 10px;
    background: #fff;
}

.point-v {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: relative;
    display: inline-block
}

.el-pagination {
    text-align: center!important
}
</style>




