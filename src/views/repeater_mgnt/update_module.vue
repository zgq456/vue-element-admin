<template>
  <el-dialog
    :title="onUpdate ? '编辑' : '新增'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="true"
    width="30%"
    @close="onClosed"
  >
    <div>
      <el-form ref="addForm" :model="formData" status-icon class="margin-b10" label-width="120px">
        <el-form-item label="机器IP：" prop="ip">
          <el-input v-model="formData.ip" size="mini" :maxlength="40" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="(ssh)端口：" prop="port">
          <el-input v-model="formData.port" size="mini" :maxlength="40" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formData.username" size="mini" :maxlength="40" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="formData.password" size="mini" :maxlength="40" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="密钥文件路径：" prop="privateRsaFile">
          <el-input v-model="formData.privateRsaFile" size="mini" :maxlength="200" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="前置命令：" prop="preCommand">
          <el-input v-model="formData.preCommand" size="mini" :maxlength="200" placeholder="请输入" />
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
import { updateModuleInfoList } from '@/api/repeater'
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
        ip: '',
        port: '',
        username: '',
        password: '',
        privateRsaFile: '',
        preCommand: '',
        moduleConfigId: null
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
    // console.log('update module mounted')
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
        this.formData.ip = val.ip
        this.formData.port = val.port
        this.formData.username = val.username
        this.formData.password = val.password
        this.formData.privateRsaFile = val.privateRsaFile
        this.formData.preCommand = val.preCommand
        this.formData.moduleConfigId = val.moduleConfigId
      } else {
        this.onUpdate = false
        this.formData = Object.assign({}, this.defaultFormData)
      }
    },
    saveRecord() {
      const param = {
        id: this.formData.id,
        ip: this.formData.ip,
        port: this.formData.port,
        username: this.formData.username,
        password: this.formData.password,
        privateRsaFile: this.formData.privateRsaFile,
        preCommand: this.formData.preCommand,
        moduleConfigId: this.formData.moduleConfigId
      }

      updateModuleInfoList(param).then(response => {
        console.log('updateModuleInfoList response:', response)
        if (response.success) {
          this.onClosed()
          this.$emit('onSuccess')
        }
      })

      // this.$api.fundAccountUpdate.post(param).then(data => {
      //   if (data.errorNo !== 0) {
      //     error(data.message)
      //     return
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: '操作成功',
      //       type: 'success'
      //     })
      //   }
      //
      //   this.onClosed()
      //   this.$emit('onSuccess')
      // }).catch((error) => {
      //   this.onClosed()
      //   this.error('系统错误')
      // });
    }
  }
}
</script>

<style scoped>

</style>
