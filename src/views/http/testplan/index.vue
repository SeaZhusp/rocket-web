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
      <el-table v-loading="listLoading" :data="userList" element-loading-text="Loading">
        <el-table-column label="序号" type="index" width="55" />
        <el-table-column label="姓名" prop="fullname" />
        <el-table-column label="账号" prop="username" />
        <el-table-column label="职责">
          <template slot-scope="{row}">
            <el-tag :type="row.duty === 0 ? 'info': row.duty === 1 ? 'success': 'danger' ">{{ row.duty | dutyName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.status === 1 ? 'success':'info' ">{{ row.status===1? "启用":"禁用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="create_time" />
        <el-table-column label="创建日期" prop="update_time" />
        <el-table-column fixed="right" label="操作" min-width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getTestplanList" />
    </el-row>

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" width="30%" @close="cancelSubmit">
      <el-form ref="testplanForm" :model="testplanForm" :rules="testplanFormRules" label-width="85px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="testplanForm.name" placeholder="计划名称" />
        </el-form-item>
        <el-form-item label="cron表达式" prop="cron">
          <el-input v-model="testplanForm.username" placeholder="cron表达式只支持5位" />
        </el-form-item>
        <el-form-item label="运行环境" prop="env_id">
          <el-select v-model="testplanForm.status" placeholder="状态" style="width:184px">
            <el-option v-for="item in statusList" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="testplanForm.desc" type="textarea" placeholder="备注" />
        </el-form-item>
        <el-form-item label="webhook" prop="webhook">
          <el-input v-model="testplanForm.webhook" type="textarea" placeholder="webhook" />
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
import { searchTestplanList, deleteTestplan } from '@/api/http'
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
      userList: null,
      projectId: parseInt(localStorage.getItem('projectId')),
      listLoading: false,
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
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        fullname: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      testplanForm: {
        id: '',
        name: '',
        desc: '',
        fullname: '',
        status: '',
        phone: '',
        email: '',
        duty: ''
      }
    }
  },
  created() {
    this.getTestplanList()
  },
  methods: {
    handleCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
      this.userForm = this.$resetForm(this.userForm)
      this.userForm.password = '123456'
    },
    handleEdit(row) {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 0
      this.dialogAttribute.title = '编辑'
      this.userForm.id = row.id
      this.userForm.fullname = row.fullname
      this.userForm.username = row.username
      this.userForm.email = row.email
      this.userForm.phone = row.phone
      this.userForm.duty = row.duty
      this.userForm.status = row.status
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
        this.userList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    saveSubmit() {
      this.$refs.userForm.validate(validate => {
        if (validate) {
          this.dialogAttribute.save = true
          if (this.dialogAttribute.create === 1) {
            this.create()
          } else {
            this.update()
          }
          this.cancelSubmit()
          this.getTestplanList()
        }
      })
    },
    update() {
      updateUser(this.userForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    create() {
      createUser(this.userForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    cancelSubmit() {
      this.dialogAttribute.save = false
      this.dialogAttribute.show = false
      this.$refs['userForm'].clearValidate()
    }
  }
}
</script>
