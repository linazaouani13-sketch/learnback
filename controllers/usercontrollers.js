const User = require('../models/User');
const updateProfileSchema = require('../validations/uppfvalidator')
// GET /api/users/profile
// get profile
exports.getprofile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const user = await User.findById(req.user.id).select('-passwordHash')
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.status(200).json(user)


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}
// PUT /api/users/profile
// updateprofile
exports.putprofile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const user = await User.findById(req.user.id).select('-passwordHash')
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        const { error, value } = updateProfileSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ success: false, errors });
        }

        if (value.name) {
            user.name = value.name;
        }

        if (value.profile) {
            // Merge the new profile fields into existing ones
            user.profile = {
                ...user.profile.toObject(),
                ...value.profile
            };
        }

        await user.save();

        // Return without password
        const updatedUser = user.toObject();
        delete updatedUser.passwordHash;

        res.status(200).json({
            success: true,
            data: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
//  GET /API/USERS/POINTS
    exports.getpoints = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const user = await User.findById(req.user.id).select('points')
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.status(200).json({ success: true, data: { points: user.points }})


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}