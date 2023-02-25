<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-alert
          title="调试步骤:1)选择pyshell后读取;2)选择方法后调试;"
          type="info"
          show-icon
        />
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="Pyshell" label-width="80px">
        <el-autocomplete
          v-model="moduleName"
          :fetch-suggestions="pyshellQuerySearch"
          placeholder="输入或选择文件"
          style="width:40%"
        />
        <el-button-group>
          <el-tooltip content="读取py文件内容" placement="top-start">
            <el-button type="success" @click.native="readPyshellContent()">读取</el-button>
          </el-tooltip>
          <el-tooltip content="创建py文件" placement="top-start">
            <el-button type="primary" @click.native="createFunc()">创建</el-button>
          </el-tooltip>
        </el-button-group>
      </el-form-item>

      <el-form-item label="函数名" label-width="80px">
        <el-autocomplete
          v-model="funcExpress"
          :fetch-suggestions="functionQuerySearch"
          placeholder="选择调试方法"
          style="width:40%"
        />
        <el-tooltip content="选择方法后进行调试" placement="top-start">
          <el-button type="primary" @click.native="handleDebugFunstion()">调试</el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="16">
        <el-container>
          <editor
            v-model="pyshellContent"
            style="font-size: 15px"
            lang="python"
            theme="monokai"
            width="100%"
            height="810px"
            :options="{
              enableSnippets:true,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true
            }"
            @init="editorInit"
          />
        </el-container>
      </el-col>
      <el-col class="result" :span="8">
        <div class="result-font">
          测试结果：
        </div>
        <pre style="white-space: pre-wrap;word-wrap: break-word;padding-left:10px;">{{ this.result }}
                </pre>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listPyshell, getPyshellContent, debugFunction } from '@/api/http'
export default {
  name: 'Pyshell',
  components: {
    editor: require('vue2-ace-editor')
  },
  data() {
    return {
      funcExpress: '',
      functions: [],
      moduleName: '',
      pyshells: [],
      pyshellContent: '',
      result: ''
    }
  },
  mounted() {
    this.getPyshellList()
  },
  methods: {
    pyshellQuerySearch(queryString, cb) {
      var restaurants = this.pyshells
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    functionQuerySearch(queryString, cb) {
      var restaurants = this.functions
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    readPyshellContent() {
      if (this.moduleName === '') {
        this.$message.warning('Pyshell不能为空')
        return
      }
      getPyshellContent({ 'module_name': this.moduleName }).then(res => {
        this.$message.success(res.msg)
        this.pyshellContent = res.data.content
        this.functions = res.data.functions
      })
    },
    createFunc() {
      create_func({ functionName: this.comparator }).then(data => {
        this.$message.success(data.msg)
        this.getFuncAddress()
      }).catch(error => {
        this.$message.error(error.response.data.msg)
      })
    },
    removeFunc() {
      remove_func({ functionName: this.comparator }).then(data => {
        this.$message.success(data.msg)
        this.getFuncAddress()
      })
    },
    getPyshellList() {
      listPyshell().then(res => {
        this.pyshells = res.data
      }).catch(error => {
        this.$message.error(error.res.msg)
      })
    },
    handleDebugFunstion() {
      if (this.moduleName === '') {
        this.$message.warning('请先选择函数文件')
        return
      }
      if (!this.funcExpress) {
        this.$message.warning('方法不能为空')
        return
      }
      if (!this.pyshellContent) {
        this.$message.warning('请点击文件读取后再调试')
        return
      }
      debugFunction({ module_name: this.moduleName, func_express: this.funcExpress }).then(res => {
        this.$message.success(res.msg)
        this.result = res.data
      })
    },
    editorInit() {
      require('brace/ext/language_tools')
      require('brace/mode/python')
      require('brace/theme/monokai')
      require('brace/snippets/python')
    },
    saveFunc() {
      if (!this.pyshellContent) {
        this.$message({
          showClose: true,
          message: '文件为空，请输入内容后再保存',
          type: 'warning'
        })
        return
      }
      save_func({ pyshellContent: this.pyshellContent, functionName: this.comparator }).then(data => {
        this.$message.success(data.msg)
      }).catch(error => {
        this.$message.error(error.response.data.msg)
      })
    }
  }

}
</script>

<style>
.result{
    padding-left:10px;
    background-color: rgb(234, 234, 234);
    height:815px
}
.result-font{
    font-weight: 700;
    color: gray;
    font-size:14px;
    margin-top: 2px;
}

</style>
