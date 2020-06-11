<!-- 白名单-->
<template>
  <div>
    <div class="whiteList" v-show="showTrue">
      <div class="bg" ref="bgHeight"><img src="../../assets/index/baimingdan.png" alt=""></div>
      <div class="whiteContent" ref="whiteContent">
        <div class="white_title">
          白名单
        </div>
        <div class="search_add">
          <div class="add" @click="add"><img src="../../assets/index/tianjia.png" alt=""></div>
          <div class="search">
            <input type="text" v-model="name" placeholder="请输入人员姓名">
            <span  @click="reach"><img src="../../assets/index/sousuo.png" alt=""></span>
            <!--<i @click="reach"><img src="../../assets/index/sousuo@2x.png" alt=""></i>-->
          </div>
        </div>
        <div v-if="whiteList.length != 0" class="whiteLists">
          <el-row :gutter="8">
            <el-col :span="6"  v-for="item in whiteList" v-bind:key="item.id">
              <div class="grid-content">
                <div class="img">
                  <img :src="item.imgUrl" alt=""  @click="bigImgShow(item.imgUrl)">
                </div>
                <div class="content">
                  <p>工作人员</p>
                  <div class="name"><span>姓名：</span>{{item.name}}</div>
                  <div class="name"><span>允许滞留：</span>{{item.retentionTime ? item.retentionTime + '分钟' : ''}}</div>
                  <div class="remove" @click="remove(item)"><img src="../../assets/index/shanchu.png" alt=""></div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="20"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
        <div class="noMsg" v-else>
          <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
          <p>暂无内容</p>
        </div>

        <!-- 添加人员弹框-->
        <div class="addToggle" v-if="addShow">
          <div class="shadow"></div>
          <div class="add_content">
            <div class="add_title">
              <span>添加白名单</span>
              <i @click="cancel"><img src="../../assets/index/guanbi.png" alt=""></i>
            </div>
            <div class="add_list">
              <div class="list">
                <div class="name">人员姓名</div>
                <div class="add_input">
                  <input type="text" v-model="add_name" placeholder="请输入姓名">
                </div>
              </div>
              <div class="list">
                <div class="name">允许滞留</div>
                <div class="add_input">
                  <el-input type="tel" v-model="time" placeholder="请输入分钟数">
                    <span slot="suffix">分钟</span>
                  </el-input>
                </div>
              </div>
              <div class="list">
                <div class="name">添加照片</div>
                <div class="add_input">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :headers="getHeader"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1"
                    :before-upload="beforeAvatarUpload1"
                    list-type="picture">
                    <img :src="imageUrl" alt="" v-if="imageUrl != ''">
                    <el-button v-else><img src="../../assets/index/tianjiazhaopian.png" alt=""></el-button>
                  </el-upload>
                </div>
              </div>
            </div>
            <div class="btns">
              <div class="cancel" @click="cancel">取消</div>
              <div class="sure" @click="sure">确认</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 大图预览效果-->
      <div class="img-show-mask" id="img-show-mask" v-show="maskBtn" @click="closeBigImg">
        <img :src="bigImgSrc" class="bigImg" id="bigImg" />
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  import httpTool from '../../tool/httpTool.js'
  export default {
    name: 'keyChannel',
    data () {
      return {
        showTrue: false,
        whiteList: [],
        currentPage: 1,
        total: 0,
        name: '',
        add_name: '',
        time: '',
        imageUrl: '',
        addShow: false,
        bigImgSrc: "",
        maskBtn:false,         // 控制大图
      }
    },
    mounted () {
      this.getWhite(0);
    },
    methods: {

      ...mapActions([
        'goto',
        'getWhiteList',
        'delWhiteItem',
        'uploadBmd'
      ]),
      getWhite (page) {
        page = page * 20;
        this.whiteList = [];
        this.getWhiteList ({
          offset: page,
          limit: 20,
          data:{
            likeName: this.name,
            createTimeStart:'',
            createTimeEnd:'',
            removed:false
          },
          onsuccess: body => {
            this.showTrue = true;
            this.total = parseInt(body.headers['x-total-count']);
            this.whiteList = [...body.data.data];
            this.$nextTick(() => {
                console.log(this.$refs);
                this.$refs.bgHeight.style.height = (this.$refs.whiteContent.offsetHeight+70) + 'px';
            })
          }
        })
      },

      // 删除操作
      remove (item) {
        this.$confirm('请确认删除该人员', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.delWhiteItem({
            data:{
              ids: [item.id]
            },
            onsuccess:body=>{
              this.$emit('getMessage', '');
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getWhite(0);
            }
          })
        }).catch(() => {

        });
      },

      // 搜索事件
      reach() {
        this.getWhite(0);
      },

      // 添加事件
      add () {
        this.addShow = true;
      },

      // 取消事件
      cancel () {
        this.addShow = false;
      },

      handleAvatarSuccess1(res, file) {
        console.log('上传成功',res)
        if(res.errcode == 0){
          this.imageUrl = res.data;
        }else {
          this.$message.error('系统异常');
        }
      },

      beforeAvatarUpload1(file) {
        let isImgType=false;
        isImgType = file.type == 'image/jpg'||file.type=='image/jpeg'
        let isLt2M =false;
        isLt2M = file.size / 1024 / 1024 < 2;

        console.log('isImgType:',file.type)
        console.log('isLt2M:',isLt2M)
        if (!isImgType) {
          this.$message.error('上传头像图片只能是 JPG/JPEG格式!');
        }

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return  isLt2M&&isImgType;
      },

      // 确认
      sure () {
        if(this.add_name === '' || this.imageUrl === '' || this.time === ''){
          if (this.add_name === '') {
            this.$message.error('请输入姓名');
          }
          if (this.time === '') {
            this.$message.error('请输入分钟');
          }
          if (this.imageUrl === '') {
            this.$message.error('请选择图片');
          }
          return
        }else if (this.time < 0) {
          this.$message({
            type: 'warning',
            message: '分钟不可小于0'
          });
          this.time = 0;
          return;
        }else if (isNaN(this.time)) {
          this.$message({
            type: 'warning',
            message: '分钟只能输入数字'
          });
          this.time = '';
          return;
        }else if (this.time.toString().indexOf('.') != -1) {
          this.$message({
            type: 'warning',
            message: '分钟只能输入整数'
          });
          this.time = '';
          return;
        }else {
          this.uploadBmd({
            data:{
              image_url: this.imageUrl,
              retentionTime: this.time,
              name: this.add_name
            },
            onsuccess:()=>{
              this.$emit('getMessage', '');
              this.addShow = false;
              this.add_name = '';
              this.time = '';
              this.imageUrl = '';
              this.getWhite(0);
            }
          })
        }
      },

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getWhite(val - 1);
      },

      // 打开大图效果
      bigImgShow: function(url) {
        this.bigImgSrc = url;
        this.maskBtn = true;
      },

      // 关闭大图效果
      closeBigImg: function() { //关闭图片预览
        this.maskBtn = false;
      },

    },
    computed: {
      uploadUrl(){
        return httpTool.httpUrlEnv() + '/monitor-channel/keychannel/whiteList/pic'
      },
      getHeader(){
        return {
          Session: sessionStorage.session_id,
          token: sessionStorage.session_id
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .whiteList {
    width: calc(100vw - 75px);
    margin: 15px 15px 0;
    padding: 15px;
    position: relative;
    .bg {
      position: absolute;
      z-index: 5;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100vh - 60px);
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .whiteContent {
      position: absolute;
      z-index: 10;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100vh - 60px);
    }
    .white_title {
      padding: 5px 10px;
      text-align: left;
      font-size: 14px;
      color: #fff;
    }
    .search_add {
      margin: 30px 0;
      display: flex;
      justify-content: flex-start;
      padding: 0 10px;
      .search {
        margin-left: 180px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        input {
          font-size: 14px;
          color: #408FE9;
          height: 40px;
          padding-left: 15px;
          outline: none;
          background: #041740;
          border-radius: 4px;
          border: 1px solid #5691D1;
        }
        input:hover {
          background-color: transparent;
        }
        input:-moz-placeholder {
          color: #408FE9;
          font-size: 14px;
        }
        input:-ms-input-placeholder {
          color: #408FE9;
          font-size: 14px;
        }
        input::-moz-placeholder {
          color: #408FE9;
          font-size: 14px;
        }
        input::-webkit-input-placeholder {
          color: #408FE9;
          font-size: 14px;
        }
        span {
          width: 100px;
          height: 36px;
          cursor: pointer;
          margin-left: 15px;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        i {
          padding: 10px;
          width: 16px;
          height: 16px;
          display: inline-flex;
          cursor: pointer;
          img {
            display: inline-flex;
            width: 100%;
            height: 100%;
          }
        }
      }
      .add {
        width: 100px;
        height: 36px;
        cursor: pointer;
        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .whiteLists {
      padding: 0 10px;
    }
    .el-row {
      margin: 0 !important;
      .el-col {
        margin-bottom: 15px;
        .grid-content {
          border: 1px solid #3798FC;
          position: relative;
          background-color: #103A72;
          display: flex;
          justify-content: flex-start;
          border-radius: 8px;
          padding: 8px;
        }
        .img {
          display: inline-block;
          width: 100px;
          height: 100px;
          margin-right: 8px;
          border-radius: 8px;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        .content {
          text-align: left;
          p {
            font-size: 20px;
            color: #fff;
          }
          .name {
            margin-top: 5px;
            font-size: 15px;
            color: #fff;
            span {
              color: #408FE9;
              font-size: 14px;
            }
          }
          .remove {
            position: absolute;
            right: 8px;
            bottom: 8px;
            width: 60px;
            height: 24px;
            cursor: pointer;
            img {
              display: inline-block;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .addToggle {
      .shadow {
        opacity: 0.6;
        background: #000000;
        position: fixed;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;
        z-index: 5;
      }
      .add_content {
        background: #FFFFFF;
        border: 1px solid #EAEEF5;
        border-radius: 4px;
        position: fixed;
        padding: 8px 12px;
        z-index: 10;
        width: 424px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .add_title {
          display: flex;
          justify-content: space-between;
          color: #606266;
          font-size: 18px;
          i {
            display: inline-flex;
            width: 10px;
            height: 10px;
            padding: 8px;
            cursor: pointer;
          }
        }
        .add_list {
          .list {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            .name {
              font-size: 14px;
              color: #333;
              margin-top: 13px;
              width: 20%;
              display: inline-flex;
              justify-content: flex-start;
            }
            .add_input {
              width: 75%;
              display: inline-flex;
              justify-content: flex-start;
              input {
                width: 302px;
                height: 40px;
                line-height: 40px;
                background: #FFFFFF;
                border: 1px solid #D8DCE6;
                border-radius: 4px;
                padding-left: 15px;
                color: #909399;
              }
              input:-moz-placeholder {
                color: #C0C4CC;
                font-size: 14px;
              }
              input:-ms-input-placeholder {
                color: #C0C4CC;
                font-size: 14px;
              }
              input::-moz-placeholder {
                color: #C0C4CC;
                font-size: 14px;
              }
              input::-webkit-input-placeholder {
                color: #C0C4CC;
                font-size: 14px;
              }
              /deep/ .el-input__suffix {
                display: inline-flex;
                align-items: center;
              }
              .el-button {
                padding: 0;
                border: none;
              }
              img {
                display: inline-flex;
                width: 100px;
                height: 100px;
              }
            }
          }
        }
        .btns {
          display: flex;
          justify-content: flex-end;
          text-align: center;
          div {
            font-size: 12px;
            width: 56px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 4px;
            display: inline-flex;
            justify-content: center;
            margin-left: 10px;
            cursor: pointer;
          }
          .cancel {
            color: #606266;
            border: 1px solid #DBDFE6;
          }
          .sure {
            color: #fff;
            background: #409EFF;
          }
        }
      }
    }

    .noMsg {
      margin: 250px auto;
      text-align: center;
      .img {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      p {
        color: #606266;
        font-size: 14px;
        margin-top: 20px;
        text-align: center;
      }
    }
  }

  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance:textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }

  .img-show-mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 3000;
    background: rgba(0, 0, 0, .5);
  }

  .img-show-mask .bigImg {
    width: 500px;
    position: fixed;
    z-index: 3100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
  }

  /deep/ .el-pagination__total {
    color: #5691D1;
  }

  /deep/ .el-pagination button {
    background: #015296;
    border: 1px solid #5691D1;
    color: #5691D1;
    border-radius: 8px;
  }

  /deep/ .el-pager li {
    background-color: transparent;
    border: 1px solid #5691D1;
    color: #5691D1;
    margin: 0 5px;
    border-radius: 8px;
  }

  /deep/ .el-pager li.active {
    color: #fff;
    background: #015296;
    border: 1px solid #5691D1;
  }

</style>
