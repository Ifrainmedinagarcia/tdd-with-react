import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";


const validateEmail = (email) => {
    const regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
    return regex.test(email)
}
const passwordValidationMsg = "The password must contain at least 8 characters, one upper case letter, one number and one special character"

export const LoginPage = () => {
    const [emailValidationMessage, setEmailVAlidationMessage] = useState("")
    const [passwordValidationMessage, setPasswordVAlidationMessage] = useState("")
    const [formValues, setFormValues] = useState({
        email: "",
        password: ""
    })
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const {email, password} = e.target.elements

        if (!email.value) {
            setEmailVAlidationMessage("The email is required")
        }
        if (!password.value) {
            setPasswordVAlidationMessage("The password is required")
        }
    }

    const handleChange = ({target: {value, name}}) =>setFormValues({...formValues, [name]: value})
    
    const handleBlurEmail = ()=> {
        if (!validateEmail(formValues.email)) {
            setEmailVAlidationMessage("The email is invalid. Example: jhon.doe@gmail.com")
            return
        }
        setEmailVAlidationMessage("")
    }

    const handleBlurPassword = () => {
        const passwordRulesRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/

        if (!passwordRulesRegex.test(formValues.password)) {
            setPasswordVAlidationMessage(passwordValidationMsg)
        }
    }

    return (
        <>
            <h1>login page</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    onBlur={handleBlurEmail}
                    label="email" 
                    id="email" 
                    type="email" 
                    name="email"
                    helperText={emailValidationMessage}
                    onChange={handleChange}
                    value={formValues.email}
                />
                <TextField
                    onBlur={handleBlurPassword}
                    label="password" 
                    id="password" 
                    type="password"
                    name="password"
                    onChange={handleChange}
                    helperText={passwordValidationMessage}
                    value={formValues.password}
                />
                <Button type="submit">send</Button>
            </form>
        </>
    )
}


export default { LoginPage }