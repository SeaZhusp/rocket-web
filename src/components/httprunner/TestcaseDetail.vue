<template>
  <div>
    <el-divider>基本信息</el-divider>
    <el-form ref="testcase" :model="testcase" :rules="testcaseRules" :inline="true" label-width="70px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="testcase.name" placeholder="名称" class="custom-form-item" />
      </el-form-item>
      <el-form-item label="目录" prop="catalog_id">
        <el-select
          ref="select"
          v-model="testcase.catalog_id"
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
              :data="testcaseCatalogs"
              node-key="id"
              empty-text="无匹配数据"
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
        <el-select v-model="testcase.level" placeholder="优先级" class="custom-form-item">
          <el-option v-for="item in levelOptions" :key="item.label" :label="item.label" :value="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="testcase.status" placeholder="状态" class="custom-form-item">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="testcase.tags"
          multiple
          filterable
          allow-create
          placeholder="标签"
          class="custom-form-item"
        >
          <el-option
            v-for="item in tagOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="testcase.desc" type="textarea" placeholder="描述" class="custom-form-item" />
      </el-form-item>
    </el-form>

    <el-divider>用例步骤</el-divider>
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="testcase.env_id" placeholder="环境">
          <el-option v-for="item in envs" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">调试</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="apiSelectShow=true">添加步骤</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="步骤">
        <el-table ref="dragTable" v-loading="listLoading" :show-header="false" row-key="index" :data="stepList" fit highlight-current-row style="width: 100%">
          <el-table-column align="center" type="index" label="Drag" width="80">
            <template slot-scope="{}">
              <svg-icon class="drag-handler" icon-class="drag" />
            </template>
          </el-table-column>
          <el-table-column align="center" type="index" label="步骤" width="80">
            <template slot-scope="scope">
              <el-tag type="info">Step {{ scope.$index+1 }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="ID" width="100">
            <template slot-scope="{row}">
              <span>ID：{{ row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column label="接口名">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column width="180px" label="请求方法">
            <template slot-scope="{row}">
              <span>{{ row.method }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" type="index" label="状态" width="100">
            <template slot-scope="{row}">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="{}">
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="show-d">
      <el-tag>The default order :</el-tag> {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>The after dragging order :</el-tag> {{ newList }}
    </div>
    <el-drawer title="选择接口" :visible.sync="apiSelectShow" size="50%">
      <ApiList
        :project-id="projectId"
        @addStep="addStep"
      />
    </el-drawer>
  </div>
</template>

<script>
import { getAllEnvConfig, createTestcase, updateTestcase } from '@/api/http'
import Sortable from 'sortablejs'
import ApiList from '@/components/HttpRunner/ApiList.vue'
export default {
  components: { ApiList },
  filters: {
  },
  props: {
    projectId: {
      type: Number,
      required: true
    },
    testcaseCatalogs: {
      type: Array,
      required: true
    },
    catalogSelectOptions: {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    isCreate: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      catalogUsed: 2,
      catalogOptions: this.catalogSelectOptions,
      apiSelectShow: false,
      showDetail: false,
      testcases: [],
      search: {
        q: '',
        status: '',
        level: ''
      },
      catalogs: [],
      testcase: {
        id: null,
        project_id: this.projectId,
        name: null,
        level: null,
        status: null,
        tags: null,
        desc: null,
        body: {
          steps: []
        },
        env_id: null,
        catalog_id: null
      },
      //   projectId: parseInt(localStorage.getItem('projectId')),
      stepList: [],
      total: null,
      listLoading: false,
      sortable: null,
      oldList: [],
      newList: [],
      envs: [],
      levelOptions: JSON.parse(localStorage.getItem('dicts'))['common_level'] || [],
      tagOptions: [{ label: '冒烟测试' }, { label: '系统测试' }],
      statusOptions: [{ value: 0, label: '进行中' }, { value: 1, label: '已完成' }, { value: 2, label: '已停用' }],
      testcaseRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '优先级不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        catalog_id: [
          { required: true, message: '目录不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    catalogSelectOptions: function() {
      this.catalogOptions = this.catalogSelectOptions
    }
  },
  created() {
    this.getStepList()
    this.getAllEnvConfigs()
  },
  methods: {
    goBack() {
      this.showDetail = false
    },
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
      this.testcase.catalog_id = data.id
      // this.selectModel = data.id // select v-model 赋值
      this.catalogOptions = [data] // 隐藏的 select option 赋值
      this.$refs.select.blur() // 收起 select 下拉框
    },
    async getAllEnvConfigs() {
      await getAllEnvConfig().then(res => {
        this.envs = res.data
      })
    },
    async getStepList() {
      this.total = 100
      this.listLoading = false
      this.oldList = this.stepList.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.stepList.splice(evt.oldIndex, 1)[0]
          this.stepList.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
          console.log(this.stepList)
        }
      })
    },
    addStep(row) {
      const index = this.stepList.length + 1
      const step = {
        id: row.id,
        name: row.name,
        path: row.path,
        method: row.method,
        status: 1,
        index: index
      }
      this.stepList.splice(index, 0, step)
      this.getStepList()
    },
    resetTestcaseInfo() {
      this.testcase.name = null
      this.testcase.project_id = this.projectId
      this.testcase.level = null
      this.testcase.status = null
      this.testcase.tags = null
      this.testcase.desc = null
      this.testcase.env_id = null
      this.testcase.catalog_id = null
      this.stepList = []
    },
    setTestcaseInfo(row) {
      this.testcase.id = row.id
      this.testcase.name = row.name
      this.testcase.project_id = row.project_id
      this.testcase.level = row.level
      this.testcase.status = row.status
      this.testcase.tags = JSON.parse(row.tags)
      this.testcase.create_user = row.create_user
      this.testcase.desc = row.desc
      this.testcase.env_id = row.env_id
      this.testcase.catalog_id = row.catalog_id
      this.stepList = JSON.parse(row.body)['steps']
      // this.getStepList()
    },
    handleSave() {
      // if (!this.testcase.env_id) {
      //   this.$notify.warning('请选择环境')
      // }
      this.$refs.testcase.validate(validate => {
        if (validate) {
          this.testcase.body.steps = this.stepList
          if (this.isCreate) {
            createTestcase(this.testcase).then(res => {
              this.$message.success(res.msg)
            }).catch(error => {
              this.$message.error(error.response.data['message'])
            })
          } else {
            updateTestcase(this.testcase).then(res => {
              this.$message.success(res.msg)
            }).catch(error => {
              this.$message.error(error.response.data['message'])
            })
          }
          this.goBack()
          this.$emit('getTestcaseList')
        }
      })
    }
  }
}
</script>

<style scoped>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
