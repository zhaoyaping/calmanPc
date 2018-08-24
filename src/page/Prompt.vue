<template>
    <div class="prompt">
        <div class="head-v">
            <span class="logo"></span>
            <p class="txt">卡尔曼发电机组远程监控平台</p>
        </div>
        <div class="forget" id="forget-v">
            <p>{{ msg }}</p>
            <span class="tel">{{ tel }}</span>
            <el-button type="primary" style="width:130px" @click="toLogin">确定</el-button>
        </div>
    </div>
</template>

<script>
import local from '@/API/local.js'
export default {
    name: 'Prompt',
    data() {
        return {
            msg: '',
            tel: ''
        }
    },
    methods: {
        toLogin() {
            this.$router.push({path: '/Login'})
        }
    },
    mounted() {
        let _this = this
        $.post(local.localhost + '/index.php/Home/Login/PwdHelp').then(function(response) {
            if (response.status == '1') {
                _this.msg = response.data.txt
                _this.tel = response.data.tel
            } else {
                _this.$message.error(response.msg);
            }
        }).catch(function(error) {
            console.log(error)
        })
        
    }

}
</script>

<style>
.prompt {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: url(../assets/u376.jpg) no-repeat; 
    background-size: 100% 100%;  
}

.prompt .logo {
    display: block;
    float: left;
    width: 172px;
    height: 70px;
    background: url(../assets/u386.png) no-repeat; 
    background-size: 100% 100%;
}

.prompt .head-v {
    position: absolute;
    top: 7%;
    left: 250px;
    width: 60%;
}

.prompt .head-v .txt {
    display: inline;
    color: #fff;
    font-size: 30px;
    font-weight: 40;
    line-height: 70px;
    letter-spacing: 3px
}

.forget {
    width: 350px;
    height: 230px;
    background: #fff;
    opacity:0.9;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    padding-top: 100px;
}

.forget p {
    font-size: 20px;
}

.forget .tel {
    display: block;
    height: 100px;
    line-height: 100px;
    font-size: 28px;
    color: #cc3333;
}
</style>
