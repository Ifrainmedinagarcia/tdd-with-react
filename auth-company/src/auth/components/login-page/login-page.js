import React, { useState, useContext } from "react";
import { 
    Avatar, 
    Button, 
    CircularProgress, 
    Container, 
    CssBaseline, 
    makeStyles, 
    Snackbar, 
    TextField, 
    Typography 
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { login } from "../../services";
import { ADMIN_ROLE } from "../../../consts";
import { AuthContext } from "../../../utils/contexts/auth-context";

const passwordValidationMsg = `The password must contain at least 8 characters, 
one upper case letter, one number and one special character`

const validateEmail = (email) => {
    const regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
    return regex.test(email)
}

const validatePassword = (pass) => {
    const passwordRulesRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/

    return passwordRulesRegex.test(pass)
}
const useStyles = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }))

export const LoginPage = () => {
    const clasess = useStyles()
    const {handleSuccessLogin} = useContext(AuthContext)
    const [emailValidationMessage, setEmailValidationMessage] = useState("")
    const [passwordValidationMessage, setPasswordValidationMessage] = useState("")
    const [formValues, setFormValues] = useState({
        email: "",
        password: ""
    })
    const [isFetching, setIsFetching] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [user, setUser] = useState({role: ""})

    const validateForm = ()=> {
        const {email, password} = formValues

        const isEmailEmpty = !email
        const isPasswordEmpty = !password

        if (isEmailEmpty) {
            setEmailValidationMessage("The email is required")
        }
        if (isPasswordEmpty) {
            setPasswordValidationMessage("The password is required")
        }

        return isEmailEmpty || isPasswordEmpty

    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) return
        const {email, password} = formValues
        try {
            setIsFetching(true)
            const response = await login({email, password})
            if (!response.ok) {
                throw response
            }
            const {user: { role }} = await response.json()
            setUser({role})
            handleSuccessLogin()
        } catch (error) {
            const data = await error.json()
            setErrorMessage(data.message)
            setIsOpen(true)
        } finally{
            setIsFetching(false)
        }
    }

    const handleChange = ({target: {value, name}}) => setFormValues({...formValues, [name]: value})
    
    const handleBlurEmail = () => {
        if (!validateEmail(formValues.email)) {
            setEmailValidationMessage("The email is invalid. Example: jhon.doe@gmail.com")
            return
        }
        setEmailValidationMessage("")
    } 
 
    const handleBlurPassword = () => {
        if (!validatePassword(formValues.password)) {
            setPasswordValidationMessage(passwordValidationMsg)
            return
        }
        setPasswordValidationMessage("")
    }

    const handleClose = () => setIsOpen(false)

    if (!isFetching && user.role === ADMIN_ROLE) {
        return <Redirect to="/admin"/>
    }
    
    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline>
            <div className={clasess.paper}>
                <Avatar className={clasess.avatar} />
                <Typography component="h1" variant="h5">login page</Typography>
                {isFetching &&  <CircularProgress data-testid="loading-indicator"/>}
                <form onSubmit={handleSubmit} className={clasess.form}>
                    <TextField
                        margin="normal"
                        fullWidth
                        onBlur={handleBlurEmail}
                        label="email"
                        id="email"
                        type="email"
                        name="email"
                        variant="outlined"
                        helperText={emailValidationMessage}
                        onChange={handleChange}
                        value={formValues.email}
                        error={!!emailValidationMessage.length}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        onBlur={handleBlurPassword}
                        label="password"
                        id="password"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        helperText={passwordValidationMessage}
                        value={formValues.password}
                        error={!!passwordValidationMessage.length}
                    />
                    <Button 
                        variant="contained" 
                        className={clasess.submit} 
                        fullWidth color="primary" 
                        disabled={isFetching} 
                        type="submit"
                        >
                            send
                        </Button>
                </form>
                <Snackbar 
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                    open={isOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message={errorMessage}
                />
            </div>
          </CssBaseline>
        </Container>
    )
}

export default { LoginPage }