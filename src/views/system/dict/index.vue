<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="q" placeholder="输入字典名筛选" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlerCreate">创建字典</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="listLoading" :data="dictList" element-loading-text="Loading" fit highlight-current-row>
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column label="字典名" prop="name" align="center" />
        <el-table-column label="描述" prop="description" align="center" />
        <el-table-column label="编号" prop="code" align="center" />
        <el-table-column label="类型" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.type === 0 ? 'info': 'success'">{{ row.type | typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态" >
          <template slot-scope="{row}">
            <el-select v-model="row.status" placeholder="请选择" style="width:80px" >
                <el-option
                v-for="item in statusList"
                :key="item.type"
                :label="item.name"
                :value="item.type">
                </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" min-width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="handlerEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handlerDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="paging.total > 0" :total="paging.total" :page.sync="paging.page" :limit.sync="paging.limit" @pagination="getDictList" />
    </el-card>

    <el-dialog :title="dialogAttribute.title" :visible.sync="dialogAttribute.show" :close-on-click-modal="false" width="30%">
      <el-form ref="dictForm" :model="dictForm" :rules="dictFormRules" label-width="55px">
        <el-form-item label="字典名" prop="name">
          <el-input v-model="dictForm.name" placeholder="字典名" :disabled="dialogAttribute.create === 0"/>
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input v-model="dictForm.code" placeholder="编号" :disabled="dialogAttribute.create === 0"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="dictForm.type" placeholder="选择类型" clearable style="width:184px">
            <el-option v-for="item in typeList" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" maxlength="200" show-word-limit v-model="dictForm.description" placeholder="描述"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit" >取 消</el-button>
        <el-button type="primary" :loading="dialogAttribute.save" @click="saveSubmit">{{ dialogAttribute.save ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchDict, createDict, deleteDict, updateDict } from '@/api/system/dict'
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
      listLoading: false,
      q: '',
      paging: {
        page: 1,
        limit: 10,
        total: 0
      },
      dialogAttribute: {
        title: '创建字典',
        create: 1,
        show: false,
        save: false
      },
      dictFormRules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        fullname: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      dictForm: {
        id: '',
        name: '',
        code: '',
        type: '',
        status: '',
        description: '',
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
  created() {
    this.getDictList()
  },
  methods: {
    handlerCreate() {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 1
    },
    handlerEdit(row) {
      this.dialogAttribute.show = true
      this.dialogAttribute.create = 0
      this.dialogAttribute.title = '编辑字典'
      this.dictForm.id = row.id
      this.dictForm.name = row.name
      this.dictForm.type = row.type
      this.dictForm.code = row.code
      this.dictForm.description = row.description
      this.dictForm.status = row.status
    },
    async handlerDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(async() => {
        console.log(row.id)
        const { msg } = await deleteUser(row.id)
        this.$message.success(msg)
        await this.getDictList()
      }).catch(() => {
      })
    },
    async handleCurrentChange(val) {
      this.paging.page = val
      await this.getDictList()
    },
    async handleSearch() {
      this.paging.page = 1
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
        }
      })
    },
    update() {
      updateUser(this.dictForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        console.log(error)
        this.$message.error(error.response.data['message'])
      }).finally(() => {
        this.cancelSubmit()
        this.getDictList()
      })
    },
    create() {
      createDict(this.dictForm).then(res => {
        this.$message.success(res.msg)
      }).catch(error => {
        console.log(error)
        this.$message.error(error.response.data['message'])
      }).finally(() => {
        this.cancelSubmit()
        this.getDictList()
      })
    },
    cancelSubmit() {
      // 等页面刷新完之后，再执行回调函数中的方法，因为this.dialogFrom = false 它是异步的
      this.$nextTick(() => {
        this.dialogAttribute.save = false
        this.dialogAttribute.show = false
        this.$refs['dictForm'].clearValidate() 
        for (let key in this.dictForm) {
          this.dictForm[key] = ''
        }
        // this.$refs['dictForm'].resetFields()
      })
    }
  }
}
</script>
