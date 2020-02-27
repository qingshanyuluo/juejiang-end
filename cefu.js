var http = require('http')
var formidable = require('formidable')
var request = require('request');
var fs = require('fs');

var type = 1+4+8+32+32768+65536;

var server = http.createServer(function (req, res) {
    // 1 设置cors跨域
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')

    // 2
    switch (req.method) {
        case 'OPTIONS':
            res.statusCode = 200
            res.end()
            break
        case 'POST':
            upload(req, res)
            break
    }
})

function upload(req, res) {
    // 1 判断
    if (!isFormData(req)) {
        res.statusCode = 400
        res.end('错误的请求, 请用multipart/form-data格式')
        return
    }

    // 2 处理
    var form = new formidable.IncomingForm()
    form.uploadDir = './myImage'
    form.keepExtensions = true

    form.on('field', (field, value) => {
        console.log(field)
        console.log(value)
    })
    form.on('file', (_name, file) => {
        // 重命名文件
        let types = file.name.split('.')
        let suffix = types[types.length - 1]
        fs.renameSync(file.path, './myImage/' + "pp" + '.' + suffix)
      })
    form.on('end', () => {
        var options = {
            'method': 'POST',
            'url': 'https://api.yimei.ai/v2/api/face/analysis/'+type,
            'headers': {
                'Authorization': 'Basic MDYyNjI4ZWNlOWU1ZmNmYjpiMjRjN2YyMmNlZjQyZTUxZjIyZmZlZmI0ZWZjZjY4Yg',
                'Content-Type': 'multipart/form-data; boundary=-----------------------x`---557098089390676341318141'
            },
            formData: {
                'image': {
                    'value': fs.createReadStream('./myImage/pp.jpg'),
                    'options': {
                        'filename': '/C:/Users/h-l-j/Pictures/Camera Roll/WHILE.jpg',
                        'contentType': null
                    }
                }
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            res.end(response.body);
        });
    })

    form.parse(req)
}

function isFormData(req) {
    let type = req.headers['content-type'] || ''
    return type.includes('multipart/form-data')
}

server.listen(8081)
console.log('port is on 8080.')