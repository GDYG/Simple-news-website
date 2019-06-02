let express = require('express');
let db = require('./routes/mysql.js');
let app = express();
let path = require('path');
let session = require('express-session');
let bodyParser = require('body-parser');
// 下面三行设置渲染的引擎模板
app.set('views', './views'); //设置模板的目录
app.set('view engine', 'html'); // 设置解析模板文件类型：这里为html文件
app.engine('html', require('ejs').__express); // 使用ejs引擎解析html文件中ejs语法
app.use(bodyParser.json()); // 使用bodyParser中间件，
app.use(bodyParser.urlencoded({ extended: true }));
// 使用 session 中间件
app.use(session({
    secret : 'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));

// 获取登录页面
app.use(express.static('views'));
app.use('/static',express.static(path.join(__dirname, './public')));
// 用户登录
app.post('/login', function(req, res){
    let sql = 'select count(*) as cc from loginform where phone=? and upwd=?';
    let data = [req.body.inputLogin,req.body.password];
    db.base(sql,data,(results)=>{
        if(results[0].cc == 1){
            req.session.phone = req.body.inputLogin; // 登录成功，设置 session
                req.session.userPwd = req.body.password;
                res.redirect('/user');
        }else{
            res.send('<span>用户名或密码不正确，请重新登录</span><a href="/user">返回登录</a>');
        }
    })
});
// 获取主页
app.get('/user', function (req, res) {
    if(req.session.phone){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('login',{phone : req.session.phone});
    }else{
        res.redirect('index.html');
    }
})
//注册
app.get('/home',(req,res)=>{
    res.render('home');
})
//注册提交数据库
app.post('/loginUp',(req,res)=>{
    let sql1 = 'select count(*) as aa from loginform where phone=? and upwd=?';
    let data1 = [req.body.tel,req.body.pw];
    db.base(sql1,data1,(results)=>{
        if(results[0].aa == 1){
            res.send('<span>该手机号已注册！</span><a href="/home">重新注册</a>');
        }else{
            let sql = 'insert into loginform set ?'
            let data = {
                phone : req.body.tel,
                upwd : req.body.pw
            }
            db.base(sql,data,(ret)=>{
                if(ret){
                    res.send('<span>注册成功，请登录</span>&nbsp;&nbsp;<a href="/user">登录</a>');
                }
            })
        }
    })

})


// 退出
app.get('/logout', function (req, res) {
    req.session.phone = null; // 删除session
    res.redirect('index.html');
});

app.listen(3000);
