const http = require('http')
const path = require('path')
const fs = require('fs')
const Mock = require('mockjs')

function getFile(url) {
    const p = path.join(__dirname, url)
    const buffer = fs.readFileSync(p)
    return buffer
}
function getData(max, random = true) {
    const length = random ? Math.ceil(Math.random() * (max || 100)) : max
    return Mock.mock({
        'totl': length,
        [`items|${length}`]: [{
            name: '@cname()',
            address: '@city(true)'
        }]
    })
    // while(true){
    //     const length = Math.ceil(Math.random() * 100)
    //     const data = Mock.mock({
    //         'totl': length,
    //         [`items|${length}`]: [{
    //             name: '@cname()',
    //             address: '@city(true)'
    //         }]
    //     })
    //     for(let i=0;i<data.length;i++){
    //         const one=data[i]
    //         if(one.name[0]==='韩'){
    //             return data
    //         }
    //     }
    // }
}
let delay = 0
let interval = null
const server = http.createServer(function (req, res) {
    const url = req.url
    function isJs(url) {
        return /\.js$/.test(url)
    }
    function isHtml(url) {
        return /\.html$/.test(url)
    }
    function isFlush(url) {
        return /flush/.test(url)
    }
    function isStream(url) {
        return /stream/.test(url)
    }
    switch (true) {
        case isJs(url): {
            try {
                res.writeHead(200, {
                    'Content-Type': 'text/javascript'
                })
                res.end(getFile(url))
            } catch (e) {
                console.log(e)
                res.writeHead(3000, {})
            } finally {
                res.end()
                return
            }
            break;
        }
        case isHtml(url): {
            try {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                res.end(getFile(url))
            } catch (e) {
                console.log(e)
                res.writeHead(3000, {})
            } finally {
                res.end()
                return
            }
            break;
        }
        case isFlush(url): {
            interval = setInterval(() => {
                res.statusCode = 200
                try{
                    res.setHeader('Content-Type', 'text/html')
                }catch(e){
                    console.log('catch')
                }
                res.write(`
                    <script>window.parent.getData(${JSON.stringify(getData())})</script>
                `)
                // res.end()
            }, 2000)
            res.connection.on('end', function () {
                console.log('close');
                clearInterval(interval);
            });
            break;
        }
        case isStream(url): {
            interval = setInterval(() => {
                res.write(`data: ${JSON.stringify(getData())}\n\n`)
            }, 2000)
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
            })
            res.write(`data: ${JSON.stringify('connected')}\n\n`)
            res.connection.on('end', function () {
                console.log('close');
                clearInterval(interval);
            });
            break;
        }
        default: {
            setTimeout(() => {
                try {
                    if (delay === 0) delay = 1000
                    const data = getData()
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    res.end(JSON.stringify(data))
                } catch (e) {
                    console.log(e)
                    res.writeHead(3000, {})
                    res.end()
                }
            }, delay)
            break;
        }
    }
})

server.listen(8000, function () { console.log('listen at 8000') })