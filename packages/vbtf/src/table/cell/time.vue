<template>
    <span class="cell-time" :title="fullTime">{{ displayTime }}</span>
</template>

<script lang="ts" setup name="CellTime">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const props = defineProps({
    data: {
        type: [String, Number],
        default: ''
    },
    column: {
        type: Object,
        default: () => { }
    },
    row: {
        type: Object,
        default: () => { }
    },
    scope: {
        type: Object,
        default: () => { }
    },
    // Custom format string, e.g. 'YYYY-MM-DD HH:mm:ss'
    format: {
        type: String,
        default: ''
    },
    // Show relative time like "2小时前"
    relative: {
        type: Boolean,
        default: false
    },
    // Show relative time only if within this number of days
    relativeDays: {
        type: Number,
        default: 7
    }
})

const parsedTime = computed(() => {
    if (!props.data) return null
    const d = dayjs(props.data)
    return d.isValid() ? d : null
})

const fullTime = computed(() => {
    if (!parsedTime.value) return ''
    return parsedTime.value.format('YYYY-MM-DD HH:mm:ss')
})

const displayTime = computed(() => {
    if (!parsedTime.value) return props.data || '-'

    const d = parsedTime.value

    // If custom format is provided, use it
    if (props.format) {
        return d.format(props.format)
    }

    // If relative mode is enabled
    if (props.relative) {
        const now = dayjs()
        const diffDays = now.diff(d, 'day')

        // Show relative time if within relativeDays
        if (Math.abs(diffDays) <= props.relativeDays) {
            return d.fromNow()
        }
    }

    // Smart format based on date
    const now = dayjs()
    const isToday = d.isSame(now, 'day')
    const isYesterday = d.isSame(now.subtract(1, 'day'), 'day')
    const isThisYear = d.isSame(now, 'year')

    if (isToday) {
        return '今天 ' + d.format('HH:mm')
    }

    if (isYesterday) {
        return '昨天 ' + d.format('HH:mm')
    }

    if (isThisYear) {
        return d.format('MM-DD HH:mm')
    }

    return d.format('YYYY-MM-DD HH:mm')
})
</script>

<style lang="scss" scoped>
.cell-time {
    color: inherit;
    white-space: nowrap;
    cursor: default;
}
</style>
