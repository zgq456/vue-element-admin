<template>
  <div class="app-container">
    <h1>配置管理</h1>
    <h3>应用列表</h3>
    <el-table
      :data="appList"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="应用名称"
      />
      <el-table-column
        prop="memo"
        label="备注"
      />
      <el-table-column
        prop="gmtCreate"
        label="创建时间"
        :formatter="formatDate"
      />
      <el-table-column
        prop="gmtModified"
        label="更新时间"
        :formatter="formatDate"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" round @click="showModuleConfigList(scope.row)">环境</el-button>
          <el-button size="mini" type="primary" round>修改</el-button>
          <el-button size="mini" type="primary" round>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 5px;">
      <el-button size="mini" type="primary" round>增加应用</el-button>
    </el-row>

    <div v-if="currentAppName">
      <h3>{{ currentAppName }} 环境配置列表</h3>
      <el-table
        :data="envList"
        style="width: 100%"
      >
        <el-table-column
          prop="environment"
          label="环境"
          width="100px"
        />
        <el-table-column
          prop="config"
          label="配置信息"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.config">'{sampleRate=10000, plugin=[http, java-entrance, java-subInvoke]}'</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          width="100px"
          :formatter="formatDate"
        />
        <el-table-column
          prop="gmtModified"
          label="更新时间"
          width="100px"
          :formatter="formatDate"
        />
        <el-table-column
          label="操作"
          width="250px"
        >
          <template slot-scope="scope">
            <!--          <el-button size="mini" type="primary" round >推送</el-button> 修改后提示推送-->
            <el-button size="mini" type="primary" round @click="showModuleInfoList(scope.row)">机器</el-button>
            <el-button size="mini" type="primary" round>修改</el-button>
            <el-button size="mini" type="primary" round>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 5px;">
        <el-button size="mini" type="primary" round>增加环境配置</el-button>
      </el-row>
    </div>

    <div v-if="currentAppName && currentEnvName">
      <h3>{{ currentAppName }} {{ currentEnvName }} 已安装机器列表</h3>
      <el-table
        :data="moduleList"
        style="width: 100%"
      >
        <el-table-column
          prop="ip"
          label="IP"
          width="150px"
        />
        <el-table-column
          prop="port"
          label="port"
          width="100px"
        />
        <el-table-column
          prop="username"
          label="用户名"
          width="100px"
        />
        <el-table-column
          prop="password"
          label="密码"
          width="100px"
        />
        <el-table-column
          prop="private_rsa_file"
          label="密钥文件"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="120px"
        >
          <template slot-scope="scope">
            {{ scope.row.status }}<i class="el-icon-refresh-right" style="cursor: pointer" />
          </template>
        </el-table-column>
        <el-table-column
          prop="gmtModified"
          label="更新时间"
          width="100px"
          :formatter="formatDate"
        />
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" round>安装/冻结/激活</el-button>
            <el-button size="mini" type="primary" round @click="toUpdateModule(scope.row)">修改</el-button>
            <el-button size="mini" type="primary" round>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 5px;">
        <el-button size="mini" type="primary" round @click="toAddModule">增加机器</el-button>
      </el-row>
    </div>

    <updateModule
      :form-visible.sync="updateModuleDialogVisible"
      :record-data="currentModule"
      @onSuccess="reloadModuleData"
    />
  </div>
</template>

<script>
import { fetchAppList, fetchConfigInfoList, fetchModuleInfoList } from '@/api/repeater'
import updateModule from './update_module'

export default {
  name: 'AppMgnt',
  components: { updateModule },
  data() {
    return {
      currentAppName: null,
      currentEnvName: null,
      currentConfig: null,
      currentModule: null,
      appList: [],
      envList: [],
      moduleList: [],
      updateModuleDialogVisible: false

    }
  },
  mounted() {
    this.loadAppList()
  },
  methods: {
    formatDate(row, column, date) {
      date = new Date(date)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    },
    loadAppList() {
      fetchAppList().then(response => {
        // console.log('response:', response)
        this.appList = response.data
      })
    },
    showModuleConfigList(app) {
      this.currentAppName = app.name
      this.currentConfig = null
      this.currentEnvName = null
      const appId = app.id
      fetchConfigInfoList({ appId }).then(response => {
        // console.log('response:', response)
        this.envList = response
      })
    },
    showModuleInfoList(config) {
      this.currentConfig = config
      this.currentEnvName = config.environment
      const configId = config.id
      fetchModuleInfoList({ configId }).then(response => {
        // console.log('response:', response)
        this.moduleList = response
      })
    },
    toUpdateModule(module) {
      this.currentModule = module
      this.$set(this.currentModule, 'moduleConfigId', this.currentConfig.id)
      this.updateModuleDialogVisible = true
    },
    toAddModule(module) {
      this.currentModule = {}
      this.$set(this.currentModule, 'moduleConfigId', this.currentConfig.id)
      this.updateModuleDialogVisible = true
    },
    reloadModuleData() {
      this.showModuleInfoList(this.currentConfig)
    }
  }
}
</script>
