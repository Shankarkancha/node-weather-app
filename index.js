const http= require("http");
const fs= require('fs');
var requests = require('requests');
const homefile= fs.readFileSync("home.html",'utf-8');
const port= process.env.PORT || 8000;

const replaceval=(tempval,orgval)=>{
    let temperature= tempval.replace("{%tempval%}",orgval.main.temp);
     temperature= temperature.replace("{%tempmin%}",orgval.main.temp_min);
     temperature= temperature.replace("{%tempmax%}",orgval.main.temp_max);
     temperature= temperature.replace("{%location%}",orgval.name);
     temperature= temperature.replace("{%country%}",orgval.sys.country);
     temperature= temperature.replace("{%tempstatus%}",orgval.weather[0].main);
     return temperature;
}


const server= http.createServer((req,res)=>{
    requests(`https://api.openweathermap.org/data/2.5/weather?q=Warangal&appid=92b11f6e9d285d84430d85e5d35b919c`)
    .on('data', function (chunk) {
        const objdata=JSON.parse(chunk);
        const arrobj=[objdata];
        const realtimedata= arrobj.map((val)=>replaceval(homefile,val)).join("");
        res.write(realtimedata);
    })
    .on('end', function (err) {
    if (err) return console.log('connection closed due to errors', err);
    
    res.end();
});
})
server.listen(port,"127.0.0.1");