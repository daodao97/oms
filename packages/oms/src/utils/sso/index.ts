import { BaseSso } from './base'
import type { SsoType, Sso } from './base'
import { Github } from './github'
import { DingTalk } from './dingtalk'
import { pinia, useSettingsStore } from '../../store'
import { newSso } from '../../types'
import { merge } from 'lodash'

export { BaseSso, SsoType, Sso, Github, DingTalk }

const defaultSso: Record<string, newSso> = {}

export function allSso(): Record<string, newSso> {
  return merge(useSettingsStore(pinia).sso || {}, defaultSso)
}

export default function(): Sso | undefined {
  const sso = allSso()
  const key = useSettingsStore(pinia).activeSsoKey || ''
  console.log(sso, key)
  const active = sso[key]
  if (active !== undefined) {
    return active()
  }
  return undefined
}
