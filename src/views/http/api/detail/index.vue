<template>
  <el-card shadow="nerer">
    <el-row>
      <el-form :inline="true" label-width="70px">
        <el-form-item label="名称">
          <el-input placeholder="用例名称" class="custom-form-item" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="apiForm.level" placeholder="优先级" class="custom-form-item">
            <el-option v-for="item in levelOptions" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="apiForm.level" placeholder="请选优先级" class="custom-form-item">
            <el-option v-for="item in levelOptions" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="apiForm.tag"
            multiple
            filterable
            allow-create
            remote
            placeholder="请选择文章标签"
            class="custom-form-item"
          >
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" placeholder="描述" class="custom-form-item" />
        </el-form-item>
      </el-form>
    </el-row>
    <el-form>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item label="Service">
            <el-select v-model="apiForm.method" style="width: 140px" placeholder="Service">
              <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="17">
          <el-form-item prop="path">
            <el-input v-model="apiForm.path" placeholder="Enter request PATH">
              <el-select slot="prepend" v-model="apiForm.method" size="medium" style="width: 100px" placeholder="Method">
                <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" :loading="this.saveRunStatus" @click.native="saveAndRun()">调试</el-button>
            <el-button type="primary" @click.native="addApiMsg()" style="margin-left:10px">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Params" name="first">数据管理</el-tab-pane>
      <el-tab-pane label="Headers" name="second">前置条件</el-tab-pane>
      <el-tab-pane label="Body" name="third">接口请求</el-tab-pane>
      <el-tab-pane label="提取参数" name="fourth">参数提取</el-tab-pane>
      <el-tab-pane label="断言" name="fourth">断言</el-tab-pane>
      <el-tab-pane label="断言" name="fourth">后置条件</el-tab-pane>
    </el-tabs>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Params" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="Headers" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="Body" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="提取参数" name="fourth">定时任务补偿</el-tab-pane>
      <el-tab-pane label="断言" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
    <span>我来啦!</span>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userList: null,
      listLoading: false,
      projects: [],
      projectId: '',
      q: '',
      methodOptions: ['POST', 'GET', 'PUT', 'DELETE'],
      apiForm: {
        level: null,
        path: '',
        method: '',
        tag: ''
      },
      levelOptions: [
        {
          value: 0,
          label: '冒烟测试'
        },
        { value: 1,
          label: '系统测试'
        }
      ],
      tagOptions: [
        {
          type: 0,
          name: 'P0'
        },
        { type: 1,
          name: 'P1'
        },
        { type: 2,
          name: 'P2'
        }
      ]
    }
  },
  watch: {

  },
  created() {

  },
  methods: {
  }
}
</script>

<style scoped>
.custom-form-item {
    width: 330px;
  }
</style>
