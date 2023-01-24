<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="q" placeholder="输入姓名筛选" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlerCreate">新增</el-button>
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
            <el-button type="text" @click="handlerEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handlerDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getUserList" />
    </el-card>

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" width="30%" @close="cancelSubmit">
      <el-form ref="userForm" :inline="true" :model="userForm" :rules="userFormRules" label-width="55px">
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="userForm.fullname" placeholder="请输入姓名" :disabled="dialogAttribute.create === 0" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入账号" :disabled="dialogAttribute.create === 0" />
        </el-form-item>
        <el-form-item v-if="dialogAttribute.create === 1" label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item v-if="dialogAttribute.create === 1" label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item v-if="dialogAttribute.create === 0" label="职责" prop="duty">
          <el-select v-model="userForm.duty" placeholder="请选择职责" style="width:184px">
            <el-option v-for="item in dutyList" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogAttribute.create === 0" label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="状态" style="width:184px">
            <el-option v-for="item in statusList" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
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
import { searchUser, createUser, deleteUser, updateUser } from '@/api/system/user'
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
      userFormRules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        fullname: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      userForm: {
        id: '',
        username: '',
        password: '',
        fullname: '',
        status: '',
        phone: '',
        email: '',
        duty: ''
      },
      statusList: [
        {
          type: 1,
          name: '启用'
        },
        { type: 0,
          name: '禁用'
        }
      ],
      dutyList: [
        {
          type: 0,
          name: '普通用户'
        },
        { type: 1,
          name: '组长'
        },
        { type: 2,
          name: '管理员'
        }
      ]
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    handlerCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
      this.userForm = this.$resetForm(this.userForm)
      this.userForm.password = '123456'
    },
    handlerEdit(row) {
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
    async handlerDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteUser(row.id)
        this.$message.success(msg)
        await this.getUserList()
      })
    },
    async handleCurrentChange(val) {
      this.paging.page = val
      await this.getUserList()
    },
    async handleSearch() {
      this.paging.page = 1
      await this.getUserList()
    },
    async getUserList() {
      this.listLoading = true
      const params = {
        page: this.paging.page,
        limit: this.paging.limit,
        search: this.q
      }
      await searchUser(params).then(response => {
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
          this.getUserList()
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
