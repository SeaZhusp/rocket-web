<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="q" placeholder="输入环境名筛选" />
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
      <el-table v-loading="listLoading" :data="envList" element-loading-text="Loading">
        <el-table-column label="序号" type="index" width="55" />
        <el-table-column label="环境名" prop="name" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="创建时间" prop="create_time" />
        <el-table-column label="更新时间" prop="update_time" />
        <el-table-column fixed="right" label="操作" min-width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getEnvList" />
    </el-row>

    <el-drawer
      :title="drawerAttribute.title"
      :visible.sync="drawerAttribute.show"
      :wrapper-closable="false"
      size="55%"
      @close="handleClose"
    >
      <el-card shadow="nerer">
        <el-form ref="envForm" :model="envForm" :rules="envFormRules">
          <el-form-item label="环境名称" prop="name" label-width="80px">
            <el-input v-model="envForm.name" placeholder="环境名称" />
          </el-form-item>
          <el-form-item label="描述" prop="description" label-width="80px">
            <el-input v-model="envForm.description" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="200" show-word-limit placeholder="描述" />
          </el-form-item>
          <el-form-item label="状态" prop="status" label-width="80px">
            <el-radio v-model="envForm.status" :label="1">启用</el-radio>
            <el-radio v-model="envForm.status" :label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <el-tabs v-model="activeStep">
          <el-tab-pane label="Service" name="service">
            <Service
              ref="service"
              :service="envForm.config.service"
            />
          </el-tab-pane>
          <el-tab-pane label="Variables" name="variables">
            <Variables
              ref="variables"
              :variables="envForm.config.variables"
            />
          </el-tab-pane>
          <el-tab-pane label="Headers" name="headers">
            <Headers
              ref="headers"
              :headers="envForm.config.headers"
              :custom-style="'width:235px'"
            />
          </el-tab-pane>
          <el-tab-pane label="Hooks" name="Hooks">
            <Hooks
              ref="hooks"
              :hooks="envForm.config.hooks"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <div class="demo-drawer__footer draw-btn-right">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="drawerAttribute.save" @click="handleSave">{{ drawerAttribute.save ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { createDict, deleteDict, updateDict } from '@/api/system/dict'
import { searchEnv } from '@/api/http/env'
import Pagination from '@/components/Pagination'
import Headers from '@/components/httprunner/Headers'
import Variables from '@/components/httprunner/Variables'
import Hooks from '@/components/httprunner/Hooks'
import Service from '@/components/httprunner/Service'

export default {
  components: { Pagination, Headers, Variables, Hooks, Service },
  filters: {},
  data() {
    return {
      envList: null,
      listLoading: false,
      activeStep: 'service',
      q: '',
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      drawerAttribute: {
        title: '新增环境',
        create: 1,
        show: false,
        save: false
      },
      envFormRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      envForm: {
        id: '',
        name: '',
        status: 1,
        desc: '',
        config: {
          variables: [{ key: '', type: 1, value: '', desc: '' }],
          headers: [{ key: '', value: '', desc: '' }],
          service: [{ key: '', value: '', desc: '' }],
          hooks: {
            setup_hooks: [{ setup_hook: '' }],
            teardown_hooks: [{ teardown_hook: '' }]
          }
        }
      }
    }
  },
  created() {
    this.getEnvList()
  },
  methods: {
    async handleCurrentChange(val) {
      this.paging.page = val
      await this.getEnvList()
    },
    async handleSearch() {
      this.paging.page = 1
      await this.getEnvList()
    },
    initEnvForm() {
      return {
        id: '',
        name: '',
        status: 1,
        description: '',
        config: {
          variables: [{ key: '', type: 1, value: '', desc: '' }],
          headers: [{ key: '', value: '', desc: '' }],
          service: [{ key: '', value: '', desc: '' }],
          hooks: {
            setup_hooks: [{ setup_hook: '' }],
            teardown_hooks: [{ teardown_hook: '' }]
          }
        }
      }
    },
    handleCreate() {
      this.drawerAttribute.show = true
      this.drawerAttribute.create = 1
      this.envForm = this.initEnvForm()
    },
    handleEdit(row) {
      this.drawerAttribute.show = true
      this.drawerAttribute.create = 0
      this.drawerAttribute.title = '编辑环境'
      this.envForm.id = row.id
      this.envForm.name = row.name
      this.envForm.type = row.type
      this.envForm.code = row.code
      this.envForm.description = row.description
      this.envForm.status = row.status
    },
    async selectChange(row) {
      const { msg } = await updateDict(row)
      this.$message.success(msg)
      await this.getEnvList()
    },
    async getEnvList() {
      this.listLoading = true
      const params = {
        page: this.paging.page,
        limit: this.paging.limit,
        search: this.q
      }
      await searchEnv(params).then(response => {
        this.envList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    handleSave() {
      console.log(this.envForm)
      this.$refs.envForm.validate(validate => {
        if (validate) {
          this.drawerAttribute.save = true
          if (this.drawerAttribute.create === 1) {
            this.create()
          } else {
            this.update()
          }
          this.handleClose()
          this.getEnvList()
        }
      })
    },
    update() {
      updateDict(this.envForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    create() {
      createDict(this.envForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    handleClose() {
      this.drawerAttribute.save = false
      this.drawerAttribute.show = false
    },
    async handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteDict(row.id)
        this.$message.success(msg)
        await this.getEnvList()
      })
    }
  }
}
</script>
