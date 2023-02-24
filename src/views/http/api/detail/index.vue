<template>
  <div>
    <el-card shadow="nerer">
      <el-form ref="apiInfo" :inline="true" :model="apiInfo" :rules="apiInfoRules" label-width="70px">
        <el-row>
          <el-form-item label="名称" prop="name">
            <el-input v-model="apiInfo.name" placeholder="接口名称" class="custom-form-item" />
          </el-form-item>
          <el-form-item label="目录" prop="catalog_id">
            <el-select
              ref="select"
              v-model="apiInfo.catalog_id"
              placeholder="请选择"
              clearable
              filterable
              :filter-method="singleTreeFilterMethod"
              popper-class="customSelectPopper"
              class="custom-form-item"
              @focus="singleTreeFocus"
              @clear="singleTreeClear"
            >
              <el-option
                v-for="item in catalogOptions"
                v-show="false"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
              <div class="singleTree">
                <el-tree
                  ref="selectTree"
                  key
                  :data="catalogs"
                  node-key="id"
                  empty-text="无匹配数据"
                  :default-expanded-keys="defaultExpandedkeys"
                  highlight-current
                  :expand-on-click-node="false"
                  :props="{'label': 'label', children: 'children'}"
                  :filter-node-method="filterNode"
                  @node-click="handleNodeClick"
                />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="优先级" prop="level">
            <el-select v-model="apiInfo.level" placeholder="优先级" class="custom-form-item">
              <el-option v-for="item in levelOptions" :key="item.label" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="apiInfo.status" placeholder="状态" class="custom-form-item">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="apiInfo.desc" type="textarea" placeholder="描述" class="custom-form-item" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="Service" prop="service" label-width="70px">
              <el-select v-model="apiInfo.service" style="width: 140px" placeholder="Service">
                <el-option v-for="item in serviceOptions" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="path">
              <el-input v-model="apiInfo.path" placeholder="Enter request PATH" style="width:680px">
                <el-select slot="prepend" v-model="apiInfo.method" size="medium" style="width: 100px" placeholder="Method">
                  <el-option v-for="item in methodOptions" :key="item.value" :label="item.value" :value="item.value" />
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="times">
              <!-- <el-tooltip class="item" effect="dark" content="循环次数" placement="top-start">
              <el-input-number v-model="apiInfo.times" style="width:100px" controls-position="right" :min="1" :max="100" />
            </el-tooltip> -->
              <el-select v-model="apiInfo.config_id" placeholder="Config">
                <el-option v-for="item in configOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" :loading="runStatus" @click.native="handleSend()">Send</el-button>
              <el-button type="primary" @click.native="handleSave()">Save</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs v-model="activeStep">
        <el-tab-pane label="Variables" name="variables">
          <Variables
            ref="variables"
            :variables="apiInfo.body.variables"
          />
        </el-tab-pane>
        <el-tab-pane label="Headers" name="headers">
          <Headers
            ref="headers"
            :headers="apiInfo.body.headers"
          />
        </el-tab-pane>
        <el-tab-pane label="Request" name="request">
          <Request
            ref="request"
            :request="apiInfo.body.request"
          />
        </el-tab-pane>
        <el-tab-pane label="Validator" name="validator">
          <Validator
            ref="validator"
            :validator="apiInfo.body.validator"
          />
        </el-tab-pane>
        <el-tab-pane label="Extract" name="extract">
          <Extract
            ref="extract"
            :extract="apiInfo.body.extract"
          />
        </el-tab-pane>
        <el-tab-pane label="Hooks" name="Hooks">
          <Hooks
            ref="hooks"
            :hooks="apiInfo.body.hooks"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-drawer title="按 Esc 关闭" :visible.sync="reportShow" :append-to-body="true" :wrapper-closable="false" size="60%">
      <el-card shawer="never">
        <Report :summary="summary" />
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { createApi, updateApi, runSingleApi } from '@/api/http'
import Extract from '@/components/HttpRunner/Extract'
import Validator from '@/components/HttpRunner/Validator'
import Headers from '@/components/HttpRunner/Headers'
import Variables from '@/components/HttpRunner/Variables'
import Request from '@/components/HttpRunner/Request'
import Hooks from '@/components/HttpRunner/Hooks'
import Report from '@/components/HttpRunner/Report'
export default {
  components: {
    Variables,
    Headers,
    Request,
    Extract,
    Validator,
    Hooks,
    Report
  },
  props: {
    apiCreateFlag: {
      type: Boolean,
      require: true
    },
    catalogs: {
      type: Array,
      required: true
    },
    apiInfo: {
      type: Object,
      require: false,
      default() {
        return {}
      }
    },
    catalogSelectOptions: {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    configOptions: {
      type: Array,
      require: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      defaultExpandedkeys: [this.apiInfo.catalog_id],
      catalogOptions: this.catalogSelectOptions,
      runStatus: false,
      summary: '',
      reportShow: false,
      activeStep: 'request',
      methodOptions: JSON.parse(localStorage.getItem('dicts'))['http_method'] || [],
      levelOptions: [{ label: 'P0' }, { label: 'P1' }, { label: 'P2' }],
      statusOptions: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }],
      tagOptions: [{ value: 0, label: '冒烟测试' }, { value: 1, label: '系统测试' }],
      serviceOptions: JSON.parse(localStorage.getItem('dicts'))['http_service'] || [],
      apiInfoRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '优先级不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        service: [
          { required: true, message: 'service不能为空', trigger: 'blur' }
        ],
        method: [
          { required: true, message: 'method不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: 'path不能为空', trigger: 'blur' }
        ],
        times: [
          { required: true, message: 'times不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    catalogSelectOptions: function() {
      this.catalogOptions = this.catalogSelectOptions
    }
  },
  created() {
  },
  methods: {
    singleTreeClear() {
      // do something
    },
    singleTreeFilterMethod(val) {
      this.$refs.selectTree.filter(val)
    },
    singleTreeFocus() {
      this.$refs.selectTree.filter('')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.apiInfo.catalog_id = data.id
      // this.selectModel = data.id // select v-model 赋值
      this.catalogOptions = [data] // 隐藏的 select option 赋值
      this.$refs.select.blur() // 收起 select 下拉框
    },
    getApiInfo() {
      return {
        id: this.apiInfo.id,
        create_user: this.apiInfo.create_user,
        project_id: this.apiInfo.project_id,
        catalog_id: this.apiInfo.catalog_id,
        config_id: this.apiInfo.config_id,
        name: this.apiInfo.name,
        level: this.apiInfo.level,
        status: this.apiInfo.status,
        desc: this.apiInfo.desc,
        service: this.apiInfo.service,
        method: this.apiInfo.method,
        path: this.apiInfo.path,
        times: this.apiInfo.times,
        body: {
          variables: this.$refs.variables.parseVariables(),
          headers: this.$refs.headers.parseHeaders(),
          request: this.$refs.request.parseRequest(),
          validator: this.$refs.validator.parseValidator(),
          extract: this.$refs.extract.parseExtract(),
          hooks: this.$refs.hooks.parseHooks()
        }
      }
    },
    handleSave() {
      this.$refs.apiInfo.validate(validate => {
        if (validate) {
          if (this.apiCreateFlag) {
            createApi(this.getApiInfo()).then(res => {
              this.$message.success(res.msg)
            }).catch(error => {
              this.$message.error(error.response.data['message'])
            })
          } else {
            updateApi(this.getApiInfo()).then(res => {
              this.$message.success(res.msg)
            }).catch(error => {
              this.$message.error(error.response.data['message'])
            })
          }
          this.$emit('handleApiDrawerClose')
          this.$emit('getApiList')
        }
      })
    },
    async handleSend() {
      const loading = this.$loading({
        lock: true,
        text: '拼命执行中',
        spinner: 'el-icon-loading'
      })
      this.runStatus = true
      const params = {
        config_id: this.apiInfo.config_id,
        api_id: this.apiInfo.id
      }
      await runSingleApi(params).then(res => {
        this.$message.success(res.msg)
        this.summary = res.data
        this.reportShow = true
      })
      this.runStatus = false
      loading.close()
    }
  }
}
</script>

<style scoped>

</style>
