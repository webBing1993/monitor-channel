<!-- 修改密码-->
<template>
  <div>
    <div class="passwordUpdate">
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="16">
              <img src="../../assets/index/logo.png" alt="">
            </el-col>
            <el-col :span="8">

            </el-col>
          </el-row>
        </el-header>
        <el-container>
          <div class="bg"><img src="../../assets/index/zhong.png" alt=""></div>
          <el-form :model="ruleForm" :rules="rules" label-position="left" ref="ruleForm" label-width="140px" class="demo-ruleForm">
            <el-form-item label="忘记密码">
            </el-form-item>
            <el-form-item label="手机号码" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请填写11位手机号码" type="tel" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="短息验证码" prop="code">
              <el-input placeholder="请填写短信验证码" maxlength="6" v-model="ruleForm.code" class="input-with-select">
                <el-button slot="append" @click="sendcode" :disabled="ruleForm.disabled">{{ ruleForm.text }}</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="设置新密码" prop="password">
              <el-input v-model="ruleForm.password" maxlength="16" placeholder="8-16位，必须包含数字和字母" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="text" @click="submitForm('ruleForm')">
                <img src="../../assets/index/querenxiugai.png" alt="">
              </el-button>
            </el-form-item>
          </el-form>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  export default {
    name: 'passwordUpdate',
    data () {
      return {
        ruleForm: {
          name: '',
          code: '',
          password: '',
          text: '获取验证码',
          time: 180,
          disabled: false
        },
        rules: {
          name: [
            { required: true, message: '请填写手机号码', trigger: 'blur' },
            { pattern: /^1\d{10}$/, message: '请填写11位手机号码' },
            { pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/, message: '请填写正确的手机号码' }
          ],
          code: [
            { required: true, message: '请填写短信验证码', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请设置新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '密码长度在 6 到 16 个字符之间', trigger: 'blur' },
            { pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/, message: '密码必须包含数字和字母' }
          ],
        }
      }
    },
    mounted () {

    },
    methods: {

      ...mapActions([
        'goto', 'getCode', 'updatgePassword'
      ]),

      // 返回上一页
      goBack() {
        this.goto(-1);
      },

      // 获取验证码
      sendcode() {
        let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
        if(this.ruleForm.name === ''){
          this.$message('请输入手机号码');
          return;
        }else if(!reg.test(this.ruleForm.name)){
          this.$message.error('手机格式不正确');
          return;
        }else {
          this.ruleForm.time = 180;
          this.ruleForm.disabled = true;
          this.getCode({
            data: {
              phone: this.ruleForm.name,
              type: 'key_channel'
            },
            onsuccess: body => {
              if (body.data.code == 0 || body.data.code == 30007) {
                if (body.data.data == '' || body.data.data == null) {
                  this.timer();
                }
                if (body.data.code != 0) {
                  this.$message.error(body.data.msg);
                }
              }else {
                this.$message.error(body.data.msg);
              }
            },
            onfail: body => {
              this.$message.error(body.data.msg);
            }
          })
        }
      },

      timer() {
        if (this.ruleForm.time > 0) {
          this.ruleForm.time--;
          this.ruleForm.text = this.ruleForm.time+"s后重新获取";
          setTimeout(this.timer, 1000);
        } else{
          this.ruleForm.time = 0;
          this.ruleForm.text = "重新获取";
          this.ruleForm.disabled = false;
        }
      },

      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              phone: this.ruleForm.name,
              code: this.ruleForm.code,
              password: this.ruleForm.password
            };
            this.updatgePassword({
              data: data,
              onsuccess: body => {
                  if (body.data.code == 0) {
                    this.$message({
                      type: 'success',
                      message: '密码修改成功，请重新登录'
                    });
                    setTimeout(() => {
                      this.goBack();
                    }, 1500)
                  }else {
                    this.$message.error(body.data.msg);
                  }
              },
              onfail: body => {
                this.$message.error(body.data.msg);
              },
              onerror: body => {
                this.$message.error(body.data.msg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

    },
    watch: {

    },
    beforeRouteLeave(to,from,next) {
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .passwordUpdate {
    .el-header {
      height: 58px !important;
      display: flex;
      align-items: center;
      padding: 10px 0;
      background-color: #041740;
      .el-row {
        width: 100vw;
        height: 100%;
        display: flex;
        align-items: center;
        .el-col-16 {
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
      }
    }
    .el-container {
      .el-container {
        /deep/ .el-form {
          padding-left: 20px;
          padding-top: 20px;
          .el-form-item:first-of-type {
            .el-form-item__label {
              font-size: 16px;
            }
          }
          .el-input__inner {
            background-color: transparent;
            color: #fff;
            border-color: #4F83D0;
          }
          .el-form-item__content {
            text-align: left;
          }
          .el-input-group__append {
            background-color: transparent;
            color: #3798FC;
            border-color: #3798FC;
          }
        }
        /deep/ .el-form-item__label {
          color: #fff;
        }
        .bg {
          position: fixed;
          z-index: -1;
          width: 100vw;
          height: calc(100vh - 60px);
          left: 0;
          top: 60px;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

</style>
