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
      formData:{{ formData }}
      <el-form ref="addForm" :model="formData" status-icon class="margin-b10" label-width="120px">
        <el-form-item label="应用名称：" prop="name">
          <el-input v-model="formData.name" size="mini" :maxlength="40" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注：" prop="memo">
          <el-input v-model="formData.memo" size="mini" :maxlength="40" placeholder="请输入" />
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
import { updateAppList } from '@/api/repeater'
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
        name: '',
        memo: ''
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
    console.log('update app mounted')
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
      console.log('###r1:', val)
      if (val && Object.keys(val).length) {
        // console.log("r2:", val)
        this.onUpdate = true

        this.formData.id = val.id
        this.formData.name = val.name
        this.formData.memo = val.memo
      } else {
        this.onUpdate = false
        // this.formData = Object.assign({}, this.defaultFormData)
        this.formData.id = null
        this.formData.name = null
        this.formData.memo = null
      }
    },
    saveRecord() {
      const param = {
        id: this.formData.id,
        name: this.formData.name,
        memo: this.formData.memo
      }

      updateAppList(param).then(response => {
        console.log('updateAppList response:', response)
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
