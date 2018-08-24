<template>
    <div class="addProject">
        <p class="title">{{title}}</p>
        <div v-show="display">
            <div class="project-m" v-show="isShowPro" style="display">
                <span class="project-mag">项目信息：</span>
                <el-form :model="addProjectData" label-width="110px" :rules="addRules" ref="addProjectData">
                    <el-form-item label="项目名称：" prop="projectName">
                        <el-input v-model="addProjectData.projectName" placeholder="请输入项目名（2-20位,）"></el-input>
                    </el-form-item>
                    <el-form-item label="所属公司：" prop="user" :rules="[{ required: true, message: '项目负责人不能为空', trigger: 'change' }]">
                        <el-select v-model="addProjectData.user" placeholder="请选择" @change="getId($event)">
                            <el-option v-for="item in addProjectData.userList" :key='item.id' :label="item.name" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址：" prop="lon">
                        <i class="el-icon-npz-techreport-" style="margin-left: 10px;margin-right:10px;color:blue;cursor: pointer;" @click="getAdress"></i>
                        <span class="adressMag">经度：{{addProjectData.lon}}</span><span class="adressMag">纬度：{{addProjectData.lat}}</span>
                    </el-form-item>
                    <el-form-item label="详细地址：" prop="address" >
                        <el-input v-model="addProjectData.address"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人：" prop="contacts" :rules="[{ required: true, message: '联系人不能为空', trigger: 'blur' },{ min: 2, max: 10, message: '长度在 2 到 10 个字符'}]">
                        <el-input v-model="addProjectData.contacts" placeholder="请输入联系人（2-10个字符）"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人电话：" prop="tel">
                        <el-input v-model="addProjectData.tel" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="项目图片：" prop="imgSrc" style="position:relative;width:550px" :rules="[{ required: true, message: '项目图片不能为空', }]">
                        <el-input placeholder="点击选择图片" readonly="true" v-model="addProjectData.imgSrc"></el-input>
                            <input type="file" accept="image/*" multiple="multiple" @change="changeImg($event)" style="opacity:0;width:100%;position:absolute;top:0;left:0;right:0;bottom:0">
                        <img class="img" :src="img" alt="">
                    </el-form-item>
                    <el-form-item label="总装机容量：" prop="capacity">
                        <el-input v-model="addProjectData.capacity" placeholder="请输入总装机容量（数字）"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="device" v-show="isShowDev"  style="margin-top:30px">
                <span class="deviceMag">设备信息：</span>
                <el-form v-for="(item,index) in addDevice" :key="item.id" :model="item" label-width="110px" :rules="devRule" ref="addDevice" style="margin-bottom:30px">
                    <el-form-item label="设备名称：" prop="name">
                        <el-input v-model="item.name" placeholder="请输入设备名字（2-20位）"></el-input>
                    </el-form-item>
                    <el-form-item label="设备型号：" :rules="[{ required: true, message: '设备型号不能为空', trigger: 'change' }]">
                        <el-select v-model="addDevice[index].type" @change="getValue($event,index)"> 
                            <el-option v-for="item in deviceTypes" :key='item.value'  :label="item.name" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="实时表名称：" prop="tabname">
                        <el-input v-model="item.tabname" placeholder="请输入实时表名称（英文,_,\,数字2-128位）"></el-input>
                    </el-form-item>
                    <el-form-item label="历史表名称：" prop="tabname1">
                        <el-input v-model="item.tabname1" placeholder="请输入历史表名称（英文,_,\,数字2-128位）"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库名称：" prop="dbname">
                        <el-input v-model="item.dbname" placeholder="请输入数据库名称（英文,.,\,_,:,数字2-128位）"></el-input>
                    </el-form-item>
                    <el-form-item label="列名称前缀：" prop="top">
                        <el-input v-model="item.top" placeholder="请输入列名称前缀（英文,_,\,数字2-128位）"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-button type="text" v-show="isShowAdd" style="display:block;margin-left:35%!important" @click="addNewDev" :disabled='isAdd'><i class="el-icon-plus" style="font-size:23px;vertical-align:middle"></i>添加设备</el-button>
            <el-button type="primary" style="margin-left:53%!important" @click="submit()" :disabled='isDisabled'>提交</el-button>
        </div>
        <div class="map-v" v-show="showMap">
            <div id="maps" class="maps"></div>
            <el-button type="primary" @click="close" style="margin-top:10px">确定</el-button>
        </div>
    </div>
</template>

<script>
import local from '@/API/local.js'
export default {
    name: 'addProject',
    data() {
        let checkName = (rule, value, callback) => {
            let regName = /^[^\'\"]{2,20}$/ 
            if (!value) {
                return callback(new Error('项目名不能为空'))
            } else if (!(regName.test(value))) {
                return callback(new Error('格式不正确,不能输入\'或\"'))
            } else {
                callback()
            }
        }
        let checkTel = (rule, value, callback) => {
            let regTel = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
            if (!value) {
                return callback(new Error('手机号不能为空'))
            } else if (!(regTel.test(value))) {
                return callback(new Error('手机号格式错误'))
            } else {
                callback()
            }
        }

        let checkAddress = (rule, value, callback) => {
            let regAddress = /^[^\'\"]{2,32}$/
            if (!value) {
                return callback(new Error('地址不能为空'))
            } else if (!(regAddress.test(value))) {
                return callback(new Error('格式不正确，不能输入\'或\"'))
            } else {
                callback()
            }
        }

        let checkCapacity = (rule, value, callback) => {
            let regCapa = /^[0-9]*$/
            if (!value) {
                return callback(new Error('总装机容量不能为空'))
            } else if (!(regCapa.test(value))) {
                return callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }

        let checkDevName = (rule, value, callback) => {
            let regName = /^[^\'\"]{2,20}$/
            if (!value) {
                return callback(new Error('设备名不能为空'))
            } else if (!(regName.test(value))) {
                return callback(new Error('格式不正确,不能输入\'或\"'))
            } else {
                callback()
            }
        }

        let checkTop = (rule, value, callback) => {
            let regTop = /^[A-Za-z0-9\\\\\/_]{2,128}$/
            if (!value) {
                return callback(new Error('列名称前缀不能为空'))
            } else if (!(regTop.test(value))) {
                return callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }

        let checkTabName = (rule, value, callback) => {
            let regTabName = /^[A-Za-z0-9_]{2,128}$/
            if (!value) {
                return callback(new Error('实时表名称不能为空'))
            } else if (!(regTabName.test(value))) {
                return callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }

        let checkTabName1 = (rule, value, callback) => {
            let regTabName1 = /^[A-Za-z0-9_]{2,128}$/
            if (!value) {
                return callback(new Error('历史表名称不能为空'))
            } else if (!(regTabName1.test(value))) {
                return callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }

        let checkDbName = (rule, value, callback) => {
            let regDbName = /^[A-Za-z0-9\\\\\/_.:]{2,128}$/
            if (!value) {
                return callback(new Error('数据库名称不能为空'))
            } else if (!(regDbName.test(value))) {
                return callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }
        return {
            deviceNum: 1,
            isDisabled: false,
            isAdd: false,
            bag: {
                backgroundImage: ''
            },
            img: '',
            title: '新增项目',
            display: true,
            id: '',                    //客户的id
            isShowPro: true,
            isShowDev: true,
            isShowAdd: true,
            showMap: false,
            fileList: [],
            addProjectData: {
                userList: [            //用户列表
                    {
                        id: 1,
                        name: '同盟军'
                    }, 
                    {
                        id: 2,
                        name: '同军'
                    }
                ],
                projectName: '',       //项目名字
                user: '',              //联系人
                lon: '',               
                lat: '',
                pic: '',
                address: '',
                contacts: '',
                tel: '',
                capacity: '',          //总装机容量
                imgSrc: '',
            },
            addDevice: [
                { 
                    'pid': '',
                    'id': '',
                    'typeid': '',
                    'type': '',      
                    'name': '',
                    'tabname': '',
                    'tabname1': '',
                    'dbname': '',
                    'top': ''
                }
            ],
            imgBase: '',
            oldImg: '',        //传过来的图片
            deviceTypes: [],
            oldType: '',       //传过来的设备的类型
            newType: '',        //重新选择的设备的类型
            addRules: {
                projectName: [
                    {required: true, validator: checkName, trigger: 'blur'}
                ],
                address: [
                    {required: true, validator: checkAddress}
                ],
                tel: [
                    {required: true, validator: checkTel, trigger: 'blur'}
                ],
                capacity: [
                    {required: true, validator: checkCapacity, trigger: 'blur'}
                ]
            },
            devRule: {
                name: [
                    {required: true, validator: checkDevName, trigger: 'blur'}
                ],
                tabname: [
                    {required: true, validator: checkTabName, trigger: 'blur'}
                ],
                tabname1: [
                    {required: true, validator: checkTabName1, trigger: 'blur'}
                ],
                dbname: [
                    {required: true, validator: checkDbName, trigger: 'blur'}
                ],
                top: [
                    {required: true, validator: checkTop, trigger: 'blur'}
                ]
            }

        }
    },
    methods: {
        getId(e) {
            // 选择客户时，获取到对应的客户id和name
            this.addProjectData.user = e.name
            this.id = e.id
        },
        // 取到客户选中的设备类型的ID放到addDevice 的type中去
        getValue(e,index) {
            this.addDevice[index].type = e.name
            this.addDevice[index].typeid = e.id
        },
        // 添加设备事件
        addNewDev() {
            this.deviceNum++;
            console.log(this.deviceNum)
            if (this.deviceNum > 47) {
                this.isAdd = true
                this.$message('已达到可以添加的最多数量')
                return false
            }
            let newdev = {
                'type': '',
                'name': '',
                'tabname': '',
                'tabname1': '',
                'dbname': '',
                'top': ''
            }
            this.addDevice.push(newdev)
        },
        // 将图片转换成base64格式
        changeImg(e) {
            let file = e.target.files[0]
            this.addProjectData.imgSrc = file.name
            let reader = new FileReader()
            let that = this
            reader.readAsDataURL(file)
            reader.onload = function(e) {
                that.imgBase = this.result
                that.img = this.result
            }
        },
        // 选取地址，并拿到对应的坐标
        getAdress() {
            let _this = this
            _this.showMap = true
            _this.display = false
            // 创建map实例
            let map = new BMap.Map('maps')
            // 设置地图中心点
            map.centerAndZoom('山西', 11)
            // 开启鼠标滚轮缩放      
            map.enableScrollWheelZoom(true);
            // 创建标注的函数
            function addMarker(point){
                let marker = new BMap.Marker(point);
                map.addOverlay(marker);
            }
            let geoc = new BMap.Geocoder();
            // 点击添加标注 并获取到点的坐标显示出来
            map.addEventListener("click",function(e){
                map.clearOverlays();
                let point = new BMap.Point(e.point.lng, e.point.lat)
                addMarker(point);
                _this.addProjectData.lon = e.point.lng
                _this.addProjectData.lat = e.point.lat
                geoc.getLocation(point,function(rs) {
                    console.log(rs.address)
                    _this.addProjectData.address = rs.address
                })
            });
        },
        // 关闭地图
        close() {
            this.showMap = false
            this.display = true
        },
        // 提交按钮
        submit() {
            let _this = this
            let regPro
            let regDev
            // 验证项目部分的表单
            var p1=new Promise(function(resolve, reject) {
                _this.$refs.addProjectData.validate((valid) => {
                    if (valid) {
                        resolve();
                        regPro = true
                    } else {
                        regPro = false
                    }
                })
            });
            // 验证设备部分的表单
            var p2=new Promise(function(resolve, reject) {
                _this.$refs.addDevice.forEach((item) => {
                    item.validate((valid) => {
                        if (valid) {
                            resolve()
                            regDev = true
                        } else {
                            regDev = false
                        }
                    })
                })
            });
            Promise.all([p2,p1]).then(function(){
                _this.isDisabled = true
            }).catch(function() {
                console.log('sadsa')
            }) 
            let flag
            // 以下的判断结果放入flag
            // 以flag的真假判断是否进行之后的操作
            // 如果是新增项目界面
            // 判断两个表单是否都验证通过
            if (_this.isShowPro && _this.isShowDev) {
                if (regPro && regDev) {
                    flag = true
                } else {
                    flag = false
                }
            // 如果是编辑设备    
            // 判断设备的表单是都验证通过
            } else if (!_this.isShowPro && _this.isShowDev) {
                if (regDev) {
                    flag = true
                } else {
                    flag = false
                }
            // 如果是编辑项目界面    
            // 判断项目的表单是否验证通过
            } else if (!_this.isShowDev && _this.isShowPro) {
                if (regPro) {
                    flag = true
                } else {
                    flag = false
                }
            }
            // 如没有通过验证 直接返回false
            if (!flag) {
                return false
            }
            // 查找对应客户的id
            let id
            if (_this.addProjectData.user) {
                let idArr = _this.addProjectData.userList.filter((item) => {
                    return item.name == _this.addProjectData.user
                })
                id = idArr[0].id
            }
            let data = {
                'project': {
                    'user': id,                                     
                    'name': _this.addProjectData.projectName,
                    'address': _this.addProjectData.address,
                    'latitude': _this.addProjectData.lat,
                    'longitude': _this.addProjectData.lon,
                    'contacts': _this.addProjectData.contacts,
                    'tel': _this.addProjectData.tel,
                    'allload': _this.addProjectData.capacity,
                    'image': _this.imgBase
                },
                'dev': _this.addDevice, 
            }
            let data2 = {'dev': _this.addDevice}
            // 判断是否重新选择了图片
            if (_this.$route.query.id) {
                let img
                // 如果重新选择了图片
                // 发送新图片的base64编码
                // 如果没有还是发送之前请求到的
                if (_this.addProjectData.imgSrc != _this.oldImg) {
                    img = _this.imgBase
                } else {
                    img = _this.oldImg
                }
                let proData = { 
                    'user': id,                                 // 客户id
                    'id': _this.$route.query.id,                // 项目id
                    'name': _this.addProjectData.projectName,   // 项目名字
                    'address': _this.addProjectData.address,    // 地址
                    'latitude': _this.addProjectData.lat,       // 纬度
                    'longitude': _this.addProjectData.lon,      // 经度
                    'contacts': _this.addProjectData.contacts,  // 联系人
                    'image': img,
                    'tel': _this.addProjectData.tel,
                    'allload': _this.addProjectData.capacity,
                }
                
                $.post(local.localhost + '/index.php/Home/Project/Updata', proData).then((response) => {
                    if (response.status == 1) {
                        _this.isDisabled = false
                        _this.$message(response.msg)
                        _this.$router.push({path: '/project'})
                    } else if(response.status == '-1') {
                        _this.isDisabled = false
                        _this.$message.error(response.msg);
                        _this.$router.push({path: '/login'})  
                    } else {
                        _this.isDisabled = false
                        _this.$message.error(response.msg);
                    }
                })      
                // 设备编辑          
            } else if (_this.$route.query.id1) {
                // 判断是否重新选择了设备类型
                if (data2.dev[0].type == _this.oldType) {
                    data2.dev[0].typeid = _this.deviceTypes.filter((item) => {
                        return item.name == _this.oldType
                    })[0].id
                }
                console.log(_this.deviceTypes)
                $.post(local.localhost + '/index.php/Home/Project/UpDev',data2).then((response) => {
                    if (response.status == 1) {
                        _this.isDisabled = false
                        _this.$message(response.msg)
                        _this.$router.push({path: '/project'})
                    } else if(response.status == '-1') {
                        _this.isDisabled = false
                        _this.$message.error(response.msg);
                        _this.$router.push({path: '/login'})  
                    } else {
                        _this.isDisabled = false
                        _this.$message.error(response.msg);
                    }
                })
            } else if (_this.$route.query.addDevId) {
                // 添加设备
                $.post(local.localhost + '/index.php/Home/Project/AddDev', data2).then((response) => {
                    if (response.status == 1) {
                        _this.isDisabled = false
                        _this.$message(response.msg)
                        _this.$router.push({path: '/project'})
                    } else if (response.status == '0') {
                        _this.isDisabled = false
                        console.log(response.msg)
                        _this.$message.error(response.msg)
                    }
                })
            } else {
                // 添加项目
                $.post(local.localhost + '/index.php/Home/Project/Add',data).then((response) => {
                    if (response.status == '1') {
                        _this.isDisabled = false
                        _this.$message(response.msg);
                        _this.$router.push({path: '/project'})
                    } else if(response.status == '-1') {
                        _this.isDisabled = false
                        _this.$message.error(response.msg);
                        _this.$router.push({path: '/login'})  
                    } else if(response.status == 0) {
                        _this.isDisabled = false
                        _this.$message.error(response.msg);
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        //获取用户列表信息
        getUserList() {
            // 请求客户信息，将客户的名字放在选择客户的下拉框中
            $.post(local.localhost + '/index.php/Home/Monitor/GetUserList').then((response) => {
                if (response.status == '1') {
                    this.addProjectData.userList = response.data
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
        //获取设备列表信息
        getDevList() {
            $.post(local.localhost + '/index.php/Home/Project/GetDevType').then((response) => {
                if (response.status == '1') {
                    this.deviceTypes = response.data
                } else if(response.status == '-1') {
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    this.$message.error(response.msg);
                }
            })
        },
        //判断是添加还是编辑项目还是设备,进行对应的初始化操作
        init() {
            // 如果是项目编辑按钮跳过来的，就隐藏掉设备信息
            if (this.$route.query.id) {
                this.isShowDev = false
                this.isShowAdd = false
                this.title = '修改项目'
                let data = {'id': this.$route.query.id}
                // 用传过来的项目的id去请求这个项目的详情，并展示在页面上
                $.post(local.localhost + '/index.php/Home/Project/Details',data).then((response) => {
                    if (response.status == 1) {
                        this.addProjectData.projectName = response.data.name
                        this.addProjectData.user = response.data.user
                        this.addProjectData.contacts = response.data.contacts
                        this.addProjectData.address = response.data.address
                        this.addProjectData.imgSrc = response.data.cover
                        this.img = response.data.cover
                        this.oldImg = response.data.cover
                        this.addProjectData.tel = response.data.tel
                        this.addProjectData.capacity = response.data.allload
                        this.addProjectData.lat = response.data.latitude
                        this.addProjectData.lon = response.data.longitude
                    } else if(response.status == '-1') {
                        this.$message.error(response.msg);
                        this.$router.push({path: '/login'})  
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            }
            // 如果是设备编辑按钮跳过来的，就隐藏掉项目信息
            if (this.$route.query.id1) {
                this.title = '修改设备'
                this.addDevice[0].id = this.$route.query.id1             //接收传过来的设备的id
                // this.addDevice[0].devpid = this.$route.query.proId    //接收传过来的这个设备的项目的id
                this.isShowPro = false
                this.isShowAdd = false
                let data = {'id': this.$route.query.id1}
                // 用传过来设备的id去请求这个项目的详情，并展示在页面上
                $.post(local.localhost + '/index.php/Home/Project/DetailsDev',data).then((response) => {
                    if (response.status == 1) {
                        this.oldType = response.data.type
                        this.addDevice[0].type = response.data.type
                        this.addDevice[0].name = response.data.name
                        this.addDevice[0].tabname = response.data.tabname
                        this.addDevice[0].tabname1 = response.data.tabname1
                        this.addDevice[0].dbname = response.data.dbname
                        this.addDevice[0].top = response.data.top
                    } else if(response.status == '-1') {
                        this.$message.error(response.msg);
                        this.$router.push({path: '/login'})  
                    } else {
                        this.$message.error(response.msg);
                    }
                })
            }
            // 如果是添加设备的按钮跳转过来的，隐藏掉项目信息
            if (this.$route.query.addDevId) {
                this.title = '添加设备'
                this.isShowPro = false
                this.addDevice[0].pid = this.$route.query.addDevId
            }
        }

    },
    mounted() {
        this.getUserList()
        this.getDevList()
        this.init()
    }
}
</script>

<style>
.map-v {
    width: 80%;
    margin: -30px auto 0;
    height: 100%;
    text-align: center;
    
}

.maps {
    width: 100%;
    height: 70vh;
    border: 2px solid rgb(99, 99, 233)
}

.anchorBL {
    display: none;
}

.addProject .title {
    height: 50px;
    width: 100%;
    line-height: 50px;
    background: rgb(238, 235, 235);
    text-align: center;
    margin-bottom: 30px    
}

.project-m, .device {
    width: 46%;
    margin: 0 auto;
    position: relative;
}

.project-m .project-mag, .device .deviceMag {
    position: absolute;
    height: 40px;
    line-height: 40px;
}

.addProject .el-form {
    margin-left: 60px;
    width: 500px
}

.addProject .el-form .el-input {
    width: 350px;
}

.addProject .adressMag {
    display: inline-block;
    width: 160px;
    color: #7d8792;
}

.addProject .img {
    width: 350px;
    /* height: 200px; */
    margin-top: 20px;
    border: 1px solid black;
}
</style>
