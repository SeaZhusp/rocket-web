<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="当前项目" prop="projectId">
        <el-select v-model="projectId" placeholder="请选择" filterable>
          <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <i class="el-icon-info" style="color:#909399"> 请先选择一个项目，然后开始吧-.- | 新增前记得先选目录后~.~ </i>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="4.1">
        <CatalogTree
          :catalogs="catalogs"
          :project-id="projectId"
          @create="createCatalogSubmit"
          @update="updateCatalogSubmit"
          @delete="deleteCatalogSubmit"
          @changeCatalogId="changeCatalogId"
          @getCatalogTree="getCatalogTree"
        />
      </el-col>
      <el-col>
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
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { get } from '@/api/http'
import Sortable from 'sortablejs'

export default {
  name: 'DragTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
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
      newList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
