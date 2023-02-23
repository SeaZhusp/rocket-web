<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="q" placeholder="输入字典名筛选" @keyup.enter.native="handleSearch" />
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
      <el-table v-loading="listLoading" :data="dictList" element-loading-text="Loading">
        <el-table-column label="序号" type="index" width="55" />
        <el-table-column label="编号" prop="code" />
        <el-table-column label="字典名" prop="name" />
        <el-table-column label="类型">
          <template slot-scope="{row}">
            <el-tag :type="row.type === 0 ? 'warning': 'success'">{{ row.type | typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="{row}">
            <el-select v-model="row.status" placeholder="请选择" style="width:80px" @change="selectChange(row)">
              <el-option
                v-for="item in statusList"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" />
        <el-table-column label="更新时间" prop="update_time" />
        <el-table-column fixed="right" label="操作" min-width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            <el-button type="text" @click="handleSetting(scope.row)">配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getDictList" />
    </el-row>

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" width="30%" @close="cancelSubmit">
      <el-form ref="dictForm" :model="dictForm" :rules="dictFormRules" label-width="55px">
        <el-form-item label="字典名称" prop="name" label-width="80px">
          <el-input v-model="dictForm.name" placeholder="字典名称" />
        </el-form-item>
        <el-form-item label="字典编号" prop="code" label-width="80px">
          <el-input v-model="dictForm.code" placeholder="字典编号" :disabled="dialogAttribute.create === 0" />
        </el-form-item>
        <el-form-item label="类型" prop="type" label-width="80px">
          <el-select v-model="dictForm.type" placeholder="选择类型" :disabled="dialogAttribute.create === 0" clearable style="width:184px">
            <el-option v-for="item in typeList" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description" label-width="80px">
          <el-input v-model="dictForm.description" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="200" show-word-limit placeholder="描述" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" :loading="dialogAttribute.save" @click="saveSubmit">{{ dialogAttribute.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>

    <el-drawer title="字典配置" :visible.sync="drawerAttribute.show" direction="rtl" size="40%">
      <div style="margin-left:20px;margin-right:20px">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" @click="handerDictItemCreate">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="点击后刷新" placement="top-start">
              <el-button icon="el-icon-refresh" @click="handleItemSearch" />
            </el-tooltip>
          </el-form-item>
        </el-form>

        <el-table v-loading="listItemLoading" :data="dictItemList" element-loading-text="Loading" :height="height">
          <el-table-column label="Label" prop="label" />
          <el-table-column label="Value" prop="value" />
          <el-table-column label="排序" prop="sort" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="{row}">
              <el-select v-model="row.status" placeholder="请选择" style="width:80px" @change="selectItemChange(row)">
                <el-option
                  v-for="item in statusList"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="80px">
            <template slot-scope="scope">
              <el-button type="text" @click="handleItemEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleItemDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <el-dialog :title="dialogItemAttribute.title" :visible.sync="dialogItemAttribute.show" width="30%" @close="cancelSubmit">
      <el-form ref="dictItemForm" :model="dictItemForm" :rules="dictItemFormRules" label-width="55px">
        <el-form-item label="Label" prop="label" label-width="80px">
          <el-input v-model="dictItemForm.label" placeholder="Label" />
        </el-form-item>
        <el-form-item label="Value" prop="value" label-width="80px">
          <el-input v-model="dictItemForm.value" placeholder="Value" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" label-width="80px">
          <el-input-number v-model="dictItemForm.sort" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelItemSubmit">取 消</el-button>
        <el-button type="primary" :loading="dialogItemAttribute.save" @click="saveItemSubmit">{{ dialogItemAttribute.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { searchDict, createDict, deleteDict, updateDict,
  createDictItem, searchDictItem, updateItemDict, deleteItemDict } from '@/api/system'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    typeName(type) {
      const statusMap = {
        0: 'string',
        1: 'number'
      }
      return statusMap[type]
    }
  },
  data() {
    return {
      dictList: null,
      dictItemList: null,
      listLoading: false,
      listItemLoading: false,
      q: '',
      dictSetId: '',
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      drawerAttribute: {
        show: false
      },
      dialogItemAttribute: {
        show: false,
        title: '新增',
        create: 1,
        save: false
      },
      dialogAttribute: {
        title: '新增',
        create: 1,
        show: false,
        save: false
      },
      dictFormRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ]
      },
      dictItemFormRules: {
        label: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ]
      },
      dictForm: {
        id: '',
        dict_id: '',
        name: '',
        code: '',
        type: '',
        status: '',
        description: ''
      },
      dictItemForm: {
        id: '',
        label: '',
        dict_id: '',
        value: '',
        sort: '',
        status: ''
      },
      statusList: [
        {
          type: 1,
          name: '启用'
        },
        { type: 0,
          name: '禁用'
        }
      ],
      typeList: [
        {
          type: 0,
          name: 'string'
        },
        { type: 1,
          name: 'number'
        }
      ]
    }
  },
  computed: {
    height() {
      return window.screen.height - 365
    }
  },
  created() {
    this.getDictList()
  },
  methods: {
    handleSetting(row) {
      this.drawerAttribute.show = true
      this.dictSetId = row.id
      this.getDictItemList()
    },
    async handleCurrentChange(val) {
      this.paging.page = val
      await this.getDictList()
    },
    async handleSearch() {
      this.paging.page = 1
      await this.getDictList()
    },
    // DictItem
    handerDictItemCreate() {
      this.dialogItemAttribute.show = true
      this.dictItemForm = this.$resetForm(this.dictItemForm)
      this.dictItemForm.dict_id = this.dictSetId
      this.dialogItemAttribute.create = 1
    },
    handleItemEdit(row) {
      this.dialogItemAttribute.show = true
      this.dialogItemAttribute.create = 0
      this.dialogItemAttribute.title = '编辑'
      this.dictItemForm.id = row.id
      this.dictItemForm.dict_id = row.dict_id
      this.dictItemForm.label = row.label
      this.dictItemForm.value = row.value
      this.dictItemForm.sort = row.sort
      this.dictItemForm.dict_id = row.dict_id
      this.dictItemForm.status = row.status
    },
    async selectItemChange(row) {
      const { msg } = await updateItemDict(row)
      this.$message.success(msg)
      await this.getDictItemList()
    },
    async handleItemSearch() {
      this.getDictItemList()
    },
    async getDictItemList() {
      this.itemListLoading = true
      const params = {
        search: this.dictSetId
      }
      await searchDictItem(params).then(response => {
        this.dictItemList = response.data
        this.itemListLoading = false
      })
    },
    saveItemSubmit() {
      this.$refs.dictItemForm.validate(validate => {
        if (validate) {
          this.dialogItemAttribute.save = true
          if (this.dialogItemAttribute.create === 1) {
            this.createItem()
          } else {
            this.updateItem()
          }
          this.cancelItemSubmit()
          this.getDictItemList()
        }
      })
    },
    updateItem() {
      updateItemDict(this.dictItemForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    createItem() {
      createDictItem(this.dictItemForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    cancelItemSubmit() {
      this.dialogItemAttribute.save = false
      this.dialogItemAttribute.show = false
      this.$refs['dictItemForm'].clearValidate()
    },
    async handleItemDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteItemDict(row.id)
        this.$message.success(msg)
        await this.getDictItemList()
      })
    },
    // Dict
    handleCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
      this.dictForm = this.$resetForm(this.dictForm)
    },
    handleEdit(row) {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 0
      this.dialogAttribute.title = '编辑'
      this.dictForm.id = row.id
      this.dictForm.name = row.name
      this.dictForm.type = row.type
      this.dictForm.code = row.code
      this.dictForm.description = row.description
      this.dictForm.status = row.status
    },
    async selectChange(row) {
      const { msg } = await updateDict(row)
      this.$message.success(msg)
      await this.getDictList()
    },
    async getDictList() {
      this.listLoading = true
      const params = {
        page: this.paging.page,
        limit: this.paging.limit,
        search: this.q
      }
      await searchDict(params).then(response => {
        this.dictList = response.data
        this.paging = response.paging
        this.listLoading = false
      })
    },
    saveSubmit() {
      this.$refs.dictForm.validate(validate => {
        if (validate) {
          this.dialogAttribute.save = true
          if (this.dialogAttribute.create === 1) {
            this.create()
          } else {
            this.update()
          }
          this.cancelSubmit()
          this.getDictList()
        }
      })
    },
    update() {
      updateDict(this.dictForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    create() {
      createDict(this.dictForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        this.$message.error(error.response.data['message'])
      })
    },
    cancelSubmit() {
      this.dialogAttribute.save = false
      this.dialogAttribute.show = false
      this.$refs['dictForm'].clearValidate()
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
        await this.getDictList()
      })
    }
  }
}
</script>
