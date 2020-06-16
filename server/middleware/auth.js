const {User} = require("../models/user");

let auth = (req,res,next)=>{
    //클라이언트 쿠키에서 토큰가져옴
    console.log("auth auth auth")
    console.log(req.cookies)
    let token = req.cookies.x_auth;

    //토큰 복호화 한 후 유저를 찾음
    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth:true, err:true})

        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth };