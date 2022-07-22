<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi {{ name }}</div>
    <VForm
      v-model="value"
      v-bind="schema"
    />
  </div>
</template>
<script setup>
import { VForm, VButton, VIcon } from '@okiss/vbtf'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const name = computed(() => {
  return store.getters.nickname || store.getters.name
})
// eslint-disable-next-line no-unused-vars

const value = ref({ a: [960] })
const schema = {
  formItems: [
    {
      field: 'a',
      label: 'checkbox',
      type: 'checkbox',
      props: {
        valueKey: 'page_id',
        labelKey: 'title',
        optionsApi: '/tv_channel_region/list?state=2'
      }
    },
    {
      field: 'b',
      label: 'checkbox2',
      type: 'checkbox',
      options: [
        { value: 2, label: '2' },
        { value: 3, label: '3' }
      ]
    },
    {
      field: 'f'
    },
    {
      field: 'c',
      type: 'sub-form',
      props: {
        formItems: [
          {
            field: 'd',
            depend: {
              field: '.f',
              value: '1'
            }
          },
          {
            field: 'e',
            depend: {
              field: 'd',
              value: '1'
            }
          }
        ]
      }
    }
  ],
  saveApi: '/xxx'
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
