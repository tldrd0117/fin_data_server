//api
import Crawler from './crawling/crawler'
import url from 'url'
import querystring from 'querystring'

const express = require('express')

// express 인스턴스 생성
const app = express()

// 실제로는 /api 라우트를 처리하는 메소드가 된다.
app.get('/', function (req, res, next) {
    const { start, end, code } = req.query
    // if( !queryObj ){
    //     res.status(500).json({err:'queryObj 없음'})
    //     return
    // }
    if( !start ){
        res.status(500).json({err:'start 없음'})
        return
    }

    if( !code ){
        res.status(500).json({err:'code 없음'})
        return
    }
    
    Crawler.crawlingFromDate(start, end, code).then(data=>{
        // res.setHeader("Content-Type", "application/json;charset=utf-8")
        // res.end(data)
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(data))
    })
    // res.setHeader("Content-Type", "application/json")
    // res.end(JSON.stringify({ message: 'Hello World' }))
})

export default app