<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5" class="app-container">
        <CatalogTree
          :catalogs="catalogs"
          :project-id="projectId"
          :catalog-used="catalogUsed"
          @setParentCatalogs="setParentCatalogs"
          @changeCatalogId="changeCatalogId"
        />
      </el-col>
      <el-col :span="19" class="app-container">

        <el-row v-show="!showDetail">
          <el-form :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <el-input v-model="search.q" placeholder="输入名称筛选" @keyup.enter.native="getTestcaseList" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="getTestcaseList">搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleCreate">新增</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table v-loading="listLoading" :data="testcases" element-loading-text="Loading">
            <el-table-column label="ID" prop="id" width="55" />
            <el-table-column label="名称" prop="name" />
            <el-table-column label="标签" prop="tags" />
            <el-table-column label="优先级" prop="level" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.level==='P0'?'danger':row.level==='P1'?'warning':'info'">{{ row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status===0?'':row.status===1?'success':'info'">{{ row.status===0?'进行中':row.status===1?'已完成':'已停用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新日期" prop="update_time" width="150" />
            <el-table-column label="更新人" prop="update_user" width="100" />
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleRun(scope.row)">执行</el-dropdown-item>
                    <el-dropdown-item disabled>复制</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getTestcaseList" />
        </el-row>
        <el-row v-show="showDetail">
          <el-page-header content="用例详情" @back="goBack" />
          <TestcaseDetail
            ref="testcaseDetail"
            :project-id="projectId"
            :testcase-catalogs="catalogs"
            :is-create="isCreate"
            :catalog-select-options.sync="catalogSelectOptions"
            @getTestcaseList="getTestcaseList"
            @goBack="goBack"
          />
        </el-row>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="reportShow" :close-on-click-modal="false" width="60%">
      <Report :summary="summary" />
    </el-dialog>
  </div>
</template>

<script>
import { searchTestcaseList, deleteTestcase, runTestcase } from '@/api/http'
import CatalogTree from '@/components/CatalogTree'
import Pagination from '@/components/Pagination'
import TestcaseDetail from '@/components/HttpRunner/TestcaseDetail.vue'
import Report from '@/components/HttpRunner/Report'

export default {
  name: 'TestCase',
  components: { CatalogTree, Pagination, TestcaseDetail, Report },
  filters: {
  },
  data() {
    return {
      catalogUsed: 2,
      showDetail: false,
      isCreate: true,
      testcases: [],
      summary: null,
      reportShow: false,
      catalogSelectOptions: [],
      search: {
        q: '',
        status: '',
        level: ''
      },
      catalogs: [],
      projectId: parseInt(localStorage.getItem('projectId')),
      listLoading: false,
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      levelOptions: JSON.parse(localStorage.getItem('dicts'))['common_level'] || [],
      tagOptions: [{ label: '冒烟测试' }, { label: '系统测试' }],
      statusOptions: [{ value: 0, label: '进行中' }, { value: 1, label: '已完成' }, { value: 2, label: '已停用' }]
    }
  },
  created() {
    // this.getCatalogTree()
    this.getTestcaseList()
  },
  methods: {
    goBack() {
      this.showDetail = false
    },
    // Catalog
    setParentCatalogs(catalogs) {
      this.catalogs = catalogs
    },
    getTestcaseList() {
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
      searchTestcaseList(params).then(response => {
        this.testcases = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    handleCreate() {
      this.showDetail = true
      this.isCreate = true
      this.catalogSelectOptions = this.catalogs
      this.$refs.testcaseDetail.resetTestcaseInfo()
    },
    handleEdit(row) {
      this.showDetail = true
      this.isCreate = false
      this.catalogSelectOptions = this.catalogs
      this.$refs.testcaseDetail.setTestcaseInfo(row)
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteTestcase(row.id)
        this.$message.success(msg)
        await this.getTestcaseList()
      })
    },
    changeCatalogId(obj) {
      this.catalogId = obj.id
      this.getTestcaseList()
      this.catalogSelectOptions = [{
        id: obj.id,
        label: obj.label
      }]
    },
    async handleRun(row) {
      // openFullScreen2() {
      const loading = this.$loading({
        lock: true,
        text: '拼命执行中',
        spinner: 'el-icon-loading'
      })
      const params = {
        id: row.id
      }
      await runTestcase(params).then(res => {
        this.$message.success(res.msg)
        this.summary = res.data
      })
      this.reportShow = true
      loading.close()
    }
  }
}
</script>

<style scoped>
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
