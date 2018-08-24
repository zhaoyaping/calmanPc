<template>
    <div class="L-C">
        <p class="title">历史数据折线图</p>
        <span calss="second-title" style="position: relative;font-size:20px;left:55%">——{{childId.proName}}{{childId.devName}}</span>
        <div id="myChart" :style="{width: '1000px', height: '450px',margin: '0 auto'}"></div>
    </div>
</template>

<script>
import local from '@/API/local.js'
export default {
    name: 'lineChart',
    props: ['childId'],
    data() {
        return {
            deviceId: this.childId.id,
            parameter: [],
            parameter1: [],
            parameter2: [],
            parameter3: [],
            parameter4: [],
            parameter5: [],
            parameter6: [],
            newData: [],
            time: []
        }
    },
    created() {
       
        
    },
    watch: {
        'childId': function(newId, oldId) {
            if (newId) {
                this.getData()
            }
        }
    },
    methods: {
         getDate() {
            let date = new Date()
            let h = date.getHours()
            let m = date.getMinutes()
            let s = date.getSeconds()
            let now = (h < 10 ? "0" + h : h) + ':'+(m < 10 ? "0" + m : m)+':' + (s < 10 ? "0" + s : s)
            this.time = now
        },
        getData() {
            this.loading()
            let data1 = {'id': this.childId.id}
            // 初始化时请求前一分钟的数据
            let columnArr = []
            $.post(local.localhost + '/index.php/Home/Monitor/History',data1).then((response) => {
                if (response.status == 1) {
                    // 拿到每个参数的名字
                    this.parameter = response.data.hname
                    for (let i = 0; i < response.data.hname.length; i++) {
                        columnArr[i] = response.data.hname[i].column;
                    }
                    let parameter1 = []
                    let parameter2 = []
                    let parameter3 = []
                    let parameter4 = []
                    let parameter5 = []
                    let parameter6 = []
                    if (response.data.data.length > 0) {
                        console.log(111)
                        // 如果返回的历史数据有东西
                        // 遍历拿到的数据，拿出数据
                        for (let i = 0; i < response.data.data.length; i = i + 2) {
                            parameter1.push(response.data.data[i][response.data.hname[0].column])
                            this.parameter1 = parameter1
                            
                            parameter2.push(response.data.data[i][response.data.hname[1].column])
                            this.parameter2 = parameter2
                            
                            parameter3.push(response.data.data[i][response.data.hname[2].column])
                            this.parameter3 = parameter3

                            parameter4.push(response.data.data[i][response.data.hname[3].column])
                            this.parameter4 = parameter4

                            parameter5.push(response.data.data[i][response.data.hname[4].column])
                            this.parameter5 = parameter5

                            parameter6.push(response.data.data[i][response.data.hname[5].column])
                            this.parameter6 = parameter6
                        }
                    } else {
                        console.log(222)
                        //如果返回的历史数据没有数据
                        //就把前一分钟的数据都显示0
                        for (let i = 0; i < 30; i++) {
                            parameter1.push(0)
                            this.parameter1 = parameter1
                            
                            parameter2.push(0)
                            this.parameter2 = parameter2
                            
                            parameter3.push(0)
                            this.parameter3 = parameter3

                            parameter4.push(0)
                            this.parameter4 = parameter4

                            parameter5.push(0)
                            this.parameter5 = parameter5

                            parameter6.push(0)
                            this.parameter6 = parameter6
                        }
                    }
                    console.log('787878')
                    this.getDate()
                    let myChart = this.$echarts.init(document.getElementById('myChart'))
                    // 绘制图表
                    let option = {
                        title: {
                            text: '',
                            subtext: ''
                        },
                        grid: {
                            top: '30%',
                            left: '30%'
                        },
                        legend: {
                            data:[this.parameter[0].txt, this.parameter[1].txt, this.parameter[2].txt, this.parameter[3].txt, this.parameter[4].txt, this.parameter[5].txt]
                        },
                        xAxis: 
                            {
                                type: 'category',
                                boundaryGap: true,
                                axisLabel:{rotate:30,interval:4},
                                axisLine:{onZero: false,lineStyle:{color:'green'}},
                                data:[
                                    "-60s","-58s","-56s","-54s","-52s","-50s","-48s","-46s","-44s","-42s","-40s","-38s","-36s","-34s","-32s","-30s","-28s","-26s","-24s","-22s","-20s","-18s","-16s","-14s","-12s","-10s","-8s","-6s","-4s","-2s",this.time,
                                    ]
                            },
                        yAxis: [
                            {
                                type: 'value',
                                scale: true,
                                name: this.parameter[0].txt + '℃',
                                nameRotate: 90,
                                max: 100,
                                min: 0,
                                boundaryGap: [0.1, 0.1]
                            },
                            {
                                type: 'value',
                                scale: true,
                                name: this.parameter[1].txt + 'kPa',
                                nameRotate: 90,
                                max: 500,
                                min: 0,
                                position: 'left',
                                offset: 40,
                                boundaryGap: [0.2, 0.2]
                            },
                            {
                                type: 'value',
                                scale: true,
                                name: this.parameter[2].txt + 'kw',
                                nameRotate: 90,
                                max: 2000,
                                min: 0,
                                position: 'left',
                                offset: 80,
                                boundaryGap: [0.2, 0.2]
                            },
                            {
                                type: 'value',
                                scale: true,
                                name: this.parameter[3].txt + '%',
                                nameRotate: 90,
                                max: 100,
                                min: 0,
                                position: 'left',
                                offset: 120,
                                boundaryGap: [0.2, 0.2]
                            },
                            {
                                type: 'value',
                                scale: true,
                                name: this.parameter[4].txt + '%',
                                nameRotate: 90,
                                max: 100,
                                min: 0,
                                position: 'left',
                                offset: 160,
                                boundaryGap: [0.2, 0.2]
                            },
                            {
                                type: 'value',
                                scale: true,
                                name: this.parameter[5].txt + '%',
                                nameRotate: 90,
                                max: 100,
                                min: 0,
                                position: 'left',
                                offset: 200,
                                boundaryGap: [0.2, 0.2]
                            }
                        ],
                        series: [
                            {
                                name: this.parameter[0].txt,
                                type:'line',
                                yAxisIndex: 0,
                                label:{
                                    normal:{
                                    show:true
                                    }
                                },
                                data:(this.parameter1)
                            },
                            {
                                name: this.parameter[1].txt,
                                type:'line',
                                yAxisIndex: 1,
                                label:{
                                    normal:{
                                    show:true
                                    }
                                },
                                data:(this.parameter2)
                            },
                            {
                                name: this.parameter[2].txt,
                                type:'line',
                                yAxisIndex: 2,
                                label:{
                                    normal:{
                                    show:true
                                    }
                                },
                                data:(this.parameter3)
                            },
                            {
                                name: this.parameter[3].txt,
                                type:'line',
                                yAxisIndex: 3,
                                label:{
                                    normal:{
                                    show:true
                                    }
                                },
                                data:(this.parameter4)
                            },
                            {
                                name: this.parameter[4].txt,
                                type:'line',
                                yAxisIndex: 4,
                                label:{
                                    normal:{
                                    show:true
                                    }
                                },
                                data:(this.parameter5)
                            },
                            {
                                name: this.parameter[5].txt,
                                type:'line',
                                yAxisIndex: 5,
                                label:{
                                    normal:{
                                    show:true
                                    }
                                },
                                data:(this.parameter6)
                            }
                        ]
                    };
                    app.count = 11;
                    let that = this
                    window.lineChart = setInterval(function (){
                        let data = {'type': 'H'}
                        that.getDate()
                        // 请求实时数据
                        $.post(local.localhost + '/index.php/Home/Monitor/GetData',data).then((response) => {
                            if (response.status == 1) {
                                window.loading.close()
                                let data0 = option.series[0].data
                                let data1 = option.series[1].data
                                let data2 = option.series[2].data
                                let data3 = option.series[3].data
                                let data4 = option.series[4].data
                                let data5 = option.series[5].data
                                data0.shift();
                                data0.push(response.data[columnArr[0]]);
                                data1.shift();
                                data1.push(response.data[columnArr[1]]);
                                data2.shift();
                                data2.push(response.data[columnArr[2]]);
                                data3.shift();
                                data3.push(response.data[columnArr[3]]);
                                data4.shift();
                                data4.push(response.data[columnArr[4]]);
                                data5.shift();
                                data5.push(response.data[columnArr[5]]);
                                option.xAxis.data.pop();
                                option.xAxis.data.push(that.time)
                                
                                myChart.setOption(option);
                            } else {
                                clearInterval(window.lineChart)
                            }
                        })
                        
                    }, 2000);
                } else if(response.status == '-1') {
                    window.loading.close()
                    this.$message.error(response.msg);
                    this.$router.push({path: '/login'})  
                } else {
                    window.loading.close()
                    this.$message.error(response.msg);
                    if (this.$echarts.init(document.getElementById('myChart'))) {
                        this.$echarts.init(document.getElementById('myChart')).dispose()
                    }
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
    destroyed() {
        clearInterval(window.lineChart)
    }

}
</script>

<style>
.L-C {
    width: 100%;
}

.L-C .title {
    text-align: center;
    font-size: 30px;
}
</style>
