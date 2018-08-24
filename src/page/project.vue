<template>
    <div class="project">
        <div class="search-project">
            <el-form :inline="true" :model="formData" ref="formData">
                <el-form-item label="客户">
                    <el-select v-model="selected" placeholder="不限" @change="getValue($event)">
                        <el-option v-for="item in formData.options" :key='item.value' :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目状态" v-show="false">
                    <el-select v-model="selected2" placeholder="不限" @change="getStatus($event)">
                        <el-option v-for="item in formData.status" :key='item.value' :label="item.name" :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目关键字" prop="keyWord">
                    <el-input v-model="formData.keyWord"></el-input>
                </el-form-item>
                
                <el-form-item label="创建时间" prop="date">
                    <el-date-picker v-model="formData.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="formData.address"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="findProject">查找</el-button>
                    <el-button type="primary" @click="resetForm('formData')">重置</el-button>
                    <el-button type="primary" @click="toAdd">新建</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="proData">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <ul class="devices">
                            <li v-for="(item, index) in props.row.device" :key="item.id" style="overflow: hidden;margin-bottom:10px">
                                {{ item.name }}
                                <el-button type="primary" size="small" style="float: right" @click="deviceDel(index, item.name,item.id)">删除</el-button>
                                <el-button type="primary" size="small" style="float: right;margin-right: 12px!important" @click="deviceEdit(props.row.id,item.id)">编辑</el-button>
                            </li>
                        </ul>
                        <p style="text-align:center">
                            <el-button type="primary" :disabled = isDisabled size="small" v-show="isMore = props.row.devmaxPage > 1 ? true : false" @click="more(props.row.id)">查看更多</el-button>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="user" label="客户" align="center"></el-table-column>
                <el-table-column prop="name" label="项目" align="center"></el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <!-- <el-table-column prop="status" label="状态" align="center"></el-table-column> -->
                <el-table-column prop="created" label="创建时间" align="center"></el-table-column>
                <el-table-column width="230">
                    <template slot-scope="scope" align="center">
                        <el-button type="primary" size="small" @click="projectEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" size="small" @click="projectDele(scope.$index, scope.row)">删除</el-button>
                        <el-button type="primary" size="small" @click="deviceAdd(scope.row)">增加设备</el-button>
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
    </div>
</template>

<script>
import local from '@/API/local.js'
export default {
    name: 'Project',
    data() {
        return {
            value: '',
            selected: '',      // 
            selected2: '',
            indexs: '',
            formData: {
                date: [],
                address: '',
                options: [
                    {
                        value: 1,
                        name: '同盟军'
                    }, 
                    {
                        id: 2,
                        name: '同军'
                    }
                ],
                status: [
                    {
                        value: 1,
                        label: '进行中'
                    }
                ],
                user: '',
                proStatus: '',
                keyWord: '',
                
            },
            proData: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            userID: '',
            currentPage: 1,
            total: null,
            pageSize: null,
            statu: '',
            count: 1,
            isMore: null,
            isDisabled: false
        }
    },
    methods: {
        getValue(e) {
            this.selected = e.name
            this.userID = e.id
        },
        getStatus(e) {
            this.statu = e.value
        },
        isShow(index) {
            this.index = index
        },
        // 查找用户事件
        findProject() {
            let _this = this
            let start
            let end
            let flag
            if (_this.formData.date == null || _this.formData.date.length == 0) {
                flag = false
            } else {
                flag = true
            }
            if (flag) {
                start = _this.formData.date[0].getFullYear() + "-" + (_this.formData.date[0].getMonth() + 1 < 10 ? '0' + (_this.formData.date[0].getMonth() + 1) : (_this.formData.date[0].getMonth() + 1)) + "-" + (_this.formData.date[0].getDate() < 10 ? '0' + _this.formData.date[0].getDate() : _this.formData.date[0].getDate());
                end = _this.formData.date[1].getFullYear() + "-" + (_this.formData.date[1].getMonth() + 1 < 10 ? '0' + (_this.formData.date[1].getMonth() + 1) : (_this.formData.date[1].getMonth() + 1)) + "-" + (_this.formData.date[1].getDate() < 10 ? '0' + _this.formData.date[1].getDate() : _this.formData.date[1].getDate());
            } else {
                start = ''
                end = ''
            }
            
            let data = {
                'userid': _this.userID,
                'name': _this.formData.keyWord,
                'status': _this.statu,
                'address': _this.formData.address,
                'start': start,
                'end': end
            }
            $.post(local.localhost + '/index.php/Home/Project/GetList',data).then((response) => {
                if (response.status == '1') {
                    _this.proData = response.data.list
                    _this.total = parseInt(response.data.total)
                    _this.pageSize = parseInt(response.data.pageSize) 
                    for (let i = 0; i < _this.proData.length; i++) {
                        if (_this.proData[i].status == 1) {
                            _this.proData[i].status = '进行中'
                        } else {
                            _this.proData[i].status = '已停止'
                        }
                    }
                } else if(response.status == '-1') {
                    _this.$message.error(response.msg);
                    _this.$router.push({path: '/login'})  
                } else {
                    _this.$message.error(response.msg)
                    _this.proData = []
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        // 重置事件
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.selected = ''
            this.selected2 = '' 
            this.userID = ''
            $.post(local.localhost + '/index.php/Home/Project/GetList').then((response) => {
                if (response.status == '1') {
                    this.proData = response.data.list
                    for (let i = 0; i < this.proData.length; i++) {
                        if (this.proData[i].status == 1) {
                            this.proData[i].status = '进行中'
                        } else {
                            this.proData[i].status = '已停止'
                        }
                    }
                    this.total = parseInt(response.data.total)
                    this.pageSize = parseInt(response.data.pageSize)            
                } else if(response.status == '-1') {
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    this.$message.error(response.msg);
                }
            }).catch((error) => {
                console.log(error)
            })       
        },
        // 新增按钮，跳转到添加项目界面
        toAdd() {
            this.$router.push({path: '/addProject'})
        },
        // 携带参数跳转到新增项目界面
        projectEdit(row) {
            this.$router.push({
                path: '/addProject',
                query: {
                    id: row.id
                }
            })
        },
        // 删除project
        projectDele(index, row) {
            let _this = this
            _this.$confirm('确认删除吗','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 点击确定后的操作
                let data = {'id': row.id}
                $.post(local.localhost + '/index.php/Home/Project/Del',data).then(function(response) {
                    if (response.status == '1') {
                        _this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                        // 将此用户的信息从页面中删除
                       _this.proData.splice(index,1) 
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
        // 设备编辑事件
        deviceEdit(proId,devId) {
            this.$router.push({
                path: '/addProject',
                query: {
                    proId: proId,  //这个设备的项目的id
                    id1: devId     //这个设备的id
                }
            })
        },
        // 设备删除事件
        deviceDel(index, name, id) {
            let _this = this
            _this.$confirm('确认删除吗','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 点击确定后的操作
                let data = {'id':id}
                $.post(local.localhost + '/index.php/Home/Project/DelDev',data).then(function(response) {
                    if (response.status == '1') {
                        _this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                        // 将此设备的信息从页面中删除
                       for(let i = 0; i < _this.proData.length; i++) {
                            for (let j = 0; j < _this.proData[i].device.length; j++) {
                                if (_this.proData[i].device[j].name == name) {
                                    _this.proData[i].device.splice(index, 1)
                                }
                            }
                        }
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
        // 添加设备
        deviceAdd(row) {
            this.$router.push({
                path: '/addProject',
                query: {
                    addDevId: row.id
                }
            })
        },
        // 分页请求
        handleCurrentChange(currentPage) {
            let data = {'curPage': currentPage}
            let _this = this
            $.post(local.localhost + '/index.php/Home/Project/GetList', data).then((response) => {
                _this.proData = response.data.list
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
        more(proId) {
            this.isDisabled = true
            this.count += 1
            let data = {
                'id': proId,
                'curPage': this.count
            }
            $.post(local.localhost + '/index.php/Home/Project/GetDevList',data).then((response) => {
                if (response.status == 1) {
                    this.isDisabled = false
                    for (let i = 0; i < this.proData.length; i++) {
                        if (this.proData[i].id == proId) {
                            for (let x = 0; x < response.data.list.length; x++) {
                                this.proData[i].device.push(response.data.list[x])
                            }
                            console.log(this.proData[i].device)
                        }
                    }
                } else {
                    this.isDisabled = false
                    this.$message.error(response.msg)
                }
            })
        },
        //进行页面初始化的操作
        init() {
            // 请求用户列表接口，经获取到的信息放在用户的下拉框中
            $.post(local.localhost + '/index.php/Home/Monitor/GetUserList').then((response) => {
                if (response.status == '1') {
                    this.formData.options = response.data
                    window.loading.close()
                } else if(response.status == '-1') {
                    window.loading.close()
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    window.loading.close()
                    this.$message.error(response.msg);
                }
            }).catch((error) => {
                console.log(error)
            })
            $.post(local.localhost + '/index.php/Home/Project/GetList').then((response) => {
                if (response.status == '1') {
                    this.proData = response.data.list
                    for (let i = 0; i < this.proData.length; i++) {
                        if (this.proData[i].status == 1) {
                            this.proData[i].status = '进行中'
                        } else {
                            this.proData[i].status = '已停止'
                        }
                    }
                    this.total = parseInt(response.data.total)
                    this.pageSize = parseInt(response.data.pageSize)            
                } else if(response.status == '-1') {
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    this.$message.error(response.msg);
                }
            }).catch((error) => {
                console.log(error)
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
.project {
    padding-top: 20px;
    padding-left: 20px; 
}

.project .el-form-item {
    margin-bottom: 10px!important;
}

.project .el-table__expanded-cell[class*=cell] {
    padding: 20px 30px 10px 50px
}

.project .devices .el-button--small {
    padding: 5px 10px!important
}

.project .el-button+.el-button {
    margin-left: 5px!important;
}

.project .el-button--small {
    padding: 5px 10px!important;
}

.el-pagination {
    text-align: center!important
}


</style>



