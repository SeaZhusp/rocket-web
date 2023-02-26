<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5" class="app-container">
        <CatalogTree
          :catalogs="catalogs"
          :project-id="projectId"
          :catalog-used="catalogUsed"
          @changeCatalogId="changeCatalogId"
        />
      </el-col>
      <el-col :span="19" class="app-container">

        <el-row>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="用例列表" name="first">
              <el-form :inline="true">
                <el-row>
                  <el-col :span="8">
                    <el-form-item>
                      <el-input v-model="q" placeholder="输入姓名筛选" @keyup.enter.native="handleSearch" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleCreate">新增</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table v-loading="listLoading" :data="list" element-loading-text="Loading">
                <el-table-column label="序号" type="index" width="55" />
                <el-table-column label="姓名" prop="ID" />
                <el-table-column fixed="right" label="操作" min-width="80px">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getUserList" /> -->
            </el-tab-pane>
            <el-tab-pane label="用例详情" name="second">
              <el-form :model="testcase" :inline="true" label-width="70px">
                <el-form-item label="项目" prop="name">
                  <el-input v-model="testcase.name" placeholder="项目" class="custom-form-item" />
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
                  <el-input v-model="testcase.desc" type="textarea" autosize placeholder="描述" class="custom-form-item" />
                </el-form-item>
              </el-form>
              <el-divider>用例步骤</el-divider>
              <el-form :inline="true">
                <el-form-item>
                  <el-select v-model="testcase.envId" placeholder="环境">
                    <el-option v-for="item in envs" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">调试</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                  <el-button type="primary">添加步骤</el-button>
                  <el-button type="primary">保存</el-button>
                </el-form-item>
              </el-form>
              <el-form>
                <el-form-item label="步骤">
                  <el-table ref="dragTable" v-loading="listLoading" :show-header="false" :data="list" row-key="id" fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" type="index" label="Drag" width="80">
                      <template slot-scope="{}">
                        <svg-icon class="drag-handler" icon-class="drag" />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" type="index" label="步骤" width="80" :index="indexMethod">
                      <template slot-scope="scope">
                        <el-tag type="info">Step {{ scope.$index+1 }}</el-tag>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" label="ID" width="65">
                      <template slot-scope="{row}">
                        <span>{{ row.id }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column width="180px" label="接口名">
                      <template slot-scope="{row}">
                        <span>{{ row.author }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" type="index" label="Drag" width="80">
                      <template slot-scope="{row}">
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
                      </template>
                    </el-table-column>

                    <el-table-column width="180px" label="Path">
                      <template slot-scope="{row}">
                        <span>{{ row.author }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作">
                      <template slot-scope="{}">
                        <el-button type="text">编辑</el-button>
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
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listCatalogTree, getAllEnvConfig } from '@/api/http'
import Sortable from 'sortablejs'
import CatalogTree from '@/components/CatalogTree'

export default {
  name: 'TestCase',
  components: { CatalogTree },
  filters: {
  },
  data() {
    return {
      catalogUsed: 2,
      isEdit: 1,
      q: '',
      catalogs: [],
      testcase: {
        name: null,
        level: null,
        status: null,
        tags: null,
        desc: null,
        steps: [],
        envId: null
      },
      projectId: parseInt(localStorage.getItem('projectId')),
      list: [
        { 'id': 1, 'author': 'Anthony', 'status': 1 },
        { 'id': 2, 'author': 'Helen', 'status': 2 },
        { 'id': 3, 'author': 'Kenneth', 'status': 0 }],
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: null,
      oldList: [],
      newList: [],
      envs: [],
      levelOptions: [{ label: 'P0' }, { label: 'P1' }, { label: 'P2' }],
      tagOptions: [{ label: '冒烟测试' }, { label: '系统测试' }],
      statusOptions: [{ value: 0, label: '进行中' }, { value: 1, label: '已完成' }, { value: 2, label: '已停用' }]
    }
  },
  created() {
    // this.getList()
    this.getCatalogTree()
    this.getAllEnvConfigs()
  },
  methods: {
    async getAllEnvConfigs() {
      await getAllEnvConfig().then(res => {
        this.envs = res.data
      })
    },
    handleCreate() {
      this.getList()
      this.testcaseDrawer.show = true
    },
    handleSearch() {
      console.log(1111)
    },
    async getCatalogTree() {
      const params = { project_id: this.projectId, used: this.catalogUsed }
      listCatalogTree(params).then(res => {
        this.catalogs = res.data
      })
    },
    async getList() {
      this.total = 100
      this.listLoading = false
      this.oldList = this.list.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      console.log(el)
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    changeCatalogId() {
      // todu
      console.log('目录改变要做的')
    }
  }
}
</script>

<style>
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
