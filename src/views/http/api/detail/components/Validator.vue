<template>
  <el-table
    highlight-current-row
    strpe
    :height="height"
    :data="tableData"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
  >
    <el-table-column prop="actual" label="实际返回" width="240">
      <template slot-scope="scope">
        <el-input v-model="scope.row.actual" placeholder="实际返回" />
      </template>
    </el-table-column>
    <el-table-column prop="comparator" label="断言类型" width="250">
      <template slot-scope="scope">
        <el-autocomplete
          v-model="scope.row.comparator"
          :fetch-suggestions="querySearch"
          placeholder="断言类型"
          style="width:240px"
        />
      </template>
    </el-table-column>
    <el-table-column prop="type" label="数据类型" width="120">
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
    <el-table-column prop="expect" label="期望返回" width="240">
      <template slot-scope="scope">
        <el-input v-model="scope.row.expect" placeholder="期望返回" />
      </template>
    </el-table-column>
    <el-table-column prop="desc" label="描述">
      <template slot-scope="scope">
        <el-input v-model="scope.row.desc" placeholder="描述" />
      </template>
    </el-table-column>
    <el-table-column width="120">
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
  name: 'Validator',
  props: {
    save: Boolean,
    validator: {
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
      tableData: this.validator,
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
      }],
      validatorOptions: [{
        value: 'equals'
      }, {
        value: 'less_than'
      }, {
        value: 'less_than_or_equals'
      }, {
        value: 'greater_than'
      }, {
        value: 'greater_than_or_equals'
      }, {
        value: 'not_equals'
      }, {
        value: 'string_equals'
      }, {
        value: 'length_equals'
      }, {
        value: 'length_greater_than'
      }, {
        value: 'length_greater_than_or_equals'
      }, {
        value: 'length_less_than'
      }, {
        value: 'length_less_than_or_equals'
      }, {
        value: 'contains'
      }, {
        value: 'contained_by'
      }, {
        value: 'type_match'
      }, {
        value: 'regex_match'
      }, {
        value: 'startswith'
      }, {
        value: 'endswith'
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
      this.$emit('validator', this.parseValidator())
    },
    validator: function() {
      this.tableData = this.validator
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
      this.tableData.splice(index + 1, 0, { actual: '', comparator: 'equals', type: 1, expect: '', desc: '' })
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
          if (value === 'false' || value === 'true') {
            const bool = {
              'true': true,
              'false': false
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
            tempValue = JSON.parse(value)
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

    parseValidator() {
      const validator = []
      for (const content of this.tableData) {
        const actual = content['actual']
        const comparator = content['comparator']
        const type = content['type']
        const desc = content['desc']
        if (actual !== '') {
          const obj = {}
          const expect = this.parseType(content['type'], content['expect'])
          if (expect === 'exception') {
            continue
          }
          obj['actual'] = actual
          obj['comparator'] = comparator
          obj['type'] = type
          obj['expect'] = expect
          obj['desc'] = desc
          validator.push(obj)
        }
      }
      return validator
    },
    querySearch(queryString, cb) {
      const validatorOptions = this.validatorOptions
      const results = queryString ? validatorOptions.filter(this.createFilter(queryString)) : validatorOptions
      cb(results)
    },
    createFilter(queryString) {
      return (validatorOptions) => {
        return (validatorOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }
  }
}
</script>

<style scoped>

</style>
