<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="当前项目" prop="projectId">
        <el-select v-model="projectId" placeholder="请选择" filterable @change="handlerProjectChange">
          <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <i class="el-icon-info" style="color:#909399"> 请先选择一个项目，然后开始吧~ </i>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="4.1">
        <el-card shadow="never">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="filterText" suffix-icon="el-icon-search" placeholder="关键字过滤" />
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="点击创建根目录，子目录请在节点创建" placement="top-start">
                <el-button type="text" icon="el-icon-folder-add" @click="handlerCatalogCreate">新增</el-button>
              </el-tooltip>
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
          >
            <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
              <span>{{ node.label }}</span>
              <span>
                <el-button v-show="data.del" type="text" icon="el-icon-folder-add" @click="handlerCatalogCreate(node, data)" />
                <el-button v-show="data.del" type="text" icon="el-icon-edit" @click="handlerCatalogEdit(node, data)" />
                <el-button v-show="data.del" type="text" icon="el-icon-delete" @click="handlerCatalogDelete(node, data)" />
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="19" style="margin-left:5px">
        <el-row shadow="never">
          <el-form :inline="true">
            <el-row>
              <el-col>
                <el-form-item>
                  <el-input v-model="search.q" placeholder="输入接口名搜索" />
                </el-form-item>
                <el-form-item>
                  <el-select v-model="search.level" placeholder="优先级" clearable class="custom-form-item-search">
                    <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="search.status" placeholder="状态" clearable class="custom-form-item-search">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handlerCreate">新增接口</el-button>
                </el-form-item>
                <el-form-item>
                  <el-dropdown>
                    <el-button> 更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item disabled>批量执行</el-dropdown-item>
                      <el-dropdown-item disabled>批量删除</el-dropdown-item>
                      <el-dropdown-item disabled>导入接口</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-table v-loading="listLoading" :data="userList" element-loading-text="Loading" fit highlight-current-row>
                <el-table-column align="center" type="selection" width="55" />
                <el-table-column label="接口名称" prop="fullname" />
                <el-table-column label="方法" prop="username" />
                <el-table-column label="路径" prop="email" />
                <el-table-column label="状态">
                  <template slot-scope="{row}">
                    <el-tag effect="dark" :type="row.status === 1 ? 'success':'info' ">{{ row.status===1? "启用":"禁用" }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="创建人" prop="phone" />
                <el-table-column label="创建日期" prop="create_time" />
                <el-table-column fixed="right" label="操作" min-width="80px">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handlerEdit(scope.row)">执行</el-button>
                    <el-button type="text" size="small" @click="handlerEdit(scope.row)">编辑</el-button>
                    <el-dropdown @command="handleCommand">
                      <span class="el-dropdown-link">
                        更多<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">复制</el-dropdown-item>
                        <el-dropdown-item command="b">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-form>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog :title="dialogCatalog.title" :visible.sync="dialogCatalog.show" width="20%" @close="cancelCatalog">
      <el-form ref="catalogForm" :model="catalogForm" :rules="catalogFormRules" label-width="55px">
        <el-form-item label="目录" prop="name">
          <el-input v-model="catalogForm.name" placeholder="目录" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCatalog">取 消</el-button>
        <el-button type="primary" :loading="dialogCatalog.save" @click="saveCatalog">{{ dialogCatalog.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>

    <el-drawer :title="drawerApi.title" :visible.sync="drawerApi.show" direction="rtl" :before-close="handleClose" :wrapper-closable="false" size="75%">
      <Detail />
    </el-drawer>
  </div>
</template>

<script>
import { listProject } from '@/api/system/project'
import { searchCatalogTree, createCatalog, updateCatalog, deleteCatalog } from '@/api/system/catalog'
import Detail from '@/views/http/api/detail'

export default {
  components: { Detail },
  data() {
    return {
      userList: [{ user: '12' }],
      listLoading: false,
      projects: [],
      projectId: '',
      search: {
        q: '',
        level: null,
        status: null
      },
      filterText: '',
      catalogForm: {
        id: '',
        name: '',
        project_id: '',
        parent_id: null
      },
      catalogFormRules: {
        name: [
          { required: true, message: '目录名不能为空', trigger: 'blur' }
        ]
      },
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      apiForm: {
        level: null
      },
      levelOptions: [{ value: 0, label: 'P0' }, { value: 1, label: 'P1' }, { value: 2, label: 'P2' }],
      statusOptions: [{ value: 0, label: '进行中' }, { value: 1, label: '已完成' }],
      catalogs: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogCatalog: {
        title: '新增',
        show: false,
        save: false,
        create: 1
      },
      drawerApi: {
        show: false,
        title: '新增'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    projectId(val) {
      localStorage.setItem('projectId', val)
      this.getCatalogTree()
    }
  },
  created() {
    this.getAllProjects()
    this.initProject()
    this.getCatalogTree()
  },
  methods: {
    initProject() {
      const projectId = localStorage.getItem('projectId')
      if (projectId) {
        this.projectId = parseInt(projectId)
      }
    },
    async getAllProjects() {
      const params = {
        project_type: 0
      }
      await listProject(params).then(response => {
        this.projects = response.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    mouseenter(data) {
      this.$set(data, 'del', true)
    },
    mouseleave(data) {
      this.$set(data, 'del', false)
    },
    handlerProjectChange(val) {
      // todo 获取所有目录，用例
      console.log(val)
    },
    // Catalog
    handlerCatalogCreate(node = null, data = null) {
      this.dialogCatalog.show = true
      this.dialogCatalog.create = 1
      this.catalogForm = this.$resetForm(this.catalogForm)
      this.catalogForm.project_id = this.projectId
      if (data) {
        this.catalogForm.parent_id = data.id
      }
    },
    handlerCatalogEdit(node = null, data) {
      this.dialogCatalog.show = true
      this.dialogCatalog.create = 0
      this.catalogForm.id = data.id
      this.catalogForm.name = data.label
      this.catalogForm.parent_id = data.parent_id
      this.catalogForm.project_id = data.project_id
    },
    async handlerCatalogDelete(node = null, data) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteCatalog(data.id)
        this.$message.success(msg)
        await this.getCatalogTree()
      })
    },
    async getCatalogTree() {
      const params = { project_id: this.projectId }
      searchCatalogTree(params).then(res => {
        this.catalogs = res.data
      })
    },
    saveCatalog() {
      this.$refs.catalogForm.validate(validate => {
        if (validate) {
          this.dialogCatalog.save = true
          if (this.dialogCatalog.create === 1) {
            this.create()
          } else {
            this.update()
          }
          this.cancelCatalog()
          this.getCatalogTree()
        }
      })
    },
    create() {
      var catalog = this.catalogForm
      if (this.catalogForm.parent_id === '') {
        delete catalog['parent_id']
        delete catalog['id']
      }
      createCatalog(catalog).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    update() {
      updateCatalog(this.catalogForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    cancelCatalog() {
      this.dialogCatalog.save = false
      this.dialogCatalog.show = false
      this.$refs['catalogForm'].clearValidate()
    },
    // Api
    handlerCreate() {
      this.drawerApi.show = true
      this.drawerApi.title = '添加用例'
    },
    handleClose() {
      this.drawerApi.show = false
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-form-item-search {
  width:110px
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 11px;
}
</style>
