<template>
  <div>
    <div class="entry">
      <div class="bg">
        <img src="../assets/index/beijingtu.png" alt="">
      </div>
      <div :class="flagPc ? 'container_bg' : 'container_bg flagBodyContainer_bg'">
        <img src="../assets/index/denglukuang.png" alt="" ref="container_bg">
      </div>
      <div :class="flagPc ? 'body ' : 'body flagBody'">
        <div class="container" ref="container">
          <div class="inner_container">
            <p class="title">
              关键通道后台系统
            </p>
            <div class="phone">
              <div class="list">
                <i><img src="../assets/index/shoujihao.png" alt=""></i>
                <input name="phone" type="number" maxlength="11" placeholder="请输入11位手机号" v-model="phone"/>
              </div>
            </div>
            <div class="code">
              <div class="list">
                <i><img src="../assets/index/mima.png" alt=""></i>
                <input type="password" maxlength="16" placeholder="请输入密码" v-model="code"/>
              </div>
            </div>
            <div class="tig">
              <el-button type="text" @click="forgetPasswork">忘记密码</el-button>
            </div>
            <div class="btns">
              <el-button type="primary" class="login" :disabled="loginLoading"  @click="login()" >
                <img src="../assets/index/denglu.png" alt="">
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <p class="footer">上海复创科技提供技术支持</p>
    </div>
  </div>
</template>

<script>
  import {mapActions,mapMutations} from 'vuex';
export default {
  name: 'HelloWorld',
  data () {
    return {
      disabled:false,
      time:0,
      btntxt: "获取验证码",
      code: '',
      phone: '',
      flagPc: false,    // 判断是否为pc端
      entryAll: false,  // 判断是否可以点击确定按钮
      loginLoading: false, // 登录loading
    }
  },
  beforeMount() {
    let flag = this.IsPC();
    if (flag) {
      this.flagPc = true;
    }else {
      this.flagPc = false;
    }
  },
  mounted () {
      // 根据窗口调整大小
      window.onresize = () => {
        this.$refs.container.style.width = this.$refs.container_bg.offsetWidth+'px';
        this.$refs.container.style.height = this.$refs.container_bg.offsetHeight+'px';
      };

      setTimeout(() =>{
        this.offsetWidthHeight();
      }, 100)
  },
  methods:{

    ...mapActions([
      'goto',
      'getCode',
      'loginEntry'
    ]),

    ...mapMutations([
      'MYNAME',
      'TOKEN'
    ]),

    // 初始化宽高
    offsetWidthHeight() {
        console.log(this.$refs.container_bg.offsetWidth);
      this.$nextTick(() => {
        this.$refs.container.style.width = this.$refs.container_bg.offsetWidth+'px';
        this.$refs.container.style.height = this.$refs.container_bg.offsetHeight+'px';
      });
    },

    // 判断是否为PC端
    IsPC () {
      let userAgentInfo = navigator.userAgent;
      let Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
      let flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },

    //验证手机号码部分
    sendcode(){
      let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
      if(this.phone == ''){
        this.$message('请输入手机号码');
      }else if(!reg.test(this.phone)){
        this.$message.error('手机格式不正确');
      }else{
        this.time = 180;
        this.disabled = true;

        this.getCode({
          data: {
            phone: this.phone,
            type: 'key_channel'
          },
          onsuccess: body => {
            this.entryAll = true;
            if (body.data.code == 0) {
              if (body.data.data == '' || body.data.data == null) {
                this.timer();
              }
              if (body.data.data.code != 0) {
                this.$message.error(body.data.data.msg);
              }
            }else {
              this.$message.error(body.data.data.msg);
            }
          },
          onfail: body => {
            this.$message.error(body.data.msg);
          }
        })
      }
    },

    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time+"s后重新获取";
        setTimeout(this.timer, 1000);
      } else{
        this.time = 0;
        this.btntxt = "重新获取";
        this.disabled = false;
      }
    },

    // 登录
    login(){
      let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
      if(this.phone === ''){
        this.$message('请输入手机号码');
        return
      }else if(!reg.test(this.phone)){
        this.$message.error('手机格式不正确');
        return
        if (this.code === '') {
          this.$message('请输入验证码');
          return
        }else if (this.code.length < 6 || this.code.length > 16) {
          this.$message('请输入６到16位数密码');
          return
        }
      }else {
        if (this.code === '') {
          this.$message('请输入验证码');
          return
        }else if (this.code.length < 6 || this.code.length > 16) {
          this.$message('请输入６到16位数密码');
          return
        }else {
          this.loginLoading = true;
          this.loginEntry({
            data: {
              phone: this.phone,
              password: this.code
            },
            onsuccess: body => {
              console.log('body:',body);
              if (body.data.code == 0) {
                sessionStorage.setItem('myName',body.data.data.name);
                this.MYNAME(body.data.data.name);
                this.TOKEN(body.data.data.token);
                sessionStorage.session_id = body.data.data.token;
                sessionStorage.hotelName = body.data.data.hotelName;
                sessionStorage.hotelId = body.data.data.hotelId;
                sessionStorage.manage = body.data.data.manage;
                sessionStorage.roleId = body.data.data.role;
//                if (body.data.data.role == '') {
//                  this.goto('/keyChannel');
//                }else {
//                  this.goto('/keyChannel/home');
//                }
                this.goto('/keyChannel');
              }else {
                this.$message.error(body.data.msg);
              }
              this.loginLoading = false;
            },
            onfail: body => {
              this.loginLoading = false;
              this.$message.error(body.data.msg);
            }
          })
        }
      }

    },

    // 忘记密码
    forgetPasswork() {
      this.goto('/passwordUpdate');
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  * {
    padding: 0;
    margin: 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }

  .entry {
    .bg {
      position: fixed;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      left: 0;
      top: 0;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .container_bg {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    .flagBodyContainer_bg {
      width: 96vw;
      img {
        display: block;
        width: 100%;
      }
    }
    .body {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      .container {
        .inner_container {
          display: block;
          padding: 25px 30px;
          height: calc(100% - 50px);
          .title {
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 25px 0;
            margin-bottom: 40px;
          }
          .phone, .code {
            padding: 15px 60px;
            text-align: left;
            align-items: center;
            margin-bottom: 10px;
            display: flex;
            .list {
              border-bottom: 1px solid #296DA6;
              width: 100%;
              display: flex;
              align-items: center;
              padding: 8px 0;
            }
            i {
              width: 24px;
              height: 24px;
              display: inline-table;
              margin-right: 8px;
              img {
                display: inline-block;
                width: 100%;
                height: 100%;
              }
            }
            input {
              border: none;
              font-size: 16px;
              line-height: 30px;
              background-color: #103A72;
              color: #fff;
            }
            input:-moz-placeholder {
              color: #fff;
            }
            input:-ms-input-placeholder {
              color: #fff;
            }
            input::-moz-placeholder {
              color: #fff;
            }
            input::-webkit-input-placeholder {
              color: #fff;
            }
          }
          .tig {
            text-align: right;
            padding-right: 60px;
            button {
              color: #409EFF;
            }
          }
          .btns {
            padding: 0 60px;
          }
          .login {
            width: 100%;
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #fff;
            cursor: pointer;
            background-color: transparent;
            border: none;
            display: inline-block;
            img {
              width: 100%;
              display: block;
            }
          }
        }
      }
    }
    .flagBody {
      .container {
        .inner_container {
          .title {
            padding: 6px 0;
            margin-bottom: 20px;
            font-size: 20px;
          }
          .phone, .code {
            padding: 15px 40px;
            margin-bottom: 0;
          }
          .tig {
            padding-right: 40px;
          }
          .btns {
            padding: 0 40px;
            .login {
              margin-top: 10px;
            }
          }
        }
      }
    }

    .footer {
      position: fixed;
      bottom: 40px;
      left: 50%;
      color: #9B9B9B;
      font-size: 14px;
      transform: translateX(-50%);
    }
  }

  input:focus, input:active:focus, button:focus {
    outline: none;
    border-color: transparent;
    box-shadow:none;
  }

</style>
