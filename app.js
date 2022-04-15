const request = require('request');
const express = require('express');
const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.listen(process.env.PORT || 3000);

app.get('/',(req,res)=>{
    res.render('index',{
        search:false,
        error:false,
        City:'Search'
    });
})

app.post('/', (req,res)=>{
    
    const City = req.body.city;
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+City+'&appid=dba88b311cd39d42a5998888d76f0513&units=metric';
    
    request(url,(error,response,body)=>{
        wea = JSON.parse(body);
        // console.log(wea);

        if(wea.cod != 200)
        {
            const errval = {
                search:false,
                error:true,
                City: wea.cod,
                errmsg: wea.message
            }
            res.render('index',errval);
            return;
        }

        const values = {
            search:true,
            error:false,
            City: wea.name+", "+wea.sys.country,
            temp: Math.round(wea.main.temp),
            hum : wea.main.humidity + "%",
            wind: wea.wind.speed+"m/s",
            Image: 'http://openweathermap.org/img/wn/'+wea.weather[0].icon+'@2x.png';//'https://openweathermap.org/img/w/'+wea.weather[0].icon+".png",   
            Desc: wea.weather[0].description
        }
        res.render('index',values);
    });
})
