const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const config = require('./config/key');

const {User} = require("./models/user");

//application/x-www-form-urlcoded
app.use(bodyParser.urlencoded({extended: true}));
//application//joson
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connectes~~!!!'))
    .catch(err => console.log(err))

/*
* mongoose.connect('mongodb+srv://Ziyoung:abcd1234@cluster-tzg33.mongodb.net/Clusters?retryWrites=true&w=majoritynp',{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connectes~~'))
    .catch(err => console.log(err))
* */

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/register',(req,res) => {
    //회원가입시 필요한 정보 client에서 가져오면 db에 저장
    const user = new User(req.body)
    user.save((err,userInfo) =>{
        if(err) return res.json({ success : false, err})
        return res.status(200).json({
                success: true
            }
        )
    })
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

