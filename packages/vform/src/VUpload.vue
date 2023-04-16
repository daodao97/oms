<template>
  <el-upload
    ref="upload"
    class="uploader ok"
    :action="action"
    :list-type="type==='image' ? 'picture-card': 'text'"
    :limit="limit"
    :multiple="limit > 1"
    :file-list="fileList"
    :disabled="disabled"
    :before-upload="beforeUpload"
    :on-preview="preview"
    :on-remove="handleRemove"
    :on-exceed="onExceed"
    :on-success="onSuccess"
    :on-error="onError"
    :headers="reqHeaders"
    :http-request="httpRequest"
  >
    <template
      v-if="fileList.length < limit"
      #default
    >
      <el-icon
        v-if="type==='image'"
        class="uploader-icon"
      ><plus /></el-icon>
      <el-button
        v-if="type==='file'"
        size="small"
        type="primary"
      >点击上传</el-button>
    </template>
    <template #tip>
      <div v-html="tip" />
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <el-image
      :src="dialogImageUrl"
      lazy
    />
  </el-dialog>
</template>

<script lang="ts">
// @ts-nocheck
import { remove } from 'lodash'
import { toArray, download, strVarReplace } from '@okiss/utils'
import { Plus } from '@element-plus/icons-vue'
import { uploadHeader } from './util'

export default {
  components: { Plus },
  inject: ['formData'],
  props: {
    modelValue: {
      type: [Array, String],
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: '#'
    },
    headers: {
      type: Object,
      default: () => {}
    },
    limit: { type: Number, default: 1 },
    accept: { type: String, default: '' },
    format: { type: Array, default: _ => [] },
    maxSize: { type: Number, default: 0 },
    type: {
      type: String,
      default: 'image' // image file
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      delIcon: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: toArray(this.$props.modelValue).map(this.parseFile),
      tip: '',
      tempIndex: 1,
      reqHeaders: Object.assign(uploadHeader(), this.$props.headers)
    }
  },
  mounted() {
    setTimeout(() => {
      this.uploadAction()
    }, 20)
    this.addDownloadIcon()
  },
  methods: {
    addDownloadIcon() {
      this.$refs['upload'].$el.getElementsByClassName('el-upload-list__item-actions').forEach((item, index) => {
        if (this.delIcon) {
          return
        }
        if (item.getElementsByClassName('el-icon-download').length) {
          return
        }
        const d = document.createElement('span')
        d.innerHTML = `<span class="el-upload-list__item-delete"><i class="iconfont ra-download"></i></span>`
        d.onclick = () => {
          const f = this.fileList[index]
          download(f.url, f.name)
        }
        this.delIcon = true
        item.appendChild(d)
      })
    },
    parseFile(file = '', index) {
      let uid = ''
      if (this.fileList && this.fileList[index] && this.fileList[index].url === file) {
        // 如果文件没变化  id不变 避免重绘
        uid = this.fileList[index].uid || Date.now() + this.tempIndex++
      }
      return {
        url: file,
        name: file.split('/').pop(),
        status: 'success',
        uid: uid || (Date.now() + this.tempIndex++)
      }
    },
    uploadAction() {
      const el = this.uploadEl()
      if (this.fileList && this.fileList.length >= this.limit) {
        if (el) {
          el.style.display = 'none'
        }
      } else {
        if (el) {
          el.style.display = 'inline-block'
        }
      }
      const list = this.fileList.map(item => {
        return item.url
      })
      this.addDownloadIcon()
      const v = this.limit === 1 ? (list[0] ?? '') : list
      this.$emit('update:modelValue', v)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.uploadAction()
    },
    preview(file) {
      if (file.status !== 'success') {
        return false
      }
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const { format, maxSize } = { format: this.format, maxSize: this.maxSize }
      const { name, size } = file
      if (format && format.length > 0 && format.indexOf(name.split('.').reverse()[0]) === -1) {
        this.$message.warning(`格式错误，仅支持后缀名为 ${format.join('、')} 的文件!`)
        return false
      }
      if (maxSize && maxSize < size / 1024) {
        this.$message.warning(`文件大小不能超过 ${maxSize}KB !`)
        return false
      }
      return true
    },
    onExceed() {
      this.$message.warning(`最多只能上传${this.limit}个`)
    },
    uploadEl() {
      if (this.$refs.upload) {
        return this.$refs.upload.$el.getElementsByClassName('el-upload')[0]
      }
    },
    onError(err, file, fileList) {
      this.$notify.error({
        title: '上传失败',
        message: err
      })
    },
    onSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$notify.error({
          title: response.message || '上传失败.',
          message: file.name
        })
        this.fileList = remove(fileList, item => {
          return item.response.code === 0
        })
        return
      }
      const responseUrl = response.data?.url
      if (!responseUrl) {
        this.$notify.error({
          message: '上传接口错误'
        })
        return
      }
      // if (this.type === 'image') {
      //   checkImgExists(responseUrl)
      //     ? this.$notify.success({
      //       title: '上传成功',
      //       message: file.name
      //     })
      //     : this.$notify.error({
      //       title: '图片地址不可用',
      //       message: responseUrl
      //     })
      // }
      file.url = responseUrl
      fileList[0].url = responseUrl
      this.fileList = fileList
      this.uploadAction()
    },
    httpRequest(opt) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', opt.file)
        this.$http.create().request({
          url: strVarReplace(opt.action, this.formData),
          method: opt.method,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            ...opt.headers
          }
        }).then(res => {
          resolve(res.data)
        }).catch(e => {
          reject(e)
        })
      })
    }
  }
}
</script>

<style>
.uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  text-align: center;
  line-height: 148px;
}

.uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.uploader-icon {
  width: 100%;
  height: 100%;
}
</style>
