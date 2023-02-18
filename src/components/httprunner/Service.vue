<template>
  <el-table
    highlight-current-row
    strpe
    :height="height"
    :data="tableData"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
  >
    <el-table-column prop="service" label="微服务" width="150">
      <template slot-scope="scope">
        <el-select v-model="scope.row.key" style="width: 140px" filterable placeholder="Service">
          <el-option v-for="item in serviceOptions" :key="item.value" :label="item.value" :value="item.value" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="value" label="域名" width="430">
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" placeholder="domain" style="width:420px" />
      </template>
    </el-table-column>
    <el-table-column prop="desc" label="描述">
      <template slot-scope="scope">
        <el-input v-model.trim="scope.row.desc" :value="scope.row.desc" placeholder="描述" />
      </template>
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-row v-show="scope.row === currentRow">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click.native="addTableRow(scope.$index)" />
          <el-button v-show="tableData.length > 1" type="danger" icon="el-icon-delete" size="mini" @click.native="delTableRow(scope.$index)" />
        </el-row>
      </template>
    </el-table-column>
    <template slot="empty">
      <el-button type="text" icon="el-icon-plus" @click="addTableRow(0)">添加一行数据</el-button>
    </template>
  </el-table>
</template>

<script>

export default {
  name: 'Service',
  props: {
    service: {
      type: Array,
      require: false,
      default() {
        return []
      }
    },
    customHeight: {
      type: Number,
      require: false,
      default() { return 586 }
    }
  },
  data() {
    return {
      currentRow: '',
      tableData: this.service,
      serviceOptions: JSON.parse(localStorage.getItem('dicts'))['http_service'] || []
    }
  },
  computed: {
    height() {
      return window.screen.height - this.customHeight
    }
  },
  watch: {
    service: function() {
      this.tableData = this.service
    }
  },
  created() {

  },
  methods: {
    cellMouseEnter(row) {
      this.currentRow = row
    },

    cellMouseLeave(row) {
      this.currentRow = ''
    },
    addTableRow(index) {
      this.tableData.splice(index + 1, 0, { key: '', value: '', desc: '' })
    },
    delTableRow(index) {
      this.tableData.splice(index, 1)
    },
    // 抽取格式化
    parseService() {
      const service = []
      for (const content of this.tableData) {
        const key = content['key']
        const value = content['value']
        const desc = content['desc']
        if (key !== '' && value !== '') {
          const obj = {}
          obj['key'] = key
          obj['value'] = value
          obj['desc'] = desc
          service.push(obj)
        }
      }
      return service
    }
  }
}
</script>

<style scoped>

</style>
