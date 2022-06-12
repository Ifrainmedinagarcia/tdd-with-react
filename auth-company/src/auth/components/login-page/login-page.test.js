import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "./login-page";

const passwordValidationMessage = /The password must contain at least 8 characters, one upper case letter, one number and one special character/i

beforeEach(()=> render(<LoginPage />))

const submitButton = () => {
    const buttonSubmit = screen.getByRole("button", {name: /send/i})
    fireEvent.click(buttonSubmit)
}

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
   test('should display required messages as the format: "The [field name] is required"', () => {
        expect(screen.queryByText(/The email is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/The password is required/i)).not.toBeInTheDocument()
        
        submitButton()

        expect(screen.getByText(/The email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/The password is required/i)).toBeInTheDocument()
   }); 
});

describe('Whe the user fills the fields and clicks the submit button', () => {
    test('should not display required messages', () => {
        const inputPassword = screen.getByLabelText(/password/i)
        const inputEmail = screen.getByLabelText(/email/i)
        
        fireEvent.change(inputEmail, {target: {value: "medina.ifrain@gmail.com"}})
        fireEvent.change(inputPassword, {target: {value: "123456"}})
        
        submitButton()

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