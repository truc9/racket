import dayjs from "dayjs"

function formatDate(value: Date, withTime: boolean = true) {
    const format = withTime ? 'DD/MM/YYYY hh:mm:ss' : 'DD/MM/YYYY'
    return dayjs(value).format(format)
}

function formatTime(value: Date) {
    return dayjs(value).format('hh:mm:ss A')
}

function formatDateRange(start: Date, end: Date) {
    if (dayjs(start).isSame(end, 'date')) {
        return `${dayjs(start).format('DD/MM/YYYY')} ${dayjs(start).format('hh:mm:ss A')} - ${dayjs(end).format('hh:mm:ss A')}`
    }
    return `${formatDate(start)} - ${formatDate(end)}`
}

export default {
    formatDate,
    formatTime,
    formatDateRange
}