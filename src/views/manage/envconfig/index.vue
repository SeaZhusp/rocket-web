<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="q" placeholder="输入名称筛选" @keyup.enter.native="handleSearch" />
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
        <el-table-column label="名称" prop="name" show-overflow-tooltip />
        <el-table-column label="Pyshell" prop="modules">
          <template slot-scope="{row}">
            <el-tag v-for="item in JSON.parse(row.modules)" :key="item" style="margin-right:5px">{{ item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="desc" show-overflow-tooltip width="200" />
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status === 0 ? 'info':'success'">{{ row.status===0? "禁用":"启用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="160" />
        <el-table-column label="更新时间" prop="update_time" width="160" />
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
        <el-form ref="configForm" :model="configForm" :rules="configFormRules">
          <el-form-item label="名称" prop="name" label-width="80px">
            <el-input v-model="configForm.name" placeholder="名称" />
          </el-form-item>
          <el-form-item label="描述" prop="desc" label-width="80px">
            <el-input v-model="configForm.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="200" show-word-limit placeholder="描述" />
          </el-form-item>
          <el-form-item label="Pyshell" prop="modules" label-width="80px">
            <el-select v-model="configForm.modules" multiple placeholder="请选择Pyshell" style="width:100%">
              <el-option
                v-for="item in moduleOptions"
                :key="item.id"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status" label-width="80px">
            <el-radio v-model="configForm.status" :label="1">启用</el-radio>
            <el-radio v-model="configForm.status" :label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <el-tabs v-model="activeStep">
          <el-tab-pane label="Service" name="service">
            <Service
              ref="service"
              :service="configForm.config.service"
            />
          </el-tab-pane>
          <el-tab-pane label="Variables" name="variables">
            <Variables
              ref="variables"
              :variables="configForm.config.variables"
            />
          </el-tab-pane>
          <el-tab-pane label="Headers" name="headers">
            <Headers
              ref="headers"
              :headers="configForm.config.headers"
              :custom-style="'width:235px'"
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
import { searchEnvConfig, deleteEnvConfig, createEnvConfig, updateEnvConfig } from '@/api/manage'
import { listPyshell } from '@/api/manage'
import Pagination from '@/components/Pagination'
import Headers from '@/components/HttpRunner/Headers'
import Variables from '@/components/HttpRunner/Variables'
import Service from '@/components/HttpRunner/Service'

export default {
  components: { Pagination, Headers, Variables, Service },
  filters: {},
  data() {
    return {
      envList: null,
      listLoading: false,
      activeStep: 'service',
      moduleOptions: [],
      q: '',
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      drawerAttribute: {
        title: '新增配置',
        create: 1,
        show: false,
        save: false
      },
      configFormRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      configForm: {
        id: '',
        name: '',
        status: 1,
        modules: '',
        desc: '',
        config: {
          variables: [{ key: '', type: 1, value: '', desc: '' }],
          headers: [{ key: '', value: '', desc: '' }],
          service: [{ key: '', value: '', desc: '' }]
        }
      }
    }
  },
  created() {
    this.getEnvList()
    this.getPyshellList()
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
    getPyshellList() {
      listPyshell().then(res => {
        this.moduleOptions = res.data
      })
    },
    initConfigForm() {
      return {
        id: '',
        name: '',
        modules: [],
        status: 1,
        desc: '',
        config: {
          variables: [{ key: '', type: 1, value: '', desc: '' }],
          headers: [{ key: '', value: '', desc: '' }],
          service: [{ key: '', value: '', desc: '' }]
        }
      }
    },
    handleCreate() {
      this.drawerAttribute.show = true
      this.drawerAttribute.create = 1
      this.configForm = this.initConfigForm()
    },
    handleEdit(row) {
      this.drawerAttribute.show = true
      this.drawerAttribute.create = 0
      this.drawerAttribute.title = '编辑配置'
      this.configForm.id = row.id
      this.configForm.name = row.name
      this.configForm.status = row.status
      this.configForm.desc = row.desc
      this.configForm.modules = JSON.parse(row.modules)
      this.configForm.config = JSON.parse(row.config)
    },
    async getEnvList() {
      this.listLoading = true
      const params = {
        page: this.paging.page,
        limit: this.paging.limit,
        search: this.q
      }
      await searchEnvConfig(params).then(response => {
        this.envList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    getConfigForm() {
      return {
        id: this.configForm.id,
        name: this.configForm.name,
        status: this.configForm.status,
        modules: this.configForm.modules,
        desc: this.configForm.desc,
        config: {
          variables: this.$refs.variables.parseVariables(),
          headers: this.$refs.headers.parseHeaders(),
          service: this.$refs.service.parseService()
        }
      }
    },
    handleSave() {
      console.log(this.getConfigForm())
      this.$refs.configForm.validate(validate => {
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
      updateEnvConfig(this.getConfigForm()).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    create() {
      createEnvConfig(this.getConfigForm()).then(res => {
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
        const { msg } = await deleteEnvConfig(row.id)
        this.$message.success(msg)
        await this.getEnvList()
      })
    }
  }
}
</script>
