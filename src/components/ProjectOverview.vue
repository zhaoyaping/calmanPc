<template>
    <div class="P-O">
        <el-row :gutter="10" style="margin:0">
            <el-col :span="6">
                <div class="left">
                    <div class="projectMsg">
                        <ul>
                            <li>项目名称：{{projectMag.name}}</li>
                            <!-- <li>地址：<span :title='alt' style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">爱仕达多撒大大大大多撒多撒大大多</span></li> -->
                            <li :title="alt" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">地址：{{address}}</li>
                            <li>总装机容量：{{projectMag.allload}}</li>
                            <li>在线功率：{{projectMag.gonglv}}</li>
                        </ul>
                    </div>
                    <div class="project-map" id="project-map"></div>
                    <div class="projectMap"></div>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="right">
                    设备机组列表
                    <el-table :data="projectMag.device">
                        <el-table-column prop="name" label="设备名称" align="center"></el-table-column>
                        <el-table-column prop="type" label="型号" align="center"></el-table-column>
                        <el-table-column prop="cylinder" label="缸数" align="center"></el-table-column>
                        <el-table-column prop="zx" label="接触状态" align="center"></el-table-column>
                        <el-table-column prop="fhxs" label="负荷系数" align="center"></el-table-column>
                        <el-table-column prop="edgl" label="额定功率" align="center"></el-table-column>
                        <el-table-column prop="dhmdyz" label="蓄电池电压" align="center"></el-table-column>
                        <el-table-column prop="fdjzs" label="实际转速" align="center"></el-table-column>
                        <el-table-column prop="xdcdy1" label="实际电荷密度因子" align="center"></el-table-column>
                        <el-table-column label="实时监控">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="toRealTimeMonitor(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="折线图">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="toLineChart(scope.row)">查看</el-button>
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
            </el-col>
        </el-row> 
    </div>
</template>

<script>
import local from '@/API/local.js'
export default {
    name: 'projectOverview',
    props: ['childData'],
    data() {
        return {
            id2:'',
            msg: 'select01',
            address: '',
            alt: '',
            projectMag: {},
            currentPage: 1,
            pageSize: null,
            total: null
        }
    },
    // 监听父组件传过来的值，如果发生改变了，就用改变后的值去请求项目详情
    watch: {
        'childData': function(newa, olda) {
            if (newa) {
                this.getData()
            }
        }
    },
    methods: {
        toRealTimeMonitor(row) {
            // 给父组件传递一个用来切换到事件监控的值
            let data = {
                x: 'select2',
                id: row.id,
                proName: this.projectMag.name,
                devName:row.name
            }
            this.$emit("childToParent",data);
        },
        toLineChart(row) {
            let data = {
                x: 'select3',
                id: row.id,
                proName: this.projectMag.name,
                devName:row.name
            }
            this.$emit("child2ToParent",data);
        },
        addMarker() {
            // 百度地图API功能
            // 创建Map实例
            let map = new BMap.Map("project-map",{enableMapClick:true});
            // 初始化地图,设置中心点坐标和地图级别
            map.centerAndZoom(new BMap.Point(116.25, 39.54), 5);
            // 开启鼠标滚轮缩放      
            map.enableScrollWheelZoom(true)
            let point = new BMap.Point(this.projectMag.longitude, this.projectMag.latitude)
            let marker = new BMap.Marker(point);
            if (this.projectMag.longitude) {
                map.addOverlay(marker);
            }
            
        },
        getData() {
            if (!this.childData.id) {
                return false
            }
            this.loading()
            let data = {id: this.childData.id}
            $.post(local.localhost + '/index.php/Home/Monitor/Details',data).then((response) => {
                if (response.status == 1) {
                    this.projectMag = response.data
                    this.alt = response.data.address
                    this.pageSize = response.data.pageSize
                    this.total = response.data.total
                    this.address = response.data.address
                    this.addMarker()
                    for (let i = 0; i < this.projectMag.device.length; i++) {
                        if (this.projectMag.device[i].zx == '1') {
                            this.projectMag.device[i].zx = '运行中'
                        } else {
                            this.projectMag.device[i].zx = '已停止'
                        }
                    }
                    window.loading.close()
                } else if(response.status == '-1') {
                    window.loading.close()
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    window.loading.close()
                    this.$message.error(response.msg);
                }
            })
        },
        handleCurrentChange(currentPage) {
            let data = {'id': this.childData.id,'curPage': currentPage}
            $.post(local.localhost + '/index.php/Home/Monitor/Details', data).then((response) => {
                if (response.status == 1) {
                    this.projectMag = response.data
                } else {
                    this.$message.error(response.msg);
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
        } 
    },
    mounted() {
        this.getData()
    }
}
</script>

<style>
.P-O {
    width: 100%;
    /* height: 100%;  */
    /* background: blue; */ 
}

.projectMsg {
    background: #e1e0e0;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
}

.projectMsg li {
    height: 25px;
    line-height: 25px
}

.project-map {
    width: 100%;
    height: 60vh;
    margin-top: 15px;
}

.anchorBL {
    display: none;
}

.el-pagination {
    text-align: center
}
</style>
