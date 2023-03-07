const router = require("express").Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');
const User = require("../models/User");

// http:localhost:5000/api/user/usertest
// router.get("/usertest", (req, res) => {
//     res.send("user test is successful")
// })

//UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SECRET)
        .toString(); 
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

//DELETE

router.delete("/:id", verifyTokenAndAuthorization, async(req, res) =>{
    try {
        await User.findByIdAndDelete(req.params.id)

        res.status(200).json("User has been deleted.")
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET USER

router.get("/find/:id", verifyTokenAndAdmin, async(req, res) =>{
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET USER

router.get("/", verifyTokenAndAdmin, async(req, res) =>{
    //http://localhost:5000/api/users?query=true 
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET USERS STAT
router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        //count the total user registered every month, group items, mongoDB aggregate

        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    //create month and take the month number inside createdAt date
                    month: {$month: "$createdAt"}
                }
            },
            {
                $group: {
                    _id: "$month", 
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;