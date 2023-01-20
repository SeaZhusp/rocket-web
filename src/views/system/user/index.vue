<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="q" placeholder="输入用例标题" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlerCreate">创建用户</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table  v-loading="listLoading" :data="userList" element-loading-text="Loading" fit highlight-current-row>
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column label="姓名" prop="fullname" align="center" />
        <el-table-column label="账号" prop="username" align="center" />
        <el-table-column label="职责" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.duty === 0 ? 'info': row.duty === 1 ? 'success': 'danger' ">{{ row.duty | dutyName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="手机号" prop="phone" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.status === 1 ? 'success':'info' ">{{ row.status===1? "启用":"禁用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="create_time" align="center" />
        <el-table-column fixed="right" align="center" label="操作" min-width="80px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handlerEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handlerDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getUserList" />
    </el-card>

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" :close-on-click-modal="false" width="30%">
      <el-form :inline="true" ref="userForm" :model="userForm" :rules="userFormRules" label-width="55px">
          <el-form-item label="姓名" prop="fullname">
              <el-input placeholder="请输入姓名" v-model="userForm.fullname" :disabled="dialogAttribute.create === 0"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="username">
              <el-input placeholder="请输入账号" v-model="userForm.username" :disabled="dialogAttribute.create === 0"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogAttribute.create === 1" label="邮箱" prop="email">
              <el-input placeholder="请输入邮箱" v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogAttribute.create === 1" label="手机号" prop="phone">
              <el-input placeholder="请输入手机号" v-model="userForm.phone"></el-input>
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
            <el-button @click="cancelSubmit" >取 消</el-button>
            <el-button type="primary" @click="saveSubmit" :loading="dialogAttribute.save">{{ dialogAttribute.save ? '提交中 ...' : '确 定' }}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchUser, createUser, deleteUser } from '@/api/user'
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
        title: '创建用户',
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
        id:'',
        username: '',
        password: '',
        fullname: '',
        status: '',
        phone:'',
        email:'',
        duty:''
      },
      statusList: [
        {
          type: 1,
          name: '启用'
        },
        { type: 0,
          name: '禁用'
        },
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
      ],
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    handlerCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
    },
    handlerEdit(row) {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 0
      this.dialogAttribute.title = '编辑用户'
      this.userForm.id = row.id
      this.userForm.fullname = row.fullname
      this.userForm.username = row.username
      this.userForm.phone = row.phone
      this.userForm.duty = row.duty
      this.userForm.status = row.status
    },
    async handlerDelete(row){
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        console.log(row.id)
        const { msg } = await deleteUser(row.id)
        this.$message.success(msg)
        await this.getUserList()
      }).catch(() => {
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
        if(validate) {
          this.dialogAttribute.save = true
          if (this.dialogAttribute.create === 1){
            this.save()
          }else{
            this.update()
          }
        }
      })
    },
    update() {
      this.$message.success("update")
      this.cancelSubmit()
      this.getUserList()
    },
    save() {
        createUser(this.userForm).then(res => {
          this.$message.success(res.msg)
        }).catch(error => {
          console.log(error)
          this.$message.error(error.response.data['message'])
        }).finally(() => {
          this.cancelSubmit()
          this.getUserList()
      })
    },
    cancelSubmit() {
      // 等页面刷新完之后，再执行回调函数中的方法，因为this.dialogFrom = false 它是异步的
      this.$nextTick(() => {
        this.dialogAttribute.save = false
        this.dialogAttribute.show = false
        this.$refs['userForm'].clearValidate() 
        for (let key in this.userForm){
          this.userForm[key] = ""
        }
        // this.$refs['userForm'].resetFields()
      })
    },
  }
}
</script>
