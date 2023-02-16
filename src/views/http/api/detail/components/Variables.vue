<template>
  <el-table
    highlight-current-row
    strpe
    :height="height"
    :data="tableData"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
  >
    <el-table-column prop="key" label="变量名">
      <template slot-scope="scope">
        <el-input v-model.trim="scope.row.key" :value="scope.row.key" placeholder="变量名" />
      </template>
    </el-table-column>
    <el-table-column label="类型" width="120">
      <template slot-scope="scope">
        <el-select v-model="scope.row.type">
          <el-option
            v-for="item in dataTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="value" label="变量值">
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" placeholder="变量值" />
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
  name: 'Variables',
  props: {
    // save: Boolean,
    variables: {
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
      tableData: this.variables,
      dataTypeOptions: [{
        label: 'String',
        value: 1
      }, {
        label: 'Integer',
        value: 2
      }, {
        label: 'Float',
        value: 3
      }, {
        label: 'Boolean',
        value: 4
      }, {
        label: 'List',
        value: 5
      }, {
        label: 'Dict',
        value: 6
      }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 586
    }
  },
  watch: {
    variables: function() {
      this.tableData = this.variables
    }
  },
  methods: {
    cellMouseEnter(row) {
      this.currentRow = row
    },

    cellMouseLeave(row) {
      this.currentRow = ''
    },
    addTableRow(index) {
      this.tableData.splice(index + 1, 0, { key: '', type: 1, value: '', desc: '' })
    },
    delTableRow(index) {
      this.tableData.splice(index, 1)
    },
    // 类型转换
    parseType(type, value) {
      let tempValue
      const msg = value + ' => ' + this.dataTypeOptions[type - 1].label + ' 转换异常, 该数据自动剔除'
      switch (type) {
        case 1:
          tempValue = value
          break
        case 2:
          // 包含$是引用类型,可以任意类型
          if (value.indexOf('$') !== -1) {
            tempValue = value
          } else {
            tempValue = parseInt(value)
          }
          break
        case 3:
          tempValue = parseFloat(value)
          break
        case 4:
          if (value === 'False' || value === 'True') {
            const bool = {
              'True': true,
              'False': false
            }
            tempValue = bool[value]
          } else {
            this.$notify.error({
              title: '类型转换错误',
              message: msg,
              duration: 2000
            })
            return 'exception'
          }
          break
        case 5:
        case 6:
          try {
            // tempValue = JSON.parse(value)
            tempValue = value
          } catch (err) {
            // 包含$是引用类型,可以任意类型
            if (value.indexOf('$') !== -1) {
              tempValue = value
            } else {
              tempValue = false
            }
          }
          break
      }
      if (tempValue !== 0 && !tempValue && type !== 4 && type !== 1) {
        this.$notify.error({
          title: '类型转换错误',
          message: msg,
          duration: 2000
        })
        return 'exception'
      }
      return tempValue
    },
    // 变量格式化variables
    parseVariables() {
      const variables = []
      for (const content of this.tableData) {
        const key = content['key']
        const type = content['type']
        const desc = content['desc']
        if (key !== '') {
          const obj = {}
          const value = this.parseType(type, content['value'])
          if (value === 'exception') {
            continue
          }
          obj['key'] = key
          obj['type'] = type
          obj['value'] = value
          obj['desc'] = desc
          variables.push(obj)
        }
      }
      return variables
    }
  }
}
</script>

<style scoped>

</style>
