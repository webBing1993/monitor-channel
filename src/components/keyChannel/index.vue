<template>
  <div>
    <div class="key_channel">
      <el-container>
        <el-header>
          <el-row class="headerTab">
            <el-col :span="12" class="headerTabL">
              <img src="../../assets/index/logo.png" alt="">
              <div class="tabs">
                <span :class="handleIndex == 1 ? 'active' : ''" @click="handleClick(1)"><img :src="handleIndex == 1 ? handerImg.img[1] : handerImg.img[0]" alt="">首页</span>
                <span :class="handleIndex == 2 ? 'active' : ''" @click="handleClick(2)"><img :src="handleIndex == 2 ? handerImg.img[1] : handerImg.img[0]" alt="">设置</span>
                <span :class="handleIndex == 3 ? 'active' : ''" @click="handleClick(3)" v-if="massage"><img :src="handleIndex == 3 ? handerImg.img[1] : handerImg.img[0]" alt="" >设备监控</span>
                <span :class="handleIndex == 4 ? 'active' : ''" @click="handleClick(4)"><img :src="handleIndex == 2 ? handerImg.img[1] : handerImg.img[0]" alt="">进出记录</span>
              </div>
            </el-col>
            <el-col :span="12">
              <el-row class="ownInfo">
                <el-col :span="13">
                  <div class="passContact">
                    <el-button @click="changePhone">
                      <span>添加设备异常通知手机号 <span>{{ phone }}</span></span>
                      <span v-if="phone !== ''">修改</span>
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="11">
                  <div class="name_logout">
                    <img src="../../assets/index/diwen.png" alt="">
                    <span class="name"><img src="../../assets/index/geren.png" alt=""><span>欢迎您，{{myName}}</span></span>
                    <span class="logout" @click="logout">退出</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-header>
        <el-container>
          <router-view  :handleTabIndex="handleTabIndex"></router-view>
        </el-container>
      </el-container>
    </div>
    <div class="statusTip" v-if="statusTip">
      <div class="shadow" @click="statusTipCancle"></div>
      <div class="tip_container">
        <div class="tip_title">
          <span>接收设备异常通知手机号</span>
          <i class="el-icon-close" @click="statusTipCancle"></i>
        </div>
        <el-form :model="changeItem" :rules="rules" label-position="left" ref="changeItem" label-width="140px" class="demo-ruleForm">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="changeItem.phone" placeholder="请输入手机号码" type="tel" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input placeholder="请输入验证码" maxlength="6" v-model="changeItem.code" class="input-with-select">
              <el-button slot="append" @click="sendcode" :disabled="changeItem.disabled">{{ changeItem.text }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('changeItem')">
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  export default {
    name: 'keyChannel',
    data () {
      return {
        roleShow: sessionStorage.roleId != '' ? true : false,  // 判断权限
        myName: '',
        handleIndex: 1,
        handleTabIndex: '',
        handerImg: {
          img: [require('../../assets/index/topweixuan.png'),require('../../assets/index/topxuanzhong.png')],
        },
        massage: sessionStorage.manage == 'true' ? true :false,
        phone: '',
        statusTip: false,    // tip显示
        changeItem: {
          phone: '',
          code: '',
          text: '获取验证码',
          time: 180,
          disabled: false
        },
        rules: {
          phone: [
            { required: true, message: '请填写手机号码', trigger: 'blur' },
            { pattern: /^1\d{10}$/, message: '请填写11位手机号码' },
            { pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/, message: '请填写正确的手机号码' }
          ],
          code: [
            { required: true, message: '请填写短信验证码', trigger: 'blur' },
          ],
        },
      }
    },
    mounted () {
      this.myName = sessionStorage.getItem('myName');
      this.handleIndex = sessionStorage.getItem('handleIndex') ? sessionStorage.getItem('handleIndex') : 1;
      this.getHotelNotifier();
    },
    methods: {

      ...mapActions([
        'replaceto', 'notifier', 'geNotifiertCode', 'updateNotifier'
      ]),

      // 退出事件
      logout () {
        sessionStorage.removeItem('tab');
        this.replaceto('/');
      },

      // tab点击事件
      handleClick(tab) {
          console.log('tab', tab);
        sessionStorage.setItem('handleIndex', tab);
        this.handleIndex = tab;
        this.handleTabIndex = tab+'&'+new Date().getTime();
        if (tab == 1) {
          this.replaceto('keyChannel')
//          this.replaceto('home')
        }else if(tab == 2) {
          this.replaceto('whiteList')
        }else if(tab == 3) {
          this.replaceto('hotelStatus');
        }else {
          this.replaceto('recode');
        }
      },

      // 获取酒店通知者
      getHotelNotifier() {
          this.notifier({
            onsuccess: body => {
                if (body.data.code == 0) {
                    this.phone = body.data.data.phone;
                }
            },
            onfail: body => {

            },
            onerror: body => {

            }
          })
      },

      // 修改手机号
      changePhone() {
//        if (this.phone !== '') {
//            this.changeItem.phone = this.phone;
//        }
        this.changeItem.phone = '';
        this.statusTip = true;
      },

      // 隐藏弹框tip
      statusTipCancle() {
        this.statusTip = false;
      },

      // 保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              phone: this.changeItem.phone,
            };
            this.updateNotifier({
              data: data,
              code: this.changeItem.code,
              onsuccess: body => {
                  if (body.data.code == 0) {
                    this.$message({
                      type: 'success',
                      message: '账号绑定成功'
                    });
                    this.phone = this.changeItem.phone;
                    this.statusTip = false;
                  }
              }
            })
          } else {
            return
          }
        })
      },

      // 获取验证码
      sendcode() {
        let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
        if(this.changeItem.phone === ''){
          this.$message('请输入手机号码');
          return;
        }else if(!reg.test(this.changeItem.phone)){
          this.$message.error('手机格式不正确');
          return;
        }else {
          this.changeItem.time = 180;
          this.changeItem.disabled = true;
          this.geNotifiertCode({
            data: {
              phone: this.changeItem.phone,
            },
            onsuccess: body => {
                console.log(5555545444);
              if (body.data.code == 0 || body.data.code == 30007) {
                this.timer();
                if (body.data.code != 0) {
                  this.$message.error(body.data.msg);
                }
              }
            }
          })
        }
      },

      timer() {
        if (this.changeItem.time > 0) {
          this.changeItem.time--;
          this.changeItem.text = this.changeItem.time+"s后重新获取";
          setTimeout(this.timer, 1000);
        } else{
          this.changeItem.time = 0;
          this.changeItem.text = "重新获取";
          this.changeItem.disabled = false;
        }
      },

    },
    watch: {
      'myName': function (val) {
        if (val === '') {
          this.replaceto('/');
        }
      }
    },
    beforeRouteLeave(to,from,next) {
      if (to.path == '/') {
        sessionStorage.removeItem('handleIndex');
      }
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .key_channel {
    .el-header {
      display: flex;
      align-items: center;
      padding: 10px 0;
      background-color: #041740;
      .headerTab {
        width: 100vw;
        height: 100%;
        display: flex;
        align-items: center;
        .headerTabL {
          text-align: left;
          padding-left: 15px;
          position: relative;
          img {
            max-height: 38px;
          }
          .tabs {
            position: absolute;
            left: 240px;
            top: 50%;
            transform: translateY(-50%);
            span {
              position: relative;
              margin-right: 8px;
              color: #3798FC;
              font-size: 14px;
              text-align: center;
              line-height: 30px;
              display: inline-block;
              width: 66px;
              cursor: pointer;
              img {
                position: absolute;
                left: 0;
                top: 0;
                height: 30px;
                display: inline-block;
                width: 66px;
                z-index: -1;
              }
            }
            span.active {
              color: #fff;
            }
          }
        }
        /deep/ .el-tabs__header {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /deep/ .el-tabs__nav-wrap::after {
          display: none;
        }
        /deep/ .el-tabs__content {
          display: none;
        }
        /deep/ .el-tabs__item {
          font-size: 16px;
        }
        /deep/ .el-tabs__active-bar {
          display: none;
        }
        .ownInfo {
          display: flex;
          align-items: center;
        }
        .passContact {
          /deep/ .el-button {
            border: 1px solid #4F83D0;
            border-radius: 4px;
            background-color: transparent;
            color: #3798FC;
            font-size: 12px;
            span {
              span {
                span {
                  color: #A6ADB4;
                  margin: 0 20px 0 10px;
                }
              }
            }
          }
        }
        .name_logout {
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 48px;
          position: relative;
          .name {
            width: 50%;
            font-size: 14px;
            color: #3798FC;
            display: inline-flex;
            align-items: center;
            position: absolute;
            right: 110px;
            img {
              display: inline-flex;
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
            span {
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              display: inline-flex;
            }
          }
          .logout {
            position: absolute;
            right: 30px;
            font-size: 14px;
            color: #fff;
            padding: 0 30px;
            cursor: pointer;
          }
        }
        .name_logout>img {
          position: absolute;
          display: inline-block;
          width: 100%;
          left: 0;
          top: 0;
        }
      }
    }
  }

  .statusTip {
    .shadow {
      opacity: 0.5;
      background: #000000;
      position: fixed;
      width: 100vw;
      height: 100vh;
      z-index: 1002;
      left: 0;
      top: 0;
    }
    .tip_container {
      min-width: 35vw;
      padding: 30px 20px;
      position: fixed;
      z-index: 1005;
      background: #FFFFFF;
      border-radius: 2px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .tip_title {
        margin-bottom: 22px;
        color: #303133;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      /deep/ .el-form-item {
        .el-form-item__content {
          text-align: left;
        }
      }
      .tip_btns {
        margin-top: 30px;
        text-align: center;
      }
      /deep/ .el-date-editor .el-range__close-icon {
        display: none;
      }
      /deep/ .el-date-editor .el-range-separator {
        width: 10%;
      }
      /deep/ .el-range-editor.el-input__inner {
        width: 60%;
      }
    }
  }

</style>
