<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="q" placeholder="输入项目名筛选" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlerCreate">创建项目</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="listLoading" :data="projectList" element-loading-text="Loading" fit highlight-current-row>
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column label="项目名" prop="name" align="center" />
        <el-table-column label="描述" prop="description" align="center" />
        <el-table-column label="类型" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.type === 0 ? 'info': row.type === 1 ? 'success': 'danger' ">{{ row.type | typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="update_time" align="center" />
        <el-table-column label="创建日期" prop="create_time" align="center" />
        <el-table-column fixed="right" align="center" label="操作" min-width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="handlerEdit(scope.row)">编辑</el-button>
            <!-- <el-button type="text" @click="handlerEdit(scope.row)">成员</el-button> -->
            <el-button type="text" @click="handlerDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getProjectList" />
    </el-card>

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" :close-on-click-modal="false" width="30%">
      <el-form ref="projectForm"  :model="projectForm" :rules="projectFormRules" label-width="55px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="name">
              <el-input v-model="projectForm.name" placeholder="项目" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="projectForm.type" placeholder="选择类型">
                <el-option v-for="item in typeList" :key="item.type" :label="item.name" :value="item.type" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" maxlength="200" show-word-limit v-model="projectForm.description" placeholder="描述"/>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit" >取 消</el-button>
        <el-button type="primary" :loading="dialogAttribute.save" @click="saveSubmit">{{ dialogAttribute.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchProject, createProject, deleteProject, updateProject } from '@/api/system/project'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    typeName(type) {
      const statusMap = {
        0: 'api',
        1: 'web',
        2: 'app'
      }
      return statusMap[type]
    }
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
        title: '创建项目',
        create: 1,
        show: false,
        save: false
      },
      projectFormRules: {
        name: [
          { required: true, message: '项目名不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ]
      },
      projectForm: {
        id: '',
        name: '',
        type: '',
        description: '',
      },
      typeList: [
        {
          type: 0,
          name: 'api'
        },
        { type: 1,
          name: 'web'
        },
        { type: 2,
          name: 'app'
        }
      ]
    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    handlerCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
    },
    handlerEdit(row) {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 0
      this.dialogAttribute.title = '编辑项目'
      this.projectForm.id = row.id
      this.projectForm.name = row.name
      this.projectForm.type = row.type
      this.projectForm.description = row.description
    },
    async handlerDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteProject(row.id)
        this.$message.success(msg)
        await this.getProjectList()
      }).catch(() => {
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
        }
      })
    },
    update() {
      updateProject(this.projectForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        console.log(error)
        this.$message.error(error.response.data['message'])
      }).finally(() => {
        this.cancelSubmit()
        this.getProjectList()
      })
    },
    create() {
      createProject(this.projectForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        console.log(error)
        this.$message.error(error.response.data['message'])
      }).finally(() => {
        this.cancelSubmit()
        this.getProjectList()
      })
    },
    cancelSubmit() {
      // 等页面刷新完之后，再执行回调函数中的方法，因为this.dialogFrom = false 它是异步的
      this.$nextTick(() => {
        this.dialogAttribute.save = false
        this.dialogAttribute.show = false
        this.$refs['projectForm'].clearValidate() 
        for (let key in this.projectForm) {
          this.projectForm[key] = ''
        }
        // this.$refs['projectForm'].resetFields()
      })
    }
  }
}
</script>
