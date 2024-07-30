const Validator = require('fastest-validator');
const v = new Validator();

const userSchema = {
    username: {
        type: "string",
        min: 3,
        max: 30,
        pattern: "^[a-zA-Z0-9]+$" 
    },
    phone: {
        type: "string",
        min: 10,
        max: 13,
        optional: true 
    },
    password: {
        type: "string",
        min: 8, 
        pattern: "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$" 
    }
};

const validateUser = v.compile(userSchema);

module.exports = validateUser;
