const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys =require('./keys');
const User = require('../model/user-model');

passport.serializeUser((user,done) =>{
        done(null,user.id);

});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user) =>{
        done(null,user);
    });
});

passport.use(new GoogleStrategy({
    //option for the google start
    callbackURL :'/auth/google/redirect',
    clientID :keys.google.clientID,
    clientSecret:keys.google.clientSecret
},(accessToken,refereshToken,profile,done) => {
    //passport callback function
    // console.log("passport calllback function fired");
    // console.log(profile);

    //check if user already exists in our db
    User.findOne({googleId :profile.id}).then((currentUser) =>{
        if(currentUser){
            //already have the User
         //   console.log("user is " ,currentUser);
            done(null,currentUser);

         }else{
            
    new User({
        username:profile.displayName,
        googleId:profile.id,
        thumbnail:profile._json.image.url


    }).save().then((newUser) =>{
       // console.log('new user created :'+ newUser);
        done(null,newUser);
    });

  }
    });

})
)
