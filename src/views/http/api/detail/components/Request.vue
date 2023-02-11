<template>
  <div>
    <el-form>
      <el-radio-group v-model="dataType">
        <el-radio label="form">form</el-radio>
        <el-radio label="json">json</el-radio>
      </el-radio-group>
      <el-button v-show="dataType === 'json'" type="text" class="custom-btn-format" @click="formatData()">格式化</el-button>
    </el-form>
    <div v-if="dataType === 'json'">
      <editor
        v-model="jsonData"
        style="font-size: 14px;margin-top:10px;"
        lang="json"
        theme="chrome"
        :height="height"
        @init="editorInit"
      />
    </div>
    <el-table
      v-if="dataType==='form'"
      highlight-current-row
      strpe
      :height="height"
      :data="tableData"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
    >
      <el-table-column prop="key" label="请求Key">
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.key" :value="scope.row.key" placeholder="key" />
        </template>
      </el-table-column>
      <el-table-column label="类型" width="140">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type">
            <el-option
              v-for="item in dataTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="请求Value" min-width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 5">
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
      <el-table-column prop="desc" label="描述">
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.desc" :value="scope.row.desc" placeholder="描述" />
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-row v-show="scope.row === currentRow">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click.native="addTableRow(scope.$index)" />
            <el-button v-show="tableData.length > 1" type="danger" icon="el-icon-delete" size="mini" @click.native="delTableRow(scope.$index)" />
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { uploadUrl, uploadFile } from '@/api/system/file'
export default {
  name: 'Request',
  components: {
    editor: require('vue2-ace-editor')
  },
  props: {
    save: Boolean,
    request: {
      type: Object,
      require: false,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentRow: '',
      dataType: 'json',
      tempNum: '',
      jsonData: '',
      uploadAddress: uploadUrl,
      myHeader: { token: localStorage.getItem('token') },
      tableData: [{ key: '', type: 1, value: '', desc: '' }],
      dataTypeOptions: [{
        label: 'String',
        value: 1
      }, {
        label: 'Integer',
        value: 2
      }, {
        label: 'Float',
        value: 3
      }, {
        label: 'Boolean',
        value: 4
      }, {
        label: 'File',
        value: 5
      }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 586
    }
  },
  watch: {
    save: function() {
      this.$emit('extract', this.parseExtract(), this.tableData)
    },
    extract: function() {
      if (this.extract.length !== 0) {
        this.tableData = this.extract
      }
    }
  },
  methods: {
    cellMouseEnter(row) {
      this.currentRow = row
    },
    cellMouseLeave(row) {
      this.currentRow = ''
    },
    addTableRow(index) {
      this.tableData.splice(index + 1, 0, { key: '', type: 1, value: '', desc: '' })
    },
    delTableRow(index) {
      this.tableData.splice(index, 1)
    },
    // 抽取格式化
    parseExtract() {
      const extract = []
      for (const content of this.tableData) {
        const key = content['key']
        const value = content['value']
        const desc = content['desc']
        if (key !== '' && value !== '') {
          const obj = {}
          obj['key'] = key
          obj['value'] = value
          obj['desc'] = desc
          extract.push(obj)
        }
      }
      return extract
    },
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
        this.tableData[this.tempNum]['value'] = response['filename']
      }
    }
  }
}
</script>

<style scoped>
.custom-btn-format {
  margin-left: 20px;
}
</style>
