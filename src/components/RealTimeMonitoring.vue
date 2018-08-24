<template>
    <div class="R-T-M">
        <p class="title">{{childId.proName}}{{childId.devName}}</p>
        <div class="top-data">
            <span class="top-cell" v-for="item in deviceData.top" :key="item.id">{{item.txt}}<span style="color:green;" :id='item.column'></span>{{item.dw}}</span>
        </div>
        <div class="positive">
            <div class="box" style="position:relative">
                <div class="pic" id="picA">
                    <img :src="deviceData.imga" alt="">
                    <!-- <img src="http://calman.jctmj.net/Uploads/G3516C/a.jpg" alt=""> -->
                </div>
                <p class="pic-txt" v-for="item in signA" :key="item.id" :style='{position:"absolute",color:"green",top:(item["t_y"]-0) * n / height1 * 100 +"%",left:(item["t_x"]-0) * n / width1 * 100+"%"}'>
                    {{item.txt}}
                    <span :class="item.column" style="color:green"></span>
                    {{item.dw}}
                </p>
            </div>
            <div class="bottom-data">
                <ul class="left" v-show="isShow">
                    <li class="cell head-cell">缸号</li>
                    <li class="cell main-cell" style="height:150px;line-height:150px">缸温</li>
                    <li class="cell main-cell" style="line-height:35px">次级<br>电压</li>
                    <li class="cell main-cell" style="line-height:35px">爆震<br>水平</li>
                </ul>
                <ul class="head-nums">
                    <li class="head-num" v-for="item in (cylinder/2)" :key="item.id">{{2 * item - 1}}</li>
                </ul>
                <ul class="data-nums">
                    <li class="data-gw" :id="item.column" v-for="item in gw" :key="item.id" v-bind:style="{height:'150px', width:100 / (cylinder / 2) + '%' }"></li>
                </ul>
                <ul class="data-nums">
                    <li class="data-list" :id="item.column" v-for="item in dy" :key="item.id" style="color:green"></li>
                </ul>
                <ul class="data-nums">
                    <li class="data-list" :id="item.column" v-for="item in sp" :key="item.id" style="color:green"></li>
                </ul>
            </div>
        </div>
        <div class="negative">
            <div class="box" style="position:relative">
                <div class="pic" id="picB">
                    <img :src="deviceData.imgb" alt="">
                    <!-- <img src="http://calman.jctmj.net/Uploads/G3516C/b.jpg" alt=""> -->
                </div>
                <p class="pic-txt" v-for="item in signB" :key="item.id" :style='{position:"absolute",color:"green",top:(item["t_y"]-0) * n1 / heightB * 100 + "%",left:(item["t_x"]-0) * n1 / widthB * 100 + "%"}'>
                    {{item.txt}}
                    <span :class="item.column" style="color:green"></span>
                    {{item.dw}}
                </p>
            </div>
            <div class="bottom-data">
                <ul class="left" v-show="isShow">
                    <li class="cell head-cell">缸号</li>
                    <li class="cell main-cell" style="height:150px;line-height:150px">缸温</li>
                    <li class="cell main-cell" style="line-height:35px">次级<br>电压</li>
                    <li class="cell main-cell" style="line-height:35px">爆震<br>水平</li>
                </ul>
                <ul class="head-nums">
                    <li class="head-num" v-for="item in (cylinder/2)" :key="item.id">{{2 * item}}</li>
                </ul>
                <ul class="data-nums">
                    <li class="data-gw" :id="item.column" v-for="item in gwB" :key="item.id" v-bind:style="{height:'150px', width:100 / (cylinder / 2) + '%' }"></li>
                </ul>
                <ul class="data-nums">
                    <li class="data-list" :id="item.column" v-for="item in dyB" :key="item.id" style="color:green"></li>
                </ul>
                <ul class="data-nums">
                    <li class="data-list" :id="item.column" v-for="item in spB" :key="item.id" style="color:green"></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import local from '@/API/local.js'
export default {
    name: 'realTimeMonitoring',
    props: ['childId'],
    data() {
        return {
            deviceData: {
                topA: [],
                topB: [],
                top: '',
                imga: '',
                imgb: '',
            },
            sign: [],
            n: '0.3937677053824363',    //正面原图与实际展示图片的比例
            n1: '0.41814814814814816',  //反面原图与实际展示图片的比例
            width1: '',
            height1: '',
            widthB: '',
            heightB: '',
            cylinder: '',
            gw1: [],
            gw2: [],
            gw: [],
            dy: [],
            sp: [],
            gwB: [],
            dyB: [],
            spB: [],
            gwDataA: {},
            gwDataB: {},
            gwData: null,
            firstGw: null,
            isShow: false
        }
    },
    computed: {
        // 截取出正面图片上的文字
        signA: function() {
            return this.sign.filter(function(item) {
                return item.img_ == 'a'
            })
        },
        // 截取出反面图片上的文字
        signB: function() {
            return this.sign.filter(function(item) {
                return item.img_ == 'b'
            })
        },
    },
    watch: {
        // 监听传过来的设备的id，并用传过来的id去请求该设备的信息
        childId: function(newId, oldId) {
            if (newId) {
                this.getData()
            }
        }
    },
    methods: {
        initEcharts() {
            for (let i = 0; i < this.firstGw.length; i++) {
                let widthBars = $('#' + this.firstGw[i].column).width() * 0.5
                let ofset = -(($('#' + this.firstGw[i].column).width() - widthBars) / 2)
                let myChart = this.$echarts.init(document.getElementById(this.firstGw[i].column))
                let data = [20];
                let xMax = 650;
                let axisColor = '#fff';
                let option = {
                    grid: {
                        left: 0,
                        right: 0,
                        top: '10%',
                        bottom: '20%',
                        containLabel: true
                    },
                    yAxis: [{
                        min:0,
                        max:650,
                        position:'left',
                        offset: ofset,
                        axisTick: {
                            show: true,
                            inside:true,
                            // color:'#fff',
                        },
                        axisLine: {
                            lineStyle:{
                                color:'black',
                            }
                        },
                        axisLabel: {
                            show: false,
                        },
                        splitLine: {
                            show: false,
                        },
                        splitNumber :5,
                    }],
                    xAxis: [{
                        type: 'category',
                        data: ['温度'],
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff',
                            }
                        }

                    }],
                    series: [{
                        name: ' ',
                        type: 'bar',
                        barWidth: widthBars,
                        silent: true,
                        itemStyle: {
                            normal: {
                                color: 'rgba(220,220,220,0.8)',
                            }
                        },
                        barGap: '-100%',
                        data: data.map(function(d) {
                            return xMax
                        }),
                    }, {
                        name: '温度',
                        type: 'bar',
                        barWidth: widthBars,
                        label: {
                            normal: {
                                show: true,
                                position: 'bottom',
                                formatter: function(o){
                                    return o.value;
                                },
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [0, 0, 0, 0],
                                color: {
                                    type: 'bar',
                                    colorStops: [{
                                        offset: 0,
                                        color:"#B1FE40",
                                    }, {
                                        offset: 1,
                                        color:"#B1FE40",
                                    }],
                                    globalCoord: false, // 缺省为 false
                                }
                            }
                        },
                        data: [this.gwData[this.firstGw[i].column]],
                    }]
                };
                myChart.setOption(option)
                
            }
        },
        
        getData() {
            if (!this.childId.id) {
                this.isShow = false
                return false
            }
            this.loading()
            // 第一次请求，拿到数据前面的文字
            let data = {'id': this.childId.id}
            $.post(local.localhost + '/index.php/Home/Monitor/Current',data).then((response) => {
                if (response.status == '1') {
                    
                    this.deviceData.topA = response.data.tab_a.top
                    this.deviceData.topB = response.data.tab_b.top
                    this.deviceData.top = response.data.tab_a.top.concat(response.data.tab_b.top)
                    this.deviceData.imga = response.data.img.img_a
                    this.deviceData.imgb = response.data.img.img_b
                    this.sign = response.data.sign
                    this.cylinder = response.data.cylinder
                    this.gw = response.data.tab_a.gw
                    this.dy = response.data.tab_a.dy
                    this.sp = response.data.tab_a.bz
                    this.gwB = response.data.tab_b.gw
                    this.firstGw = response.data.tab_a.gw.concat(response.data.tab_b.gw)
                    this.dyB = response.data.tab_b.dy
                    this.spB = response.data.tab_b.bz
                    this.isShow = true
                    
                } else if(response.status == '-1') {
                    window.loading.close()
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    window.loading.close()
                    this.isShow = false
                    this.$message.error(response.msg);
                }
            })
            // 请求页面上数据的接口
            let _this = this
            window.realTime = setInterval(function(){
                _this.secondQuest()
            },2000)
        },
        // 第二次请求
        secondQuest() {
            let data1 = {'id': this.childId.id, 'type': 'C'}
            let that = this
            $.post(local.localhost + '/index.php/Home/Monitor/GetData',data1).then((response) => {
                if (response.status == '1') {
                    window.loading.close()
                    that.gwDataA = response.data.a.gw
                    that.gwDataB = response.data.b.gw
                    let gw = response.data.a.gw
                    // that.initEcharts(gw)
                    let gwB = response.data.b.gw
                    // that.initEcharts(gwB)
                    that.gwData = Object.assign(response.data.a.gw,response.data.b.gw)
                    
                    that.initEcharts()
                    let data = Object.assign(response.data.a.top, response.data.b.top)
                    for (let key in data) {
                        $('#' + key).text(data[key])
                    }
                    
                    // 正反面图片上的数据
                    let sign = response.data.sign
                    for (let i in sign) {
                        $('.'+i).text(sign[i])
                    }
                    
                    // 正面电压的数据
                    let dys = response.data.a.dy
                    for (let key in dys) {
                        $('#' + key).text(dys[key])
                    }
                    // 正面爆震水平的数据
                    let sps = response.data.a.bz
                    for (let key in sps) {
                        $('#' + key).text(sps[key])
                    }
                    
                    // 反面电压的数据
                    let dyB = response.data.b.dy
                    for (let key in dyB) {
                        $('#' + key).text(dyB[key])
                    }
                    // 反面爆震水平的数据
                    let spB = response.data.b.bz
                    for (let key in spB) {
                        $('#' + key).text(spB[key])
                    }
                } else if(response.status == 0) {
                    window.loading.close()  
                    that.$message.error(response.msg)
                    clearInterval(window.realTime)
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

    },
    updated() {
        let width1 = $("#picA").width()  //取到实际展示的宽度
        let height1 = $('#picA').height()
        this.width1 = width1
        this.height1 = height1
        let widthB = $("#picB").width()
        let heightB = $('#picB').height()
        this.widthB = widthB
        this.heightB = heightB
        // 计算正面原图与实际展示图片的比例
        let img = new Image()
        img.src = this.deviceData.imga
        let _this = this
        img.onload = function() {
            let width = img.width
            _this.n = _this.width1 / width
        }
        // 计算反面原图与实际展示图片的比例
        let img1 = new Image()
        img1.src = this.deviceData.imgb
        img1.onload = function() {
            let width = img1.width
            _this.n1 = _this.width1 / width
        }
        
    },
    destroyed () {
        clearInterval(window.realTime)
    }

}
</script>

<style>
.R-T-M {
    width: 100%;
    height: 100%;
}

.R-T-M .title {
    text-align: center;
    font-size: 30px;
}

.R-T-M .positive, .R-T-M .negative {
    width: 50%;
    float: left;
}

.R-T-M .top-head {
    text-align: center;
    height: 30px;
    line-height: 30px;
}

.R-T-M .positive .top-cell:nth-child(1), .R-T-M .positive .top-cell:nth-child(2) {
    width: 50%;
    display: inline-block
}

.R-T-M .top-data span:nth-child(1), .R-T-M .top-data span:nth-child(2) {
    width: 50%;
}

.R-T-M .top-cell {
    display: inline-block;
    width: 25%;
    text-align: center;
    box-sizing: border-box;
    height: 32px;
    line-height: 32px;
    border: 1px solid rgb(122, 121, 121);
    font-size: 10px;
}

.top-cell1 {
    /* width: 100%; */
    height: 30px;
    display: block;
    border: 1px solid rgb(122, 121, 121);
} 

.R-T-M .pic {
    width: 100%;
    /* height: 300px; */
}

.R-T-M .pic img {
    width: 100%;
    height: 100%
}

.pic-txt {
    font-size: 9px;
}

.bottom-data {
    width: 100%;
}

.bottom-data .left {
    float: left;
    width: 11%;
}

.bottom-data .left .cell {
    width: 100%;
    border: 1px solid rgb(122, 121, 121);
    text-align: center;
    box-sizing: border-box
}

.bottom-data .left .head-cell {
    height: 50px;
    line-height: 50px;
}

.bottom-data .left .main-cell {
    height: 70px;
    line-height: 70px
}

.bottom-data .head-nums {
    overflow: hidden;
    width: 89%;
    display: flex
}

.bottom-data .head-num {
    float: left;
    height: 50px;
    line-height: 50px;
    text-align: center;
    flex: 1;
    border: 1px solid rgb(122, 121, 121);
    box-sizing: border-box
}

.bottom-data .data-nums {
    width: 89%;
    overflow: hidden;
    display: flex
}

.bottom-data .data-gw {
    float: left;
    border: 1px solid rgb(122, 121, 121);
    box-sizing: border-box;
}

.sixteen {
    width: 12.5%
}

.twenty {
    width: 10%
}

.bottom-data .data-list {
    flex: 1;
    float: left;
    height: 70px;
    line-height: 70px;
    border: 1px solid rgb(122, 121, 121);
    text-align: center;
    box-sizing: border-box;
}

.data-gw div, .data-gw canvas {
    width: 100%;
}
</style>
