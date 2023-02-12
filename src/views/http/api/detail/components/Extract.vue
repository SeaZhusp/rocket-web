<template>
  <el-table
    highlight-current-row
    strpe
    :height="height"
    :data="extract"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
  >
    <el-table-column prop="key" label="变量名">
      <template slot-scope="scope">
        <el-input v-model.trim="scope.row.key" :value="scope.row.key" placeholder="变量名" />
      </template>
    </el-table-column>
    <el-table-column prop="value" label="表达式">
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" placeholder="表达式" />
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
          <el-button v-show="extract.length > 1" type="danger" icon="el-icon-delete" size="mini" @click.native="delTableRow(scope.$index)" />
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  name: 'Extract',
  props: {
    save: Boolean,
    extract: {
      type: Array,
      require: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentRow: ''
    }
  },
  computed: {
    height() {
      return window.screen.height - 586
    }
  },
  watch: {
    save: function() {
      this.$emit('extract', this.parseExtract(), this.extract)
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
      this.extract.splice(index + 1, 0, { key: '', value: '', desc: '' })
    },
    delTableRow(index) {
      this.extract.splice(index, 1)
    },
    // 抽取格式化
    parseExtract() {
      const extract = []
      for (const content of this.extract) {
        const key = content['key']
        const value = content['value']
        const desc = content['desc']
        if (key !== '' && value !== '') {
          const obj = {}
          obj['key'] = key
          obj['value'] = value
          obj['desc'] = desc
          extract.push(obj)
        }
      }
      return extract
    }
  }
}
</script>

<style scoped>

</style>
