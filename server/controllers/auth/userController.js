const User = require("../../models/auth/user");

const userLogin = async(req, res) => {
    const { userName, email, password } = req.body;

    try {

        const checkUser = await User.findOne({email});

        if(!checkUser)
            return res.json({
                success: false,
                message: "User Already exists with the same email! Please try again"
            });

        const newUser = new User({
            userName,
            email,
            password
        });
        
        newUser.save();

        res.status(200).json({
            success: true,
            msg: "Registration successful"
        });

    } catch (error) {
        console.log("Catch error from userController: ", error);
        res.status(501).json({
            success: false,
            msg: "Something went wrong"
        });
    }
}

module.exports = { userLogin }