const express = require("express")
const app = express()
const passport = require("passport")
const bodyParser = require('body-parser')
const {initializingPassport, isAuth} = require("./passportConfig")
const session = require("express-session")

const {connectMongoose, userSchema, Users} = require("./database")
connectMongoose()
initializingPassport(passport)

app.use(bodyParser.json() );    
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.json())
//first initialize session then passports
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


//Connect templates EJS
app.set("view engine","ejs");


app.get("/",(req,res)=>{
    res.render("index")
})
        
app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",async(req,res)=>{
    const user = await Users.findOne({name: req.body.name});
    if(user){
        return res.status(400).send("User Exists")
    }
    console.log("REQBODY:",req.body)
    const newUser = new Users({
        name: req.body.name,
        password: req.body.password,
        username: req.body.username
    })
    newUser.save()
    console.log("USER PUSHED")
    res.status(201).send(newUser)
    
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",
    passport.authenticate('local', { failureRedirect: '/login', successRedirect:"/profile" })
)

app.get("/logout",(req,res)=>{
    res.logOut(()=>{})
    res.send("Logged out succesfully")
})

app.get("/profile", isAuth,(req,res)=>{
    res.send(req.user)
})


app.listen(3000,()=>{
    console.log("listening to port 3000")
})