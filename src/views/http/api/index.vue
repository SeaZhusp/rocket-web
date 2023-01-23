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
      <el-col :span="4">
        <el-card shadow="never">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="filterText" suffix-icon="el-icon-search" placeholder="关键字过滤" />
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="点击创建根目录，子目录在树上建" placement="top-start">
                <el-button type="text" icon="el-icon-plus" />
              </el-tooltip>
            </el-form-item>
          </el-form>
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="catalogs"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
              <span>{{ node.label }}</span>
              <span>
                <el-button v-show="data.del" type="text" size="mini" icon="el-icon-plus" @click="alert('新增')" />
                <el-button v-show="data.del" type="text" size="mini" icon="el-icon-edit" @click="alert('修改')" />
                <el-button v-show="data.del" type="text" size="mini" icon="el-icon-delete" @click="alert('删除')" />
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="19" style="margin-left:5px">
        <el-card shadow="never">
          <el-form :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <el-input v-model="q" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handlerCreate">添加用例</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-table v-loading="listLoading" :data="userList" element-loading-text="Loading" fit highlight-current-row>
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
              </el-table> -->
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer :title="drawerAttribute.title" :visible.sync="drawerAttribute.show" direction="rtl" :before-close="handleClose" :wrapper-closable="false" size="70%">
      <el-card shadow="nerer">
        <el-row>
          <el-form :inline="true">
            <el-form-item label="用例名称">
              <el-input placeholder="用例名称" />
            </el-form-item>
            <el-form-item label="用例等级">
              <el-select v-model="apiForm.level" placeholder="请选优先级" clearable style="width:184px">
                <el-option v-for="item in levelList" :key="item.type" :label="item.name" :value="item.type" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-row>
        <span>我来啦!</span>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { listProject } from '@/api/system/project'

export default {
  data() {
    return {
      userList: null,
      listLoading: false,
      projects: [],
      projectId: '',
      q: '',
      filterText: '',
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      apiForm: {
        level: null
      },
      levelList: [
        {
          type: 0,
          name: 'P0'
        },
        { type: 1,
          name: 'P1'
        },
        { type: 2,
          name: 'P2'
        }
      ],
      catalogs: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      drawerAttribute: {
        show: false,
        direction: 'rtl',
        title: '添加用例'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    projectId(val) {
      localStorage.setItem('projectId', val)
    }
  },
  created() {
    this.getAllProjects()
    this.initProject()
  },
  methods: {
    initProject() {
      const projectId = localStorage.getItem('projectId')
      if (projectId) {
        this.projectId = parseInt(projectId)
      }
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
    async getAllProjects() {
      const params = {
        project_type: 0
      }
      await listProject(params).then(response => {
        this.projects = response.data
      })
    },
    handlerProjectChange(val) {
      // todo 获取所有目录，用例
      console.log(val)
    },
    handlerCreate() {
      this.drawerAttribute.show = true
      this.drawerAttribute.title = '添加用例'
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
</style>
