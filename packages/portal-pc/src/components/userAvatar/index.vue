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
      v-if="options.img"
      class="h-full w-full object-cover"
      :src="options.img"
    >
    <div
      v-else
      class="avatar-alt"
    >
      <el-icon size="16px">
        <Plus />
      </el-icon>
      <div class="mt-1">{{ $t('common.upload') }}</div>
    </div>
    <div
      v-if="options.img"
      class="avatar-add"
    >
      <el-icon size="16px">
        <Plus />
      </el-icon>
    </div>
  </div>
  <el-dialog
    v-model="open"
    :title="title"
    width="622px"
    append-to="#app"
    @opened="modalOpened"
    @close="closeDialog"
  >
    <div style="position: relative; top: -20px">{{ $t('bots.s') + $t('bots.w') }}</div>
    <el-row>
      <el-col
        :xs="24"
        :md="12"
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
      </el-col>
      <el-col
        :xs="24"
        :md="12"
        :style="{ height: '350px' }"
      >
        <div
          class="avatar-upload-preview"
          :style="{ ...previewStyle1, borderRadius: roundCropperImage ? '50%' : '8px' }"
        >
          <div :style="previews.div">
            <img
              :src="previews.url"
              :style="previews.img"
            >
          </div>
        </div>
      </el-col>
    </el-row>
    <br>
    <div class="flex">
      <div class="flex-1">
        <el-row>
          <el-col
            :lg="2"
            :sm="3"
            :xs="3"
          >
            <el-upload
              action="#"
              accept=".jpg, .png, .jpeg"
              :http-request="requestUpload"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <el-button size="small"> {{ $t('bots.basic_1') }} <i class="el-icon-upload el-icon--right" /></el-button>
            </el-upload>
          </el-col>
          <el-col
            :lg="{ span: 1, offset: 2 }"
            :sm="2"
            :xs="2"
          >
            <el-button
              size="small"
              @click="changeScale(1)"
            >
              <el-icon>
                <Plus />
              </el-icon>
            </el-button>
          </el-col>
          <el-col
            :lg="{ span: 1, offset: 1 }"
            :sm="2"
            :xs="2"
          >
            <el-button
              size="small"
              @click="changeScale(-1)"
            >
              <el-icon>
                <Minus />
              </el-icon>
            </el-button>
          </el-col>
          <el-col
            :lg="{ span: 1, offset: 1 }"
            :sm="2"
            :xs="2"
          >
            <el-button
              size="small"
              @click="rotateLeft()"
            >
              <el-icon>
                <RefreshLeft />
              </el-icon>
            </el-button>
          </el-col>
          <el-col
            :lg="{ span: 1, offset: 1 }"
            :sm="2"
            :xs="2"
          >
            <el-button
              size="small"
              @click="rotateRight()"
            >
              <el-icon>
                <RefreshRight />
              </el-icon>
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="ml-auto shrink-0">
        <el-button
          type="primary"
          linear
          :loading="subLoading"
          @click="uploadImg()"
        >
          提 交
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { uploadAvatar, userAvatarUpload } from '@gptx/base/api/user';
import { useDebounceFn } from '@vueuse/core';
import { t } from '@gptx/base/i18n';
import { ElMessage } from 'element-plus';
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
        ElMessage.error(this.$t('bots.s'));
      } else if (!isLt1M) {
        ElMessage.error(this.$t('bots.ww'));
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
      this.options.img = this.avatar;
      this.visible = false;
      window.removeEventListener('resize', this.resizeHandler);
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
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(25%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}
</style>
