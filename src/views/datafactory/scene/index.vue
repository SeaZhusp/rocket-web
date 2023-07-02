<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tableTabs"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
        <span slot="label"><svg-icon :icon-class="item.class" /> {{ item.label }}</span>
      </el-tab-pane>
      <div class="app-container">
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form ref="form" size="small" :inline="true" :model="listQuery">
              <el-form-item label="项目: ">
                <el-select v-model="listQuery.project" clearable filterable placeholder="请选择项目" class="groupSelect">
                  <el-option
                    v-for="item in projects"
                    :key="item.id"
                    :label="item.project_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="场景名称: ">
                <el-select
                  v-model="listQuery.case_id"
                  style="width:220px"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入场景名称/描述/负责人"
                  :remote-method="remoteSearch"
                  :loading="searchLoading"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="`${item.group_name}-${item.title}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <div style="float: right;">
                  <el-button icon="el-icon-search" size="small" type="primary" @click="searchCase()">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="small" @click="refresh()">重置</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6">
            <el-form ref="form" size="small" :inline="true" :model="syncProject">
              <el-form-item>
                <el-select v-model="syncProject.id" clearable filterable placeholder="请选择项目" class="groupSelect">
                  <el-option
                    v-for="item in projects"
                    :key="item.id"
                    :label="item.project_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <div style="float: right;">
                  <el-button icon="el-icon-magic-stick" size="small" type="primary" @click="sync()">同步场景</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-empty v-show="lists.length === 0" :description="operationClass(listQuery.show)" />
      </div>
      <el-row :gutter="10">
        <el-col v-for="(item, i) in lists" :key="i" :lg="8" :xl="6" style="padding: 15px;">
          <el-card class="case-card" :body-style="{ padding: '10px' }" shadow="hover">
            <div style="padding: 10px;">
              <div @click="onSelect(item)">
                <div style="width:100%;height:32px;">
                  <div id="left" style="width:75%;line-height:32px;height:32px;float:left;display:table-cell">
                    <span style="color: #409EFF;font-weight: bold">
                      {{ item.title }}
                    </span>
                  </div>
                  <div id="right" style="width:25%;float:left;">
                    <el-tag
                      type="success"
                      disable-transitions
                    >{{ item.group_name }}</el-tag>
                  </div>
                </div>
                <div class="text item">
                  {{ item.description }}
                </div>
                <div class="text item">
                  <div id="owner" style="width:35%;text-align: left;float:left;">
                    {{ '负责人: ' + item.owner }}
                  </div>
                  <div id="updateTime" style="width:65%;text-align: right;float:left;">
                    <span style="color: #409eff">
                      {{ '更新时间: ' + item.update_time }}
                    </span>
                  </div>
                </div>
              </div>
              <div style="width:100%;height:32px;text-align:center">
                <div id="like" style="width:50%;text-align: center;float:left;">
                  <el-button class="myButton" type="text" size="medium" @click="likeSubmit(item.id)"><svg-icon :icon-class="likeClass(item.like)" /></el-button>
                  <span style="font-size: 13px;font-weight: bold">{{ item.like_num }}</span>
                </div>
                <div id="collection" style="width:50%;text-align: center;float:left;">
                  <el-button class="myButton" type="text" size="medium" @click="collectionSubmit(item.id)"><svg-icon :icon-class="collectionClass(item.collection)" /></el-button>
                  <span style="font-size: 13px;font-weight: bold">{{ item.collection_num }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <pagination v-show="total>0" :total="total" :page-sizes="pageSizes" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getCaseList" />
    </el-tabs>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'fullname'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
