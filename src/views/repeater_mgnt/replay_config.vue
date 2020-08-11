<template>
  <el-dialog
    title="回放配置"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="true"
    width="30%"
    @close="onClosed"
  >
    <div v-if="recordData">
      <el-form ref="addForm" :model="formData" status-icon class="margin-b10" label-width="120px">
        <el-form-item label="应用名称：" prop="ip">
          {{ formData.appName }}
        </el-form-item>
        <el-form-item label="环境：" prop="environment">
          <el-select v-model="formData.environment" @change="changeEnv">
            <el-option
              v-for="item in envOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="机器：" prop="host">
          <el-select v-model="formData.host">
            <el-option
              v-for="item in Object.keys(hostOptions)"
              :key="item"
              :label="hostOptions[item]"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Mock：" prop="host">
          <el-radio v-model="formData.isMock" :label="true">是</el-radio>
          <el-radio v-model="formData.isMock" :label="false">否</el-radio>
        </el-form-item>

      </el-form>

      <el-row>
        <el-col align="center">
          <el-button type="primary" :loading="loading" size="mini" @click.native="saveRecord">回放</el-button>
          <el-button size="mini" @click.native="onClosed">关闭</el-button>
        </el-col>
      </el-row>

    </div>
  </el-dialog>
</template>

<script>
import { fetchEnv, fetchHost, executeReplay, fetchReplay } from '@/api/repeater'
export default {
  props: {
    formVisible: {
      type: Boolean,
      default: false
    },
    recordData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      formData: {
        appName: null,
        environment: '',
        host: '',
        traceId: '',
        isMock: true
      },
      defaultFormData: {},
      envOptions: [],
      hostOptions: []
    }
  },
  watch: {
    formVisible() {
      this.visible = this.formVisible
      // console.log('this.visible:', this.visible)
      if (this.visible && this.recordData) {
        this.resetRecordData(this.recordData)
      }
    },

    recordData(val) {
      // console.log("###recordData:", val)
      this.resetRecordData(val)
    }

  },
  mounted() {
    // console.log('update module mounted')
  },
  methods: {
    onClosed() {
      this.resetForm()
      this.$emit('update:formVisible', false)
      this.$emit('onSuccess')
    },
    resetForm() {
      this.$refs.addForm.resetFields()
      this.resetRecordData()
    },
    resetRecordData(val) {
      // console.log("###r1:", val)
      if (val && Object.keys(val).length) {
        // console.log("r2:", val)

        this.formData.appName = val.appName
        this.formData.environment = val.environment
        this.formData.traceId = val.traceId
        this.formData.host = null

        fetchEnv({ appName: val.appName }).then(response => {
          // console.log('fetchEnv response:', response)
          this.envOptions = response
          this.changeEnv()
        })
      }
    },
    changeEnv() {
      this.formData.host = null
      fetchHost({ appName: this.formData.appName, env: this.formData.environment }).then(response => {
        this.hostOptions = response
      })
    },
    async saveRecord() {
      this.loading = true
      const param = {
        traceId: this.formData.traceId,
        moduleId: this.formData.host,
        isMock: this.formData.isMock
      }

      let replayResponse = await executeReplay(param)
      // console.log('replayResponse:', replayResponse)
      if (!replayResponse.success) {
        this.$message.error('操作失败')
        return
      }

      let repeatId = replayResponse.data
      let replayFinalResponse
      let replayStatus
      do {
        replayFinalResponse = await fetchReplay({ repeatId })
        replayStatus = replayFinalResponse.data[0].status
        console.log('replayFinalResponse:', replayFinalResponse)
      } while(replayStatus != 'FINISH' && replayStatus != 'FAILED')

      this.loading = false
      this.$message({ message: '操作成功，请到详情中的回访管理查看明细', type: 'success' })
      this.onClosed()

    }
  }
}
</script>

<style scoped>

</style>
