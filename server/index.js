const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { auth } = require('./middleware/auth')
const { RegisterUser, FindEmail,comparePassword,bcryptPassword ,generateToken, Logout, User_schema } = require('./database/testDAO')
const request = require('request');
const { application } = require('express')
const { urlencoded } = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

function getRandomInt(min,max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/api/hello', (req, res) => res.send('Hello World!!!!'))

app.get('/api/users/oauth/line', (req, res) => {
  console.log('Access Line Login')
  var RandomState = getRandomInt(10000000, 99999999)
  const LineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1657314919&redirect_uri=http://ec2-13-57-250-118.us-west-1.compute.amazonaws.com:5000/lineCallBack&state=${RandomState}&scope=profile%20openid`;
  
  return res.redirect(LineAuthUrl);
})

app.get('/lineCallBack', (req, res) => {
  console.log('Access Line CallBack')

  const code = req.query.code;
  const state = req.query.state;

  var jsonDataObj = {
    code,
    state,
    client_id : '1657314919',
    client_secret : '90479ec37d712c8c7ab33489a921946d',
    redirect_uri : 'http://ec2-13-57-250-118.us-west-1.compute.amazonaws.com:5000/lineCallBack',
    grant_type : 'authorization_code'
  }

  const options = {
    uri: "https://api.line.me/oauth2/v2.1/token",
    mothod : 'POST',
    form:jsonDataObj,
    headers: { 'Content-Type':'application/x-www-form-urlencoded'}
  }

  request.post(options , function(err,response, body){
    console.log(JSON.parse(body))

    const jsonbody= JSON.parse(body)

    const profile_options = {
      uri: "https://api.line.me/v2/profile",
      headers: { 'Authorization':'Bearer '+jsonbody.access_token}
    }
    console.log(profile_options)

    request(profile_options , function(err,response, body){
      console.log(body)
    })
  })

  return res.send('CallbackSuccess');
})

app.post("/api/users/login", (req, res) => {
  //1. 요청된 이메일을 데이터베이스에서 있는지 찾아본다.
  console.log('/api/users/login')
  FindEmail(req.body.email, (err, user) => {

    console.log(user)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    bcryptPassword(req.body.password, user.password, () => {
      //2. 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
      comparePassword(req.body.password, user.password, (err, isMatch) => {
        console.log(isMatch)
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다.",
          });

        //3. 비밀번호까지 맞다면 토큰을 생성한다.
        generateToken(user.id,(err, token) => {
          if (err) return res.status(400).send(err);

          //토큰을 쿠키/로컬스토리지에 저장할 수 있다. 여기에는 현재 쿠키로 진행할 예정
          res
            .cookie("x_auth", token)
            .status(200)
            .json({ loginSuccess: true, userId: user.id });
        });
      });
    })
  });
});

app.get('/api/users/auth', auth, (req, res) => {

  //role 1 admin , role 0 user
  console.log('/api/users/auth')
  res
    .status(200)
    .json(
      {
        id: req.id,
        isAuth: true,
        email: req.email,
        name: req.name,
        role: req.role
      }
    )
})

app.get('/api/users/logout', auth, (req, res) => {
  console.log('/api/users/logout')
  Logout(req.id, (err, user) => {
    if (err)
      return res.json({ success: false, err });
    console.log('logout isauth : '+req.isAuth)
    return res
      .status(200)
      .send({ success: true })
  })
})
app.post('/api/users/register', (req, res) => {
  console.log('/api/users/register')
  var schema = new User_schema();

  schema.name = req.body.name;
  schema.email = req.body.email;
  schema.password = req.body.password;

  bcryptPassword(schema.password , "", (err , hash) => {
    schema.password = hash
    RegisterUser(schema, (err) => {
      if (err) {
        console.log(err)
        return res.json({ success: false, err });
      } else
        return res
          .status(200)
          .json({
            //성공하였을 때 전달내용
            success: true
          });
    }
    )
  })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))