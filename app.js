const express = require('express');
const path = require('path');

const app = express();


app.use('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req,res) => {
    res.send('hello word')
})

app.listen(3000, ()=>{
    console.log('App is listening on 3000 port.')
})