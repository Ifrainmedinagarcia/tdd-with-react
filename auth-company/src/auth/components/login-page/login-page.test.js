import React from "react";
import { screen, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import {setupServer} from "msw/node"
import { rest } from "msw";
import { LoginPage } from "./login-page";
import { handlers, handlerInvalidCredentials } from "../../../mocks/handlers";
import { HTTP_UNEXPECTED_ERROR_STATUS } from "../../../consts";
import { renderWithRouter , submitButton } from "../../../utils/tests";
import { AuthContext } from "../../../utils/contexts/auth-context";




const server = setupServer(...handlers)


beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

beforeEach(()=> renderWithRouter(
    <AuthContext.Provider value={{handleSuccessLogin: jest.fn()}}>
        <LoginPage/>
    </AuthContext.Provider>
))


const passwordValidationMessage = /The password must contain at least 8 characters, one upper case letter, one number and one special character/i

describe('When login page is mounted', () => {
    test('must display the login title ', () => {
        expect(screen.getByText(/login page/i)).toBeInTheDocument()
    });
    test('must have a form with the following fields: email, password and submit button', () => {
        const inputPassword = screen.getByLabelText(/password/i)
        const inputEmail = screen.getByLabelText(/email/i)

        expect(inputEmail).toBeInTheDocument()
        expect(inputPassword).toBeInTheDocument()
        expect(inputPassword.type).toBe("password")
        expect(inputEmail.type).toBe("email")
        expect(screen.getByRole("button", {name: /send/i})).toBeInTheDocument()
    });
});

describe('Whe the user leaves empty fields and clicks the submit button', () => {
   test('should display required messages as the format: "The [field name] is required"', async () => {
        expect(screen.queryByText(/The email is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/The password is required/i)).not.toBeInTheDocument()
        
        submitButton()

        await waitFor(()=> expect(screen.getByRole("button", {name: /send/i})).not.toBeDisabled())

        expect(screen.getByText(/The email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/The password is required/i)).toBeInTheDocument()
   }); 
});

describe('Whe the user fills the fields and clicks the submit button', () => {
    test('should not display required messages', async () => {
        const inputPassword = screen.getByLabelText(/password/i)
        const inputEmail = screen.getByLabelText(/email/i)
        
        fireEvent.change(inputEmail, {target: {value: "medina.ifrain@gmail.com"}})
        fireEvent.change(inputPassword, {target: {value: "123456"}})
        
        submitButton()

        await waitFor(()=> expect(screen.getByRole("button", {name: /send/i})).not.toBeDisabled())

        expect(screen.queryByText(/The email is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/The password is required/i)).not.toBeInTheDocument()
    });
});

describe('When the user fills and blur the email input with invalid email, and then focus and change with valis value', () => {
    test('must no display a validation message', () => {
        const inputEmail = screen.getByLabelText(/email/i)
        
        fireEvent.change(inputEmail, {target: {value: "invalid.email"}})
        fireEvent.blur(inputEmail)
        
        expect(screen.getByText(/The email is invalid. Example: jhon.doe@gmail.com/i)).toBeInTheDocument()

        fireEvent.change(inputEmail, {target: {value: "medina.ifrain@mail.com"}})

        fireEvent.blur(inputEmail)

        expect(screen.queryByText(/The email is invalid. Example: jhon.doe@gmail.com/i)).not.toBeInTheDocument()
    });
});

describe('When the user fills and blur the password input with a value with 7 character length', () => {
    test('should display the validation message "The password must contain at least 8 characters", one upper case letter, one number and one special character', () => {
        const passwordSevenLengthValue = "szafadg"
        const inputPassword = screen.getByLabelText(/password/i)
        fireEvent.change(inputPassword, {target: {value: passwordSevenLengthValue}})

        fireEvent.blur(inputPassword)

        expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
    });
});

describe('When the user fills an blur the password input with a value one upper case character', () => {
    test('should display the validation message "The password must contain at least 8 characters", one upper case letter, one number and one special character', () => {
        const passwordWithOutUpperCaseValue = "szafadg8"
        const inputPassword = screen.getByLabelText(/password/i)
        fireEvent.change(inputPassword, {target: {value: passwordWithOutUpperCaseValue}})

        fireEvent.blur(inputPassword)

        expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
    });
});

describe('When the user fills an blur the password input with a value without one number', () => {
    test('should display the validation message "The password must contain at least 8 characters", one upper case letter, one number and one special character', () => {
        const passwordWithOutNumberValue = "szafadgA"
        const inputPassword = screen.getByLabelText(/password/i)
        fireEvent.change(inputPassword, {target: {value: passwordWithOutNumberValue}})

        fireEvent.blur(inputPassword)

        expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
    });
});

describe('when the user fills and blur the password input with a value without one special character', () => {
    test('should display the validation message "The password must contain at least 8 characters", one upper case letter, one number and one special character', () => {
        const passwordWithOutCharacterSpecialValue = "szafadgA8"
        const inputPassword = screen.getByLabelText(/password/i)
        fireEvent.change(inputPassword, {target: {value: passwordWithOutCharacterSpecialValue}})

        fireEvent.blur(inputPassword)

        expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
    });
});

describe('When the user fills and blur the password input a invalid value and then change with valid value and bllur again', () => {
  test('Must not display the validation message', () => {
    const passwordWithOutCharacterSpecialValue = "szafadgA8"
    const validPassword = "aA1#sdfs"
    const inputPassword = screen.getByLabelText(/password/i)
    fireEvent.change(inputPassword, {target: {value: passwordWithOutCharacterSpecialValue}})

    fireEvent.blur(inputPassword)

    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()

    fireEvent.change(inputPassword, {target: {value: validPassword}})

    fireEvent.blur(inputPassword)

    expect(screen.queryByText(passwordValidationMessage)).not.toBeInTheDocument()

  });
})

describe('When teh user submit the login form with valid date', () => {
    test('Must disable the submit buttom while the form page is fetching the data', async () => {
        const validPassword = "aA1#sdfs"
        const inputPassword = screen.getByLabelText(/password/i)
        const inputEmail = screen.getByLabelText(/email/i)
        
        fireEvent.change(inputEmail, {target: {value: "medina.ifrain@gmail.com"}})
        fireEvent.change(inputPassword, {target: {value: validPassword}})
        submitButton()
        expect(screen.getByRole("button", {name: /send/i})).toBeDisabled()

        await waitFor(()=> expect(screen.getByRole("button", {name: /send/i})).not.toBeDisabled())

    });
    test('Must be a loading indicator at the top of the form while it is fetching', async () => {
        expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument()
        const validPassword = "aA1#sdfs"
        const inputPassword = screen.getByLabelText(/password/i)
        const inputEmail = screen.getByLabelText(/email/i)
        
        fireEvent.change(inputEmail, {target: {value: "medina.ifrain@gmail.com"}})
        fireEvent.change(inputPassword, {target: {value: validPassword}})
        
        submitButton()

        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument()

        await waitForElementToBeRemoved(()=> screen.queryByTestId("loading-indicator"))
    });
});

describe('When the user submit the login form with valid data and is an unexpected server error', () => {
    test('Must display the error message "Unexpected error, please try again" from the api', async () => {
        server.use(rest.post('/login', (_req, res, ctx) => 
            res(ctx.status(HTTP_UNEXPECTED_ERROR_STATUS), ctx.json({message: "Unexpected error, please try again"}))))
        
        expect(screen.queryByText(/Unexpected error, please try again/i)).not.toBeInTheDocument()
        
        const validPassword = "aA1#sdfs"
        const inputPassword = screen.getByLabelText(/password/i)
        const inputEmail = screen.getByLabelText(/email/i)
        
        fireEvent.change(inputEmail, {target: {value: "medina.ifrain@gmail.com"}})
        fireEvent.change(inputPassword, {target: {value: validPassword}})
        submitButton()

        expect(await screen.findByText(/Unexpected error, please try again/i)).toBeInTheDocument()
    
    });
    
});

describe('When the user submit the login form with valid data and there is an invalid credentials error', () => {
    test('Must display the error message "The email or password are not correct" from the api', async () => {
        const wrongEmail = "wrong@mail.com"
        const wrongPassword = "Aa12345678#"
        
        server.use(handlerInvalidCredentials({wrongEmail, wrongPassword}))

        expect(screen.queryByText(/The email or password are not correct/i)).not.toBeInTheDocument()

        const inputPassword = screen.getByLabelText(/password/i)
        const inputEmail = screen.getByLabelText(/email/i)
        
        fireEvent.change(inputEmail, {target: {value: wrongEmail}})
        fireEvent.change(inputPassword, {target: {value: wrongPassword}})
        submitButton()

        expect(await screen.findByText(/The email or password are not correct/i)).toBeInTheDocument()
    });
});
