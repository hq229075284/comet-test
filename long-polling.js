function toXRH() {
    const xhr = new XMLHttpRequest()
    xhr.open('get', 'http://127.0.0.1:8000/a.json')
    xhr.send()
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {
            document.body.querySelector('div').innerHTML = JSON.stringify(JSON.parse(xhr.responseText), null, 2)
        }
    }
}
toXRH()
setInterval(() => {
    toXRH()
}, 3000);