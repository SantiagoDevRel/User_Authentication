const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const {Users} = require("./database")


const initializingPassport = (passport)=>{
    passport.use(
        new LocalStrategy(async(username,password,done)=>{
            try{
                const user = await Users.findOne({username})
                if(!user)return done(null,false);
                if(user.password !== password)return done(null,false);
                return done(null,user)
            }catch(error){
                return done(error,false)
            }
        })
    )
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser(async(id,done)=>{
        try{
            const user = await Users.findById(id)
            done(null,user)
        }catch(error){
            done(error,false)
        }
    })

}

const isAuth = (req,res,next)=>{
    if(req.user) return next()
    res.redirect("/login")
}

module.exports = {initializingPassport, isAuth}