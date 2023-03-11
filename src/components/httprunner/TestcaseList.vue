<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5" class="app-container">
        <CatalogTree
          :catalogs="catalogs"
          :project-id="projectId"
          :catalog-used="catalogUsed"
          :show-add="false"
          @setParentCatalogs="setParentCatalogs"
          @changeCatalogId="changeCatalogId"
        />
      </el-col>
      <el-col :span="19" class="app-container">
        <el-row>
          <el-form :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <el-input v-model="search.q" placeholder="输入名称筛选" @keyup.enter.native="getTestcaseList" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="getTestcaseList">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table v-loading="listLoading" :data="testcases" element-loading-text="Loading">
            <el-table-column label="ID" prop="id" width="55" />
            <el-table-column label="名称" prop="name" />
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
                <el-button type="text" @click="handleAdd(scope.row)">加入计划</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getTestcaseList" />
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { searchTestcaseList } from '@/api/http'
import CatalogTree from '@/components/CatalogTree'
import Pagination from '@/components/Pagination'

export default {
  name: 'TestCase',
  components: { CatalogTree, Pagination },
  filters: {
  },
  data() {
    return {
      catalogUsed: 2,
      isCreate: true,
      testcases: [],
      summary: null,
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
    changeCatalogId(obj) {
      this.catalogId = obj.id
      this.getTestcaseList()
      this.catalogSelectOptions = [{
        id: obj.id,
        label: obj.label
      }]
    },
    handleAdd(row) {
      this.$emit('addToPlan', row)
    }
  }
}
</script>
