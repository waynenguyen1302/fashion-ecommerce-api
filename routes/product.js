const router = require("express").Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');
const Product = require("../models/Products");

//Create 

router.post("/", verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE Product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})

// //DELETE

router.delete("/:id", verifyTokenAndAdmin, async(req, res) =>{
    try {
        await Product.findByIdAndDelete(req.params.id)

        res.status(200).json("Product has been deleted.")
    } catch (error) {
        res.status(500).json(error)
    }
})

// //GET PRODUCT

router.get("/find/:id", async(req, res) =>{
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
})

// //GET ALL PRODUCTS

router.get("/", async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    const queryBrand = req.query.brand;
    const queryColor = req.query.color;
    try {
        let products;
        if(queryNew) {
            products = await Product.find().sort({createdAt: -1}).limit(5)
        } else if (queryCategory) {
            products = await Product.find({
                categories: {
                    $in: [queryCategory],
                }
            })
        } else if (queryBrand) {
            products = await Product.find({
                brand: {
                    $in: [queryBrand]
                }
            })
        }   else if (queryColor) {
            products = await Product.find({
                color: {
                    $in: [queryColor]
                }
            })
        }         
        else {
            products = await Product.find();
        }
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
})

// //GET USERS STAT
// router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
//     const date = new Date();
//     const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

//     try {
//         //count the total user registered every month, group items, mongoDB aggregate

//         const data = await User.aggregate([
//             {$match: {createdAt: {$gte: lastYear}}},
//             {
//                 $project: {
//                     //create month and take the month number inside createdAt date
//                     month: {$month: "$createdAt"}
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$month", 
//                     total: {$sum: 1}
//                 }
//             }
//         ]);
//         res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })


module.exports = router;