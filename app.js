const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const _ = require('lodash');
const LocalStrategy = require('passport-local');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());



const messageSchema = {
    name: String,
    email: String,
    subject: String,
    message: String,
    created: String,
    status: String
};

const Message = mongoose.model("Message", messageSchema);



app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/admin")
    }else{
        res.render("login");
    }
});

app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

app.get("/admin", async (req, res) => {
    if (req.isAuthenticated()) {
        const value = req.query.tab ?? "";
        let cond = {};
        const read = req.query.read;
        const unread = req.query.unread;
        if (read !== undefined) {
            let update = "read"
            await Message.findOneAndUpdate({ _id: read }, { $set: { status: update } }).then(() => {
            }).catch(function (err) {
                console.log(err);
            })
        }
        if (unread !== undefined) {
            let update = "unread"
            await Message.findOneAndUpdate({ _id: unread }, { $set: { status: update } }).then(() => {
            }).catch(function (err) {
                console.log(err);
            })
        }
        if (value === "read" || value === "unread") {
            cond = { status: value };
        }
        Message.find(cond).then(function (foundMessages) {
            res.render("admin", { value: value, messages: foundMessages });
        }).catch(function (err) {
            console.log(err);
        });
    } else {
        res.redirect("/login");
    }
});


app.post("/", (req, res) => {
    const date = new Date().toLocaleDateString('en-us', { month: "short", day: "numeric" });
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const status = "unread"

    const newMessage = new Message({
        name: name,
        email: email,
        subject: subject,
        message: message,
        created: date,
        status: status
    });

    newMessage.save().then(() => {
        res.redirect("/");
    }).catch(function (err) {
        console.log(err);
    });
});


app.post("/login", (req, res,next) => {
    const user = new User({
        username: req.body.email,
        password: req.body.password
      });
      req.login(user, function(err){
          if (err) {
              console.log(err);
            } else {
            passport.authenticate("local",function(err, user, info, status){
                console.log(user);
                 res.redirect("/admin");
            })(req, res, next);
        }
      });
    
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
