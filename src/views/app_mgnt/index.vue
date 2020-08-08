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
            <el-button size="mini" type="primary" round>机器</el-button>
            <el-button size="mini" type="primary" round>修改</el-button>
            <el-button size="mini" type="primary" round>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 5px;">
        <el-button size="mini" type="primary" round>增加环境配置</el-button>
      </el-row>
    </div>

    <h3>gs-service test 已安装机器列表</h3>
    <el-table
      :data="machineList"
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
        width="100px"
      >
        <template slot-scope="scope">
          {{ scope.row.status }}<i class="el-icon-refresh-right" style="cursor: pointer" />
        </template>
      </el-table-column>
      <el-table-column
        prop="lastModifiedDate"
        label="更新时间"
        width="100px"
      />
      <el-table-column
        label="操作"
        width="300px"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" round>冻结/激活</el-button>
          <el-button size="mini" type="primary" round>修改</el-button>
          <el-button size="mini" type="primary" round>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 5px;">
      <el-button size="mini" type="primary" round>增加机器</el-button>
    </el-row>
  </div>
</template>

<script>
import { fetchAppList, fetchConfigInfoList } from '@/api/app'
export default {
  name: 'AppMgnt',
  data() {
    return {
      currentAppName: null,
      appList: [],
      appListTest: [{
        name: 'gs-service',
        memo: 'spring boot gs service',
        createdDate: '2020-08-08',
        lastModifiedDate: '2020-08-08'
      }, {
        name: 'gs-service2',
        memo: 'spring boot gs service2',
        createdDate: '2020-08-08',
        lastModifiedDate: '2020-08-08'
      }, {
        name: 'gs-service3',
        memo: 'spring boot gs service3',
        createdDate: '2020-08-08',
        lastModifiedDate: '2020-08-08'
      }],
      envList: [],
      envListTest: [{
        name: 'test',
        config: '{sampleRate=10000, plugin=[http, java-entrance, java-subInvoke]}',
        createdDate: '2020-08-08',
        lastModifiedDate: '2020-08-08'
      }, {
        name: 'release',
        config: '{sampleRate=10000, plugin=[http, java-entrance, java-subInvoke]}',
        createdDate: '2020-08-08',
        lastModifiedDate: '2020-08-08'
      }],
      machineList: [
        {
          ip: '192.168.1.1',
          port: '22',
          username: 'admin',
          password: '****',
          private_rsa_file: '/home/admin/.ssh/id_rsa',
          createdDate: '2020-08-08',
          lastModifiedDate: '2020-08-08',
          status: '已激活'
        },
        {
          ip: '192.168.1.2',
          port: '22',
          username: 'admin',
          password: '****',
          private_rsa_file: '/home/admin/.ssh/id_rsa',
          createdDate: '2020-08-08',
          lastModifiedDate: '2020-08-08',
          status: '已冻结'
        },
        {
          ip: '192.168.1.3',
          port: '22',
          username: 'admin',
          password: '****',
          private_rsa_file: '/home/admin/.ssh/id_rsa',
          createdDate: '2020-08-08',
          lastModifiedDate: '2020-08-08',
          status: '已停止'
        }
      ]
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
      const appId = app.id
      fetchConfigInfoList({ appId }).then(response => {
        // console.log('response:', response)
        this.envList = response
      })
    }

  }
}
</script>
