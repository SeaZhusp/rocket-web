<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5" class="app-container">
        <CatalogTree
          :catalogs="catalogs"
          :project-id="projectId"
          :catalog-used="catalogUsed"
          @changeCatalogId="changeCatalogId"
        />
      </el-col>
      <el-col :span="19" class="app-container">
        <el-row>
          <el-form :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <el-input v-model="q" placeholder="输入姓名筛选" @keyup.enter.native="handleSearch" />
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
          <el-table v-loading="listLoading" :data="list" element-loading-text="Loading">
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column label="姓名" prop="ID" />
            <el-table-column fixed="right" label="操作" min-width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getUserList" /> -->
        </el-row>

      </el-col>
    </el-row>
    <el-dialog :title="testcaseDialog.title" :visible.sync="testcaseDialog.show">
      <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="Drag" width="80">
          <template slot-scope="{}">
            <svg-icon class="drag-handler" icon-class="drag" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="ID" width="65">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" label="接口名">
          <template slot-scope="{row}">
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" label="Path">
          <template slot-scope="{row}">
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="center" label="操作">
          <template slot-scope="{}">
            <el-button type="text">编辑</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="show-d">
        <el-tag>The default order :</el-tag> {{ oldList }}
      </div>
      <div class="show-d">
        <el-tag>The after dragging order :</el-tag> {{ newList }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCatalogTree } from '@/api/http'
import Sortable from 'sortablejs'
import CatalogTree from '@/components/CatalogTree'

export default {
  name: 'TestCase',
  components: { CatalogTree },
  filters: {
  },
  data() {
    return {
      catalogUsed: 2,
      isEdit: 1,
      q: '',
      catalogs: [],
      projectId: parseInt(localStorage.getItem('projectId')),
      list: [
        { 'id': 1, 'author': 'Anthony' },
        { 'id': 2, 'author': 'Helen' },
        { 'id': 3, 'author': 'Kenneth' }],
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: null,
      oldList: [],
      newList: [],
      testcaseDialog: {
        show: false,
        title: '新增'
      }
    }
  },
  created() {
    // this.getList()
    this.getCatalogTree()
  },
  methods: {
    handleCreate() {
      this.getList()
      this.testcaseDialog.show = true
    },
    handleSearch() {
      console.log(1111)
    },
    async getCatalogTree() {
      const params = { project_id: this.projectId, used: this.catalogUsed }
      listCatalogTree(params).then(res => {
        this.catalogs = res.data
      })
    },
    async getList() {
      this.total = 100
      this.listLoading = false
      this.oldList = this.list.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      console.log(el)
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    changeCatalogId() {
      // todu
      console.log('目录改变要做的')
    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
