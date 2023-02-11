<template>
  <el-row>
    <el-col :span="11">
      <el-table
        highlight-current-row
        strpe
        :height="height"
        :data="setupData"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column prop="setup_hooks" label="setup_hooks">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.setup_hooks" :value="scope.row.setup_hooks" placeholder="${ setup_hooks function($request, *args, **kwargs) }" />
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
    </el-col>
    <el-col :span="11" style="margin-left:20px">
      <el-table
        highlight-current-row
        strpe
        :height="height"
        :data="teardownData"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column prop="teardown_hooks" label="teardown_hooks">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.teardown_hooks" :value="scope.row.teardown_hooks" placeholder="${ teardown_hooks function($response, *args, **kwargs) }" />
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
    </el-col>
  </el-row>

</template>

<script>

export default {
  name: 'Hooks',
  props: {
    save: Boolean,
    hooks: {
      type: Object,
      require: false,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentRow: '',
      setupData: [{ setup_hooks: '' }],
      teardownData: [{ teardown_hooks: '' }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 540
    }
  },
  watch: {
    save: function() {
      this.$emit('extract', this.parseExtract(), this.tableData)
    },
    extract: function() {
      if (this.extract.length !== 0) {
        this.tableData = this.extract
      }
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
      this.tableData.splice(index + 1, 0, { key: '', value: '', desc: '' })
    },
    delTableRow(index) {
      this.tableData.splice(index, 1)
    },
    // 抽取格式化
    parseExtract() {
      const extract = []
      for (const content of this.tableData) {
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
