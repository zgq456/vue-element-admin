<template>
  <el-dialog
    :title="onUpdate ? '编辑' : '新增'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="true"
    width="80%"
    @close="onClosed"
  >
    <div>
      recordData:{{ recordData }}
      <el-form ref="addForm" :model="formData" status-icon class="margin-b10" label-width="120px">
        <el-form-item label="环境：" prop="environment">
          <el-input v-model="formData.environment" size="mini" :maxlength="40" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="配置信息：" prop="config">
          <el-input v-model="formData.config" size="mini" :maxlength="40" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <el-row>
        <el-col align="center">
          <el-button type="primary" :loading="loading" size="mini" @click.native="saveRecord">确定</el-button>
          <el-button size="mini" @click.native="onClosed">取消</el-button>
        </el-col>
      </el-row>

    </div>
  </el-dialog>
</template>

<script>
import { updateConfigList } from '@/api/repeater'
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
      onUpdate: false,
      formData: {
        id: null,
        environment: '',
        config: ''
      },
      defaultFormData: {}
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
    console.log('update config mounted')
  },
  methods: {
    onClosed() {
      this.resetForm()
      this.$emit('update:formVisible', false)
    },
    resetForm() {
      this.$refs.addForm.resetFields()
      this.resetRecordData()
    },
    resetRecordData(val) {
      // console.log("###r1:", val)
      if (val && Object.keys(val).length) {
        // console.log("r2:", val)
        this.onUpdate = true

        this.formData.id = val.id
        this.formData.environment = val.environment
        this.formData.config = val.config
      } else {
        this.onUpdate = false
        this.formData = Object.assign({}, this.defaultFormData)
      }
    },
    saveRecord() {
      const param = {
        id: this.formData.id,
        environment: this.formData.environment,
        config: this.formData.config,
        appId: this.recordData.appId
      }

      updateConfigList(param).then(response => {
        console.log('updateModuleInfoList response:', response)
        if (response.success) {
          this.onClosed()
          this.$emit('onSuccess')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
