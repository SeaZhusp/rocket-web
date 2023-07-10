<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form :inline="true">
          <el-form-item prop="catalog_id">
            <el-select
              ref="select"
              v-model="search.catalog_id"
              placeholder="请选择目录"
              clearable
              filterable
              :filter-method="singleTreeFilterMethod"
              popper-class="customSelectPopper"
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
                  :data="catalogs"
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
          <el-form-item>
            <el-select v-model="search.level" placeholder="优先级" clearable class="custom-form-item-select" @change="getApiList">
              <el-option v-for="item in levelOptions" :key="item.label" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.q" clearable placeholder="输入接口名搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getApiList">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="listLoading" stripe :data="apiList" element-loading-text="Loading">
          <!-- <el-table-column align="center" type="selection" width="55" /> -->
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
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="text" @click="addToSteps(row)">加入步骤</el-button>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { searchApi } from '@/api/http'
import { listCatalogTree } from '@/api/manage'
import Pagination from '@/components/Pagination'

export default {
  name: 'ApiList',
  components: { Pagination },
  props: {
    projectId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      apiList: [],
      listLoading: false,
      catalogOptions: null,
      catalogId: '',
      catalogUsed: 1,
      apiInfo: null,
      search: {
        q: '',
        level: '',
        status: '',
        catalog_id: ''
      },
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      levelOptions: JSON.parse(localStorage.getItem('dicts'))['common_level'] || [],
      statusOptions: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }],
      catalogs: []
    }
  },
  watch: {
  },
  created() {
    this.getCatalogTree()
    this.getApiList()
  },
  methods: {
    singleTreeClear() {
      this.getApiList()
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
      this.search.catalog_id = data.id
      // this.selectModel = data.id // select v-model 赋值
      this.catalogOptions = [data] // 隐藏的 select option 赋值
      this.$refs.select.blur() // 收起 select 下拉框
      this.getApiList()
    },
    async getCatalogTree() {
      const params = { project_id: this.projectId, used: this.catalogUsed }
      listCatalogTree(params).then(res => {
        this.catalogs = res.data
        this.catalogOptions = res.data
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
        catalog_id: this.search.catalog_id
      }
      searchApi(params).then(response => {
        this.apiList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    addToSteps(row) {
      this.$emit('addStep', row)
      this.$message.success('加入成功')
    }
  }
}
</script>
