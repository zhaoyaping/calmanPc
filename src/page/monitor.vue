<template>
    <div class="monitor">
        <el-form :inline="true" :model="formData">
            <el-form-item label="选择客户">
                <el-select v-model="userName" placeholder="不限" @change="getId($event)">
                    <el-option v-for="item in formData.options" :key='item.value' :label="item.name" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择项目">
                <el-select v-model="projectName" placeholder="不限" @change="getValue($event)">
                    <el-option v-for="item in formData.projects" :key='item.id' :label="item.name" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择设备" v-show="showDevice">
                <el-select v-model="deviceName" placeholder="不限" @change="getDevId($event)">
                    <el-option v-for="item in formData.devices" :key='item.value' :label="item.name" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="define">确定</el-button>
            </el-form-item>
        </el-form>
        <div class="radio-wrap">
            <div class="radio-group">   
                <span class="tabs" v-for="(tab ,index) in tabs" :key="tab.id" :class="{cur:iscur==index}" @click="iscur=index,tabChange('select' + (index + 1))">{{tab.name}}</span>  
            </div>  
            <!-- <keep-alive>    -->
                <component :key="view" v-bind:is="tabView" :child-data="asyncData" :child-id="devid" @childToParent="child" @child2ToParent="child2"></component>  
            <!-- </keep-alive>    -->
        </div>
    </div>
</template>
 
<script>
import select1 from '../components/ProjectOverview';  
import select2 from '../components/RealTimeMonitoring';  
import select3 from '../components/LineChart'; 
import local from '@/API/local.js'
 export default {
    name: 'Monitor',
    data() {
        return {
            view: 1,
            asyncData: '',
            devid: '',
            deviceName: '',
            projectName: '',
            userName: '',
            formData: {
                options: [
                    {
                        value: 'item1',
                        label: '同盟军'
                    }
                ],
                projects: [
                    {
                        value: 'item1',
                        label: '晋城项目'
                    }
                ],
                devices: [
                    {
                        value: 'item1',
                        label: '01#机组'
                    }
                ],
                user: '',
                project: '',
                device: ''
            },
            tabView: 'select1',
            tabs: [
                {name: '项目总览'},
                {name: '实时监控'},
                {name: '折线图'}
            ],
            iscur: 0,
            showDevice: false,
            projectId: '',
            deviceId: ''
        }
    },
    components: {
        select1,
        select2,
        select3
    },
    methods: {
        // 请求到对应客户的所用项目
        getId(e) {
            let _this = this
            _this.userName = e.name
            let data = {'userid': e.id}
            $.post({url:local.localhost + '/index.php/Home/Monitor/GetProjectList',data:data,xhrFields:{withCredentials:true} }).then((response) => {
                if (response.status == '1') {
                    // 拿到项目列表放在下拉框
                    _this.formData.projects = response.data   
                    // 显示第一个项目的名字
                    _this.projectName = response.data[0].name 
                    // 拿到第一个项目的设备列表放在选择设备的下拉框
                    _this.formData.devices = response.data[0].device
                    // 显示第一个设备的名字
                    _this.deviceName = response.data[0].device.length != 0 ? response.data[0].device[0].name : ''
                } else if(response.status == '-1') {
                    _this.$message.error(response.msg);
                    _this.$router.push({path: '/login'})  
                } else {
                    _this.projectName = ''
                    _this.formData.devices = []
                    _this.deviceName = ''
                    this.asyncData = {'id': ''}
                }
            })
        },
        // 并且请求这个项目的详情，拿到这个项目的所有设备
        getValue(e) {
            let _this = this
            let data = {'id': e.id}
            $.post({url:local.localhost + '/index.php/Home/Monitor/Details',data:data,xhrFields:{withCredentials:true} }).then((response) => {
                if (response.status == '1') {
                    _this.formData.devices = response.data.device.length > 0 ? response.data.device : []
                    _this.deviceName = response.data.device.length > 0 ? response.data.device[0].name : ''
                }
            })
            _this.projectName = e.name
            _this.projectId = e.id
        },
        getDevId(e) {
            this.deviceName = e.name
            this.deviceId = e.id
        },
        // 点击确定后，把选择到的项目的id赋值给要传递给子组件的那个值
        // 把选择到的设备的id赋值给要传递给子组件的那个值
        define() {
            // 如果此时选择的客户有项目，把这个项目的id传下去
            // 如果没有就传一个空的值下去
            if (this.projectName) {
                let proId = this.formData.projects.filter((item) => {
                    return item.name == this.projectName
                })[0].id
                console.log(this.formData.projects)
                console.log()
                this.asyncData = {'id':proId}
            } else {
                this.asyncData = {'id': ''}
            }
            // 如果这个项目有设备，把这个设备的id传下去
            // 如果没有，就传一个空的值下去
            if (this.deviceName) {
                let devId = this.formData.devices.filter((item) => {
                    return item.name == this.deviceName
                })[0].id
                this.devid = {'id': devId, 'proName': this.projectName, 'devName': this.deviceName}
                this.view++
            } else {
                this.devid = {'id': '', 'proName': '', 'devName': ''}
            }
            if (window.lineChart) {
                clearInterval(window.lineChart)
            } else if (window.realTime) {
                clearInterval(window.realTime)
            }
        },
        // 切换三个子组件
        tabChange:function(tab){  
            this.tabView = tab;
            this.view++
            if (tab == 'select2' || tab == 'select3') {
                this.showDevice = true
                if (this.deviceName) {
                    let devId = this.formData.devices.filter((item) => {
                        return item.name == this.deviceName
                    })[0].id
                    this.devid = {'id': devId, 'proName': this.projectName, 'devName': this.deviceName}
                    this.view++
                } else {
                    this.devid = {'id': '', 'proName': '', 'devName': ''}
                }
            } else {
                this.showDevice = false
            }
        },
        // 此方法接收子组件传递过来的值，并切换到实时监控
        child(data){
            this.showDevice = true  
            this.tabView = data.x
            this.iscur = 1 
            this.deviceName = data.devName
            this.devid = {'id': data.id, 'proName': data.proName, 'devName': data.devName}
        },
        // 此方法接收到子组件传递过来的值，并切换到折线图
        child2(data) {
            this.showDevice = true
            this.tabView = data.x
            this.iscur = 2
            this.deviceName = data.devName
            this.devid = {'id': data.id, 'proName': data.proName, 'devName': data.devName}
        },
        //进行页面初始化的操作
        init() {
            // 请求到客户列表放在选择客户的下拉框
            let proName
            $.post({url:local.localhost + '/index.php/Home/Monitor/GetUserList',xhrFields:{withCredentials:true} }).then((response) => {
                if (response.status == 1) {
                    this.formData.options = response.data                    // 拿到客户列表放在下拉框
                    // 如果是设备地图跳转过来的
                    if (this.$route.query.id) {   
                        for (let i = 0; i < this.formData.options.length; i++) {
                            if (this.formData.options[i].id == this.$route.query.user) {
                                this.userName = this.formData.options[i].name
                            }
                        }
                        // 用这个客户的id去请求到他的项目放在之后选择项目的下拉框
                        let dataId = {'userid': this.$route.query.user}
                        $.post({url:local.localhost + '/index.php/Home/Monitor/GetProjectList',data:dataId,xhrFields:{withCredentials:true} }).then((response) => {
                            if (response.status == 1) {
                                this.formData.projects = response.data
                            }
                        })     
                        this.projectName = this.$route.query.name           // 显示传过来的项目名字
                        this.asyncData = {'id':this.$route.query.id}        //把传过来的项目的id传下去
                        let data = {'id': this.$route.query.id}              // 用传过来的项目的id请求项目详情
                        $.post({url:local.localhost + '/index.php/Home/Monitor/Details',data:data,xhrFields:{withCredentials:true} }).then((response) => {
                            if (response.status == 1) {
                                this.formData.devices = response.data.device    //拿到这个项目的设备
                                this.deviceName = response.data.device[0].name  //显示第一个设备的名字
                                this.devid = {'id': response.data.device[0].id, 'proName': response.data.name, 'devName': response.data.device[0].name}
                            } else {
                                this.$message.error(response.msg);
                            }
                        })
                    } else {
                        // 如果不是从地图跳过来的
                        // 用第一个客户的id去请拿到他对应的项目和设备
                        // 把他第一个项目的id和设备的id传下去渲染出来
                        // 显示第一个项目的名字和第一个设备的名字
                        let data = {'userid': response.data[0].id}
                        $.post({url:local.localhost + '/index.php/Home/Monitor/GetProjectList',data:data,xhrFields:{withCredentials:true} }).then((response) => {
                            if (response.status == 1) {
                                this.formData.projects = response.data           
                                this.formData.devices = response.data[0].device
                                this.userName = this.formData.options[0].name
                                this.projectName = this.formData.projects[0].name
                                this.deviceName = this.formData.projects[0].device[0].name
                                this.asyncData = {'id': this.formData.projects[0].id}
                                this.devid = {'id': this.formData.projects[0].device[0].id, 'proName': this.formData.projects[0].name, 'devName': this.formData.projects[0].device[0].name}
                            }
                        })
                    }
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
        this.init()
    }
 }
 </script>

 <style>
.monitor {
    padding-top: 20px;
    padding-left: 20px;
}
 
.radio-group {
    font-size:0;
    height: 26px;
    line-height:26px;
    margin-bottom: 10px;
}  
.radio-group>span{
    cursor:pointer;
    display:inline-block;
    font-size:14px;
    text-align:center;
    width:100px;
    border: 1px solid rgb(117, 114, 114);
    margin-right: 20px
}  
.cur{
    color: rgb(117, 114, 114);
    background-color: #66b1ff
} 
 </style>
 
 