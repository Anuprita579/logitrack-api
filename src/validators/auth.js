const validator = require("validator");

const validateSignupData = (data) =>{
    const {name, email, password, role} = data;
    const errors = {};

    if (!name) {
        errors.name = "Name is required.";
    } else if (name.length < 3) {
        errors.name = "Name should be at least 3 characters long.";
    } else if (name.length > 50) {
        errors.name = "Name should not exceed 50 characters.";
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        errors.name = "Name should contain only alphabets.";
    }

    if (!email) {
        errors.email = "Email is required.";
    } else if (!validator.isEmail(email)) {
        errors.email = "Invalid email format.";
    }

    if (!password) {
        errors.password = "Password is required.";
    } else if (!validator.isStrongPassword(password)) {
        errors.password = "Password is not strong enough.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

const validateLoginData = (data) => {
    const { email, password } = data;
    const errors = {};

    if (!email) {
        errors.email = "Email is required.";
    } else if (!validator.isEmail(email)) {
        errors.email = "Invalid email format.";
    }

    if (!password) {
        errors.password = "Password is required.";
    } 

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

module.exports = {validateSignupData, validateLoginData};