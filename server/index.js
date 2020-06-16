const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require("./middleware/auth");
const {User} = require("./models/user");

//application/x-www-form-urlcoded
app.use(bodyParser.urlencoded({extended: true}));
//application//joson
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connectes~~!!!'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/hello', (req,res) => {
    res.send("안녕하세요")
})


app.post('/api/users/register',(req,res) => {
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

app.post('/api/users/login',(req,res)=>{
    console.log('login')
    //1.요청된 이메일을 db에서 찾음
    User.findOne({email: req.body.email},(err,user) =>{
        if(!user){
            return res.json({
                loginSuccess : false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //2.비밀번호 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({loginSuccess: false,message: "비밀번호가 틀렸습니다."})

            //3.토큰생성
            user.generateToken((err,user) =>{
                if(err) return res.status(400).send(err);

                //토큰을 쿠키에 저장
                res.cookie("x_auth",user.token)
                    .status(200)
                    .json({loginSuccess:true,userId:user._id})
            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
    console.log("call auth")
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    console.log("call logout")
    console.log(req.user)
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }
        , (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})

const port = 5000
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

