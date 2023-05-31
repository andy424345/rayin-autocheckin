require('dotenv').config()
const { LINE_NOTIFY_TOKEN, CUSTNAME } = process.env
const schedule = require('node-schedule')
const axios = require('axios')
const FormData = require('form-data')

 /**
  * 推播LINE Notify
  * @param {String} message   
  */
var notify = async (message) => {    
    if (!LINE_NOTIFY_TOKEN) return
    const data = new FormData()
    data.append('message', message)
    await axios({
        method: 'POST',
        url: 'https://notify-api.line.me/api/notify',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
        },
        data
    })
}

/**
 * 
 * @param {String} chkType 
 */
var signin = async (chkType) => {
    const data = new FormData()    
    data.append('custname', CUSTNAME)
    data.append('chkType', chkType)
    let res = await axios({
        method: 'POST',
        url: 'http://checkin.rayin.com.tw/myrec',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data
    })
    await notify(res.data)
}

let rule = new schedule.RecurrenceRule()    
rule.hour = 8
rule.minute = Math.floor(Math.random() * 10)
rule.second = Math.floor(Math.random() * 60) 

const work = schedule.scheduleJob(rule, async () => {
    await signin('0')
})

rule = new schedule.RecurrenceRule()    
rule.hour = 17
rule.minute = Math.floor(Math.random() * 10)
rule.second = Math.floor(Math.random() * 60) 

const offwork = schedule.scheduleJob(rule, async () => {
    await signin('1')
})

