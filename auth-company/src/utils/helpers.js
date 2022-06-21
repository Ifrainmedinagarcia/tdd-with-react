export const validateEmail = (email) => {
    const regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
    return regex.test(email)
}

export const validatePassword = (pass) => {
    const passwordRulesRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/

    return passwordRulesRegex.test(pass)
}

export default{
    validateEmail,
    validatePassword
}