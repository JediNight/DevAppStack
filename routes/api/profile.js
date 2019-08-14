/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const auth = require ('../../middleware/auth');
const Profile = require ('../../models/Profile');
 // eslint-disable-next-line no-unused-vars
const User = require ('../../models/Users');

//@route    GET api/profile/me
//@desc     Get current users profile
//@access   Private
router.get('/me', auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);

        if (!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

}
);

//@route    POST api/profile/me
//@desc     Create or update profile
//@access   Private

router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()] // eslint-disable-next-line no-unused-vars
],async (req,res) => { // eslint-disable-next-line no-unused-vars
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body
        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;

}


    
);

module.exports = router;