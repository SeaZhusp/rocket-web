<template>
  <div>
    <el-row>
      <el-table :data="statTableData" border>
        <el-table-column prop="strat_time" label="StartTime" align="center" width="160">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.strat_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="EndTime" align="center" width="160">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.end_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="Duration" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.duration/1000 }} 秒</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="Total" align="center">
          <template slot-scope="scope">
            <el-tag type="primary">{{ scope.row.total }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="success" label="Success" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.success }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="failed" label="Failed" align="center">
          <template slot-scope="scope">
            <el-tag type="danger">{{ scope.row.failed }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="error" label="Error" align="center">
          <template slot-scope="scope">
            <el-tag type="warning">{{ scope.row.error }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skip" label="Skip" align="center">
          <template slot-scope="scope">
            <el-tag type="info">{{ scope.row.skip }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row style="margin-top:20px">
      <slot v-for="item in summary.details">
        <div>
          <span style="font-weight: bold; font-size: medium">{{ item.name }}</span>
          <el-popover placement="top-start" width="400" trigger="hover">
            <pre class="code-block">{{ item.in_out }}</pre>
            <el-button slot="reference" round type="text">parameters & output</el-button>
          </el-popover>
        </div>
        <el-table
          :data="item.records"
          style="width: 100%"
          border
          :header-cell-style="{textAlign:'center', background: '#F8F8FA'}"
          :cell-style="{textAlign:'center'}"
        >
          <el-table-column type="expand" fixed>
            <template slot-scope="props">
              <el-tabs>
                <el-tab-pane label="Request">
                  <pre class="code-block" v-html="handleRequest(props.row.meta_data.request)" />
                </el-tab-pane>
                <el-tab-pane v-if="props.row.meta_data.response.content !== null" label="Content">
                  <pre
                    class="code-block"
                    v-text="handleContent(props.row.meta_data.response.content)"
                  />
                </el-tab-pane>
                <el-tab-pane label="Response">
                  <pre class="code-block" v-text="handleResponse(props.row.meta_data.response)" />
                </el-tab-pane>
                <el-tab-pane v-if="props.row.meta_data.validators.length !== 0" label="Validators">
                  <!--                                <pre class="code-block" v-html="props.row.meta_data.validators"></pre>-->
                  <el-table
                    :data="props.row.meta_data.validators"
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
                <el-tab-pane v-if="props.row.attachment !== ''" label="Exception">
                  <pre class="code-block" v-html="props.row.attachment" />
                </el-tab-pane>
                <el-tab-pane v-if="props.row.meta_data.response.content !== null" label="Extract">
                  <ResContent :data="props.row.meta_data.response.content" />
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>

          <el-table-column label="名 称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="请求地址">
            <template slot-scope="scope">
              <span>{{ scope.row.meta_data.request.url }}</span>
            </template>
          </el-table-column>

          <el-table-column label="请求方法">
            <template slot-scope="scope">
              <span
                :class="scope.row.meta_data.request.method"
              >{{ scope.row.meta_data.request.method }}</span>
            </template>
          </el-table-column>

          <el-table-column label="响应时间 (ms)">
            <template slot-scope="scope">
              <span>{{ scope.row.meta_data.response.elapsed_ms }}</span>
            </template>
          </el-table-column>

          <el-table-column label="测试结果">
            <template slot-scope="scope">
              <div :class="scope.row.status">{{ scope.row.status }}</div>
            </template>
          </el-table-column>

        </el-table>
      </slot>
    </el-row>
  </div>
</template>

<script>
import { getInfo } from '@/api/http/api'
export default {
  name: 'Report',
  props: {

  },
  data() {
    return {
      statTableData: [{
        strat_time: '2016-05-02 11:00:00',
        end_time: '2016-05-02 11:05:11',
        duration: 123,
        total: 1,
        success: 1,
        failed: 0,
        error: 0,
        skip: 0
      }],
      summary: ''
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.getresult()
  },
  methods: {
    getresult() {
      getInfo().then(res => {
        this.summary = res.data
        console.log(this.summary)
      })
    },
    handleRequest(request) {
      const keys = ['start_timestamp']

      keys.forEach(function(item) {
        delete request[item]
      })
      try {
        request['body'] = JSON.parse(request['body'])
      } catch (e) {
      }

      return request
    },

    handleContent(content) {
      try {
        content = JSON.parse(content)
      } catch (e) {
      }

      return content
    },

    handleResponse(response) {
      const keys = [
        'response_time_ms',
        'encoding',
        'ok',
        'reason',
        'url',
        'text',
        'json',
        'content_size',
        'content_type'
      ]

      keys.forEach(function(item) {
        delete response[item]
      })

      return response
    }
  }
}
</script>

<style scoped>

</style>
