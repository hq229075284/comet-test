var source = new EventSource('/stream')
source.onmessage = function (e) {
    var str = e.data.replace(/^data:\s/, '')
    document.querySelector('div').innerHTML = JSON.stringify(JSON.parse(str), null, 2)
}