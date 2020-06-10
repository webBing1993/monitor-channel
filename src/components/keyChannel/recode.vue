<template>
  <div>
    <div class="homeIndex">
      <!-- 陌生人待处理-->
      <el-container  ref="elAside">
        <!-- 中间主页-->
        <el-main ref="mainHeight">
          <el-container>
            <el-header ref="headerHeight">
              <el-row>
                <el-col :span="12" class="search_btns">
                  <div class="search_add">
                    <div class="search">
                      <input type="text" v-model="name" placeholder="请输入人员姓名">
                      <span  @click="reach"><img src="../../assets/index/sousuo.png" alt=""></span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="bg"><img src="../../assets/index/zhongshnag.png" alt=""></div>
                  <el-row>
                    <el-col :span="6">
                      <img src="../../assets/index/paizhao.png" alt="">
                    </el-col>
                    <el-col :span="6">
                      <span>最近7日总抓拍</span>
                      <span>{{weekNum}}</span>
                    </el-col>
                    <el-col :span="6">
                      <span>在岗人员</span>
                      <span>{{total3}}</span>
                    </el-col>
                    <el-col :span="6">
                      <span>陌生人</span>
                      <span>{{total2}}</span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-header>
            <el-main ref="mainListHeight" class="mt10">
              <div class="bg"><img src="../../assets/index/zhong.png" alt=""></div>
              <div class="lists">
                <el-row :gutter="8">
                  <el-col :span="6"  class="list" v-for="(item,index) in whiteLists" v-bind:key="index">
                    <div class="grid-content">
                      <div class="img">
                        <img :src="item.mostSimilarPic" alt=""  @click="bigImgShow(item.mostSimilarPic)">
                      </div>
                      <div class="content">
                        <div class="li">
                          <span class="name">{{ item.name }}</span>
                        </div>
                        <div class="li">
                          <span class="name">进出时间：</span>
                          <span class="value">{{ datetimeparse(item.inTime, 'hh:mm') }} - {{ datetimeparse(item.outTime, 'hh:mm') }}</span>
                        </div>
                        <div class="li">
                          <span class="name">滞留时间：</span>
                          <span class="value">{{ getRemainderTime(item.inTime) }}</span>
                        </div>
                        <div :class="item.type != 1 ? 'li red-color' : 'li green-color'">
                          <span class="name">状态：</span>
                          <span class="value">{{ item.type == 1 ? '正常' : '超时' }}</span>
                        </div>
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
                  :total="total" v-if="whiteLists.length != 0">
                </el-pagination>
                <div class="noMsg" v-else>
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-main>
        <!-- 右边图表-->
        <el-aside>
          <statistics :totalLists="totalLists"></statistics>
        </el-aside>
      </el-container>
      <!-- 大图预览效果-->
      <div class="img-show-mask" id="img-show-mask" v-show="maskBtn" @click="closeBigImg">
        <img :src="bigImgSrc" class="bigImg" id="bigImg" />
      </div>
    </div>
  </div>
</template>

<script>

  import {mapState,mapActions} from 'vuex';
  import ElCol from "element-ui/packages/col/src/col";
  import Statistics from './statistics.vue';
  import Vue from 'vue'
  export default {
    components: {ElCol, Statistics},
    name: 'keyChannel',
    data () {
      return {
        hotelName: sessionStorage.hotelName, // 酒店名
        maskBtn:false,         // 控制大图
        bigImgSrc: '',         // 大图url
        currentPage: 1,
        total: 0,
        whiteLists: [],
        totalLists: [],         // 总的数组，存放各个数量
        weekNum: '',
        total3: '',
        total2: '',
        name: '',
        websock: null,
      }
    },
    watch: {

    },
    mounted () {
      this.websock = Vue.prototype.$loading({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.getGuest(0);
    },
    methods: {

      ...mapActions([
        'getDoubtfulList','totalGuest','hasChecked', 'getLocations', 'monitorGuest', 'staffOut'
      ]),

      // 打开大图效果
      bigImgShow: function(url) {
        if (url.indexOf('assets/index') != -1) {
          this.bigImgSrc = require('../../assets/index/noMan.png');
        }else {
          this.bigImgSrc = url;
        }
        this.maskBtn = true;
      },

      // 关闭大图效果
      closeBigImg: function() { //关闭图片预览
        this.maskBtn = false;
      },

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getGuest(val-1);
      },

      // 搜索
      reach() {
        this.currentPage = 1;
        this.getGuest(this.currentPage-1);
      },

      // 距离现在在岗几时几分几秒
      getRemainderTime (startTime){
        let s2 = new Date(),
          runTime = parseInt((s2.getTime() - startTime) / 1000);
        let hour = Math.floor(runTime / 3600);
        runTime = runTime % 3600;
        let minute = Math.floor(runTime / 60);
        runTime = runTime % 60;
        let second = runTime;
        if (hour < 10) {
            hour = '0'+hour
        }
        if (minute < 10) {
          minute = '0'+minute
        }
        if (second < 10) {
          second = '0'+second
        }
        return hour+'小时'+minute+'分';

      },

      // 获取在岗人员列表
      getGuest(page) {
          let data = {
            status: 'out',
            name: this.name
          };
        this.monitorGuest ({
          offset: page,
          limit: 20,
          data: data,
          onsuccess: body => {
              if (body.data.code == 0) {
                let time = new Date().getTime();
                if (body.data.data && body.data.data.length != 0) {
                  body.data.data.forEach(item => {
                    if (parseInt(Math.abs(time-item.inTime)/1000/60) <= this.datetimeparse(item.warnTime, 'dd')) {
                      item.type = 1;
                    }else {
                        item.type = 2
                    }
                  })
                }
                this.total = parseInt(body.headers['x-total-count']);
                this.whiteLists = [...body.data.data];
                this.totalList();
              }
            this.websock.close();
          }
        })
      },

      // 获取总数列表
      totalList () {
        this.totalGuest({
          data: {
            location: '',
            hotelId: sessionStorage.hotelId,
          },
          onsuccess: body => {
            if (body.data.code == 0) {
              this.total2 = body.data.data.suspiciousCount;
              this.total3 = body.data.data.staffCount;
              this.weekNum = body.data.data.weekTotal;
              this.totalAll();
            }
          }
        })
      },

      // 各组数量组成数组 日抓拍
      totalAll() {
        this.$nextTick(() => {
          this.totalLists = [];
          let obj = {}, obj2 = {};
          obj2.name = '在岗人员';
          obj2.value = this.total3;
          obj.name = '陌生人';
          obj.value = this.total2;
          this.totalLists.push(obj, obj2);
          console.log('this.totalLists',this.totalLists);
        })
      },

      beforeRouteLeave(to,from,next) {
        this.websock.close();
        next();
      },
      beforeDestroy:function(){
        this.websock.close();
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .homeIndex {
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

      .stranger_list {
        max-height: calc(100vh - 118px);
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
        .list {
          margin-top: 8px;
          border: 1px solid #F46C6C;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          justify-content: flex-start;
          .img {
            width: 100px;
            height: 100px;
            border-radius: 8px;
            img {
              display: inline-flex;
              width: 100%;
              height: 100%;
              cursor: pointer;
            }
          }
          .list_content {
            width: 174px;
            position: relative;
            margin-left: 8px;
            p {
              display: flex;
              justify-content: flex-start;
              color: #fff;
              font-size: 14px;
              text-align: left;
              display: -webkit-box;
            }
            p:last-of-type {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            }
            .handle {
              width: 60px;
              height: 24px;
              display: inline-block;
              position: absolute;
              bottom: 0;
              right: 0;
              cursor: pointer;
            }
          }
        }
      }
      .stranger_list::-webkit-scrollbar {
        display: none; // 隐藏滚动条
        width:0px;
        height:0px;
      }
      .stranger_list .-o-scrollbar{
        -moz-appearance: none !important;
        background: rgba(0,255,0,0) !important;
      }

    }
    .stranger_title {
      font-size: 14px;
      text-align: left;
      line-height: 24px;
      display: inline-block;
      .stranger_tab {
        display: inline-block;
        width: 120px;
        position: relative;
        text-align: center;
        margin-right: 20px;
        cursor: pointer;
        color: #3596FC;
        img {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: -1;
          left: 0;
          top: 0;
        }
      }
      .active {
        color: #fff;
      }
    }
    .el-main {
      padding: 0;
      .el-header {
        height: auto !important;
        padding: 0;
        .locationTabs {
          margin-top: 10px;
          text-align: left;
          .stranger_title {
            .stranger_tab {
              margin-bottom: 10px;
            }
          }
        }
        .search_btns {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .search_add {
          margin: 30px 0;
          display: flex;
          justify-content: flex-start;
          padding: 0 10px;
          .search {
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: space-between;
            input {
              font-size: 14px;
              color: #408FE9;
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
        .el-col-12 {
          height: 70px;
          margin-right: 15px;
          position: relative;
          .bg {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 8;
            width: 100%;
            height: 70px;
            img {
              display: inline-block;
              width: 100%;
              height: 100%;
            }
          }
          .tabs {
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            .el-row {
              height: 100%;
              .tab {
                color: #408FE9;
                font-size: 14px;
                cursor: pointer;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                span {
                  display: block;
                }
              }
              .active {
                color: #fff;
              }
            }
          }
        }
        .el-col-12:last-of-type {
          width: calc(50% - 15px);
          margin-right: 0;
          .el-row {
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            .el-col-6 {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #A6ADB4;
              height: 100%;
              flex-direction: column;
              img {
                display: inline-flex;
                width: 26.7px;
                height: 20.7px;
              }
              span {
                display: flex;
                word-wrap:break-word
              }
            }
          }
        }
      }
      .el-main {
        /*margin-top: 12px;*/
        padding: 12px 12px 40px;
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
          min-height: calc(100vh - 214px);
        }
        .list {
          margin-bottom: 15px;
        }
        .grid-content {
          border: 1px solid #3798FC;
          border-radius: 8px;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
            .li {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              margin-bottom: 6px;
              color: #fff;
              font-size: 12px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
        .grid-content:hover {
          border: 1px solid #F46C6C;
        }
      }
    }
    .el-aside:last-of-type {
      padding: 0;
      margin-right: 0;
      margin-left: 15px;
      height: auto;
    }
    .red-color {
      color: red !important;
    }
    .green-color {
      color: green !important;
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
  }

  /deep/ .el-pagination__total {
    color: #5691D1;
  }

  /deep/ .el-pagination {
    position: absolute;
    bottom: 10px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
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

  .mt10 {
    margin-top: 10px;
  }

</style>
