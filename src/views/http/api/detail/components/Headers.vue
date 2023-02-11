<template>
  <el-table
    highlight-current-row
    strpe
    :height="height"
    :data="tableData"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
  >
    <el-table-column prop="key" label="请求头标签">
      <template slot-scope="scope">
        <el-autocomplete
          v-model="scope.row.key"
          :fetch-suggestions="queryKeySearch"
          placeholder="请求头标签"
          style="width:320px"
        />
      </template>
    </el-table-column>
    <el-table-column prop="value" label="请求头内容">
      <template slot-scope="scope">
        <el-autocomplete
          v-model="scope.row.value"
          :fetch-suggestions="queryValueSearch"
          placeholder="请求头内容"
          style="width:320px"
        />
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
  </el-table>
</template>

<script>

export default {
  name: 'Headers',
  props: {
    save: Boolean,
    headers: {
      type: Array,
      require: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentRow: '',
      tableData: [{ key: '', value: '', desc: '' }],
      headerKeyOptions: [{
        value: 'Content-Type'
      }, {
        value: 'source'
      }, {
        value: 'token'
      }, {
        value: 'Host'
      }, {
        value: 'Origin'
      }, {
        value: 'Referer'
      }, {
        value: 'User-Agent'
      }],
      headerValueOptions: [{
        value: 'application/json'
      }, {
        value: '501'
      }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 586
    }
  },
  watch: {
    save: function() {
      this.$emit('headers', this.parseHeaders(), this.tableData)
    },
    headers: function() {
      if (this.headers.length !== 0) {
        this.tableData = this.headers
      }
    }
  },
  methods: {
    queryKeySearch(queryString, cb) {
      const keyOptions = this.headerKeyOptions
      const results = queryString ? keyOptions.filter(this.createFilter(queryString)) : keyOptions
      cb(results)
    },
    queryValueSearch(queryString, cb) {
      const valueOptions = this.headerValueOptions
      const results = queryString ? valueOptions.filter(this.createFilter(queryString)) : valueOptions
      cb(results)
    },
    createFilter(queryString) {
      return (options) => {
        return (options.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
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

    // 头部信息格式化
    parseHeaders() {
      const headers = []
      for (const content of this.tableData) {
        const key = content['key']
        const value = content['value']
        const desc = content['desc']
        if (key !== '' && value !== '') {
          const obj = {}
          obj['key'] = key
          obj['value'] = value
          obj['desc'] = desc
          headers.push(obj)
        }
      }
      return headers
    }
  }
}
</script>

<style scoped>

</style>
