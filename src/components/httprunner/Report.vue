<template>
  <div>
    <el-row>
      <el-table :data="summary.stat" border>
        <el-table-column prop="start_time" label="StartTime" align="center" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.start_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="Duration" align="center" width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.duration }} 秒 </span>
          </template>
        </el-table-column>
        <el-table-column prop="success" label="Result" align="center" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.test_success===true ? 'success' : 'danger'" disable-transitions>{{ scope.row.test_success===true ? 'Pass' : 'Fail' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="Total" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="primary">{{ scope.row.total }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="success" label="Success" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.success }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="failed" label="Failed" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="danger">{{ scope.row.failed }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Platform" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>HttpRunner: {{ scope.row.platform.httprunner_version }}</p>
              <p>Python: {{ scope.row.platform.python_version }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.platform.platform }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row style="margin-top:20px">
      <slot v-for="item in summary.details">
        <div :key="item.case_id" style="margin:5px">
          <span>ID:{{ item.case_id }}</span>
          <el-divider direction="vertical" />
          <span style="color: #409EFF;">{{ item.name }}</span>
          <el-divider direction="vertical" />
          <el-tag :type="item.test_success===true ? 'success' : 'danger'" disable-transitions>{{ item.test_success===true ? 'Pass' : 'Fail' }}</el-tag>
          <div :key="item.id" style="float:right">
            <span>{{ item.time.start_at_iso_format }}</span>
            <el-divider direction="vertical" />
            <el-popover placement="right" width="400" trigger="click">
              <vue-json-editor
                v-model="item.in_out"
                :show-btns="false"
              />
              <el-button slot="reference" type="text" icon="el-icon-view">查看变量</el-button>
            </el-popover>
          </div>

        </div>
        <el-table
          :data="item.step_datas"
          border
          :header-cell-style="{textAlign:'center'}"
        >
          <el-table-column type="expand" fixed>
            <template slot-scope="props">
              <el-tabs>
                <el-tab-pane label="Request">
                  <vue-json-editor
                    v-model="props.row.data.req_resps[0].request"
                    :show-btns="false"
                  />
                </el-tab-pane>
                <el-tab-pane v-if="props.row.data.req_resps[0].response.body !== null" label="Body">
                  <vue-json-editor
                    v-model="props.row.data.req_resps[0].response.body"
                    :show-btns="false"
                  />
                </el-tab-pane>
                <el-tab-pane label="Response">
                  <vue-json-editor
                    v-model="props.row.data.req_resps[0].response"
                    :show-btns="false"
                  />
                </el-tab-pane>
                <el-tab-pane v-if="props.row.data.validators" label="Validators">
                  <el-table
                    :data="props.row.data.validators.validate_extractor"
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
                    v-model="props.row.export_vars"
                    :show-btns="false"
                  />
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>

          <el-table-column label="步骤名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="请求地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.data.req_resps[0].request.url }}</span>
            </template>
          </el-table-column>

          <el-table-column label="请求方法" align="center">
            <template slot-scope="scope">
              <span
                :class="scope.row.data.req_resps[0].request.method"
              >{{ scope.row.data.req_resps[0].request.method }}</span>
            </template>
          </el-table-column>

          <el-table-column label="响应时间 (ms)" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.data.stat.elapsed_ms }}</span>
            </template>
          </el-table-column>

          <el-table-column label="测试结果" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.test_success===true ? 'Pass' : 'Fail' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </slot>
    </el-row>
  </div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
export default {
  name: 'Report',
  components: { vueJsonEditor },
  props: {
    summary: {
      type: Object,
      require: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
