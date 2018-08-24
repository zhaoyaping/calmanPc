<template>
    <div class="map" >
        <div id="XSDFXPage" class="XSDFXPage"></div>
        <!-- <div class="project-list">
            <div class="project-list-head">
                <span class="title">项目列表</span>
                <el-button type="primary" icon="el-icon-refresh" size="mini" style="float:right" @click="refresh">刷新</el-button>
            </div>
            <div class="project-list-search">
                <el-input prefix-icon="el-icon-search" style="width:71%" placeholder="请输入项目名称" v-model="projectKey"></el-input>
                <el-button type="primary" @click="findProject">查询</el-button>
            </div>
            <p style="text-align:right;font-size:14px;line-height:30px">总发电量（kwh）</p>
            <p style="text-align:right;font-size:14px;margin-bottom:10px"><span style="margin-right:20%">今天</span><span style="margin-right:10%">本周</span></p>
            <el-table :data="tableData5" style="width: 100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-table :data="props.row.device" style="width: 100%">
                        <el-table-column prop="name" align="center">
                        </el-table-column>
                        <el-table-column prop="jtfdl" align="center">
                        </el-table-column>
                        <el-table-column prop="bzfdl" align="center">
                        </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center">
                </el-table-column>
                <el-table-column prop="jtfdl" align="center">
                </el-table-column>
                <el-table-column prop="bzfdl" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="foot">
            <el-row :gutter="1">
                <el-col :span="4"><div class="bottomList "><i class="el-icon-menu"></i>设备总量<span>{{ footData.num }}</span></div></el-col>
                <el-col :span="4"><div class="bottomList"><i class="el-icon-menu"></i>在线设备<span>{{ footData.num_zx }}</span></div></el-col>
                <el-col :span="4"><div class="bottomList"><i class="el-icon-time"></i>在线率<span>{{ footData.num_zxl }}</span></div></el-col>
                <el-col :span="4"><div class="bottomList"><i class="el-icon-circle-close-outline"></i>离线设备<span>{{ footData.num_lx }}</span></div></el-col>
                <el-col :span="4"><div class="bottomList">今日发电<span>{{ footData.jtfdl }}</span></div></el-col>
                <el-col :span="4"><div class="bottomList">本周发电<span>{{ footData.bzfdl }}</span></div></el-col>
            </el-row>
        </div> -->
    </div>
</template>
 
<script>
 import local from '@/API/local.js';
 import red from '../assets/red.png'
 import black from '../assets/black.png'
 export default {
     name: 'Map',
     data() {
         return {
            dataList: [
                // {id: '0', name: 'abc',latitude: "116.404", longitude: "39.915", authority: "1"},
                // {id: '1', name: 'qaz',latitude: "116.417", longitude: "49.909", authority: "0"},
            ],
            tableData5: [],
            listChildren:[],
            footData: {
                total: '16'
            },
            projectKey: '' ,
            map: '' ,
            flag:1,
            load: true
         }
     },
    methods: {
        // 刷新
        // refresh() {
        //     let _this = this
        //     $.post(local.localhost + '/index.php/Home/Monitor/GetMyList').then((response) => {
        //         if (response.status == 1) {
        //             _this.tableData5 = response.data.list
        //             _this.projectKey = ''
        //         } else if(response.status == '-1') {
        //             _this.$message.error(response.msg);
        //             _this.$router.push({path: '/login'})  
        //         } else {
        //             _this.$message.error(response.msg);
        //         }
        //     })
        // },
        // 查找项目
        // findProject() {
        //     let data = {'key': this.projectKey}
        //     $.post(local.localhost + '/index.php/Home/Monitor/GetMyList',data).then((response) => {
        //         if (response.status == '1') {
        //             this.$message(response.msg)
        //             this.tableData5 = response.data.list
        //         } else if(response.status == '-1') {
        //             this.$message.error(response.msg);
        //             this.$router.push({path: '/login'})  
        //         } else {
        //             this.$message.error(response.msg)
        //             this.tableData5 = []
        //         }
        //     }).catch((error) => {
        //         console.log(error)
        //     })
        // }, 
        //地图上添加标注
        addMarker(lat,lng,authority,index,name,id,user) {
            let marker
            let point = new BMap.Point(lng, lat)
            let redIcon = new BMap.Icon(red, new BMap.Size(40,40),{
            imageSize : new BMap.Size('100%','100%')
            })
            let blackIcon = new BMap.Icon(black, new BMap.Size(40,40),{
            imageSize : new BMap.Size('100%','100%')
            })
            let _this = this
            //判断是否是自己的项目
            if (authority == 1) {
                marker = new BMap.Marker(point, {icon:redIcon})
                marker.addEventListener("click",function() {
                    _this.$router.push({
                        path: '/monitor',
                        query: {
                            id: id,
                            name: name,
                            user: user   //客户的id
                        }
                    })
                })
            } else {
                marker = new BMap.Marker(point, {icon:blackIcon})
                marker.addEventListener("click", function() {
                    _this.$message.error('该项目为他人所有，您无权查看');
                })
            }
            this.map.addOverlay(marker)
            let label = new BMap.Label(index+1,{offset:new BMap.Size(11,5)});
            label.setStyle({
                color : "#FFF",
                backgroundColor:'transparent',//文本背景色
                borderColor:'transparent',//文本框边框色
                fontSize : "13px",
                height : "20px",
                lineHeight : "20px",
                fontFamily:"微软雅黑"
            });
            marker.setLabel(label);  
        },
        // loading() {
        //     window.loading = this.$loading({
        //         lock: true,
        //         text: '马上就好',
        //         spinner: 'el-icon-loading',
        //         background: 'rgba(0, 0, 0, 0.7)'
        //     })
        // },
        //初始化地图
        createMap() {
            // 创建Map实例
            this.map = new BMap.Map("XSDFXPage",{enableMapClick:true})
            // 初始化地图,设置中心点坐标和地图级别
            this.map.centerAndZoom(new BMap.Point(116.4035,39.915), 5);
            // 开启鼠标滚轮缩放      
            this.map.enableScrollWheelZoom(true);
            // 获取到所有项目的坐标信息，并循环执行添加标注的事件
            $.post(local.localhost + '/index.php/Home/Monitor/GetMapList').then((response) => {
                if (response.status == '1') {
                    this.dataList = response.data
                    let marker
                    for (let i = 0; i < this.dataList.length; i++) {
                        let lat = this.dataList[i].latitude
                        let lng = this.dataList[i].longitude
                        let authority = this.dataList[i].authority
                        let id = this.dataList[i].id       //项目的名字
                        let name = this.dataList[i].name  //项目的名字
                        let user = this.dataList[i].user  //客户id
                        this.addMarker(lat,lng,authority,i,name,id,user)
                    }
                    // window.loading.close();
                } else if(response.status == '-1') {
                    // window.loading.close();
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    // window.loading.close();
                    this.$message.error(response.msg);
                }
            }).catch((error) => {
                console.log(error)
            })
        },

        // getProList() {
        //     // 获取到项目列表
        //     $.post(local.localhost + '/index.php/Home/Monitor/GetMyList').then((response) => {
        //         if (response.status == '1') {
        //             window.loading.close();
        //             this.tableData5 = response.data.list
        //             this.footData = response.data.count
        //         } else if(response.status == '-1') {
        //             window.loading.close();
        //             this.$message.error(response.msg);
        //             this.$router.push({path: '/login'})  
        //         } else {
        //             window.loading.close();
        //             this.$message.error(response.msg);
        //         }
        //     })
        // }
    },
     mounted() {
        // this.loading()
        this.createMap()
        // this.getProList()
     }
 }
 </script>

 <style>
.XSDFXPage{
        width: 98%;
        height: 80vh;
        overflow: hidden;
        margin: 0;
        font-family: "微软雅黑";
        float: left;
}

.anchorBL {
    display: none;
}

.map {
    padding-top: 20px;
    padding-left: 20px
}

.map .el-table td {
    border-style: none;
    /* padding: 6px 0 */
}

.map .el-table .cell {
    padding-left: 0
}

.project-list {
    width: 30%;
    height: 67vh;
    box-sizing: border-box;
    border: 1px solid black;
    float: left;
    margin-left: 1%;
    padding: 10px;
    overflow: scroll;
}

.project-list .project-list-head {
    border-bottom: 1px solid black;
    overflow: hidden;
}

.project-list .project-list-head .title {
    font-size: 14px;
    float: left;
    line-height: 30px;
}



.project-list .project-list-search {
    margin-top: 5px;
}

.project-list .project-list-search .el-input__inner {
    height: 30px!important;
    /* line-height: 30px!important; */
}

.project-list .project-list-search .el-input__icon {
    line-height: 30px;
}

.project-list .project-list-search .el-button {
    padding: 6px 20px;
}

.project-list .el-table__expanded-cell {
    padding: 0 0 0 60px;
}

.project-list .el-table__expanded-cell[class*=cell] {
    padding: 0 0 0 55px!important
}

.project-list .el-table__expanded-cell .el-table td {
    padding: 5px 0!important;
}

.project-list .el-table thead:nth-child(2) {
    display: none;
}

.project-list .el-table__body-wrapper {
    overflow: visible;
}

.foot {
    clear: both;
    width: 90%;
    box-sizing: border-box;
    padding-top: 10px;
}

.bottomList {
    border: 1px solid #F4F3F8;
    background: #FBFBFB;
    /* background: rgb(129, 126, 126); */
    border-radius: 4px;
    height: 55px;
    line-height: 55px;
    padding-left: 15px;
    font-size: 13px
}

.bottomList span {
    font-size: 30px;
    color: blue;
    vertical-align: middle;
    margin-left: 10px;
}
 </style>
 
 