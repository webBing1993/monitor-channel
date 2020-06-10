<template>
  <div>
    <div class="homeIndex">
      <!-- 陌生人待处理-->
      <el-container  ref="elAside">
        <el-aside>
          <div class="bg"><img src="../../assets/index/zuo.png" alt="" ></div>
          <div class="stranger_title stranger_title_">
            <div :class="strangerTab == 1 ? 'active stranger_tab' : 'stranger_tab'" @click="strangerTabClick(1, 1)">
              <img src="../../assets/index/zuoxuanzhong.png" alt="" v-if="strangerTab == 1">
              <img src="../../assets/index/zuoweixuan.png" alt="" v-else>
              陌生人(未处理)
            </div>
            <!--<div :class="strangerTab == 2 ? 'active stranger_tab' : 'stranger_tab'" @click="strangerTabClick(2, 1)">-->
              <!--<img src="../../assets/index/zuoxuanzhong.png" alt="" v-if="strangerTab == 2">-->
              <!--<img src="../../assets/index/zuoweixuan.png" alt="" v-else>-->
              <!--模糊抓拍-->
            <!--</div>-->
          </div>
          <div class="stranger_list" v-if="strangerTab == 1">
            <div class="list red-purple" v-for="(item,index) in strangerList" :key="index">
              <div class="img">
                <img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)">
              </div>
              <div class="list_content">
                <p><span>时间：</span><span>{{datetimeparse(item.filming_time,'MM-DD hh:mm:ss')}}</span></p>
                <p><span>地点：</span><span>{{item.location ? item.location : '-'}}</span></p>
                <div class="handle" @click="handelBtn(item.illegal_guest_id,1)"><img src="../../assets/index/chuli.png" alt=""></div>
              </div>
            </div>
            <div class="noMsg" v-if="strangerList.length == 0">
              <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
              <p>暂无内容</p>
            </div>
          </div>
          <div class="stranger_list" v-if="strangerTab == 2">
            <div class="list red-purple" v-for="(item,index) in indistinctList" :key="index">
              <div class="img">
                <img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)">
              </div>
              <div class="list_content">
                <p><span>时间：</span><span>{{datetimeparse(item.filming_time,'MM-DD hh:mm:ss')}}</span></p>
                <p><span>地点：</span><span>{{item.location ? item.location : '-'}}</span></p>
                <div class="handle" @click="handelBtn(item.illegal_guest_id,2)"><img src="../../assets/index/chuli.png" alt=""></div>
              </div>
            </div>
            <div class="noMsg" v-if="indistinctList.length == 0">
              <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
              <p>暂无内容</p>
            </div>
          </div>
        </el-aside>
        <!-- 中间主页-->
        <el-main ref="mainHeight">
          <el-container>
            <el-header ref="headerHeight">
              <el-row>
                <el-col :span="12">
                  <div class="bg"><img src="../../assets/index/zhongshnag.png" alt=""></div>
                  <div class="tabs">
                    <el-row>

                      <el-col :span="7"  :class="tab3 ? 'active tab' : 'tab'" @click.native="tabClick(2)">
                        <span>在岗人员</span><span>({{total3}})</span>
                      </el-col>
                      <el-col :span="1" style="height: 100%"></el-col>
                      <el-col :span="7"  :class="tab1 ? 'active tab' : 'tab'" @click.native="tabClick(0)">
                        <span>今日抓拍</span><span>({{total1}})</span>
                      </el-col>
                      <el-col :span="1" style="height: 100%"></el-col>
                      <el-col :span="7"  :class="tab2 ? 'active tab' : 'tab'" @click.native="tabClick(1)">
                        <span>陌生人</span><span>({{total2}})</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="bg"><img src="../../assets/index/zhongshnag.png" alt=""></div>
                  <el-row>
                    <el-col :span="6">
                      <img src="../../assets/index/paizhao.png" alt="">
                    </el-col>
                    <el-col :span="6">
                      <span>本周抓拍</span>
                      <span>{{weekNum}}</span>
                    </el-col>
                    <el-col :span="6">
                      <span>本月抓拍</span>
                      <span>{{monthNum}}</span>
                    </el-col>
                    <el-col :span="6">
                      <span>总抓拍</span>
                      <span>{{allNum}}</span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row class="locationTabs" v-if="!tab3">
                <el-col :span="24">
                  <div class="stranger_title">
                    <div v-for="(item, index) in selectLists" :class="locationTab == index+1 ? 'active stranger_tab' : 'stranger_tab'" @click="strangerTabClick(index, 2)">
                      <img src="../../assets/index/zuoxuanzhong.png" alt="" v-if="locationTab == index+1">
                      <img src="../../assets/index/zuoweixuan.png" alt="" v-else>
                      {{ item }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-header>
            <el-main ref="mainListHeight" :class="tab3 ? 'mt10' : ''">
              <div class="bg"><img src="../../assets/index/zhong.png" alt=""></div>
              <!-- 今日抓拍列表-->
              <div class="toDay_lists lists" v-if="tab1">
                <el-row :gutter="8">
                  <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4"  class="list" v-for="(item,index) in toDayLists" v-bind:key="index">
                    <div class="grid-content bg-purple">
                      <div class="imgs">
                        <div class="nowImg"><img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)"></div>
                        <div class="idCacrdImg" v-if="item.most_similar_pic"><img :src="item.most_similar_pic" alt=""  @click="bigImgShow(item.most_similar_pic)"></div>
                        <div class="idCacrdImg" v-else><img src="../../assets/index/noMan.png" alt=""  @click="bigImgShow('../../assets/index/noMan.png')"></div>
                      </div>
                      <div class="list_content">
                        <div class="title" v-if="item.guestType == 'STAFF'">{{ item.name }}</div>
                        <div class="title" v-else>陌生人</div>
                        <div class="content">
                          <p>
                            <span>时间：</span>
                            <span>{{dateDiff(item.filming_time)}}小时前 ({{datetimeparse(item.filming_time,'hh:mm:ss')}})</span>
                          </p>
                          <p>
                            <span>地点：</span>
                            <span>{{item.location}}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currentPage1"
                  :page-size="18"
                  layout="total, prev, pager, next"
                  :total="total1" v-if="toDayLists.length != 0">
                </el-pagination>
                <div class="noMsg" v-else>
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
              <!-- 陌生人列表-->
              <div class="stranger_lists lists" v-if="tab2">
                <el-row :gutter="8">
                  <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4"  class="list" v-for="(item,index) in strangerLists" v-bind:key="index">
                    <div class="grid-content bg-purple">
                      <div class="imgs">
                        <div class="nowImg"><img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)"></div>
                        <div class="idCacrdImg" v-if="item.most_similar_pic"><img :src="item.most_similar_pic" alt=""  @click="bigImgShow(item.most_similar_pic)"></div>
                        <div class="idCacrdImg" v-else><img src="../../assets/index/noMan.png" alt=""  @click="bigImgShow('../../assets/index/noMan.png')"></div>
                      </div>
                      <div class="list_content">
                        <div class="title" v-if="item.guestType == 'STAFF'">{{ item.name }}</div>
                        <div class="title" v-else>陌生人</div>
                        <div class="content">
                          <p>
                            <span>时间：</span>
                            <span>{{dateDiff(item.filming_time)}}小时前 ({{datetimeparse(item.filming_time,'hh:mm:ss')}})</span>
                          </p>
                          <p>
                            <span>地点：</span>
                            <span>{{item.location}}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange2"
                  :current-page.sync="currentPage2"
                  :page-size="18"
                  layout="total, prev, pager, next"
                  :total="total2" v-if="strangerLists.length != 0">
                </el-pagination>
                <div class="noMsg" v-else>
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
              <!-- 在岗人员列表-->
              <div class="white_lists lists" v-if="tab3">
                <el-row :gutter="8">
                  <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4"  class="list" v-for="(item,index) in whiteLists" v-bind:key="index">
                    <div :class="item.type == 1 ? 'grid-content bg-purple red-purple' : 'grid-content bg-purple'">
                      <div class="imgs">
                        <div class="nowImg"><img :src="item.facialPic" alt="" @click="bigImgShow(item.facialPic)"></div>
                        <div class="idCacrdImg" v-if="item.mostSimilarPic"><img :src="item.mostSimilarPic" alt=""  @click="bigImgShow(item.mostSimilarPic)"></div>
                        <div class="idCacrdImg" v-else><img src="../../assets/index/noMan.png" alt=""  @click="bigImgShow('../../assets/index/noMan.png')"></div>
                      </div>
                      <div class="list_content">
                        <div :class="item.type == 1 ? 'title blockTitle' : 'title'">{{ item.name }}</div>
                        <div class="content">
                          <p :class="item.type == 1 ? 'blockTitle' : ''">
                            <span>{{ item.type == 1 ? '在岗时间' : '滞留时间' }}：</span>
                            <span>{{ item.inTime_ }}</span>
                          </p>
                          <p :class="item.type == 1 ? 'blockTitle' : ''">
                            <span>进入时间：</span>
                            <span>{{datetimeparse(item.inTime,'hh:mm:ss')}}</span>
                          </p>
                          <div class="btns" v-if="item.type == 1" @click="goOut(item.id)">
                            <img src="../../assets/index/ligang.png" alt="">
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange3"
                  :current-page.sync="currentPage3"
                  :page-size="18"
                  layout="total, prev, pager, next"
                  :total="total3" v-if="whiteLists.length != 0">
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

  let lockReconnect = false;//避免重复连接
  let wsUrl = 'wss://qa.fortrun.cn/keychannel/websocket/' + sessionStorage.hotelId + '_' + encodeURIComponent(sessionStorage.session_id);
  let ws;
  let tt;

  import {mapState,mapActions} from 'vuex';
  import ElCol from "element-ui/packages/col/src/col";
  import Statistics from './statistics.vue';
  import Vue from 'vue'
  export default {
    components: {ElCol, Statistics},
    name: 'keyChannel',
    props: ['handleIndex'],
    data () {
      return {
        hotelName: sessionStorage.hotelName, // 酒店名
        maskBtn:false,         // 控制大图
        bigImgSrc: '',         // 大图url
        strangerList: [],   // 陌生人待处理的列表
        indistinctList: [], // 陌生人模糊抓拍列表
        strangerNum: 0,     // 陌生人待处理的数量
        tab1: false,
        tab2: false,
        tab3: true,
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        total1: 0,              // 今日抓拍数量
        total2: 0,              // 陌生人数量
        total3: 0,              // 工作人员数量
        totalLists: [],         // 总的数组，存放各个数量
        weekNum: 0,           // 本周抓拍数量
        monthNum: 0,          // 本月抓拍数量
        allNum: 0,            // 所有抓拍数量
        toDayLists: [],        // 今日抓拍列表
        strangerLists: [],        // 陌生人列表
        whiteLists: [],        // 工作人员列表
        aliveLists: [],        // 在住人列表
        visitorLists: [],        // 访客列表
        websock: null,
        strangerTab: 1,      // 左边tab切换
        timer: null,
        loading: null,
        handleIndex: 1,
        selectLists: [],      // 位置筛选lists
        locationTab: 1,       // 位置筛选选择
        timer_: null
      }
    },
    watch: {
      handleIndex: function (val) {
        this.handleIndex = val;
        console.log(val);   // 接收父组件的值
        this.websock.close();
      },
    },
    mounted () {
        console.log(2222);
      this.loading = Vue.prototype.$loading({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.locations();
      clearInterval(this.timer);
      if (this.websock) {
        this.websock.close();
      }else {
        this.initWebSocket();
      }

      this.timer = setInterval(() => {
        this.websocketsend(888);
      },30000)
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

      // 获取摄像头列表
      locations() {
          this.getLocations({
            onsuccess: body => {
                if (body.data.code == 0) {
                  this.selectLists = body.data.data;
                  this.selectLists.unshift('全部');
                  this.totalList();
                  this.getGuest(0);
                  this.indistinctList = [];
                  this.strangerNum = [];
                  this.getLists(0,'SUSPICIOUS_GUEST',5,500,'SUSPICIOUS_GUEST');
                }
            },
            onfail: body => {

            },
            onerror: body => {

            }
          })
      },

      // tab切换
      tabClick(num) {
        this.currentPage1 = 1;
        this.currentPage2 = 1;
        this.currentPage3 = 1;
        this.currentPage4 = 1;
        this.currentPage5 = 1;
        if (num == 0) {
          this.tab1 = true;
          this.tab2 = false;
          this.tab3 = false;
          this.getLists(0,'',0,18,'');
        }else if (num == 1) {
          this.tab1 = false;
          this.tab2 = true;
          this.tab3 = false;
          this.getLists(0,'SUSPICIOUS_GUEST',1,18,'READ');
        }else if (num == 2) {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = true;
          this.getGuest(0);
        }
        this.totalList();
      },

      // 左边tab切换
      strangerTabClick(index, type) {
        if (type == 1) {
          this.strangerTab = index;
        }else {
          this.locationTab = parseInt(index)+1;
          clearInterval(this.timer_);
          this.currentPage1 = 1;
          this.currentPage2 = 1;
          this.currentPage3 = 1;
          this.currentPage4 = 1;
          this.currentPage5 = 1;
          if (this.tab1) {
            this.getLists(0,'',0,18,'');
          }else if (this.tab2) {
            this.getLists(0,'SUSPICIOUS_GUEST',1,18,'READ');
          }else if (this.tab3) {
            this.getGuest(0);
          }
          this.indistinctList = [];
          this.strangerNum = [];
          this.getLists(0,'SUSPICIOUS_GUEST',5,500,'SUSPICIOUS_GUEST');
          this.totalList();
        }
      },

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange1(val) {
        console.log(`当前页: ${val}`);
        this.getLists(val-1,'',0,18,'');
      },
      handleCurrentChange2(val) {
        console.log(`当前页2: ${val}`);
        this.getLists(val-1,'SUSPICIOUS_GUEST ',1,18,'READ');
      },
      handleCurrentChange3(val) {
        console.log(`当前页3: ${val}`);
        this.getGuest(val-1);
      },

      // 距离现在相差几小时函数
      dateDiff(outTime) {
        let newTime = new Date().getTime();
        let iHour;
        iHour = parseInt(Math.abs(newTime - outTime) / 1000 / 60 / 60);
        return iHour;
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
        return hour+':'+minute+':'+second;

      },

      // 获取在岗人员列表
      getGuest(page) {
          clearTimeout(this.timer_);
          let data = {
            status: 'in'
          };
        this.monitorGuest ({
          offset: page,
          limit: 18,
          data: data,
          onsuccess: body => {
              if (body.data.code == 0) {
                let time = new Date().getTime();
                if (body.data.data && body.data.data.length != 0) {
                  let speakNum = 0;
                  body.data.data.forEach(item => {
                    if (parseInt(Math.abs(time-item.inTime)/1000/60) <= this.datetimeparse(item.warnTime, 'dd')) {
                      item.type = 2;
                    }else {
                        item.type = 1;
                        speakNum++;
                    }
                    item.inTime_ = this.getRemainderTime(item.inTime);
                    this.timer_ = setInterval(() => {
                      let inTime_ = (parseFloat(item.inTime/1000)+1)*1000;
                      item.inTime_ = this.getRemainderTime(inTime_)
                    }, 1000);
                  });
                  this.$nextTick(() => {
                      if (speakNum != 0) {
                          this.speckText('有人员超时滞留，请及时处理');
                      }
                  })
                }
                this.strangerNum = parseInt(body.headers['x-total-count']);
                this.total3 = parseInt(body.headers['x-total-count']);
                this.whiteLists = [...body.data.data];
              }
          }
        })
      },

      // 语音播报
      speckText(str){
        let url = "http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=" + encodeURI(str);        // baidu
        let n = new Audio(url);
        n.src = url;
        setTimeout(() =>{
          n.play();
          n = null;
          this.timer_ = setTimeout(() => {
              clearTimeout(this.timer_);
              this.speckText(str);
          }, 10000)
        }, 1500)
      },

      // 离岗处理
      goOut(id) {
        this.$confirm('确定该人员已出场？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '是',
          cancelButtonText: '否'
        })
          .then(() => {
            this.staffOut({
              id: id,
              onsuccess: body => {
                if (body.data.code == 0) {
                  this.$message({
                    message: '成功离岗',
                    type: 'success'
                  });
                  this.getGuest(parseInt(this.currentPage3-1));
                }
              }
            })
          })
          .catch(action => {

          });
      },


      // 获取数据列表
      getLists (page,statuses,type,limit,status) {
        page = page * 18;
        this.doubtfulList = [];
        let obj = {
          createTimeStart: new Date(this.datetimeparse(new Date(new Date(new Date().toLocaleDateString()).getTime()),'YYYY/MM/DD hh:mm:ss')).getTime(),
          createTimeEnd: '',
          hotelId: sessionStorage.hotelId,
          location: this.locationTab == 1 ? '' : this.selectLists[this.locationTab-1]
        };
        if (status != '') {
          obj.status = status
        }
        if (statuses != '') {
          obj.guestType = statuses
        }
        this.getDoubtfulList ({
          offset: page,
          limit: limit,
          data: obj,
          onsuccess: body => {
            if (type == 0) {
              this.toDayLists = [...body.data.data];
            }else if (type == 1) {
              this.strangerLists = [...body.data.data];
            }else if (type == 2) {
              this.whiteLists = [...body.data.data];
            }else {
              this.strangerNum = parseInt(body.headers['x-total-count']);
              body.data.data.forEach(item => {
                if (Math.abs(item.bluriness && item.bluriness) >= 1) {
                  this.indistinctList.push(item);
                }else {
                  this.strangerList.push(item);
                }
              });
            }
            this.$nextTick(() => {
              this.loading.close();
              if (!this.tab3) {
                this.$refs.mainListHeight.$el.childNodes[2].style.minHeight = 'calc(100vh - '+(100 + this.$refs.headerHeight.$el.offsetHeight)+'px)';
              }else {
                this.$refs.mainListHeight.$el.childNodes[this.$refs.mainListHeight.$el.childNodes.length-1].style.minHeight = 'calc(100vh - '+(100 + this.$refs.headerHeight.$el.offsetHeight)+'px)';
              }
              this.$refs.elAside.$children[0].$el.style.height = this.$refs.mainHeight.$el.offsetHeight + 'px';
              this.$refs.elAside.$children[0].$el.firstChild.firstChild.style.height = (this.$refs.mainHeight.$el.offsetHeight - 1) + 'px';
              this.$refs.elAside.$children[0].$el.lastElementChild.style.maxHeight = (this.$refs.mainHeight.$el.offsetHeight - 48)+ 'px';
            })
          }
        })
      },

      // 获取总数列表
      totalList () {
        this.totalGuest({
          data: {
            location: this.locationTab == 1 ? '' : this.selectLists[this.locationTab-1],
            hotelId: sessionStorage.hotelId,
          },
          onsuccess: body => {
            if (body.data.code == 0) {
              this.total1 = body.data.data.count;
              this.total2 = body.data.data.suspiciousCount;
              this.total3 = body.data.data.inCount;
              this.weekNum = body.data.data.weekTotal;
              this.monthNum = body.data.data.monthTotal;
              this.allNum = body.data.data.total;
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

      // 待处理的处置事件
      handelBtn(id,type){
        this.hasChecked({
          illegalGuestId: id,
          onsuccess:body=>{
            this.$message({
              message: '处置成功',
              type: 'success'
            });
            if (type == 1) {
              this.strangerNum--;
              this.strangerList.forEach((item,index) => {
                if (item.illegal_guest_id == id) {
                  this.$nextTick(() => {
                    this.strangerList.splice(index, 1);
                    this.total1++;
                    this.total2++;
                    if (this.tab1 && this.currentPage1 == 1) {
                      this.toDayLists.unshift(item);
                      if (this.toDayLists.length > 18) {
                        this.toDayLists.splice(18,1);
                      }
                    }else if (this.tab2 && this.currentPage2 == 1) {
                      this.strangerLists.unshift(item);
                      if (this.strangerLists.length > 18) {
                        this.strangerLists.splice(18,1);
                      }
                    }
                  });
                }
                this.totalAll();
              })
            }else {
              this.indistinctList.forEach((item,index) => {
                if (item.illegal_guest_id == id) {
                  this.$nextTick(() => {
                    this.indistinctList.splice(index, 1);
                    this.total1++;
                    this.total2++;
                    if (this.tab1 && this.currentPage1 == 1) {
                      this.toDayLists.unshift(item);
                      if (this.toDayLists.length > 18) {
                        this.toDayLists.splice(18,1);
                      }
                    }else if (this.tab2 && this.currentPage2 == 1) {
                      this.strangerLists.unshift(item);
                      if (this.strangerLists.length > 18) {
                        this.strangerLists.splice(18,1);
                      }
                    }
                  });
                }
                this.totalAll();
              })
            }

          }
        })
      },

      //初始化weosocket
      initWebSocket(){
        //ws地址
        // const wsuri = process.env.WS_API + "/websocket/threadsocket";
        const wsuri = 'ws://qa.fortrun.cn/monitor-channel/websocket/' + encodeURIComponent(sessionStorage.session_id);
        this.websock = new WebSocket(wsuri);
        this.websock.onopen = this.websocketonopen;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
        this.websock.onerror = this.websocketerror;
      },
      websocketonopen(e){ //建立通道
        // let redata = e;
        console.log('============websocket建立链接==============')
      },
      websocketonmessage(e){ //数据接收
        console.log('============websocket数据接收成功==============');
        console.log(e.data);
        if (e.data != '连接成功' && e.data != 888) {
          let val = JSON.parse(e.data);
          console.log(22222211111, val);
          this.weekNum = val.weekTotal;
          this.monthNum = val.monthTotal;
          this.allNum = val.total;
          let newData = JSON.parse(val.illegalGuest);
          this.$nextTick(() => {
            if (newData.guestType == 'SUSPICIOUS_GUEST') {
              this.strangerNum++;
              if (newData.bluriness && Math.abs(newData.bluriness) >= 1) {
                this.indistinctList.unshift(newData);
              }else {
                this.strangerList.unshift(newData);
              }
            }else {
              this.total1++;
              this.toDayLists.unshift(newData);
              if (this.toDayLists.length > 18) {
                this.toDayLists.splice(18,1);
              }
              if (newData.guestType == 'STAFF' || newData.guestType == 'STAFF_IN') {
                if (this.tab3) {
                  this.getGuest(parseFloat(this.currentPage3-1));
                }
              }
            }
            this.totalAll();
          });
          console.log(newData);
        }
      },
      websocketsend(agentData){//数据发送
        console.log('============websocket数据发送成功==============')
        this.websock.send(agentData);
      },
      websocketclose(e){  //关闭通道
        console.log("关闭通道connection closed (" + e.code + ")");
        this.websock.close();
        setTimeout(() => {
          if (this.handleIndex == 1) {
            this.initWebSocket();
          }
        },3000);
      },
      websocketerror(e){  //通道异常
        console.log("通道异常connection closed (" + e.code + ")");
        this.websock.close();
        setTimeout(() => {
            if (this.handleIndex == 1) {
              this.initWebSocket();
            }
        },3000);
      },

      beforeRouteLeave(to,from,next) {
        this.websock.close();
        clearInterval(this.timer_);
        clearInterval(this.timer);
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
      text-align: left;
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
    .stranger_title_ {
      display: flex;
      justify-content: flex-start;
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
        .lists {
          .el-row {
            /*margin-bottom: 10px;*/
            &:last-child {
              margin-bottom: 0;
            }
          }
          .list {
            margin: 0 0 8px;
            .grid-content {
              border: 1px solid #3798FC;
              border-radius: 8px;
              padding: 5px;
              .imgs {
                display: flex;
                justify-content: space-between;
                div {
                  position:relative;
                  width: 48.5%;
                  height:0;
                  padding-top:50%;
                  border-radius: 8px;
                  img {
                    position:absolute;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    border-radius: 8px;
                    cursor: pointer;
                  }
                }
              }
              .list_content {
                .title {
                  font-size: 20px;
                  color: #fff;
                  margin: 8px 0;
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .title:hover {
                  overflow: inherit;
                  background-color: #041740;
                  z-index: 5;
                }
                .blockTitle {
                  color: #fff;
                }
                .blockTitle.title:hover {
                  background-color: transparent;
                }
                .content {
                  padding-bottom: 40px;
                  position: relative;
                  p {
                    height: 22px;
                    display: flex;
                    justify-content: flex-start;
                    font-size: 14px;
                    text-align: left;
                    /*overflow: hidden;*/
                    /*text-overflow: ellipsis;*/
                    /*display: -webkit-box;*/
                    /*-webkit-line-clamp: 1;*/
                    /*display: -webkit-box;*/
                    /*-webkit-box-orient: vertical;*/
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    span:first-of-type {
                      color: #408FE9;
                    }
                    span:last-of-type {
                      color: #fff;
                      font-size: 15px;
                    }
                  }
                  p:hover {
                    overflow: inherit;
                    span {
                      background-color: #041740;
                      z-index: 5;
                    }
                  }
                  p.blockTitle {
                    span:first-of-type {
                      color: #fff;
                    }
                  }
                  p.blockTitle:hover {
                    span {
                      background-color: transparent;
                    }
                  }
                  p:nth-of-type(3) span:last-of-type {
                    color: #F46C6C;
                  }
                  .btns {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    cursor: pointer;
                  }
                }
              }
            }
            .grid-content:hover {
              border: 1px solid #F46C6C;
            }
          }
        }
      }
    }
    .el-aside:last-of-type {
      padding: 0;
      margin-right: 0;
      margin-left: 15px;
      height: auto;
    }
    .red-purple {
      background-color: red;
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
