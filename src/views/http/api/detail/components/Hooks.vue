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
        <el-table-column prop="setup_hook" label="setup_hooks">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.setup_hook" :value="scope.row.setup_hook" placeholder="${ setup_hooks function($request, *args, **kwargs) }" />
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template slot-scope="scope">
            <el-row v-show="scope.row === currentRow">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click.native="addTableRow('setup', scope.$index)" />
              <el-button v-show="setupData.length > 1" type="danger" icon="el-icon-delete" size="mini" @click.native="delTableRow('setup', scope.$index)" />
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
        <el-table-column prop="teardown_hook" label="teardown_hooks">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.teardown_hook" :value="scope.row.teardown_hook" placeholder="${ teardown_hooks function($response, *args, **kwargs) }" />
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template slot-scope="scope">
            <el-row v-show="scope.row === currentRow">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click.native="addTableRow('teardown', scope.$index)" />
              <el-button v-show="teardownData.length > 1" type="danger" icon="el-icon-delete" size="mini" @click.native="delTableRow('teardown', scope.$index)" />
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
    setupHooks: {
      type: Object,
      require: false,
      default() {
        return {}
      }
    },
    teardownHooks: {
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
      setupData: [{ setup_hook: '' }],
      teardownData: [{ teardown_hook: '' }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 586
    }
  },
  watch: {
    // save: function() {
    //   this.$emit('hooks', this.parseExtract(), this.tableData)
    // },
    hooks: function() {
      if (this.hooks.setupHooks.length !== 0) {
        this.hooks.setupHooks = this.setupHooks
      }
      if (this.hooks.teardownHooks.length !== 0) {
        this.hooks.teardownHooks = this.teardownHooks
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
    addTableRow(t, index) {
      if (t === 'setup') {
        this.setupData.splice(index + 1, 0, { setup_hook: '' })
      } else {
        this.teardownData.splice(index + 1, 0, { teardown_hook: '' })
      }
    },
    delTableRow(t, index) {
      if (t === 'setup') {
        this.setupData.splice(index, 1)
      } else {
        this.teardownData.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>

</style>
