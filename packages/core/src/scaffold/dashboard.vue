<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi {{ name }}.</div>
  </div>
  <VButton v-bind="b1" />
  <VButton v-bind="b2" />
  <VButton v-bind="b3" />
  <VButtonGroup :buttons="buttons" />
  <Rule v-model="rules" :filters="filters" :sets="sets" />
</template>
<script>
import { mapGetters } from 'vuex'
import VButton from '../components/button/VButton.vue'
import VButtonGroup from '../components/button/VButtonGroup.vue'
import Rule from './rule/index.vue'

// interface FilterCell {
//   filter : string
//   operator: string
//   value: any,
//   sub: FilterGroup
// }
//
// type Logic = 'and' | 'or' | 'AND' | 'OR'
//
// interface FilterGroup {
//   logic: Logic,
//   sub: Array<FilterCell>
// }
//
// type Operator = '=' | '+' | '-' | '*' | '/'
//
// interface SetCell {
//   Field: string,
//   Operator: Operator,
//   Value: any
// }
//
// interface RuleEngine {
//   Filter: FilterCell[],
//   Set: SetCell[]
// }
//
// const tmp : RuleEngine = {
//   Filter: [
//     { filter: 'version', operator: '>', value: '1.3.0' },
//     { filter: 'ip', operator: 'in', value: '北京,上海' }
//   ]
// }

export default {
  name: 'Dashboard',
  components: { VButton, VButtonGroup, Rule },
  data() {
    return {
      rules: [
        ['version', '>', '1.3.0'],
        ['ip', '=', '北京'],
        [
          ['version', '>', '1.3.0'],
          ['ip', '=', '北京']
        ],
        [
          ['version', '=', ''],
          ['ip', '=', '']
        ]
      ],
      filters: [
        { label: '版本', field: 'version' },
        { label: 'ip', field: 'ip' }
      ],
      sets: [
        { label: '活动ID', field: 'version' },
        { label: '文案', field: 'ip' },
        { label: '标题', field: 'ip' }
      ],
      buttons: [
        {
          type: 'jump',
          text: '跳转',
          target: 'http://github.com/daodao97',
          props: {
            type: 'primary',
            circle: true
            // icon: 'el-icon-edit'
          }
        },
        {
          type: 'api',
          text: '删除',
          target: '/user/{id}',
          metaData: {
            id: 1
          },
          extra: {
            method: 'POST'
          }
        },
        {
          type: 'form',
          text: '表单',
          target: '/user/form',
          extra: {
            formItems: [
              { type: 'input', lable: 'xxx' }
            ]
          },
          // container: 'drawer',
          beforeCloseContainer() {
            console.log(1111)
            return true
          }
        }
      ],
      b1: {
        type: 'jump',
        text: '跳转',
        target: 'http://github.com/daodao97',
        props: {
          type: 'primary',
          circle: true
          // icon: 'el-icon-edit'
        }
      },
      b2: {
        type: 'api',
        text: '删除',
        target: '/user/{id}',
        metaData: {
          id: 1
        },
        extra: {
          method: 'POST'
        }
      },
      b3: {
        type: 'form',
        text: '表单',
        target: '/user/form',
        extra: {
          formItems: [
            { type: 'input', lable: 'xxx' }
          ]
        },
        // container: 'drawer',
        beforeCloseContainer() {
          console.log(1111)
          return true
        }
      }
    }
  },
  computed: {
    ...mapGetters(['name']),
    admin() {
      return this.$store.state.settings
    }
  }
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

.moduleList {
  margin: 20px 0;

  .moduleCard {
    cursor: pointer;
  }
}
</style>
