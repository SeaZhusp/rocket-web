<template>
  <div>
    <el-card shadow="never">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="filterText" suffix-icon="el-icon-search" placeholder="关键字过滤" />
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="点击创建根目录，子目录请在节点创建" placement="top-start">
            <el-button type="text" icon="el-icon-folder-add" @click="handleCreate">新增</el-button>
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
        @node-click="handleCatalogClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
          <span>{{ node.label }}</span>
          <span>
            <el-button v-show="data.del" type="text" icon="el-icon-folder-add" @click="handleCreate(node, data)" />
            <el-button v-show="data.del" type="text" icon="el-icon-edit" @click="handleCatalogEdit(node, data)" />
            <el-button v-show="data.del" type="text" icon="el-icon-delete" @click="handleCatalogDelete(node, data)" />
          </span>
        </span>
      </el-tree>
    </el-card>

    <el-dialog :title="catalogDialog.title" :visible.sync="catalogDialog.show" width="20%" @close="cancelCatalog">
      <el-form ref="catalogForm" :model="catalogForm" :rules="catalogFormRules" label-width="55px">
        <el-form-item label="目录" prop="name">
          <el-input v-model="catalogForm.name" placeholder="目录" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCatalog">取 消</el-button>
        <el-button type="primary" :loading="catalogDialog.save" @click="handleSave">{{ catalogDialog.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CatalogTree',
  props: {
    catalogs: {
      type: Array,
      required: true
    },
    projectId: {
      type: Number,
      required: true
    },
    catalogUsed: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      filterText: '',
      catalogForm: {
        id: null,
        name: null,
        used: null,
        project_id: null,
        parent_id: null
      },
      catalogFormRules: {
        name: [
          { required: true, message: '目录名不能为空', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      catalogDialog: {
        show: false,
        title: '新增',
        save: false
      }
    }
  },
  computed: {

  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
  },
  methods: {
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
    handleCreate(node = null, data = null) {
      console.log(this.catalogForm)
      this.catalogDialog.show = true
      this.catalogDialog.create = 1
      this.catalogForm = this.$resetForm(this.catalogForm)
      this.catalogForm.used = this.catalogUsed
      this.catalogForm.project_id = this.projectId
      if (data) {
        this.catalogForm.parent_id = data.id
      }
    },
    handleCatalogEdit(node = null, data) {
      console.log(this.catalogForm)
      this.catalogDialog.show = true
      this.catalogDialog.create = 0
      this.catalogForm.id = data.id
      this.catalogForm.name = data.label
      this.catalogForm.parent_id = data.parent_id
      this.catalogForm.project_id = data.project_id
    },
    async handleCatalogDelete(node = null, data) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        this.$emit('delete', data.id)
      })
    },
    handleCatalogClick(obj, node, data) {
      this.$emit('changeCatalogId', obj)
    },
    handleSave() {
      this.$refs.catalogForm.validate(validate => {
        if (validate) {
          this.catalogDialog.save = true
          if (this.catalogDialog.create === 1) {
            this.$emit('create', this.catalogForm)
          } else {
            this.$emit('update', this.catalogForm)
          }
          this.cancelCatalog()
        }
      })
    },
    cancelCatalog() {
      this.catalogDialog.save = false
      this.catalogDialog.show = false
      this.$refs['catalogForm'].clearValidate()
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
