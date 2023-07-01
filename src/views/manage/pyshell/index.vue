<template>
  <div class="app-container">
    <el-row>
      <el-form>
        <el-form-item>
          <el-alert
            title="【调试步骤】: 先选择pyshell [读取]，再选择要调试的方法 [执行]"
            type="info"
            close-text="知道了"
            show-icon
          />
        </el-form-item>
      </el-form>

    </el-row>
    <el-row>
      <el-col :span="13">
        <el-form>
          <el-form-item label="Pyshell" label-width="80px">
            <el-autocomplete
              v-model="moduleName"
              :fetch-suggestions="pyshellQuerySearch"
              placeholder="输入或选择文件"
              style="width:40%"
            />
            <el-button-group>
              <el-tooltip content="读取Pyshell" placement="top-start">
                <el-button type="success" icon="el-icon-refresh" @click.native="readPyshellContent()" />
              </el-tooltip>
              <el-tooltip content="创建Pyshell" placement="top-start">
                <el-button type="primary" icon="el-icon-document-add" @click.native="handleCreatePyshell()" />
              </el-tooltip>
              <el-tooltip content="覆盖Pyshell" placement="top-start">
                <el-button type="warning" icon="el-icon-document" @click.native="handleSavePyshell()" />
              </el-tooltip>
              <el-tooltip content="删除Pyshell" placement="top-start">
                <el-button type="danger" icon="el-icon-delete" @click.native="handleDeletePyshell()" />
              </el-tooltip>
            </el-button-group>
          </el-form-item>
        </el-form>
        <editor
          v-model="pyshellContent"
          style="font-size: 15px"
          lang="python"
          theme="monokai"
          width="100%"
          height="710px"
          :options="{
            enableSnippets:true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
          }"
          @init="editorInit"
        />
      </el-col>
      <el-col :span="10" style="margin-left:10px">
        <el-form>
          <el-form-item label="方法名" label-width="80px">
            <el-autocomplete
              v-model="funcExpress"
              :fetch-suggestions="functionQuerySearch"
              placeholder="选择调试方法"
              style="width:90%"
            />
            <el-tooltip content="选择方法后进行调试" placement="top-start">
              <el-button type="primary" icon="el-icon-video-play" @click.native="handleDebugFunstion()" />
            </el-tooltip>
          </el-form-item>
        </el-form>
        <div class="result-font">
          测试结果：
        </div>
        <pre style="white-space: pre-wrap;word-wrap: break-word;padding-left:10px;">{{ result }}</pre>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { listPyshell, getPyshellContent, debugFunction, createPyshell, savePyshell, deletePyshell } from '@/api/manage'
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
    console.log(this.duty)
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
    handleCreatePyshell() {
      createPyshell({ module_name: this.moduleName }).then(res => {
        this.$message.success(res.msg)
        this.getPyshellList()
      }).catch(error => {
        this.$message.error(error.msg)
      })
    },
    getPyshellList() {
      listPyshell().then(res => {
        this.pyshells = res.data
      })
    },
    handleDebugFunstion() {
      if (this.moduleName === '') {
        this.$message.warning('请先选择Pyshell')
        return
      }
      if (!this.funcExpress) {
        this.$message.warning('方法不能为空')
        return
      }
      if (!this.pyshellContent) {
        this.$message.warning('请点击读取后再调试')
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
    handleSavePyshell() {
      if (this.moduleName === '') {
        this.$message.warning('请先选择Pyshell')
        return
      }
      if (!this.pyshellContent) {
        this.$message.warning('请输入内容后再保存')
        return
      }
      this.$confirm('确定要覆盖吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        savePyshell({ module_name: this.moduleName, code: this.pyshellContent }).then(res => {
          this.$message.success(res.msg)
          this.readPyshellContent()
        })
      })
    },
    handleDeletePyshell() {
      if (this.moduleName === '') {
        this.$message.warning('请先选择要删除的Pyshell')
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(() => {
        deletePyshell({ module_name: this.moduleName }).then(res => {
          this.$message.success(res.msg)
          this.getPyshellList()
        })
      })
    }
  }

}
</script>

<style>
.result-font{
    font-weight: 700;
    color: gray;
    font-size:14px;
    margin-top: 2px;
}

</style>
