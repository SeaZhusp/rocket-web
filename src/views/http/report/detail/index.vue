<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-header-title">{{ reportName }}</span>
        <el-divider direction="vertical" />
        <el-tag :type="summary.test_success? 'success':'danger'">{{ summary.test_success? '通过':'未通过' }}</el-tag>
        <div style="float: right; padding: 3px 0">
          <el-tag type="info">Httprunner {{ summary.platform.httprunner_version }}</el-tag>
          <el-divider direction="vertical" />
          <el-tag type="info">{{ summary.platform.python_version }}</el-tag>
          <el-divider direction="vertical" />
          <el-tag type="info">{{ summary.platform.platform }}</el-tag>
        </div>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">返回列表</el-button> -->
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <el-descriptions size="medium">
              <el-descriptions-item label="测试环境">{{ envName }}</el-descriptions-item>
              <el-descriptions-item label="执行人">{{ createUser }}</el-descriptions-item>
              <el-descriptions-item label="执行总数"><el-tag>{{ total }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="成功"><el-tag type="success">{{ passed }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="失败"><el-tag type="danger">{{ failed }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="通过率"><el-tag type="warning">{{ passRate }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="耗时（秒）">{{ duration }}</el-descriptions-item>
              <el-descriptions-item label="测试时间">{{ testBeginTime }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <el-divider>Test Cases</el-divider>
        <el-row>
          <el-col :span="6">
            <el-card shadow="never">
              <el-table
                ref="singleTable"
                :data="summary.details.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                highlight-current-row
                @current-change="handleCurrentChange"
              >
                <el-table-column prop="name" :show-overflow-tooltip="true">
                  <template slot="header" slot-scope="{}">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
                  </template>
                </el-table-column>
                <el-table-column prop="time.duration" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.time.duration | computerTime }} s</span>
                  </template>
                </el-table-column>
                <el-table-column width="80">
                  <template slot-scope="{row}">
                    <el-tag :type="row.test_success?'success': 'danger'">{{ row.test_success?'Success': 'Failed' }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="17" style="margin-left: 10px">
            <el-card shadow="never">
              <el-empty v-if="step_datas.length === 0" description="请选择Testcase后查看执行详情" />
              <el-collapse v-if="step_datas.length !== 0">
                <el-collapse-item v-for="(item, index) in step_datas" :key="index">
                  <template slot="title">
                    <el-tag type="info">Step:{{ index+1 }}</el-tag>
                    <el-divider direction="vertical" />
                    {{ item.name }}
                    <el-divider direction="vertical" />
                    {{ item.data.stat.elapsed_ms }} ms
                    <el-divider direction="vertical" />
                    <el-tag :type="item.test_success?'success': 'danger'">{{ item.test_success?'Success': 'Failed' }}</el-tag>
                  </template>
                  <el-tabs>
                    <el-tab-pane label="Request">
                      <vue-json-editor
                        v-model="item.data.req_resps[0].request"
                        :show-btns="false"
                      />
                    </el-tab-pane>
                    <el-tab-pane v-if="item.data.req_resps[0].response.body !== null" label="Body">
                      <vue-json-editor
                        v-model="item.data.req_resps[0].response.body"
                        :show-btns="false"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="Response">
                      <vue-json-editor
                        v-model="item.data.req_resps[0].response"
                        :show-btns="false"
                      />
                    </el-tab-pane>
                    <el-tab-pane v-if="item.data.validators" label="Validators">
                      <el-table
                        :data="item.data.validators.validate_extractor"
                        stripe
                        border
                        style="width: 100%"
                      >
                        <el-table-column prop="check_result" label="是否通过" width="180" />
                        <el-table-column prop="check" label="取值表达式" width="180" />
                        <el-table-column prop="check_value" label="实际值" />
                        <el-table-column prop="comparator" label="比较器" />
                        <el-table-column prop="expect" label="期望值" />
                      </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="Extract">
                      <vue-json-editor
                        v-model="item.export_vars"
                        :show-btns="false"
                      />
                    </el-tab-pane>
                  </el-tabs>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
        </el-row>

      </div>
    </el-card>
  </div>
</template>

<script>
import { getReportDetail } from '@/api/http'
import vueJsonEditor from 'vue-json-editor'
import * as echarts from 'echarts'
export default {
  components: { vueJsonEditor },
  filters: {
    computerTime(duration) {
      return duration.toFixed(2)
    }
  },
  data() {
    return {
      search: '',
      summary: {
        details: [],
        platform: {},
        time: {},
        stat: [],
        test_success: null
      },
      reportName: '',
      envName: '',
      duration: '',
      failed: '',
      passed: '',
      passRate: '',
      total: '',
      testBeginTime: '',
      createUser: '',
      step_datas: []
    }
  },
  watch: {
  },
  created() {
    this.viewReportDetail()
  },
  mounted() {
    this.getRunPie()
  },
  methods: {
    getRunPie() {
      // 绘制图表
      var myChart = echarts.init(this.$refs.passRate)
      // 指定图表的配置项和数据
      var option = {
        title: {
          x: 'left' // 标题位置
        },
        // stillShowZeroSum: true,
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        // 饼图数据
        series: {
          name: '通过率',
          type: 'pie', // echarts图的类型   pie代表饼图
          radius: ['40%', '60%'], // 饼图中饼状部分的大小所占整个父元素的百分比
          center: ['50%', '50%'], // 整个饼图在整个父元素中的位置
          // data:''               //饼图数据
          data: [{ 'name': 'Pass', 'value': 0 }, { 'name': 'Failed', 'value': 3 }],
          itemStyle: {
            normal: {
              label: {
                show: true// 饼图上是否出现标注文字 标注各模块代表什么  默认是true
                // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
              },
              labelLine: {
                show: true// 官网demo里外部标注上的小细线的显示隐藏    默认显示
              }
            }
          }
        }

      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    viewReportDetail() {
      const loading = this.$loading({
        lock: true,
        text: '拼命执行中',
        spinner: 'el-icon-loading'
      })
      const params = { report_id: this.$route.query.report_id }
      getReportDetail(params).then(res => {
        this.summary = JSON.parse(res.data.summary)
        this.reportName = res.data.name
        this.envName = res.data.env_name
        this.duration = res.data.duration
        this.failed = res.data.failed
        this.passRate = res.data.pass_rate
        this.passed = res.data.passed
        this.createUser = res.data.create_user
        this.total = res.data.total
        this.testBeginTime = res.data.test_begin_time
      })
      loading.close()
    },
    handleCurrentChange(val) {
      this.step_datas = val.step_datas
    }
  }
}
</script>

<style scoped>
.card-header-title {
    color: rgba(48, 43, 43, 0.88);
    font-weight: 600;
    font-size: 16px;
}
.chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    /* box-shadow: 4px 4px 40px rgba(0, 0, 0, .05); */
    border-color: rgba(0, 0, 0, .05);
  }
</style>
