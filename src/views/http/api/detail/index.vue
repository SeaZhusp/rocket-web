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
          <el-form-item label="Service">
            <el-select v-model="caseForm.service" style="width: 140px" placeholder="Service">
              <el-option v-for="item in serviceOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="17">
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
              <el-autocomplete
                v-model="scope.row.type"
                placeholder="请选择"
              />
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
              <el-button type="text" icon="el-icon-delete" @click="delTableRow('extract',scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Request" name="request">
        <el-tabs v-model="activeReq" @tab-click="handleClick">
          <el-tab-pane label="Params" name="params">
            <b class="custom-reqinfo-name">Query Params</b>
            <el-table :data="caseForm.params">
              <el-table-column property="key" label="KEY">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.key" placeholder="key" />
                </template>
              </el-table-column>
              <el-table-column property="value" label="VALUE">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value" placeholder="value" />
                </template>
              </el-table-column>
              <el-table-column property="value" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-delete" @click.native="delTableRow('params',scope.$index)" />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="Headers" name="headers">
            <b class="custom-reqinfo-name">Headers</b>
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
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-delete" @click="delTableRow('headers',scope.$index)" />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="Body" name="body">
            <el-form>
              <el-radio-group v-model="caseForm.body_type">
                <!-- <el-radio label="none">none</el-radio> -->
                <el-radio label="form-data">form-data</el-radio>
                <!-- <el-radio label="x-www-form-urlencoded">x-www-form-urlencoded</el-radio> -->
                <el-radio label="raw">raw</el-radio>
                <el-radio label="binary">binary</el-radio>
              </el-radio-group>
              <el-button v-show="caseForm.body_type === 'raw'" type="text" class="custom-btn-format" @click="formatData()">格式化</el-button>
            </el-form>

            <div v-if="caseForm.body_type === 'raw'">
              <editor
                v-model="caseForm.body"
                style="font-size: 1px"
                lang="json"
                theme="chrome"
                :height="height"
                @init="editorInit"
              />
            </div>

            <el-table v-if="caseForm.body_type==='form-data'" :data="caseForm.form_data">
              <el-table-column prop="key" label="KEY">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.key" :value="scope.row.key" placeholder="key" />
                </template>
              </el-table-column>
              <el-table-column prop="value" label="VALUE">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value" placeholder="value" />
                </template>
              </el-table-column>
              <el-table-column prop="description" label="DESCRIPTION">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.description" :value="scope.row.description" placeholder="description" />
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-delete" @click="delTableRow('form_data',scope.$index)" />
                </template>
              </el-table-column>
            </el-table>

            <el-upload
              v-if="caseForm.body_type === 'binary'"
              class="upload-demo"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>

          </el-tab-pane>
        </el-tabs>
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
          <el-table-column prop="remark" label="REMARK">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.remark" :value="scope.row.remark" placeholder="remark" />
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="delTableRow('extract',scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Validate" name="validate">
        <el-table :data="caseForm.validate">
          <el-table-column prop="key" label="实际返回">
            <template slot-scope="scope">
              <el-input v-model="scope.row.key" placeholder="实际返回" />
            </template>
          </el-table-column>
          <el-table-column label="断言类型">
            <template slot-scope="scope">
              <el-autocomplete
                v-model="scope.row.comparator"
                class="inline-input"
                :fetch-suggestions="querySearch"
                placeholder="请选择"
              />
            </template>
          </el-table-column>
          <el-table-column label="数据类型">
            <template slot-scope="scope">
              <el-autocomplete
                v-model="scope.row.comparator"
                class="inline-input"
                :fetch-suggestions="querySearch"
                placeholder="请选择"
              />
            </template>
          </el-table-column>
          <el-table-column property="value" label="期望返回">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder="value" />
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="备注" />
            </template>
          </el-table-column>
          <el-table-column property="value" label="操作" header-align="center" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-delete"
                size="mini"
                @click.native="delTableRow('validate',scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Hooks" name="hooks">Hooks</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  components: {
    editor: require('vue2-ace-editor')
  },
  data() {
    return {
      userList: null,
      listLoading: false,
      projects: [],
      projectId: '',
      q: '',
      saveRunStatus: false,
      activeStep: 'request',
      activeReq: 'body',
      methodOptions: ['POST', 'GET', 'PUT', 'DELETE'],
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
        variables: [{ key: null, value: null, remark: null }],
        headers: [{ key: null, value: null, remark: null }],
        extract: [{ key: null, value: null, remark: null }],
        params: [{ key: null, value: null }],
        form_data: [{ key: null, value: null }]
      },
      levelOptions: [
        {
          value: 0,
          label: 'P0'
        },
        { value: 1,
          label: 'P1'
        },
        { value: 2,
          label: 'P2'
        }
      ],
      statusOptions: [
        {
          value: 0,
          label: '进行中'
        },
        { value: 1,
          label: '已完成'
        }
      ],
      tagOptions: [
        {
          value: 0,
          label: '冒烟测试'
        },
        { value: 1,
          label: '系统测试'
        }
      ],
      serviceOptions: [
        {
          value: 0,
          label: 'udp'
        }
      ]
    }
  },
  computed: {
    height() {
      return window.screen.height - 464
    }
  },
  watch: {
    'caseForm.path': {
      handler: function() {
        if (!this.caseForm.path) {
          this.caseForm.params = [{ key: '', value: '' }]
          return
        }
        if (this.caseForm.path.indexOf('?') === -1) {
          this.caseForm.params = [{ key: '', value: '' }]
          return
        }

        let url = this.caseForm.path.split('?')
        url.splice(0, 1)
        url = url.join('?')
        if (!url) {
          this.caseForm.params = [{ key: '', value: '' }]
          return
        }
        const strParam = url.split('&')
        if (strParam[0]) {
          this.caseForm.params = []
          for (let i = 0; i < strParam.length; i++) {
            if (strParam[i].indexOf('=') !== -1) {
              const _array = strParam[i].split('=')

              const d = _array[0]
              _array.splice(0, 1)

              this.caseForm.params.push({
                key: d,
                value: _array.join('=')
              })
            } else {
              this.caseForm.params.push({ key: strParam[i], value: '' })
            }
          }
        }
      }
    },
    'caseForm.params': {
      handler: function() {
        if (this.caseForm.params.length === 0) {
          this.addTableRow('params')
        } else if (this.caseForm.params[this.caseForm.params.length - 1]['key'] || this.caseForm.params[this.caseForm.params.length - 1]['value']) {
          this.addTableRow('params')
        }
        let strParam = ''
        for (const i in this.caseForm.params) {
          if (parseInt(i) + 2 === this.caseForm.params.length && this.caseForm.params[i].key) {
            if (this.caseForm.params[i].value) {
              strParam += this.caseForm.params[i].key + '=' + this.caseForm.params[i].value
            } else {
              strParam += this.caseForm.params[i].key
            }
          } else if (this.caseForm.params[i].key) {
            strParam += this.caseForm.params[i].key + '=' + this.caseForm.params[i].value + '&'
          }
        }
        if (strParam.substr(strParam.length - 1, 1) === '&') {
          strParam = strParam.substring(0, strParam.length - 1)
        }
        if (strParam) {
          this.caseForm.path = this.caseForm.path.split('?')[0] + '?' + strParam
        } else {
          this.caseForm.path = this.caseForm.path.split('?')[0]
        }
      },
      deep: true
    },
    'caseForm.headers': {
      handler: function() {
        if (this.caseForm.headers.length === 0) {
          this.addTableRow('headers')
        }
        if (this.caseForm.headers[this.caseForm.headers.length - 1]['key'] || this.caseForm.headers[this.caseForm.headers.length - 1]['value']) {
          this.addTableRow('headers')
        }
      },
      deep: true
    },
    'caseForm.form_data': {
      handler: function() {
        if (this.caseForm.form_data.length === 0) {
          this.addTableRow('form_data')
        }
        if (this.caseForm.form_data[this.caseForm.form_data.length - 1]['key'] || this.caseForm.form_data[this.caseForm.form_data.length - 1]['value']) {
          this.addTableRow('form_data')
        }
      },
      deep: true
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
    handleClick() {

    },
    addTableRow(type) {
      if (type === 'form_data') {
        this.caseForm.form_data.push({ key: '', value: '', remark: '' })
      } else if (type === 'headers') {
        this.caseForm.headers.push({ key: '', value: '' })
      } else if (type === 'validate') {
        this.caseForm.validate.push({ key: '', value: '' })
      } else if (type === 'extract') {
        this.caseForm.extract.push({ key: '', value: '', remark: '' })
      } else if (type === 'params') {
        this.caseForm.params.push({ key: '', value: '' })
      }
    },
    delTableRow(type, index) {
      if (type === 'form_data') {
        this.caseForm.form_data.splice(index, 1)
      } else if (type === 'headers') {
        this.caseForm.headers.splice(index, 1)
      } else if (type === 'validate') {
        this.caseForm.validate.splice(index, 1)
      } else if (type === 'extract') {
        this.caseForm.extract.splice(index, 1)
      } else if (type === 'params') {
        this.caseForm.params.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.custom-form-item {
    width: 330px;
  }
.custom-reqinfo-name {
  font-size: 14px;
  color: gray;
}
.custom-btn-format{
  margin-left: 20px;
}
</style>
