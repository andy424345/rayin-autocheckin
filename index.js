require('dotenv').config()
const express = require('express')
const server = express()
const { LINE_NOTIFY_TOKEN } = process.env
const axios = require('axios')
const FormData = require('form-data')

 /**
  * 推播LINE Notify  
  * @param {String} token  
  * @param {String} message      
  */
var notify = async (token, message) => {    
    if (!token) {
        token = LINE_NOTIFY_TOKEN
    }
    const data = new FormData()
    data.append('message', message)
    await axios({
        method: 'POST',
        url: 'https://notify-api.line.me/api/notify',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
        },
        data
    })
}

/**
 * 執行簽到
 * @param {String} token LINE推播權杖
 * @param {Stirng} custname 簽到人員
 * @param {String} chkType 0簽到 1簽退
 */
var signin = async (token, custname, chkType) => {
    const data = new FormData()    
    data.append('custname', custname)
    data.append('chkType', chkType)
    let res = await axios({
        method: 'POST',
        url: 'http://checkin.rayin.com.tw/myrec',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data
    })
    await notify(token, `\n簽到人員:${custname}\n結果:${res.data}`)
    return res.data
}

server.use(express.json())

server.all('/', (req, res) => {
    res.send('Your bot is alive!')
})

server.get('/checkin', async (req, res) => {
    const { name, type, token } = req.query        
    if (!name || !type) {
        console.log('err')
        res.statusCode = 404
        res.send('404 NOT FOUND')
        return
    }
    const data = await signin(token, name, type)
    res.send(data)
})

const port = process.env.PORT || 3001
server.listen(port, () => console.log(`[已準備就緒] port: ${port}`))

setTimeout(async () => {
    await notify(LINE_NOTIFY_TOKEN, `\n自動簽到已啟動`)
}, 10)