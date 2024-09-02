<template>
  <div
    class="avatar-container"
    :style="{
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      ...customStyle
    }"
    @click="editCropper()"
  >
    <img
      v-if="modelValue"
      class="object-cover w-full h-full"
      :src="modelValue"
    >
    <div
      v-else
      class="avatar-alt"
    >
      <van-icon
        name="plus"
        size="16px"
      />
      <div class="mt-1">{{ $t('common.upload') }}</div>
    </div>
    <div
      v-if="modelValue"
      class="avatar-add"
    >
      <van-icon
        name="plus"
        size="16px"
      />
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
    </div>
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
import { uploadAvatar, userAvatarUpload } from '@gptx/base/api/user';
import { useDebounceFn } from '@vueuse/core';
import { t } from '@gptx/base/i18n';

export default {
  components: { VueCropper },
  props: {
    user: {
      type: Boolean,
      default: false
    },
    modelValue: {
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
  emits: ['update:modelValue', 'updateAvatar'],
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
    modelValue: {
      handler(n) {
        this.options.img = n;
      },
      immediate: true
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
      this.options.img = this.modelValue;
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
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(async (data) => {
        try {
          const formData = new FormData();
          // 都是.png的格式
          let fileOfBlob = new File([data], new Date().getTime() + '.png', {
            type: data.type
          });
          // console.log(data,'data11')
          // console.log(fileOfBlob,'fileOfBlob')
          formData.append('file', fileOfBlob);
          this.subLoading = true;
          let response = null;
          if (this.user) {
            response = await userAvatarUpload(formData);
          } else {
            response = await uploadAvatar(formData);
          }
          if (response.code !== 200) return false;
          this.open = false;
          const imgUrl = response.data.location;
          this.options.img = imgUrl;
          this.subLoading = false;
          this.$emit('updateAvatar', this.options.img);
          this.visible = false;
        }
        catch (e) {
          console.log(e);
          this.subLoading = false;
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
