<template>
  <el-card shadow="nerer">
    <el-row>
      <el-form :inline="true" label-width="70px">
        <el-form-item label="接口名称">
          <el-input v-model="caseForm.name" placeholder="接口名称" class="custom-form-item" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="caseForm.level" placeholder="优先级" class="custom-form-item-select">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="caseForm.status" placeholder="状态" class="custom-form-item-select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="标签">
          <el-select
            v-model="caseForm.tag"
            multiple
            filterable
            allow-create
            remote
            placeholder="接口标签"
            class="custom-form-item"
          >
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="描述">
          <el-input v-model="caseForm.description" type="textarea" placeholder="描述" class="custom-form-item" />
        </el-form-item>
      </el-form>
    </el-row>
    <el-form>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item label="Service" label-width="70px">
            <el-select v-model="caseForm.service" style="width: 140px" placeholder="Service">
              <el-option v-for="item in serviceOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item prop="path">
            <el-input v-model="caseForm.path" placeholder="Enter request PATH">
              <el-select slot="prepend" v-model="caseForm.method" size="medium" style="width: 100px" placeholder="Method">
                <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="循环次数" placement="top-start">
              <el-input-number v-model="caseForm.times" style="width:100px" controls-position="right" :min="1" :max="100" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="执行并保存" placement="top-start">
              <el-button type="primary" :loading="saveRunStatus" @click.native="saveAndRun()">Send</el-button>
            </el-tooltip>
            <el-button type="primary" @click.native="addApi()">Save</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeStep" @tab-click="handleClick">
      <el-tab-pane label="Variables" name="variables">
        <Variables />
      </el-tab-pane>
      <el-tab-pane label="Headers" name="headers">
        <Headers
          :save="save"
          :extract="caseForm.headers"
          @header="handleHeaders"
        />
      </el-tab-pane>
      <el-tab-pane label="Request" name="request">
        <Request
          :save="save"
          :extract="caseForm.request"
          @extract="handleRequest"
        />
      </el-tab-pane>
      <el-tab-pane label="Validator" name="validator">
        <Validator
          :save="save"
          :extract="caseForm.validator"
          @extract="handleValidator"
        />
      </el-tab-pane>
      <el-tab-pane label="Extract" name="extract">
        <Extract
          :save="save"
          :extract="caseForm.extract"
          @extract="handleExtract"
        />
      </el-tab-pane>
      <el-tab-pane label="Hooks" name="Hooks">
        <Hooks
          :save="save"
          :setup-hooks="caseForm.setup_hooks"
          :teardown-hooks="caseForm.teardown_hooks"
          @extract="handleExtract"
        />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
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
  data() {
    return {
      saveRunStatus: false,
      activeStep: 'request',
      caseForm: {
        name: '',
        level: '',
        status: '',
        desc: '',
        service: '',
        method: '',
        path: '',
        times: 1,
        variables: [],
        headers: [],
        request: {},
        validator: [],
        extract: [],
        setup_hooks: [],
        teardown_hooks: []
      },
      methodOptions: ['POST', 'GET', 'PUT', 'DELETE'],
      levelOptions: [{ value: 'P0', label: 'P0' }, { value: 'P1', label: 'P1' }, { value: 'P2', label: 'P2' }],
      statusOptions: [{ value: 0, label: '禁用' }, { value: 1, label: '启用' }],
      tagOptions: [{ value: 0, label: '冒烟测试' }, { value: 1, label: '系统测试' }],
      serviceOptions: [{ value: 0, label: 'udp' }]
    }
  },
  computed: {},
  created() {

  },
  methods: {
    addApi() {

    }
  }
}
</script>

<style scoped>
.custom-form-item {
    width: 330px;
  }
</style>
