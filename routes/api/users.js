const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/Users');

//@route    GET api/users
//@desc     Register user 
//@access   Public
router.post('/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a value').isEmail(),
        check('password', 'Please enter a password with a 6 or more characeters').isLength({min: 6})
    ],
    async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        
    const{ name, email, password } = req.body; //parsing email from request

    try {
    //See if users exists
        let user = await User.findOne({email});

        if (user){
            return res.status(400).json({errors : [{ msg: 'User already exists '}]})
        }

        const avatar = gravatar.url(email,
            {s:'200',
            r:'pg',
            d:'mm'});
        //create user
        user = new User({
            name,
            email,
            avatar,
            password
        });
    //Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
    //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'),{expiresIn: 360000},  /*after authentication, create login token: pass in secret from default.json, 
                set expiration to 100hrs, will change to an hour in production*/
                (err,token)=> {
                    if (err) throw err;
                    res.json({ token });
                    }
                );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

    }
);



module.exports = router;
