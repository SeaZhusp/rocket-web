<template>
  <div class="app-container">
    <el-row v-if="showList">
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="search.q" placeholder="输入计划名筛选" @keyup.enter.native="handleSearch" />
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
      <el-table v-loading="listLoading" :data="testplanList" element-loading-text="Loading">
        <el-table-column label="计划名称">
          <template slot-scope="{row}">
            <el-link type="primary" :underline="false" @click="hanldePlanDetail(row.Plan)">{{ row.Plan.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="运行环境" prop="name" width="300" />
        <el-table-column label="Cron" prop="Plan.cron" width="250" />
        <el-table-column label="定时执行" width="180">
          <template slot-scope="{row}">
            <el-switch v-model="row.Plan.status" :active-value="1" :inactive-value="0" @change="changeStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="更新日期" prop="Plan.update_time" width="180" />
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row.Plan)">编辑</el-button>
            <el-button type="text" @click="handleRun(scope.row.Plan)">执行</el-button>
            <el-dropdown>
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleDelete(scope.row.Plan)">删除</el-dropdown-item>
                <el-dropdown-item disabled>复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getTestplanList" />
    </el-row>

    <el-row v-if="!showList">
      <el-row>
        <el-page-header content="计划详情" @back="goBack" />
      </el-row>
      <el-row>
        <el-col :span="5" class="app-container">
          <el-card shadow="never">
            <el-form :inline="true">
              <el-form-item>
                <el-input v-model="filterText" suffix-icon="el-icon-search" placeholder="关键字过滤" />
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
            />
          </el-card>
        </el-col>
        <el-col :span="19" class="app-container">
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" @click="handleAddTestcase">关联用例</el-button>
              <el-button type="primary" @click="handleRun(plan)">执行计划</el-button>
              <el-button @click="handleReset">重置列表</el-button>
            </el-form-item>
          </el-form>
          <el-table v-loading="caseListLoading" :data="caseList" element-loading-text="Loading">
            <el-table-column label="用例名称">
              <template slot-scope="{row}">
                <el-link type="primary" :underline="false">{{ row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="优先级" prop="level" width="200" />
            <el-table-column label="状态" width="150">
              <template slot-scope="{row}">
                <el-tag :type="row.status===0?'':row.status===1?'success':'info'">{{ row.status===0?'进行中':row.status===1?'已完成':'已停用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新日期" prop="update_time" width="150" />
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="handleRemove(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="caseListPaging.total > 0"
            :total="caseListPaging.total"
            :page.sync="caseListPaging.page"
            :limit.sync="caseListPaging.limit"
            @pagination="getTestplanList"
          />
        </el-col>
      </el-row>
    </el-row>

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" width="30%" @close="resetTestplanForm">
      <el-form ref="testplanForm" :model="testplanForm" :rules="testplanFormRules" label-width="85px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="testplanForm.name" placeholder="计划名称" />
        </el-form-item>
        <el-form-item label="cron" prop="cron">
          <el-input v-model="testplanForm.cron" placeholder="分 时 天 月 周" />
        </el-form-item>
        <el-form-item label="运行环境" prop="env_id">
          <el-select v-model="testplanForm.env_id" placeholder="状态">
            <el-option v-for="item in envs" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Webhook" prop="webhook">
          <el-input v-model="testplanForm.webhook" type="textarea" placeholder="webhook" />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="testplanForm.desc" type="textarea" placeholder="备注" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetTestplanForm">取 消</el-button>
        <el-button type="primary" :loading="dialogAttribute.save" @click="saveSubmit">{{ dialogAttribute.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>

    <el-drawer title="测试用例" :visible.sync="testcaseListShow" size="70%">
      <TestcaseList
        @addToPlan="addToPlan"
      />
    </el-drawer>
  </div>
</template>

<script>
import { searchTestplanList,
  deleteTestplan,
  createTestplan,
  updateTestplan,
  getPlanTestcaseCatalogTree,
  getPlanTestcaseList,
  deletePlanDetailTestcase,
  runPlan,
  addPlanStatus,
  removePlanStatus,
  addTestcaseToPlan } from '@/api/http'
import { getAllEnvConfig } from '@/api/manage'
import Pagination from '@/components/Pagination'
import TestcaseList from '@/components/HttpRunner/TestcaseList'

export default {
  components: { Pagination, TestcaseList },
  filters: {
  },
  data() {
    return {
      testplanList: null,
      projectId: parseInt(localStorage.getItem('projectId')),
      listLoading: false,
      showList: true,
      caseListLoading: false,
      testcaseListShow: false,
      envs: [],
      search: {
        q: '',
        project_id: ''
      },
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      catalogs: [],
      caseList: [],
      plan: null,
      caseListPaging: {
        page: 1,
        limit: 10,
        total: 0
      },
      filterText: '',
      catalogId: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogAttribute: {
        title: '新增',
        create: 1,
        show: false,
        save: false
      },
      testplanFormRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: 'cron不能为空', trigger: 'blur' }
        ],
        env_id: [
          { required: true, message: '环境不能为空', trigger: 'blur' }
        ]
      },
      testplanForm: {
        id: '',
        name: '',
        cron: '',
        env_id: '',
        webhook: '',
        project_id: '',
        desc: ''
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    '$store.state.rocket.projectId'() {
      this.projectId = this.$store.state.rocket.projectId
      this.getTestplanList()
    }
  },
  created() {
    this.getTestplanList()
    this.getAllEnvConfigs()
  },
  methods: {
    handleAddTestcase() {
      this.testcaseListShow = true
    },
    handleCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
      this.testplanForm = this.$resetForm(this.testplanForm)
    },
    handleEdit(row) {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 0
      this.dialogAttribute.title = '编辑'
      this.testplanForm.id = row.id
      this.testplanForm.project_id = row.project_id
      this.testplanForm.name = row.name
      this.testplanForm.cron = row.cron
      this.testplanForm.env_id = row.env_id
      this.testplanForm.webhook = row.webhook
      this.testplanForm.desc = row.desc
    },
    async getAllEnvConfigs() {
      await getAllEnvConfig().then(res => {
        this.envs = res.data
      })
    },
    async handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteTestplan(row.id)
        this.$message.success(msg)
        await this.getTestplanList()
      })
    },
    async handleCurrentChange(val) {
      this.paging.page = val
      await this.getTestplanList()
    },
    async handleSearch() {
      this.paging.page = 1
      await this.getTestplanList()
    },
    async getTestplanList() {
      this.listLoading = true
      const params = {
        page: this.paging.page,
        limit: this.paging.limit,
        search: this.search.q,
        project_id: this.projectId
      }
      await searchTestplanList(params).then(response => {
        this.testplanList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    saveSubmit() {
      this.$refs.testplanForm.validate(validate => {
        if (validate) {
          this.dialogAttribute.save = true
          if (this.dialogAttribute.create === 1) {
            this.create()
          } else {
            this.update()
          }
          this.$nextTick(() => {
            this.resetTestplanForm()
            this.getTestplanList()
          })
        }
      })
    },
    update() {
      updateTestplan(this.testplanForm).then(res => {
        this.$message.success(res.msg)
      }).catch(() => {})
    },
    create() {
      createTestplan(this.testplanForm).then(res => {
        this.$message.success(res.msg)
      }).catch(() => {})
    },
    resetTestplanForm() {
      this.dialogAttribute.save = false
      this.dialogAttribute.show = false
      this.$refs['testplanForm'].clearValidate()
      this.testplanForm.project_id = parseInt(localStorage.getItem('projectId'))
    },
    goBack() {
      this.showList = true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleReset() {
      this.catalogId = ''
      this.hanldePlanDetail(this.plan)
    },
    hanldePlanDetail(plan) {
      this.showList = false
      this.plan = plan
      this.getCatalogTree()
      this.getPlanDetailTestcaseList()
    },
    handleCatalogClick(obj, node, data) {
      this.catalogId = obj.id
      this.getPlanDetailTestcaseList()
    },
    getCatalogTree() {
      const params = {
        plan_id: this.plan.id,
        project_id: this.plan.project_id
      }
      getPlanTestcaseCatalogTree(params).then(res => {
        this.catalogs = res.data
      })
    },
    getPlanDetailTestcaseList() {
      this.caseListLoading = true
      const params = {
        plan_id: this.plan.id,
        catalog_id: this.catalogId
      }
      getPlanTestcaseList(params).then(res => {
        this.caseList = res.data
        this.caseListPaging = res.paging
      })
      this.caseListLoading = false
    },
    handleRemove(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const data = {
          plan_id: this.plan.id,
          testcase_id: row.id
        }
        deletePlanDetailTestcase(data).then(res => {
          this.$message.success(res.msg)
          this.hanldePlanDetail(this.plan)
        })
      })
    },
    addToPlan(row) {
      const data = {
        plan_id: this.plan.id,
        testcase_id: row.id
      }
      addTestcaseToPlan(data).then(res => {
        this.message.success(res.msg)
      })
      this.testcaseListShow = false
      this.handleReset()
    },
    handleRun(plan) {
      runPlan(plan.id).then(res => {
        this.$message.success(res.msg)
      })
    },
    changeStatus(row) {
      const id = row.Plan.id
      const status = row.Plan.status
      if (status === 1) {
        addPlanStatus(id).then(res => {
          this.$message.success(res.msg)
        })
      } else {
        removePlanStatus(id).then(res => {
          this.$message.success(res.msg)
        })
      }
    }
  }
}
</script>
