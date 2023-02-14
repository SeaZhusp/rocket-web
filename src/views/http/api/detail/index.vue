<template>
  <el-card shadow="nerer">
    <el-form ref="apiForm" :inline="true" :model="apiForm" :rules="apiFormRules" label-width="70px">
      <el-row>
        <el-form-item label="名称" prop="name">
          <el-input v-model="apiForm.name" placeholder="接口名称" class="custom-form-item" />
        </el-form-item>
        <!-- <el-form-item label="目录" prop="catalog_id">
          <el-select
            ref="select"
            v-model="apiForm.catalog_id"
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
        </el-form-item> -->
        <el-form-item label="优先级" prop="level">
          <el-select v-model="apiForm.level" placeholder="优先级" class="custom-form-item">
            <el-option v-for="item in levelOptions" :key="item.label" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="apiForm.status" placeholder="状态" class="custom-form-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="apiForm.desc" type="textarea" placeholder="描述" class="custom-form-item" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="Service" prop="service" label-width="70px">
            <el-select v-model="apiForm.service" style="width: 140px" placeholder="Service">
              <el-option v-for="item in serviceOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item prop="path">
            <el-input v-model="apiForm.path" placeholder="Enter request PATH" style="width:730px">
              <el-select slot="prepend" v-model="apiForm.method" size="medium" style="width: 100px" placeholder="Method">
                <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item prop="times">
            <el-tooltip class="item" effect="dark" content="循环次数" placement="top-start">
              <el-input-number v-model="apiForm.times" style="width:100px" controls-position="right" :min="1" :max="100" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="执行并保存" placement="top-start">
              <el-button type="primary" :loading="saveRunStatus" @click.native="handlerSend()">Send</el-button>
            </el-tooltip>
            <el-button type="primary" @click.native="handlerSave()">Save</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeStep">
      <el-tab-pane label="Variables" name="variables">
        <Variables :variables="apiForm?apiForm.body.variables:[]" />
      </el-tab-pane>
      <el-tab-pane label="Headers" name="headers">
        <Headers
          :headers="apiForm?apiForm.body.headers:[]"
        />
      </el-tab-pane>
      <el-tab-pane label="Request" name="request">
        <Request
          :data-type="apiForm.body.request.data_type"
          :json-data="apiForm.body.request.json_data"
          :form-data="apiForm.body.request.form_data"
        />
      </el-tab-pane>
      <el-tab-pane label="Validator" name="validator">
        <Validator
          :validator="apiForm?apiForm.body.validator:[]"
        />
      </el-tab-pane>
      <el-tab-pane label="Extract" name="extract">
        <Extract
          :extract="apiForm?apiForm.body.extract:[]"
        />
      </el-tab-pane>
      <el-tab-pane label="Hooks" name="Hooks">
        <Hooks
          :setup-hooks="apiForm?apiForm.body.hooks.setup_hooks:[]"
          :teardown-hooks="apiForm?apiForm.body.hooks.teardown_hooks:[]"
        />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { createApi, updateApi } from '@/api/http/api'
import Extract from './components/Extract'
import Validator from './components/Validator'
import Headers from './components/Headers'
import Variables from './components/Variables'
import Request from './components/Request'
import Hooks from './components/Hooks'
export default {
  components: {
    Variables,
    Headers,
    Request,
    Extract,
    Validator,
    Hooks
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
    apiForm: {
      type: Object,
      require: false,
      default() {
        return {}
      }
    },
    catalogSelectOptions: {
      type: Array,
      require: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      defaultExpandedkeys: [this.apiForm.catalog_id],
      catalogOptions: this.catalogSelectOptions,
      saveRunStatus: false,
      activeStep: 'request',
      methodOptions: ['POST', 'GET', 'PUT', 'DELETE'],
      levelOptions: [{ label: 'P0' }, { label: 'P1' }, { label: 'P2' }],
      statusOptions: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }],
      tagOptions: [{ value: 0, label: '冒烟测试' }, { value: 1, label: '系统测试' }],
      serviceOptions: [{ value: 0, label: 'udp' }],
      apiFormRules: {
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
  created() {},
  methods: {
    // singleTreeClear() {
    //   // do something
    // },
    // singleTreeFilterMethod(val) {
    //   this.$refs.selectTree.filter(val)
    // },
    // singleTreeFocus() {
    //   this.$refs.selectTree.filter('')
    // },
    // filterNode(value, data) {
    //   if (!value) return true
    //   return data.label.indexOf(value) !== -1
    // },
    // handleNodeClick(data) {
    //   console.log(data)
    //   this.apiForm.catalog_id = data.id
    //   // this.selectModel = data.id // select v-model 赋值
    //   this.catalogOptions = [data] // 隐藏的 select option 赋值
    //   this.$refs.select.blur() // 收起 select 下拉框
    // },
    handlerSave() {
      this.$refs.apiForm.validate(validate => {
        if (validate) {
          if (this.apiCreateFlag) {
            createApi(this.apiForm).then(res => {
              this.$message.success(res.msg)
            }).catch(error => {
              this.$message.error(error.response.data['message'])
            })
          } else {
            updateApi(this.apiForm).then(res => {
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
    handlerSend() {
      console.log(this.apiForm)
    }
  }
}
</script>

<style scoped>
.custom-form-item {
    width: 330px;
}
</style>
