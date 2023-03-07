const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

//register

router.post("/register" , async (req,res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString() 
    });
    //save user to our db
    try {
        const savedUser = await newUser.save();
        //send directly to client
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json(error)
    }    
})

//login

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        !user && res.status(401).json('Wrong username or password!')

        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET)        
        const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8)
        const inputPassword = req.body.password;
        originalPassword !== inputPassword && res.status(401).json('wrong username or password!')

        //destructure user -> separate password and username, etc and send information without the password
        const { password, ...others } = user._doc;

        //secure the app with jwt
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,

            }, 
            process.env.JWT_SECRET,
            {expiresIn: "3d"}
        );

        res.status(200).json({...others, accessToken});

    } catch (error) {
        res.status(500).json(error)
    }
    
})


module.exports = router;