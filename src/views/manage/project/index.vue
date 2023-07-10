<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="q" placeholder="输入项目名筛选" @keyup.enter.native="handleSearch" />
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
      <el-row>
        <el-table v-loading="listLoading" :data="projectList" element-loading-text="Loading">
          <el-table-column label="序号" type="selection" width="55" />
          <el-table-column label="项目" prop="name" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="更新时间" prop="update_time" />
          <el-table-column label="创建日期" prop="create_time" />
          <el-table-column fixed="right" label="操作" min-width="80px">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" disabled>配置</el-button>
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click="handleDelete(scope.row)">删除</el-dropdown-item>
                  <el-dropdown-item disabled>同步项目</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getProjectList" />
      </el-row>
    </el-row>

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" width="30%" @close="cancelSubmit">
      <el-form ref="projectForm" :model="projectForm" :rules="projectFormRules" label-width="55px">
        <el-form-item label="项目" prop="name">
          <el-input v-model="projectForm.name" placeholder="项目" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="projectForm.description" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" maxlength="200" show-word-limit placeholder="描述" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" :loading="dialogAttribute.save" @click="saveSubmit">{{ dialogAttribute.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchProject, createProject, deleteProject, updateProject } from '@/api/manage'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      projectList: null,
      listLoading: false,
      q: '',
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
      projectFormRules: {
        name: [
          { required: true, message: '项目名不能为空', trigger: 'blur' }
        ]
      },
      projectForm: {
        id: '',
        name: '',
        description: ''
      }
    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    handleCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
      this.projectForm = this.$resetForm(this.projectForm)
    },
    handleEdit(row) {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 0
      this.dialogAttribute.title = '编辑'
      this.projectForm.id = row.id
      this.projectForm.name = row.name
      this.projectForm.description = row.description
    },
    async handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteProject(row.id)
        this.$message.success(msg)
        await this.getProjectList()
      })
    },
    async handleCurrentChange(val) {
      this.paging.page = val
      await this.getProjectList()
    },
    async handleSearch() {
      this.paging.page = 1
      await this.getProjectList()
    },
    async getProjectList() {
      this.listLoading = true
      const params = {
        page: this.paging.page,
        limit: this.paging.limit,
        search: this.q
      }
      await searchProject(params).then(response => {
        this.projectList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    saveSubmit() {
      this.$refs.projectForm.validate(validate => {
        if (validate) {
          this.dialogAttribute.save = true
          if (this.dialogAttribute.create === 1) {
            this.create()
          } else {
            this.update()
          }
          this.cancelSubmit()
          this.getProjectList()
        }
      })
    },
    update() {
      updateProject(this.projectForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    create() {
      createProject(this.projectForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    cancelSubmit() {
      this.dialogAttribute.save = false
      this.dialogAttribute.show = false
      this.$refs['projectForm'].clearValidate()
    }
  }
}
</script>
