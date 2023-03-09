<template>
  <div class="app-container">
    <el-row>
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
            <el-link type="primary" :underline="false">{{ row.Plan.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="运行环境" prop="name" width="250" />
        <el-table-column label="Cron" prop="Plan.cron" width="200" />
        <!-- <el-table-column label="备注" prop="Plan.desc" /> -->
        <el-table-column label="运行状态" width="150">
          <template slot-scope="{row}">
            <el-switch v-model="row.Plan.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="Plan.create_time" width="150" />
        <!-- <el-table-column label="创建日期" prop="Plan.update_time" /> -->
        <el-table-column fixed="right" label="操作" width="150">
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

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" width="30%" @close="resetTestplanForm">
      <el-form ref="testplanForm" :model="testplanForm" :rules="testplanFormRules" label-width="85px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="testplanForm.name" placeholder="计划名称" />
        </el-form-item>
        <el-form-item label="cron" prop="cron">
          <el-input v-model="testplanForm.cron" placeholder="cron表达式只支持5位" />
        </el-form-item>
        <el-form-item label="运行环境" prop="env_id">
          <el-select v-model="testplanForm.env_id" placeholder="状态">
            <el-option v-for="item in envs" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="运行状态" prop="status">
          <el-switch v-model="testplanForm.status" :active-value="1" :inactive-value="0" />
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
  </div>
</template>

<script>
import { searchTestplanList, deleteTestplan, createTestplan, updateTestplan, getAllEnvConfig } from '@/api/http'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    dutyName(duty) {
      const statusMap = {
        0: '普通成员',
        1: '组长',
        2: '管理员'
      }
      return statusMap[duty]
    }
  },
  data() {
    return {
      testplanList: null,
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
        status: '',
        webhook: '',
        project_id: '',
        desc: ''
      }
    }
  },
  created() {
    this.getTestplanList()
    this.getAllEnvConfigs()
  },
  methods: {
    handleCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
      this.testplanForm = this.$resetForm(this.testplanForm)
      this.testplanForm.status = 0
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
      this.testplanForm.status = row.status
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
        status: this.search.status,
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
    }
  }
}
</script>
