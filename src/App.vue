<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>
.draw-btn-right {
    position: absolute;
    right: 0px;
    padding: 10px;
}
.custom-form-item {
    width: 330px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 11px;
}
.el-drawer__body {
  overflow: auto;
}
</style>
