<template>
  <van-form
    ref="formRef"
    class="cover-form"
    :disabled="loading || disabled"
  >
    <div class="design-form">
      <div class="design-form-item">
        <div class="design-form-title">
          Similarity
          <svg-icon
            class="info-icon"
            name="info-o"
            @click="
              emits('show-tip', {
                title: 'Similarity',
                message: `1.When the similarity is high (such as 0.8 or above), only knowledge that is highly relevant to the problem will be retrieved, which will be more accurate, and it will also be easier to miss.\n2.When the similarity is low (such as below 0.7), content with low relevance may be retrieved, but the retrieval scope will be wider.`
              })
            "
          />
        </div>
        <div class="design-form-content">
          <div class="py-4">
            <van-slider
              v-model="form.k_min_score"
              bar-height="6"
              :step="0.05"
              :max="1"
              :min="0.1"
              @change="_updateConfig('k_min_score')"
            >
              <template #button>
                <van-button
                  class="custom-slider-button"
                  round
                >
                  {{ form.k_min_score }}
                </van-button>
              </template>
            </van-slider>
          </div>
          <div class="flex justify-between">
            <div class="text-gray-400">0.1</div>
            <div class="text-gray-400">1</div>
          </div>
        </div>
      </div>
      <div class="design-form-item">
        <div class="design-form-title">
          Number of items retrieved in a single time
          <svg-icon
            class="info-icon"
            name="info-o"
            @click="
              emits('show-tip', { title: 'Number of items retrieved in a single time', message: 'The maximum number of paragraphs retrieved from the knowledge base for a single question and answer. The default is 3. Increasing the number will increase token consumption. Be careful not to exceed the maximum context of the model.' })
            "
          />
        </div>
        <div class="design-form-content">
          <div class="py-4">
            <van-slider
              v-model="form.k_max_referenced"
              bar-height="6"
              :step="1"
              :max="30"
              :min="1"
              @change="_updateConfig('k_max_referenced')"
            >
              <template #button>
                <van-button
                  class="custom-slider-button"
                  round
                >
                  {{ form.k_max_referenced }}
                </van-button>
              </template>
            </van-slider>
          </div>
          <div class="flex justify-between">
            <div class="text-gray-400">1</div>
            <div class="text-gray-400">30</div>
          </div>
        </div>
      </div>
      <div class="design-form-item">
        <div class="design-form-title">
          Missed strategy
          <svg-icon
            class="info-icon"
            name="info-o"
            @click="
              emits('show-tip', {
                title: 'Missed strategy',
                message: `Strategies when similar content is not found in the knowledge base\n1.Autonomous reasoning: The robot will reason and reply on its own\n2.Fixed reply: Reply based on specified text`
              })
            "
          />
        </div>
        <div class="design-form-content">
          <van-radio-group
            v-model="form.k_miss_strategy"
            direction="horizontal"
            @change="onStrategyChange"
          >
            <van-radio
              :name="1"
              icon-size="16"
            >
              Reply by assistant's self
            </van-radio>
            <van-radio
              :name="2"
              icon-size="16"
            >
              Fixed reply
            </van-radio>
          </van-radio-group>
        </div>
        <div
          v-if="form.k_miss_strategy === 2"
          class="design-form-content"
        >
          <van-field
            v-model="form.k_miss_response"
            name="k_miss_response"
            type="textarea"
            maxlength="50"
            show-word-limit
            bordered
            background
            clearable
            placeholder="Please enter fixed reply content"
            :rows="4"
            :rules="rules.k_miss_response"
            @blur="_updateConfig('k_miss_response')"
          />
        </div>
      </div>
      <div class="mb-0 design-form-item">
        <div class="design-form-title">
          <div class="flex justify-between w-full">
            Bind base
            <van-button
              type="primary"
              icon="plus"
              link
              @click="openKnowledgeBindDialog"
            />
          </div>
        </div>
        <div class="pb-0 design-form-content">
          <div
            v-for="base in form.bind_list"
            class="page-list"
          >
            <van-cell class="page-list__inner">
              <div class="relative flex items-center mb-2">
                <van-image
                  class="page-list-img"
                  fit="cover"
                  radius="8"
                  :src="base.icon"
                >
                  <template #error>
                    <div class="page-list-img__error">
                      <van-icon name="photo" />
                    </div>
                  </template>
                </van-image>
                <div
                  class="flex-1 pl-2 pr-3 text-base line-clamp-1"
                  :title="base.name"
                >
                  {{ base.name }}
                </div>
                <van-button
                  link
                  @click="updateKnowledgeBindState(base)"
                >
                  <svg-icon
                    name="delete"
                    class="text-base text-[#7a7a7a]"
                  />
                </van-button>
              </div>
              <div class="text-[#7a7a7a]">
                <div class="text-xs">
                  <span>Number of files：</span>
                  <span>{{ base.file_count }}files</span>
                </div>
                <div class="text-xs">
                  <span>File size：</span>
                  <span>{{ base.friendly_file_size }}</span>
                </div>
              </div>
            </van-cell>
          </div>
          <div
            v-if="!form.bind_list.length"
            class="page-list"
          >
            <van-cell
              class="page-list__inner"
              shadow="hover"
            >
              <van-button
                class="bind-knowledge-btn"
                link
                @click="openKnowledgeBindDialog"
              >
                <svg-icon
                  class="text-[26px]"
                  name="plus-square"
                />
                <div class="mt-1">Bind base</div>
              </van-button>
            </van-cell>
          </div>
        </div>
      </div>
      <design-bind-knowledge
        ref="bindKnowledgeRef"
        class="bind-knowledge"
        :bot-id="botId"
        @update="emits('update')"
      />
    </div>
  </van-form>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import { bindKnowledge, updateConfig } from '@gptx/base/api/application';
import { DesignBindKnowledge } from './index';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  botId: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['update', 'show-tip']);

let form = reactive({
  bind_list: [],
  k_min_score: 0.75,
  k_max_referenced: 3,
  k_miss_strategy: 1,
  k_miss_response: ''
});
let formOrigin = {};
const rules = reactive({
  k_miss_response: null
});
const loading = ref(false);
const bindKnowledgeRef = ref(null);
/* ref dom */
const formRef = ref(null);

const openKnowledgeBindDialog = () => bindKnowledgeRef.value.open();
const onStrategyChange = () => {
  if (form.k_miss_strategy === 1) {
    _updateConfig('k_miss_strategy');
  } else {
    rules.k_miss_response = [{ required: true, message: "Please enter fixed reply content" }];
    // formRef.value.resetFields();
    if (form.k_miss_response) {
      _updateConfig('k_miss_strategy');
    }
  }
};
const updateKnowledgeBindState = async ({ id }) => {
  if (loading.value) return;
  try {
    loading.value = true;
    await bindKnowledge({ app_id: props.botId, knowledge_id: id, to_bind: false });
    loading.value = false;
    emits('update');
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};
const _updateConfig = async (key) => {
  try {
    if (JSON.stringify(form[key]) === JSON.stringify(formOrigin[key])) return console.log('nothing changed');
    await formRef.value.validate();
    const params = {
      id: props.botId
    };
    switch (key) {
      case 'k_miss_strategy':
        if (form.k_miss_response) {
          params.k_miss_response = form.k_miss_response;
        }
        break;
      case 'k_miss_response':
        if (form.k_miss_strategy === 2) {
          params.k_miss_strategy = form.k_miss_strategy;
        }
        break;
    }
    loading.value = true;
    params[key] = form[key];
    const { code } = await updateConfig(params);
    if (code === 200) {
      emits('update');
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};

watch(
  () => props.data,
  (val) => {
    for (const key in form) {
      if (Object.hasOwnProperty.call(form, key)) {
        form[key] = val[key];
      }
    }
    formOrigin = JSON.parse(JSON.stringify(val));
  }
);
</script>
<style lang="scss" scoped>
:deep(.design-form-title) {
  display: block;
}

.page-list {
  padding: 0;
}

.page-list-img {
  width: 30px;
  height: 30px;

  .page-list-img__error {
    font-size: 15px;
  }
}
</style>
<style lang="scss">
.bind-knowledge-btn {
  width: 100%;
  height: 100% !important;
}
</style>
