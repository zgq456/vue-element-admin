<template>
  <div class="app-container">
    <h1>录制回放管理</h1>
    <h3>调用列表</h3>
    <el-table
      :data="recordList"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50"
      />
      <el-table-column
        prop="appName"
        label="应用名称"
      />
      <el-table-column
        prop="entranceDesc"
        label="流量入口"
      />
      <el-table-column
        prop="traceId"
        label="TraceID"
        width="300px"
      />
      <el-table-column
        prop="environment"
        label="环境"
        width="60px"
      />
      <el-table-column
        prop="host"
        label="机器"
        width="100px"
      />
      <el-table-column
        prop="gmtCreate"
        label="创建时间"
        :formatter="formatDate"
        width="150px"
      />

      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" round @click="getRecordDetail(scope.row, scope.$index)">详情</el-button>
          <el-button size="mini" type="primary" round @click="toReplay(scope.row, scope.$index)">回放</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col align="right">
        <el-pagination
          layout="sizes, prev, pager, next"
          size="mini"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20, 30]"
          :total="total"
          @current-change="onPaginationChange"
          @size-change="onPaginationSizeChange"
        />
      </el-col>
    </el-row>

    <div v-if="currentRecordDetail">
      <h3>{{ currentIndex + '.' + currentRecordDetail.appName }}调用信息 时间：{{ formatDate(null, null, currentRecordDetail.gmtCreate) }}</h3>

      <el-tabs v-model="activeName">
        <el-tab-pane label="请求信息" name="first">
          <h4>请求参数</h4>
          <pre>
            <json-viewer
              :value="currentRecordDetail.request"
              :expand-depth="5"
              copyable
              boxed
            />

          </pre>
          <h4>返回结果</h4>
          <pre>
            <json-viewer
              :value="currentRecordDetail.response"
              :expand-depth="5"
              copyable
              boxed
/>
          </pre>
          <h4>子调用信息</h4>
          <pre>
            <json-viewer
              :value="currentRecordDetail.subInvocations"
              :expand-depth="5"
              copyable
              boxed
/>
          </pre>
        </el-tab-pane>
        <el-tab-pane label="回放管理" name="second">
          <el-table
            :data="replayList"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <h3>响应：</h3>
                <json-viewer
                  :value="props.row.response"
                  :expand-depth="5"
                  copyable
                  boxed
                />

                <h3>差异：</h3>
                <json-viewer
                  :value="props.row.differences"
                  :expand-depth="5"
                  copyable
                  boxed
                />

                <h3>mockInvocations：</h3>
                <json-viewer
                  :value="props.row.mockInvocations"
                  :expand-depth="5"
                  copyable
                  boxed
                />
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column
              prop="environment"
              label="环境"
              width="60px"
            />
            <el-table-column
              prop="ip"
              label="机器"
              width="120px"
            />
            <el-table-column
              prop="success"
              label="成功"
              width="120px"
              align="center"
            >
              <template slot-scope="scope">
                <i v-if="scope.row.success" class="el-icon-check" />
                <i v-else class="el-icon-close" />
              </template>
            </el-table-column>
            <el-table-column
              prop="cost"
              label="耗时(ms)"
              width="80px"
            />
            <el-table-column
              prop="gmtCreate"
              label="创建时间"
              :formatter="formatDate"
              width="150px"
            />

          </el-table>

        </el-tab-pane>
      </el-tabs>

    </div>

    <hr>

    <replayConfig
      :form-visible.sync="replayConfigDialogVisible"
      :record-data="currentRecord"
      @onSuccess="reloadReplayData"
    />
  </div>
</template>

<script>
import { fetchRecordList, fetchRecordDetail, fetchReplay, fetchConfigInfoList, fetchModuleInfoList, getModuleStatus, installModule, attachModule, detachModule } from '@/api/repeater'
import replayConfig from './replay_config'

export default {
  name: 'AppMgnt',
  components: { replayConfig },
  data() {
    return {
      activeName: 'first',
      currentRecord: null,
      currentRecordDetail: null,
      replayList: [],

      // ///////////////////////////////////////
      // ///////////////////////////////////////
      // ///////////////////////////////////////

      currentAppName: null,
      currentEnvName: null,
      currentConfig: null,
      currentModule: null,
      recordList: [],
      envList: [],
      moduleList: [],
      replayConfigDialogVisible: false,
      statusDict: {
        'OFFLINE': '已离线',
        'SCRATCH': '未安装',
        'APP_DOWN': '应用未启动',
        'DETACH': 'detached',
        'ACTIVE': 'attached',
        'FROZEN': '已冻结'
      },
      // pagination
      page: 1,
      pageSize: 5,
      total: 0
    }
  },
  mounted() {
    this.loadRecordList()
  },
  methods: {
    onPaginationSizeChange(val) {
      this.pageSize = val
      this.loadRecordList()
    },

    onPaginationChange(val) {
      this.page = val
      this.loadRecordList()
    },
    formatDate(row, column, date) {
      date = new Date(date)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    loadRecordList() {
      this.currentRecordDetail = null
      const param = {
        size: this.pageSize,
        page: this.page - 1
      }
      fetchRecordList(param).then(response => {
        // console.log('response:', response)
        this.recordList = response.data
        this.total = response.count
      })
    },
    loadReplayList(recordId) {
      fetchReplay({ recordId: recordId }).then(response => {
        console.log('replay response:', response)
        this.replayList = response.data
        if (this.replayList) {
          this.replayList.forEach(replay => {
            if (replay.response) {
              replay.response = JSON.parse(replay.response)
            }
          })
        }
      })
    },
    getRecordDetail(record, index) {
      this.currentIndex = index + 1
      this.currentRecord = record

      fetchRecordDetail({ id: record.id }).then(response => {
        // console.log('response:', response)
        const currentRecordDetail = response
        currentRecordDetail.request = JSON.parse(currentRecordDetail.request)
        currentRecordDetail.response = JSON.parse(currentRecordDetail.response)
        currentRecordDetail.subInvocations = JSON.parse(currentRecordDetail.subInvocations)
        this.currentRecordDetail = currentRecordDetail
      })

      this.loadReplayList(record.id)
    },
    toReplay(record, index) {
      this.getRecordDetail(record, index)
      this.replayConfigDialogVisible = true
    },
    reloadReplayData() {
      this.loadReplayList(this.currentRecord.id)
    },

    // ////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////

    showModuleInfoList(config) {
      this.currentConfig = config
      this.currentEnvName = config.environment
      const configId = config.id
      fetchModuleInfoList({ configId }).then(response => {
        // console.log('response:', response)
        this.moduleList = response
      })
    },

    toAddModule(module) {
      this.currentModule = {}
      this.$set(this.currentModule, 'moduleConfigId', this.currentConfig.id)
      this.replayConfigDialogVisible = true
    },

    installSandboxModule(module) {
      this.$set(module, 'loading', true)
      installModule({ id: module.id }).then(response => {
        // console.log('installModule response:', response)
        this.$set(module, 'status', response.status)
        this.$set(module, 'loading', false)
        if (response.success) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    attachSandboxModule(module) {
      this.$set(module, 'loading', true)
      attachModule({ id: module.id }).then(response => {
        // console.log('installModule response:', response)
        this.$set(module, 'status', response.status)
        this.$set(module, 'loading', false)
        if (response.success) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    detachSandboxModule(module) {
      this.$set(module, 'loading', true)
      detachModule({ id: module.id }).then(response => {
        // console.log('installModule response:', response)
        this.$set(module, 'status', response.status)
        this.$set(module, 'loading', false)
        if (response.success) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message.error('操作失败')
        }
      })
    }
  }
}
</script>
