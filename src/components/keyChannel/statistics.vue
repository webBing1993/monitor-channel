<template>
  <div>
    <div class="statistics_chat">
      <!--<div class="preparation">筛选</div>-->
      <!--<div class="timeChoose">-->
        <!--<span>日期</span>-->
        <!--<span class="calendarChoose" @click="calendarShow = true">-->
          <!--<img src="../../assets/index/riqi.png" alt="">-->
          <!--<input type="text" readonly placeholder="选择日期" v-model="startTime">-->
        <!--</span>-->
        <!--<span>至</span>-->
        <!--<span class="calendarChoose" @click="calendarShow_ = true">-->
          <!--<img src="../../assets/index/riqi.png" alt="">-->
          <!--<input type="text" readonly placeholder="选择日期" v-model="endTime">-->
        <!--</span>-->
        <!--<span class="inquire" @click="inquire">查询</span>-->
      <!--</div>-->

       <el-card class="box-card">
         <!-- 饼图-->
         <div class="pie">
           <img src="../../assets/index/youshang.png" alt="">
           <p>日抓拍统计</p>
           <div id="myChart2" style="width: calc(100% - 32px);height: 300px"/>
         </div>
         <!-- 折线图-->
         <div class="lineChart">
           <img src="../../assets/index/youxia.png" alt="">
           <div id="myChart1" style="width: calc(100% - 32px);height: 300px"/>
         </div>
      </el-card>


      <!-- 日期控件-->
      <Calendar
        v-on:choseDay="clickDay"
        v-on:changeMonth="changeDate"
        v-show="calendarShow"
      ></Calendar>
      <Calendar
        v-on:choseDay="clickDay_"
        v-on:changeMonth="changeDate_"
        v-show="calendarShow_"
      ></Calendar>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  import Calendar from 'vue-calendar-component';

  // 引入基本模板
  import echarts from 'echarts'
  // 引入柱状图组件
  require('echarts/lib/chart/bar');
  require('echarts/lib/chart/pie');

  // 引入提示框和title组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/legend');


  export default {
    name: 'statistics',
    components: {
      Calendar
    },
    data () {
      return {
        calendarShow: false,
        calendarShow_: false,
        startTime: '',
        endTime: '',
        echarts2Options: [],   // 饼图数据
        echarts1Options: {},   // 折线图数据
      }
    },
    props: {
      totalLists: {
        type: Array,
        required: true
      }
    },
    mounted () {

      // 初始化时间为当前天前七天的数据
      this.startTime = this.fun_date(-7);
      this.endTime = this.datetimeparse(new Date().getTime(),'YYYY/MM/DD');
      // 获取数据列表
      setTimeout(() => {
        // 饼图
        this.echarts1Options = {};
        this.echarts2Options = [];
        this.getList (this.startTime, this.endTime);
      },0);
    },
    methods: {

      ...mapActions([
        'replaceto','illegalGuest'
      ]),

      // 获取前后几天的时间
      fun_date(aa){
        let date1 = new Date(),
          time1=date1.getFullYear()+"/"+(date1.getMonth()+1)+"/"+date1.getDate();//time1表示当前时间
        let date2 = new Date(date1);
        date2.setDate(date1.getDate()+aa);
        let time2 = date2.getFullYear()+"/"+(date2.getMonth()+1)+"/"+date2.getDate();
        return time2;
      },

      // 计算续住的总日期列表
      getAll(begin, end) {
        let ab = begin.split("/");
        let ae = end.split("/");
        let db = new Date();
        let arrTime = [];
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        let de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        let unixDb = db.getTime();
        let unixDe = de.getTime();
        for (let k = unixDb; k <= unixDe;) {
          arrTime.push(this.datetimeparse(k, 'YYYY-MM-DD'));
          k = k + 24 * 60 * 60 * 1000;
        }
        arrTime.pop();   // 去掉最后一天
        return arrTime;
      },

      // 选中某天
      clickDay (data) {
        this.startTime = data;
        this.calendarShow = false;
      },
      clickDay_ (data) {
        this.endTime = data;
        this.calendarShow_ = false;
      },

      // 左右点击切换月份
      changeDate(data) {
        console.log(data);
      },
      changeDate_(data) {
        console.log(data);
      },

      // 查询
      inquire() {
        this.echarts1Options = {};
        this.echarts2Options = [];
        this.getList (this.startTime, this.endTime);
      },

      // 获取数据
      getList (startTime,endTime) {
        let arr = this.getAll (startTime, endTime);
        console.log('arr:',arr);
//        console.log('arr_:',arr.reverse());
        if (arr.length > 7) {
          this.$message('筛选时间不可大于7天');
          return
        }
        if (startTime == '') {
          this.$message.error('请选择初始时间');
          return;
        }else if (endTime == '') {
          this.$message.error('请选择结束时间');
          return
        }
        if (new Date(this.datetimeparse(new Date(new Date(new Date(endTime).toLocaleDateString()).getTime()+24*60*60*1000-1),'YYYY-MM-DD hh:mm:ss')).getTime() <= new Date(this.datetimeparse(new Date(new Date(new Date(startTime).toLocaleDateString()).getTime()),'YYYY-MM-DD hh:mm:ss')).getTime()) {
          this.$message('结束时间必须大于起始时间');
          return
        }
        this.illegalGuest({
          data: {
            createTimeStart: new Date(this.datetimeparse(new Date(new Date(new Date(startTime).toLocaleDateString()).getTime()),'YYYY/MM/DD hh:mm:ss')).getTime(),
            createTimeEnd: new Date(this.datetimeparse(new Date(new Date(new Date(endTime).toLocaleDateString()).getTime()+24*60*60*1000-1),'YYYY/MM/DD hh:mm:ss')).getTime(),
            hotelId: sessionStorage.hotelId ? sessionStorage.hotelId : '',
          },
          onsuccess: body => {
              let list = body.data.data.list;
              let timeArr = [],suspiciousList = [],staffList = [],visitorList = [],guestList = [];
              this.echarts1Options = {};
              this.echarts2Options = [];
              list.forEach(item => {
                timeArr.push(item.date);
                suspiciousList.push(item.suspicious);
                staffList.push(item.staff);
                visitorList.push(item.visitor);
                guestList.push(item.guest);
              });

              // 处理空日期的填充
              arr.forEach((item, index) => {
                  if (arr[index] != timeArr[index]) {
                      timeArr.splice(index, 0, item);
                      suspiciousList.splice(index, 0, 0);
                      staffList.splice(index, 0, 0);
                      visitorList.splice(index, 0, 0);
                      guestList.splice(index, 0, 0);
                  }
              });

              this.echarts1Options.timeArr = timeArr;
              this.echarts1Options.suspiciousList = suspiciousList;
              this.echarts1Options.staffList = staffList;
              this.echarts1Options.visitorList = visitorList;
              this.echarts1Options.guestList = guestList;

              let obj = {}, obj2 = {};
              obj.name = '陌生人';
              obj.value = body.data.data.suspicious;
              obj2.name = '在岗人员';
              obj2.value = body.data.data.staff;

              this.echarts2Options.push(obj2, obj);
              console.log('this.echarts2Options',this.echarts2Options);

              setTimeout(() => {
                this.getLine();
                this.getPie();
              }, 1500);

              this.$nextTick(() => {
                setTimeout(() => {       // 隔一天加载折线图
                  this.startTime = this.fun_date(-7);
                  this.endTime = this.datetimeparse(new Date().getTime(),'YYYY/MM/DD');
                  this.echarts1Options = {};
                  this.echarts2Options = [];
                  this.getList (this.startTime, this.endTime);
                },((new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1) - new Date().getTime()))
              })
          }
        })
      },

      // 折线图
      getLine () {
        // 基于准备好的dom，初始化echarts实例
        let myChart1 = null;
        if (myChart1) {
          myChart1.clear();
        }
        setTimeout(() => {
          myChart1 = echarts.init(document.getElementById('myChart1'));
          // 绘制图表，this.echarts1_option是数据
          myChart1.setOption({
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              y: 'bottom',
              x: 'center',
              icon: 'rect',
              itemWidth: 20,
              itemHeight: 10,
              itemGap: 10,
              textStyle:{
                fontSize: 12,//字体大小
                color: '#ffffff'//字体颜色
              },
              data:['在岗人员','陌生人']
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.echarts1Options.timeArr,
              axisLabel: {
                show: true,
                showMaxLabel: true,
                textStyle: {
                  color: '#ffffff'
                }
              }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#ffffff'
                },
                margin: 2,
                formatter: function (value, index) {
                  if (value >= 1000 && value < 10000) {
                    value = value / 1000 + "千";
                  } else if (value >= 10000) {
                    value = value / 10000 + "万";
                  }
                  return value;
                }
              }
            },
            grid: {
              left: 40,
              right: 40
            },
            series: [
              {
                name:'在岗人员',
                type:'line',
                data: this.echarts1Options.staffList
              },
              {
                name:'陌生人',
                type:'line',
                data: this.echarts1Options.suspiciousList
              }
            ]
          },true)
        },500)
      },

      // 饼图
      getPie () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = null;
        if (myChart) {
          myChart.clear();
        }
        setTimeout(() => {
          myChart = echarts.init(document.getElementById('myChart2'));
          myChart.clear();
          myChart.setOption({
            series: [{
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              hoverAnimation:false, // 是否开启 hover 在扇区上的放大动画效果
              data: this.echarts2Options,
              avoidLabelOverlap: true,   //是否启用防止标签重叠策略
              label:{
                align: 'left',
                normal:{
                  formatter(v) {
                    let text = v.name;
                    if(text.length <= 2)
                    {
                      return text;
                    }else if(text.length > 2 && text.length <= 4){
                      return text = `${text.slice(0,2)}\n${text.slice(2)}`
                    }
                  },
                  textStyle : {
                    fontSize : 12
                  }
                }
              }
            }],
            tooltip: {
              formatter: '{b} : {c}',// 默认值null，内容格式器
            },
            legend: {
              y: 'bottom',
              x: 'center',
              textStyle:{
                fontSize: 12,//字体大小
                color: '#ffffff'//字体颜色
              },
              data: ['在岗人员','陌生人']
            },
          },true);
        },500)
      },

    },
    watch: {
      totalLists (newV, oldV) { // watch监听props里status的变化，然后执行操作
        console.log(1111, newV, oldV);
//        this.totalLists = newV;
//        this.getPie();
        this.startTime = this.fun_date(-7);
        this.endTime = this.datetimeparse(new Date().getTime(),'YYYY/MM/DD');
        this.echarts1Options = {};
        this.echarts2Options = [];
        this.getList (this.startTime, this.endTime);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .el-card {
    border: none;
    background-color: transparent;
  }

  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: none;
    height: 100%;
  }

  .box-card {
    /*width: 100vw;*/
    /deep/ .el-card__body {
      width: 100%;
      padding: 0;
      height: 100%;
      /*position: absolute;*/
      z-index: 10;
      /*left: 0;*/
      /*top: 0;*/
    }
    .pie {
      position: relative;
      width: 100%;
      img {
        display: block;
        width: 100%;
      }
      p {
        position: absolute;
        z-index: 10;
        font-size: 14px;
        color: #fff;
        padding: 8px;
        left: 8px;
        top: 0;

      }
    }
    .lineChart {
      position: relative;
      width: 100%;
      margin-top: 20px;
      img {
        display: block;
        width: 100%;
        /*height: 360px;*/
      }
    }
    #myChart1, #myChart2 {
      display: block;
      padding: 8px;
      position: absolute;
      z-index: 10;
      left: 8px;
      top: 18px;
      div {
        width: 100%;
        height: 100%;
      }
    }
    #myChart1 {
      top: -34px;
    }
  }

  .statistics_chat {
    position: relative;
    height: 100%;
    .preparation {
      color: #fff;
      font-size: 16px;
      text-align: left;
    }
    .timeChoose {
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      span {
        margin-right: 15px;
      }
      .calendarChoose {
        border: 1px solid #D0D0D0;
        border-radius: 4px;
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          width: 14px;
          height: 14px;
          display: inline-flex;
          margin: 0 15px;
        }
        input {
          color: #303133;
          font-size: 14px;
          border: none;
          background-color: #fff;
          width: 60%;
        }
        input:-moz-placeholder {
          color: #C0C4CC;
        }
        input:-ms-input-placeholder {
          color: #C0C4CC;
        }
        input::-moz-placeholder {
          color: #C0C4CC;
        }
        input::-webkit-input-placeholder {
          color: #C0C4CC;
        }
      }
      .inquire {
        background: #409EFF;
        border-radius: 4px;
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        margin-left: 15px;
      }
    }
    .wh_container {
      position: absolute;
      top: 90px;
      /deep/ .wh_content_all {
        background-color: #D0D0D0;
      }
    }
  }

</style>
