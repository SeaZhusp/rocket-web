<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="search.q" placeholder="输入报告名筛选" @keyup.enter.native="handleSearch" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="listLoading" :data="reportList" element-loading-text="Loading">
        <el-table-column label="报告名称" prop="name" />
        <el-table-column label="运行环境" prop="env_name" width="250" />
        <el-table-column label="测试时间" prop="test_begin_time" width="150" />
        <el-table-column label="耗时（秒）" width="100">
          <template slot-scope="{row}">
            <span>{{ row.duration }} 秒</span>
          </template>
        </el-table-column>
        <el-table-column label="用例数" width="100">
          <template slot-scope="{row}">
            <el-tag type="primary">{{ row.total }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="通过" width="100">
          <template slot-scope="{row}">
            <el-tag type="success">{{ row.passed }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="失败" width="100">
          <template slot-scope="{row}">
            <el-tag type="danger">{{ row.failed }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="通过率" prop="pass_rate" width="100">
          <!-- <template slot-scope="{row}">
            <el-tag type="warning">{{ row.pass_rate }}</el-tag>
          </template> -->
        </el-table-column>
        <el-table-column label="执行人" prop="create_user" width="100" />
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row.id)">查看</el-button>
            <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getReportList" />
    </el-row>

  </div>
</template>

<script>
import { searchReportList, deleteReport } from '@/api/http'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      reportList: null,
      projectId: parseInt(localStorage.getItem('projectId')),
      listLoading: false,
      envs: [],
      search: {
        q: '',
        project_id: '',
        status: ''
      },
      paging: {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  watch: {
  },
  created() {
    this.getReportList()
  },
  methods: {
    async handleDelete(id) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteReport(id)
        this.$message.success(msg)
        await this.getReportList()
      })
    },
    async handleCurrentChange(val) {
      this.paging.page = val
      await this.getReportList()
    },
    async handleSearch() {
      this.paging.page = 1
      await this.getReportList()
    },
    async getReportList() {
      this.listLoading = true
      const params = {
        page: this.paging.page,
        limit: this.paging.limit,
        search: this.search.q,
        status: this.search.status,
        project_id: this.projectId
      }
      await searchReportList(params).then(response => {
        this.reportList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    handleView(id) {
      const { href } = this.$router.resolve({ path: '/http/report/view', query: { report_id: id }})
      window.open(href, '_blank')
    }
  }
}
</script>
