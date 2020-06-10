<template>
  <div>
    <div class="hotelStatus">
      <!-- 酒店列表-->
      <el-container>
        <el-aside>
          <div class="bg"><img src="../../assets/index/zuo.png" alt="" ></div>
          <div class="stranger_title"><img src="../../assets/index/zuoxuanzhong.png" alt="">酒店名称</div>
          <div class="stranger_list" v-if="hotelList.length != 0">
            <p class="tig">
              <span class="blue"></span>全部正常 &nbsp;&nbsp; <span class="yellow"></span>部分正常 &nbsp;&nbsp; <span class="red"></span> 全部瘫痪
            </p>
            <div class="list" v-for="(item,index) in hotelList" :key="index" @click="hotelClick(item.hotelId)">
              <p>
                <span>酒店名称：</span>
                <span>{{item.hotelName}}</span>
              </p>
              <p>
                <span>程序状态：<span :class="item.processStatus == 0 ? 'red' : 'blue'"></span></span>
                <span>摄像头状态：<span :class="item.processStatus == 0 ? 'red' : item.cameraStatus == 1 ? 'blue' : (item.cameraStatus == 0 || item.cameraStatus == 3) ? 'red' : 'yellow'"></span></span>
              </p>
            </div>
          </div>
          <div class="noMsg" v-else>
            <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
            <p>暂无内容</p>
          </div>
        </el-aside>
        <!-- 中间主页-->
        <el-main>
          <div class="bg"><img src="../../assets/index/zhong.png" alt=""></div>
          <!-- 摄像头列表-->
          <div class="lists">
            <el-row :gutter="15">
              <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6"  class="list" v-for="(item,index) in cameraList" v-bind:key="index">
                <div class="grid-content bg-purple">
                  <div class="img">
                    <img src="../../assets/index/canmera.png" alt="" v-if="item.cameraStatus == 1">
                    <img src="../../assets/index/canmera_.png" alt="" v-else>
                  </div>
                  <div class="list_content">
                    <p><span>类型：</span><span>{{item.cameraType == 'IN' ? '入口' : '出口'}}</span></p>
                    <p><span>状态：</span><span :class="item.cameraStatus == 1 ? 'blue' : 'red'"></span></p>
                    <p><span>序列号：</span><span>{{item.id}}</span></p>
                    <p><span>IP地址：</span><span>{{item.ipAddress}}</span></p>
                    <p><span>上次下载时间：</span><span>{{datetimeparse(item.lastDownLoadTime, 'yy/MM/dd hh/mm/ss')}}</span></p>
                    <p><span>上次登录时间：</span><span>{{datetimeparse(item.lastLoginTime, 'yy/MM/dd hh/mm/ss')}}</span></p>
                    <p><span>本次上报时间：</span><span>{{datetimeparse(item.createTime, 'yy/MM/dd hh/mm/ss')}}</span></p>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="noMsg" v-if="cameraList.length == 0">
              <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
              <p>暂无内容</p>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  import ElCol from "element-ui/packages/col/src/col";
  import ElMain from "../../../node_modules/element-ui/packages/main/src/main";
  export default {
    components: {ElMain, ElCol},
    name: 'hotelStatus',
    data () {
      return {
        hotelList: [],   // 酒店列表
        currentPage: 1,
        total: 0,
        cameraList: [],  // 摄像头列表
        timer: null,  // 定时器
      }
    },
    mounted () {
      this.getHotelList();
      this.timer = setInterval(() => {
        this.getHotelList();
      },60000)
    },
    methods: {

      ...mapActions([
        'getHotel','hotelCamera'
      ]),

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },


      // 获取左边酒店数据
      getHotelList() {
        this.getHotel({
          onsuccess: body => {
            if (body.data.code == 0 && body.data.data) {
                this.hotelList = body.data.data;
                this.hotelClick(sessionStorage.getItem('hotelClickId') ? sessionStorage.getItem('hotelClickId') : this.hotelList[0].hotelId);
            }
          }
        })
      },

      // 获取酒店对应的摄像头
      hotelClick (hotelId) {
        sessionStorage.setItem('hotelClickId', hotelId);
        this.hotelCamera({
          hotelId: hotelId,
          onsuccess: body => {
            if (body.data.code == 0 && body.data.data) {
                this.cameraList = body.data.data;
            }
          }
        })
      },

    },
    watch: {

    },
    beforeRouteLeave(to,from,next) {
      sessionStorage.removeItem('hotelClickId');
      clearInterval(this.timer);
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .hotelStatus {
    margin: 10px 15px 0;
    width: calc(100vw - 47px);
    .el-aside {
      width: 200px;
      padding: 8px;
      margin-right: 15px;
      position: relative;
      overflow: hidden;
      height: calc(100vh - 81px);
      .bg {
        position: absolute;
        z-index: -1;
        left: 0;
        top: 0;
        width: 100%;
        img {
          display: block;
          width: 100%;
          height: calc(100vh - 81px);
        }
      }
      .stranger_title {
        font-size: 14px;
        color: #fff;
        text-align: left;
        line-height: 24px;
        position: relative;
        /*display: inline-block;*/
        /*width: 120px;*/
        img {
          display: none;
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: -1;
          left: 0;
          top: 0;
        }
      }
      .stranger_list {
        max-height: calc(100vh - 100px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch; // 为了滚动顺畅
        -ms-scroll-chaining: chained;
        -ms-overflow-style: none;
        -ms-content-zooming: zoom;
        -ms-scroll-rails: none;
        -ms-content-zoom-limit-min: 100%;
        -ms-content-zoom-limit-max: 500%;
        -ms-scroll-snap-type: proximity;
        -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
        -ms-overflow-style: none;
        .tig {
          color: #fff;
          font-size: 14px;
          span {
            display: inline-flex;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .blue {
            background-color: blue;
          }
          .yellow {
            background-color: yellow;
          }
          .red {
            background-color: red;
          }
        }
        .list {
          margin-top: 8px;
          border: 1px solid #F46C6C;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          p {
            display: table;
            align-items: center;
            span {
              color: #fff;
              font-size: 14px;
              span {
                display: inline-flex;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 30px;
              }
              .blue {
                background-color: blue;
              }
              .yellow {
                background-color: yellow;
              }
              .red {
                background-color: red;
              }
            }
          }
        }
      }
      .stranger_list::-webkit-scrollbar {
        display: none; // 隐藏滚动条
        width: 0px;
        height: 0px;
      }
      .stranger_list .-o-scrollbar {
        -moz-appearance: none !important;
        background: rgba(0, 255, 0, 0) !important;
      }

    }
    .el-main {
      position: relative;
      overflow: hidden;
      .bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      .lists {
        min-height: calc(100vh - 260px);
        .list {
          margin: 0 0 15px;
          .grid-content {
            border: 1px solid #3798FC;
            border-radius: 8px;
            padding: 5px;
          }
          .img {
            display: block;
          }
          .list_content {
            p {
              display: flex;
              align-items: center;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              span {
                font-size: 14px;
                color: #fff;
              }
              .blue {
                display: inline-flex;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: blue !important;
              }
              .red {
                display: inline-flex;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: red !important;
              }
            }
            p:hover {
              overflow: inherit;
              span {
                background-color: #041740;
                z-index: 5;
              }
            }
          }
        }
      }
    }
    .noMsg {
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50% ,-50%);
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
        color: #fff;
        font-size: 14px;
        margin-top: 20px;
        text-align: center;
      }
    }
  }

</style>
