<template>
  <el-card shadow="nerer">
    <el-row>
      <el-form :inline="true" label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="caseForm.name" placeholder="用例名称" class="custom-form-item" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="caseForm.level" placeholder="优先级" class="custom-form-item">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="caseForm.status" placeholder="请选优先级" class="custom-form-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="caseForm.tag"
            multiple
            filterable
            allow-create
            remote
            placeholder="用例标签"
            class="custom-form-item"
          >
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
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
        <el-col :span="16">
          <el-form-item prop="path">
            <el-input v-model="caseForm.path" placeholder="Enter request PATH">
              <el-select slot="prepend" v-model="caseForm.method" size="medium" style="width: 100px" placeholder="Method">
                <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" :loading="saveRunStatus" @click.native="saveAndRun()">调试</el-button>
            <el-button type="primary" style="margin-left:10px" @click.native="addApiMsg()">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeStep" @tab-click="handleClick">
      <el-tab-pane label="Variables" name="variables">
        <el-table :data="caseForm.variables">
          <el-table-column prop="key" label="变量名">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.key" :value="scope.row.key" placeholder="变量名" />
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              <el-autocomplete v-model="scope.row.type" placeholder="请选择" />
            </template>
          </el-table-column>
          <el-table-column prop="value" label="变量值">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder="变量值" />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="描述">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.remark" :value="scope.row.remark" placeholder="描述" />
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click.native="addTableRow('variables',scope.$index)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.native="delTableRow('variables',scope.$index)" />
            </template>
          </el-table-column>
          <template slot="empty">
            <el-button type="text" icon="el-icon-plus" @click="addTableRow('variables')">添加一行数据</el-button>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Headers" name="headers">
        <el-table :data="caseForm.headers">
          <el-table-column prop="key" label="KEY">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.key" :value="scope.row.key" placeholder="key" />
            </template>
          </el-table-column>
          <el-table-column prop="value" label="VALUE">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.value" :value="scope.row.value" placeholder="value" />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="REMARK">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.remark" :value="scope.row.remark" placeholder="remark" />
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click.native="addTableRow('headers',scope.$index)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.native="delTableRow('headers',scope.$index)" />
            </template>
          </el-table-column>
          <template slot="empty">
            <el-button type="text" icon="el-icon-plus" @click="addTableRow('headers')">添加一行数据</el-button>
          </template>

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Request" name="request">
        <el-form>
          <el-radio-group v-model="caseForm.body_type">
            <el-radio label="formdata">form-data</el-radio>
            <el-radio label="raw">raw</el-radio>
          </el-radio-group>
          <el-button v-show="caseForm.body_type === 'raw'" type="text" class="custom-btn-format" @click="formatData()">格式化</el-button>
        </el-form>
        <div v-if="caseForm.body_type === 'raw'">
          <editor v-model="caseForm.body" style="font-size: 14px" lang="json" theme="chrome" :height="height" @init="editorInit" />
        </div>
        <el-table v-if="caseForm.body_type==='formdata'" :data="caseForm.formdata">
          <el-table-column prop="key" label="KEY">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.key" :value="scope.row.key" placeholder="key" />
            </template>
          </el-table-column>
          <el-table-column label="TYPE" width="140">
            <template slot-scope="scope">
              <el-autocomplete v-model="scope.row.type" :fetch-suggestions="formDataTypeQuerySearch" placeholder="数据类型" style="width:120px" />
            </template>
          </el-table-column>
          <el-table-column label="Value" header-align="center" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 'file'">
                <el-row :gutter="10">
                  <el-col :span="18">
                    <el-input v-model="scope.row.value" size="mini" :disabled="true" />
                  </el-col>
                  <el-col :span="2">
                    <el-upload
                      class="upload-demo"
                      :action="uploadAddress"
                      :headers="myHeader"
                      :show-file-list="false"
                      list-type="picture"
                      :on-success="fileChange"
                    >
                      <el-button size="mini" type="primary" @click="setTempNum(scope.$index)">点击上传</el-button>
                    </el-upload>
                  </el-col>
                </el-row>
              </div>
              <div v-else>
                <el-input v-model="scope.row.value" placeholder="value" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="REMARK">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.remark" :value="scope.row.remark" placeholder="remark" />
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click.native="addTableRow('formdata',scope.$index)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.native="delTableRow('formdata',scope.$index)" />
            </template>
          </el-table-column>
          <template slot="empty">
            <el-button type="text" icon="el-icon-plus" @click="addTableRow('formdata')">添加一行数据</el-button>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Validate" name="validate">
        <el-table :data="caseForm.validate">
          <el-table-column prop="key" label="实际返回" width="240">
            <template slot-scope="scope">
              <el-input v-model="scope.row.key" placeholder="实际返回" />
            </template>
          </el-table-column>
          <el-table-column label="断言类型" width="250">
            <template slot-scope="scope">
              <el-autocomplete
                v-model="scope.row.comparator"
                :fetch-suggestions="validateQuerySearch"
                placeholder="断言类型"
                style="width:240px"
              />
            </template>
          </el-table-column>
          <el-table-column label="数据类型" width="120">
            <template slot-scope="scope">
              <el-autocomplete
                v-model="scope.row.type"
                :fetch-suggestions="variableTypeQuerySearch"
                placeholder="数据类型"
                style="width:110px"
              />
            </template>
          </el-table-column>
          <el-table-column property="value" label="期望返回" width="240">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder="期望返回" />
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="备注" />
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click.native="addTableRow('validate',scope.$index)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.native="delTableRow('validate',scope.$index)" />
            </template>
          </el-table-column>
          <template slot="empty">
            <el-button type="text" icon="el-icon-plus" @click="addTableRow('validate')">添加一行数据</el-button>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Extract" name="extract">
        <el-table :data="caseForm.extract">
          <el-table-column prop="key" label="变量名">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.key" :value="scope.row.key" placeholder="变量名" />
            </template>
          </el-table-column>
          <el-table-column prop="value" label="表达式">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder="表达式" />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.remark" :value="scope.row.remark" placeholder="备注" />
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click.native="addTableRow('extract',scope.$index)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.native="delTableRow('extract',scope.$index)" />
            </template>
          </el-table-column>
          <template slot="empty">
            <el-button type="text" icon="el-icon-plus" @click="addTableRow('extract')">添加一行数据</el-button>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Hooks" name="Hooks">
        <el-table :data="caseForm.setup_hooks">
          <el-table-column prop="setup_hooks" label="setup_hooks">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.setup_hooks" :value="scope.row.setup_hooks" placeholder="${ setup_hooks function($request, *args, **kwargs) }" />
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click.native="addTableRow('setup_hooks',scope.$index)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.native="delTableRow('setup_hooks',scope.$index)" />
            </template>
          </el-table-column>
          <template slot="empty">
            <el-button type="text" icon="el-icon-plus" @click="addTableRow('setup_hooks')">添加一行数据</el-button>
          </template>
        </el-table>
        <el-table :data="caseForm.teardown_hooks">
          <el-table-column prop="teardown_hooks" label="teardown_hooks">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.teardown_hooks" :value="scope.row.teardown_hooks" placeholder="${ teardown_hooks function($response, *args, **kwargs) }" />
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click.native="addTableRow('teardown_hooks',scope.$index)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.native="delTableRow('teardown_hooks',scope.$index)" />
            </template>
          </el-table-column>
          <template slot="empty">
            <el-button type="text" icon="el-icon-plus" @click="addTableRow('teardown_hooks')">添加一行数据</el-button>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { uploadUrl, uploadFile } from '@/api/system/file'
export default {
  components: {
    editor: require('vue2-ace-editor')
  },
  data() {
    return {
      tempNum: '',
      uploadAddress: uploadUrl,
      myHeader: { token: localStorage.getItem('token') },
      saveRunStatus: false,
      activeStep: 'request',
      caseForm: {
        level: null,
        path: '',
        status: '',
        method: '',
        tag: '',
        description: '',
        service: '',
        body_type: 'raw',
        body: '',
        variables: [],
        headers: [],
        extract: [],
        formdata: [],
        validate: [],
        setup_hooks: [],
        teardown_hooks: []
      },
      methodOptions: ['POST', 'GET', 'PUT', 'DELETE'],
      variableTypes: [{ 'value': 'string' }, { 'value': 'integer' }, { 'value': 'float' }, { 'value': 'boolean' }, { 'value': 'list' }, { 'value': 'dict' }],
      formDataTypes: [{ 'value': 'string' }, { 'value': 'integer' }, { 'value': 'float' }, { 'value': 'boolean' }, { 'value': 'file' }],
      comparators: [{ 'value': 'equals' }, { 'value': 'less_than' }, { 'value': 'less_than_or_equals' }, { 'value': 'greater_than' }, { 'value': 'greater_than_or_equals' },
        { 'value': 'not_equals' }, { 'value': 'string_equals' }, { 'value': 'length_equals' }, { 'value': 'length_greater_than' }, { 'value': 'count_greater_than_or_equals' },
        { 'value': 'length_less_than' }, { 'value': 'length_less_than_or_equals' }],
      levelOptions: [{ value: 0, label: 'P0' }, { value: 1, label: 'P1' }, { value: 2, label: 'P2' }],
      statusOptions: [{ value: 0, label: '进行中' }, { value: 1, label: '已完成' }],
      tagOptions: [{ value: 0, label: '冒烟测试' }, { value: 1, label: '系统测试' }],
      serviceOptions: [{ value: 0, label: 'udp' }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 464
    }
  },
  created() {

  },
  methods: {
    editorInit() {
      require('brace/ext/language_tools')
      require('brace/mode/json')
      require('brace/theme/chrome')
      require('brace/snippets/json')
    },
    formatData() {
      try {
        this.caseForm.body = JSON.parse(this.caseForm.body)
        this.caseForm.body = JSON.stringify(this.caseForm.body, null, 4)
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'json格式错误',
          type: 'warning'
        })
      }
    },
    setTempNum(index) {
      this.tempNum = index
    },
    fileChange(response, file) {
      if (response['status'] === 0) {
        this.$confirm('服务器已存在相同名字文件，是否覆盖?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const form = new FormData()
          form.append('file', file.raw)
          form.append('skip', '1')
          uploadFile(form).then(data => {
            this.$message({
              showClose: true,
              message: data['msg'],
              type: 'success'
            })
            this.apiMsgData.variable[this.temp_num]['value'] = data['data']
          })
        })
      } else {
        if (response['msg']) {
          this.$message({
            showClose: true,
            message: response['msg'],
            type: 'success'
          })
        }
        this.caseForm.formdata[this.tempNum]['value'] = response['filename']
      }
    },
    handleClick() {

    },
    addTableRow(type, index) {
      if (type === 'formdata') {
        this.caseForm.formdata.splice(index + 1, 0, { key: '', type: '', value: '', remark: '' })
      } else if (type === 'headers') {
        this.caseForm.headers.splice(index + 1, 0, { key: '', value: '', remark: '' })
      } else if (type === 'variables') {
        this.caseForm.variables.splice(index + 1, 0, { key: '', value: '', remark: '' })
      } else if (type === 'validate') {
        this.caseForm.validate.splice(index + 1, 0, { key: '', comparator: '', type: '', value: '', remark: '' })
      } else if (type === 'extract') {
        this.caseForm.extract.splice(index + 1, 0, { key: '', value: '', remark: '' })
      } else if (type === 'setup_hooks') {
        this.caseForm.setup_hooks.splice(index + 1, 0, { setup_hooks: '' })
        console.log(this.caseForm.setup_hooks)
      } else if (type === 'teardown_hooks') {
        this.caseForm.teardown_hooks.splice(index + 1, 0, { teardown_hooks: '' })
      }
    },
    delTableRow(type, index) {
      if (type === 'formdata') {
        this.caseForm.formdata.splice(index, 1)
      } else if (type === 'headers') {
        this.caseForm.headers.splice(index, 1)
      } else if (type === 'variables') {
        this.caseForm.variables.splice(index, 1)
      } else if (type === 'validate') {
        this.caseForm.validate.splice(index, 1)
      } else if (type === 'extract') {
        this.caseForm.extract.splice(index, 1)
      } else if (type === 'setup_hooks') {
        this.caseForm.setup_hooks.splice(index, 1)
      } else if (type === 'teardown_hooks') {
        this.caseForm.teardown_hooks.splice(index, 1)
      }
    },
    validateQuerySearch(queryString, cb) {
      var restaurants = this.comparators
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    formDataTypeQuerySearch(queryString, cb) {
      var restaurants = this.formDataTypes
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    variableTypeQuerySearch(queryString, cb) {
      var restaurants = this.variableTypes
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }
  }
}
</script>

<style scoped>
.custom-form-item {
    width: 330px;
  }
.custom-btn-format{
  margin-left: 20px;
}
</style>
