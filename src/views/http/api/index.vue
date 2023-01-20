<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-card shadow="never">
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag">
        </el-tree>
        </el-card>
      </el-col>
      <el-col :span="20">
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
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer :title="drawerAttribute.title" :visible.sync="drawerAttribute.show" direction="rtl" :before-close="handleClose" :wrapperClosable='false' size='70%'>
      <el-card shadow='nerer'>
        <el-row>
          <el-form :inline="true">
            <el-form-item label="用例名称">
              <el-input placeholder="用例名称"/>
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
export default {
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
        apiForm: {
          level: null,
        },
        levelList:[
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
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2',
            children: [{
             id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '三级 3-2-3'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        drawerAttribute: {
          show: false,
          direction: 'rtl',
          title: '添加用例'
        }
      };
    },
    methods: {
      handlerCreate() {
        this.drawerAttribute.show = true
        this.drawerAttribute.title = '添加用例'
      },
      handleDragStart(node, ev) {
        console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label);
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        console.log('tree drag leave: ', dropNode.label);
      },
      handleDragOver(draggingNode, dropNode, ev) {
        console.log('tree drag over: ', dropNode.label);
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType);
      },
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.label === '二级 3-1') {
          return type !== 'inner';
        } else {
          return true;
        }
      },
      allowDrag(draggingNode) {
        return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
      }
    }
  };
</script>

<style scoped>

</style>
