import { Router } from 'vue-router'
import store from '../../store'

export default function(router: Router) {
  router.beforeEach(async(to, from, next) => {
    const settings = store.state.settings
    const tokens: string[] = [settings.title || '']
    const len = to.matched.length
    for (let i = len; i > len - 3; i--) {
      const item = to.matched[i - 1]
      if (item?.meta?.title) {
        tokens.push(item.meta.title + '')
      }
    }
    if (tokens.length > 1) {
      document.title = tokens.reverse().join('-')
    }
    next()
  })
  router.afterEach(async(to, from, failure) => {
    if (Object.keys(to.meta).length > 0) {
      await store.dispatch('app/setCurrentMeta', to.meta)
    }
  })
}
