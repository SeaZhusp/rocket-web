<template>
  <el-row>
    <el-col :span="11">
      <el-table
        highlight-current-row
        strpe
        :height="height"
        :data="setupTableData"
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
              <el-button v-show="setupTableData.length > 1" type="danger" icon="el-icon-delete" size="mini" @click.native="delTableRow('setup', scope.$index)" />
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
        :data="teardownTableData"
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
              <el-button v-show="teardownTableData.length > 1" type="danger" icon="el-icon-delete" size="mini" @click.native="delTableRow('teardown', scope.$index)" />
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
      setupTableData: this.hooks.setup_hooks,
      teardownTableData: this.hooks.teardown_hooks
    }
  },
  computed: {
    height() {
      return window.screen.height - 586
    }
  },
  watch: {
    save: function() {
      this.$emit('hooks', this.parseHooks())
    },
    hooks: function() {
      this.setupTableData = this.hooks.setup_hooks
      this.teardownTableData = this.hooks.teardown_hooks
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
        this.setupTableData.splice(index + 1, 0, { setup_hook: '' })
      } else {
        this.teardownTableData.splice(index + 1, 0, { teardown_hook: '' })
      }
    },
    delTableRow(t, index) {
      if (t === 'setup') {
        this.setupTableData.splice(index, 1)
      } else {
        this.teardownTableData.splice(index, 1)
      }
    },
    parseHooks() {
      const setups = []
      const teardowns = []
      for (const content of this.setupTableData) {
        const setup = content['setup_hook']
        if (setup !== '') {
          const obj = {}
          obj['setup_hook'] = setup
          setups.push(obj)
        }
      }
      for (const content of this.teardownTableData) {
        const teardown = content['teardown_hook']
        if (teardown !== '') {
          const obj = {}
          obj['teardown_hook'] = teardown
          teardowns.push(obj)
        }
      }
      return { setup_hooks: setups, teardown_hooks: teardowns }
    }
  }
}
</script>

<style scoped>

</style>
