<template>
  <render :schema="schema" />
</template>
<script setup>
import { render } from '@/render'

const schema = [
  {
    type: 'card.div',
    span: 8,
    props: {
      test: 1
    },
    children: {
      type: 'test',
      span: 8,
      props: {
        test: 233
      },
      children: [

      ]
    }
  },
  {
    type: 'card.test',
    span: 8,
    props: {
      test: 2
    }
  },
  {
    type: 'card.test',
    span: 8,
    props: {
      test: 3
    }
  }
]

const schema1 = [
  {
    'type': 'card.table',
    'span': 12,
    'props': {
      'key': '4',
      'infoApi': '/schema/user',
      'showPagination': false
    }
  },
  {
    'type': 'card.table',
    'span': 12,
    'props': {
      'key': '2',
      'infoApi': '/schema/ott_user_crowd',
      'showPagination': false
    }
  }
]
</script>
