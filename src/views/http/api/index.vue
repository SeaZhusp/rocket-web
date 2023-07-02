<template>
  <div>
    <el-row>
      <el-col :span="5" class="app-container">
        <CatalogTree
          v-if="projectId"
          :catalogs="catalogs"
          :project-id="projectId"
          :catalog-used="catalogUsed"
          @setParentCatalogs="setParentCatalogs"
          @changeCatalogId="changeCatalogId"
        />
      </el-col>
      <el-col :span="19" class="app-container">
        <el-row>
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
                  <el-button type="primary" @click="handleApiCreate">新增</el-button>
                </el-form-item>
                <el-form-item>
                  <el-dropdown>
                    <el-button> 更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
                    <el-dropdown-menu slot="dropdown">
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
                    <el-tag :type="row.level==='P0'?'danger':row.level==='P1'?'warning':'info'">{{ row.level }}</el-tag>
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
                    <el-button type="text" size="small" @click="handleRun(scope.row)">执行</el-button>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        更多<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleApiDelete(scope.row)">删除</el-dropdown-item>
                        <el-dropdown-item disabled>复制</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getApiList" />
            </el-row>
          </el-form>
        </el-row>
      </el-col>
    </el-row>

    <el-drawer :title="apiDrawer.title" :visible.sync="apiDrawer.show" direction="rtl" :before-close="handleApiDrawerClose" :wrapper-closable="false" size="75%">
      <Detail
        v-if="catalogs"
        :api-info="apiInfo"
        :api-create-flag="apiCreateFlag"
        :catalogs="catalogs"
        :envs="envs"
        :catalog-select-options.sync="catalogSelectOptions"
        @handleApiDrawerClose="handleApiDrawerClose"
        @getApiList="getApiList"
      />
    </el-drawer>

    <el-dialog :visible.sync="reportDialog.show" :close-on-click-modal="false" width="60%">
      <Report :summary="summary" />
    </el-dialog>
  </div>
</template>

<script>
import { runSingleApi, searchApi, getApiDetail, deleteApi } from '@/api/http'
import { getAllEnvConfig } from '@/api/manage'
import Detail from '@/views/http/api/detail'
import Pagination from '@/components/Pagination'
import CatalogTree from '@/components/CatalogTree'
import Report from '@/components/HttpRunner/Report'

export default {
  name: 'Api',
  components: { CatalogTree, Detail, Pagination, Report },
  data() {
    return {
      apiList: [],
      listLoading: false,
      apiCreateFlag: true,
      catalogSelectOptions: [],
      envs: [],
      summary: {},
      projectId: '',
      catalogId: '',
      catalogUsed: 1,
      apiInfo: null,
      search: {
        q: '',
        level: '',
        status: ''
      },
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      levelOptions: JSON.parse(localStorage.getItem('dicts'))['common_level'] || [],
      statusOptions: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }],
      catalogs: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      apiDrawer: {
        show: false,
        title: '新增'
      },
      reportDialog: {
        show: false
      }
    }
  },
  watch: {
    '$store.state.rocket.projectId'() {
      this.projectId = this.$store.state.rocket.projectId
      this.initApiPage()
    }
  },
  created() {
    this.initApiPage()
    this.getAllEnvConfigs()
  },
  methods: {
    initApiPage() {
      const projectId = localStorage.getItem('projectId')
      if (projectId) {
        this.projectId = parseInt(projectId)
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
    async getAllEnvConfigs() {
      await getAllEnvConfig().then(res => {
        this.envs = res.data
      })
    },
    // Catalog
    setParentCatalogs(catalogs) {
      this.catalogs = catalogs
    },
    changeCatalogId(obj) {
      this.catalogId = obj.id
      this.getApiList()
      this.catalogSelectOptions = [{
        id: obj.id,
        label: obj.label
      }]
    },
    // Api
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
    },
    async handleRun(row) {
      // openFullScreen2() {
      const loading = this.$loading({
        lock: true,
        text: '拼命执行中',
        spinner: 'el-icon-loading'
      })
      const params = {
        api_id: row.id,
        env_id: row.env_id
      }
      await runSingleApi(params).then(res => {
        this.$message.success(res.msg)
        this.summary = res.data
      })
      this.reportDialog.show = true
      loading.close()
    }
  }
}
</script>
