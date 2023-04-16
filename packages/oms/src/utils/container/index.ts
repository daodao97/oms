import { Component } from 'vue'

const defaultMap: Record<string, Component> = {}

export function setCmp(name: string, cmp: Component) {
  defaultMap[name] = cmp
}

export function getCmp(name: string) {
  return defaultMap[name]
}
