<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="当前项目" prop="projectId">
        <el-select v-model="projectId" placeholder="请选择" filterable>
          <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <i class="el-icon-info" style="color:#909399"> 请先选择一个项目，然后开始吧~ </i>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="4.1">
        <el-card shadow="never">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="filterText" suffix-icon="el-icon-search" placeholder="关键字过滤" />
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="点击创建根目录，子目录请在节点创建" placement="top-start">
                <el-button type="text" icon="el-icon-folder-add" @click="handleCurrentChange">新增</el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="catalogs"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            highlight-current
            @node-click="handleCatalogClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
              <span>{{ node.label }}</span>
              <span>
                <el-button v-show="data.del" type="text" icon="el-icon-folder-add" @click="handleCurrentChange(node, data)" />
                <el-button v-show="data.del" type="text" icon="el-icon-edit" @click="handleCatalogEdit(node, data)" />
                <el-button v-show="data.del" type="text" icon="el-icon-delete" @click="handleCatalogDelete(node, data)" />
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="19" style="margin-left:5px">
        <el-row shadow="never">
          <el-form :inline="true">
            <el-row>
              <el-col>
                <el-form-item>
                  <el-input v-model="search.q" placeholder="输入接口名搜索" />
                </el-form-item>
                <el-form-item>
                  <el-select v-model="search.level" placeholder="优先级" clearable class="custom-form-item-select" @change="getApiList">
                    <el-option v-for="item in levelOptions" :key="item.label" :label="item.label" :value="item.label" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="search.status" placeholder="状态" clearable class="custom-form-item-select" @change="getApiList">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="getApiList">搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="catalogId === '' " @click="handleApiCreate">新增接口</el-button>
                </el-form-item>
                <el-form-item>
                  <el-dropdown>
                    <el-button> 更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item disabled>批量执行</el-dropdown-item>
                      <el-dropdown-item disabled>批量删除</el-dropdown-item>
                      <el-dropdown-item disabled>导入接口</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-table v-loading="listLoading" border stripe :data="apiList" element-loading-text="Loading">
                <el-table-column align="center" type="selection" width="55" />
                <el-table-column label="ID" prop="id" width="60" />
                <el-table-column label="接口名称" :show-overflow-tooltip="true" prop="name" />
                <el-table-column label="路径" :show-overflow-tooltip="true" prop="path" />
                <el-table-column label="请求方式" prop="method" width="100">
                  <template slot-scope="{row}">
                    <el-tag :type="row.method==='GET'?'':row.method==='POST'?'success':row.method==='PUT'?'info':'warning'">{{ row.method }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="优先级" prop="level" width="100">
                  <template slot-scope="{row}">
                    <el-tag :type="row.level==='P0'?'':row.level==='P1'?'success':'info'">{{ row.level }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                  <template slot-scope="{row}">
                    <el-tag :type="row.status === 0 ? 'info':'success'">{{ row.status===0? "禁用":"启用" }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="更新日期" prop="update_time" width="150" />
                <el-table-column label="更新人" prop="update_user" width="100" />
                <el-table-column fixed="right" label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleApiEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="handleApiDelete(scope.row)">删除</el-button>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        更多<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>执行</el-dropdown-item>
                        <el-dropdown-item>复制</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                v-show="paging.total > 0"
                :total="paging.total"
                :page.sync="paging.page"
                :limit.sync="paging.limit"
                @pagination="getApiList"
              />
            </el-row>
          </el-form>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog :title="catalogDialog.title" :visible.sync="catalogDialog.show" width="20%" @close="cancelCatalog">
      <el-form ref="catalogForm" :model="catalogForm" :rules="catalogFormRules" label-width="55px">
        <el-form-item label="目录" prop="name">
          <el-input v-model="catalogForm.name" placeholder="目录" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCatalog">取 消</el-button>
        <el-button type="primary" :loading="catalogDialog.save" @click="saveCatalog">{{ catalogDialog.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>

    <el-drawer :title="apiDrawer.title" :visible.sync="apiDrawer.show" direction="rtl" :before-close="handleApiDrawerClose" :wrapper-closable="false" size="75%">
      <Detail
        :api-info="apiInfo"
        :api-create-flag="apiCreateFlag"
        :catalogs="catalogs"
        :catalog-select-options="catalogSelectOptions"
        @handleApiDrawerClose="handleApiDrawerClose"
        @getApiList="getApiList"
      />
    </el-drawer>

    <el-dialog :visible.sync="reportDialog.show" :close-on-click-modal="false" width="60%">
      <Report />
    </el-dialog>
  </div>
</template>

<script>
import { listProject } from '@/api/system/project'
import { searchCatalogTree, createCatalog, updateCatalog, deleteCatalog } from '@/api/system/catalog'
import { searchApi, getApiDetail, deleteApi } from '@/api/http/api'
import Detail from '@/views/http/api/detail'
import Pagination from '@/components/Pagination'
import Report from '@/components/httprunner/Report'

export default {
  components: { Detail, Pagination, Report },
  data() {
    return {
      apiList: [],
      listLoading: false,
      apiCreateFlag: true,
      catalogSelectOptions: [],
      projects: [],
      projectId: '',
      catalogId: '',
      apiInfo: null,
      search: {
        q: '',
        level: '',
        status: ''
      },
      filterText: '',
      catalogForm: {
        id: '',
        name: '',
        project_id: '',
        parent_id: null
      },
      catalogFormRules: {
        name: [
          { required: true, message: '目录名不能为空', trigger: 'blur' }
        ]
      },
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      levelOptions: [{ label: 'P0' }, { label: 'P1' }, { label: 'P2' }],
      statusOptions: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }],
      catalogs: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      catalogDialog: {
        title: '新增',
        show: false,
        save: false,
        create: 1
      },
      apiDrawer: {
        show: false,
        title: '新增'
      },
      reportDialog: {
        show: true
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    projectId(val) {
      localStorage.setItem('projectId', val)
      this.getCatalogTree()
      this.getApiList()
    }
  },
  created() {
    this.getAllProjects()
    this.initApiPage()
  },
  methods: {
    initApiPage() {
      const projectId = localStorage.getItem('projectId')
      if (projectId) {
        this.projectId = parseInt(projectId)
        this.getCatalogTree()
        this.getApiList()
      }
    },
    initApiInfo() {
      return {
        project_id: this.projectId,
        catalog_id: this.catalogId,
        name: '',
        level: '',
        status: 1,
        desc: '',
        service: '',
        method: 'GET',
        path: '',
        times: 1,
        body: {
          variables: [{ key: '', type: 1, value: '', desc: '' }],
          headers: [{ key: '', value: '', desc: '' }],
          request: {
            data_type: 'json',
            json_data: '',
            form_data: [{ key: '', type: 1, value: '', desc: '' }]
          },
          validator: [{ actual: '', comparator: 'equals', type: 1, expect: '', desc: '' }],
          extract: [{ key: '', value: '', desc: '' }],
          hooks: {
            setup_hooks: [{ setup_hook: '' }],
            teardown_hooks: [{ teardown_hook: '' }]
          }
        }
      }
    },
    async getAllProjects() {
      const params = {
        project_type: 0
      }
      await listProject(params).then(response => {
        this.projects = response.data
        if (this.projectId === '') {
          this.projectId = response.data[0].id
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    mouseenter(data) {
      this.$set(data, 'del', true)
    },
    mouseleave(data) {
      this.$set(data, 'del', false)
    },
    // Catalog
    handleCurrentChange(node = null, data = null) {
      this.catalogDialog.show = true
      this.catalogDialog.create = 1
      this.catalogForm = this.$resetForm(this.catalogForm)
      this.catalogForm.project_id = this.projectId
      if (data) {
        this.catalogForm.parent_id = data.id
      }
    },
    handleCatalogEdit(node = null, data) {
      this.catalogDialog.show = true
      this.catalogDialog.create = 0
      this.catalogForm.id = data.id
      this.catalogForm.name = data.label
      this.catalogForm.parent_id = data.parent_id
      this.catalogForm.project_id = data.project_id
    },
    async handleCatalogDelete(node = null, data) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteCatalog(data.id)
        this.$message.success(msg)
        await this.getCatalogTree()
      })
    },
    async getCatalogTree() {
      const params = { project_id: this.projectId }
      searchCatalogTree(params).then(res => {
        this.catalogs = res.data
      })
    },
    saveCatalog() {
      this.$refs.catalogForm.validate(validate => {
        if (validate) {
          this.catalogDialog.save = true
          if (this.catalogDialog.create === 1) {
            this.create()
          } else {
            this.update()
          }
          this.cancelCatalog()
          this.getCatalogTree()
        }
      })
    },
    create() {
      var catalog = this.catalogForm
      if (this.catalogForm.parent_id === '') {
        delete catalog['parent_id']
        delete catalog['id']
      }
      createCatalog(catalog).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    update() {
      updateCatalog(this.catalogForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    cancelCatalog() {
      this.catalogDialog.save = false
      this.catalogDialog.show = false
      this.$refs['catalogForm'].clearValidate()
    },
    // Api
    handleCatalogClick(obj, node, data) {
      this.catalogId = node.data.id
      this.getApiList()
    },
    handleApiEdit(row) {
      getApiDetail(row.id).then(response => {
        if (response.code === 200) {
          this.apiInfo = response.data.api
          this.apiInfo.catalog_id = response.data.api.catalog_id
          this.apiCatalog = response.data.catalog
          this.apiDrawer.show = true
          this.apiCreateFlag = false
          this.catalogSelectOptions = [{
            id: response.data.catalog.id,
            label: response.data.catalog.name
          }]
        }
      })
    },
    handleApiDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteApi(row.id)
        this.$message.success(msg)
        await this.getApiList()
      })
    },
    getApiList() {
      this.listLoading = true
      const params = {
        page: this.paging.page,
        limit: this.paging.limit,
        search: this.search.q,
        status: this.search.status,
        level: this.search.level,
        project_id: this.projectId,
        catalog_id: this.catalogId
      }
      searchApi(params).then(response => {
        this.apiList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    handleApiCreate() {
      this.apiInfo = this.initApiInfo()
      this.apiDrawer.show = true
      this.apiDrawer.title = '新增接口'
      this.apiCreateFlag = true
      this.catalogSelectOptions = this.catalogs
    },
    handleApiDrawerClose() {
      this.apiDrawer.show = false
      this.apiInfo = this.initApiInfo()
      this.catalogSelectOptions = []
    }
  }
}
</script>

<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-form-item-select {
  width:110px
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 11px;
}
.el-drawer__body {
  overflow: auto;
}
</style>
