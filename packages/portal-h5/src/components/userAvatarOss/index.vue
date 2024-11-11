<template>
  <div
    class="avatar-container"
    :style="{
      width: '30px',
      height: '30px',
      ...customStyle
    }"
    @click="editCropper()"
  >
    <img
      v-if="options.img"
      class="object-cover w-full h-full"
      :src="options.img"
    >
    <div
      v-else
      class="avatar-alt"
    >
      <van-icon size="24px">
        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
          <path d="M16.9487 24.5V12.275L13.0487 16.175L10.9487 14L18.4487 6.5L25.9487 14L23.8487 16.175L19.9487 12.275V24.5H16.9487ZM9.44873 30.5C8.62373 30.5 7.91773 30.2065 7.33073 29.6195C6.74373 29.0325 6.44973 28.326 6.44873 27.5V23H9.44873V27.5H27.4487V23H30.4487V27.5C30.4487 28.325 30.1552 29.0315 29.5682 29.6195C28.9812 30.2075 28.2747 30.501 27.4487 30.5H9.44873Z" fill="#C5C5C5"/>
        </svg>
      </van-icon>
<!--      <div class="mt-1">{{ $t('common.upload') }}</div>-->
    </div>
    <div
      v-if="options.img"
      class="avatar-add"
    >
      <van-icon size="24px">
        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
          <path d="M16.9487 24.5V12.275L13.0487 16.175L10.9487 14L18.4487 6.5L25.9487 14L23.8487 16.175L19.9487 12.275V24.5H16.9487ZM9.44873 30.5C8.62373 30.5 7.91773 30.2065 7.33073 29.6195C6.74373 29.0325 6.44973 28.326 6.44873 27.5V23H9.44873V27.5H27.4487V23H30.4487V27.5C30.4487 28.325 30.1552 29.0315 29.5682 29.6195C28.9812 30.2075 28.2747 30.501 27.4487 30.5H9.44873Z" fill="#C5C5C5"/>
        </svg>
      </van-icon>
    </div>
  </div>

  <van-popup
    v-model:show="open"
    class="cover-popup"
    position="bottom"
    teleport="body"
    closeable
    @opened="modalOpened"
    @close="closeDialog"
  >
    <div class="cover-popup-head">
      {{ title }}
    </div>
    <div class="cover-popup-body">
      <div class="mb-2">{{ $t('bots.s') + $t('bots.w') }}</div>
      <van-row>
        <van-col
          span="24"
          :style="{ height: '350px' }"
        >
          <vue-cropper
            v-if="visible"
            ref="cropper"
            :img="options.img"
            :info="true"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            :output-type="options.outputType"
            @real-time="realTime"
          />
        </van-col>
      </van-row>
      <div class="cover-popup-foot">
        <van-button
          size="small"
          icon="plus"
          @click="onOpenFileUploader"
        >
          {{ $t('bots.basic_1') }}
        </van-button>
        <van-button
          size="small"
          type="primary"
          linear
          :loading="subLoading"
          @click="uploadImg"
        >
          {{ $t('common.upload') }}
        </van-button>
      </div>
    </div>
    <van-uploader
      ref="uploaderRef"
      accept=".jpg, .png, .jpeg"
      :before-read="beforeUpload"
      :show-upload="false"
    />
  </van-popup>
</template>

<script>
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { getOssPresignedUrlV2, getOssUrlV2 } from '@gptx/base/api/user';
import axios from 'axios'
import { useDebounceFn } from '@vueuse/core';
import { t } from '@gptx/base/i18n';
import { ElMessage } from 'element-plus';
import CryptoJS from 'crypto-js';

export default {
  components: { VueCropper },
  props: {
    user: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: ''
    },
    roundCropperImage: {
      type: Boolean,
      default: false
    },
    customStyle: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: t('bots.botAvatar')
    }
  },
  emits: ['updateAvatar'],
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      options: {
        img: this.avatar, // 裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        outputType: 'png' // 默认生成截图为PNG格式
      },
      previews: {},
      subLoading: false,
      resizeHandler: null,
      previewStyle1: {}
    };
  },
  watch: {
    avatar: {
      handler(n) {
        this.options.img = n;
      },
      deep: true
    }
  },
  methods: {
    // 编辑头像
    editCropper() {
      this.open = true;
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true;
      if (!this.resizeHandler) {
        this.resizeHandler = useDebounceFn(() => {
          this.refresh();
        }, 100);
      }
      window.addEventListener('resize', this.resizeHandler);
    },
    // 刷新组件
    refresh() {
      this.$refs.cropper.refresh();
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 5;
      if (file.type.indexOf('image/') == -1) {
        showFailToast(this.$t('bots.s'))
      } else if (!isLt1M) {
        showFailToast(this.$t('bots.ww'))
      }
      {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
      }
    },
// 上传文件
    async uploadFile (upload_url, file, form_data) {
      // 创建 FormData 对象并附加上传所需的字段
      const form = new FormData();

      // 将 form_data 中的键值对添加到 form_data 对象中
      for (const [key, value] of Object.entries(form_data)) {
        form.append(key, value);
      }
      // 最后添加文件本身
      form.append('file', file);

      // 使用 POST 请求上传文件
      await axios.post(upload_url, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    generateFileHash(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileData = event.target.result;
          const wordArray = CryptoJS.lib.WordArray.create(fileData); // 使用 WordArray 创建 SHA256 输入
          const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
          console.log('文件哈希:', hash);
          resolve(hash);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file); // 读取文件内容为 ArrayBuffer
      });
    },
// 上传头像图片
    async uploadImg () {
      this.$refs.cropper.getCropBlob(async (data) => {
        try {
          // 创建文件对象
          let fileOfBlob = new File([data], new Date().getTime() + '.png', { type: data.type });
          console.log(fileOfBlob, 'fileOfBlob');

          // 生成文件哈希值
          const fileHash = await this.generateFileHash(fileOfBlob);
          const fileSize = fileOfBlob.size;
          const fileName = fileOfBlob.name;

          this.subLoading = true;
          // 获取预签名 URL
          const presignedData = await getOssPresignedUrlV2({
            biz_type: 'avatar',
            file_name: fileName,
            file_size: fileSize,
            file_hash: fileHash
          });
          const { upload_url,file_url, form_data } = presignedData.data;

          // 使用上传 URL 和表单数据上传文件
          await this.uploadFile(upload_url, fileOfBlob, form_data);
          // const fileHttpUrl = await getOssUrlV2({
          //   file_url: file_key,
          //   file_key
          // })
          console.log(file_url, 'file_url');
          // 提取文件访问 URL
          const imgUrl = file_url.split('?')[0];
          console.log('头像上传成功:', imgUrl);
          this.options.img = imgUrl;
          this.$emit('updateAvatar', this.options.img);
          this.visible = false;
        } catch (error) {
          console.error('头像上传失败:', error);
        } finally {
          this.subLoading = false;
          this.open = false;
        }
      });
    },

    // 实时预览
    realTime(data) {
      this.previews = data;
      this.previewStyle1 = {
        width: this.previews.w + 'px',
        height: this.previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: h
      };
    },
    // 关闭窗口
    closeDialog() {
      this.options.img = this.avatar;
      this.visible = false;
      window.removeEventListener('resize', this.resizeHandler);
    },
    onOpenFileUploader() {
      this.$refs.uploaderRef.chooseFile();
    }
  }
};
</script>
<style scoped lang="scss">
.avatar-container {
  position: relative;
  display: flex;
  width: fit-content;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  img {
    object-fit: cover;
  }
  &:hover {
    .avatar-add {
      visibility: visible;
    }
  }
}
.avatar-add {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-style: normal;
  line-height: 1;
  background: rgba(0, 0, 0, 0.5);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  visibility: hidden;
  border-radius: inherit;
}
.avatar-alt {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  line-height: 1;
  color: #a4a4a4;
  border: 1px solid #e6e6e6;
  border-radius: inherit;
  &:hover {
    border-color: #066be9;
  }
}

#app {
  .van-dialog {
    .van-dialog__footer {
      .van-button {
        & + .van-button {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
