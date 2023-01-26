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
      <el-tab-pane label="数据管理" name="variables">数据管理</el-tab-pane>
      <el-tab-pane label="前置处理" name="setup">前置处理</el-tab-pane>
      <el-tab-pane label="接口请求" name="request">
        <el-tabs v-model="activeReq" @tab-click="handleClick">
          <el-tab-pane label="Params" name="params">
            <b class="custom-reqinfo-name">Query Params</b>
            <el-table :data="caseForm.params">
              <el-table-column property="key" label="Key">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.key" placeholder="key" />
                </template>
              </el-table-column>
              <el-table-column property="value" label="Value">
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
              <el-table-column prop="description" label="DESCRIPTION">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.description" :value="scope.row.description" placeholder="description" />
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
                <el-radio label="none">none</el-radio>
                <el-radio label="form-data">form-data</el-radio>
                <el-radio label="x-www-form-urlencoded">x-www-form-urlencoded</el-radio>
                <el-radio label="raw">raw</el-radio>
                <el-radio label="binary">binary</el-radio>
              </el-radio-group>
              <el-button v-show="caseForm.body_type === 'raw'" type="text" class="btn-format" @click="formatData()">格式化</el-button>
            </el-form>

            <div v-if="caseForm.body_type === 'raw'">
              <editor
                v-model="caseForm.body"
                style="font-size: 15px"
                lang="json"
                theme="chrome"
                height="575px"
                :options="{}"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="提取参数" name="extract">提取参数</el-tab-pane>
      <el-tab-pane label="断言" name="assert">断言</el-tab-pane>
      <el-tab-pane label="后置处理" name="teardown">后置处理</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userList: null,
      listLoading: false,
      projects: [],
      projectId: '',
      q: '',
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
        headers: [{ key: '', value: '', description: '' }],
        params: [{ key: '', value: '' }]
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
    // monitorPath() {
    //   return this.caseForm.path
    // },
    // monitorParams() {
    //   return this.caseForm.params
    // },
    // monitorHeader() {
    //   return this.caseForm.headers
    // }
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
    }
  },
  created() {

  },
  methods: {
    addTableRow(type) {
      if (type === 'variable') {
        this.caseForm.variable.push({ key: '', value: '', param_type: 'string', remark: '' })
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
      if (type === 'variable') {
        this.caseForm.variable.push(index, 1)
      } else if (type === 'headers') {
        this.caseForm.headers.splice(index, 1)
      } else if (type === 'validate') {
        this.caseForm.validate.push(index, 1)
      } else if (type === 'extract') {
        this.caseForm.extract.push(index, 1)
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
</style>
