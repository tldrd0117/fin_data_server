// const axios = require("axios");
// const cheerio = require("cheerio");
import axios from 'axios';
import cheerio from 'cheerio';
import charset from 'charset';
import iconv from 'iconv-lite';

const getHtml = async (url) => {
    try{
        return await axios.get(url, {
            responseType: 'arraybuffer',
        });
    } catch(err) {
        console.log(err)
    }
};

export default {
    crawlingFromDate: async function (start, end, code){
        let idxPage = 0
        let startSplit = start.split('-')
        let startTime = new Date(startSplit[0], startSplit[1], startSplit[2]).getTime();
        const dataSeq = []
        while(true){
            idxPage+=1
            const {dataOne, isEnd} = await this.crawling(code, idxPage).then(data=>{
                let dateSplit = data[data.length - 1].date.split('.')
                let dateTime = new Date(dateSplit[0], dateSplit[1], dateSplit[2]).getTime()
                console.log(startTime, dateTime)
                return { dataOne: data, isEnd: startTime >= dateTime }
            })
            dataSeq.push(dataOne)
            if(isEnd){
                break;
            }
        }
        return dataSeq
    },
    crawling: (code, page)=>{
        // return getHtml('https://www.yna.co.kr/sports/all')
        return getHtml(`https://finance.naver.com/item/sise_day.nhn?code=${code}&page=${page}`)
        .then(res => {
            const enc = charset(res.headers, res.data)
            var buf = new Buffer(res.data);
            const html = iconv.decode(buf, enc).toString()
            return html;
        })
        .then(html => {
            const $ = cheerio.load(html);
            const trList = [];
            const firstTable = $('table').first().first()
            firstTable.find('tr').each((i, tr)=>{
                const tdList = [];
                $(tr).find('td').each((i2, td)=>{
                    const text = $(td).text().trim();
                    if( text.length >0)
                        tdList.push($(td).text().trim())
                })
                if( tdList.length >0 )
                    trList.push(tdList)
            })
            return trList.map(item=>({
                date: item[0],
                close: item[1],
                before: item[2],
                open: item[3],
                high: item[4],
                low: item[5],
                volume: item[6]
            }))
        })
    }
}