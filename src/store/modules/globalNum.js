const now = (new Date(new Date().toLocaleDateString())).getTime()
const nowEnd = now + 3600 * 1000 * 24 - 1
const nowEndDate = new Date(nowEnd).format('yyyy-MM-dd hh:mm:ss')
const lastPartMonth = now - 3600 * 1000 * 24 * 15
const lastPartMonthDate = new Date(lastPartMonth).format('yyyy-MM-dd hh:mm:ss')
const lastWeek = now - 3600 * 1000 * 24 * 7
const lastWeekDate = new Date(lastWeek).format('yyyy-MM-dd hh:mm:ss')
const lastMonth = now - 3600 * 1000 * 24 * 30
const lastMonthDate = new Date(lastMonth).format('yyyy-MM-dd hh:mm:ss')

const globalNum = {
    state: {
        now,
        lastPartMonth,
        lastPartMonthDate,
        lastWeek,
        lastWeekDate,
        nowEnd,
        nowEndDate, // Date类型的数据,兼容返回特定格式的接口
        lastMonth,
        lastMonthDate
    }
}

export default globalNum;