import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render , fireEvent, screen } from "@testing-library/react";
import { AuthGuard } from "./components/auth-guard";


export const renderWithRouter = (ui, {route = "/"}= {}) => {
    window.history.pushState({}, "", route)
    return render(ui, {wrapper: Router})
}

export const renderWithAuthProvider = (ui, {isAuth = false}= {}) => render(<AuthGuard isAuth={isAuth}>{ui}</AuthGuard>, {wrapper: Router})

export const goTo = (route) =>  window.history.pushState({}, "", route)


export const fillInputs = ({
    email = 'john.doe@test.com',
    password = 'Aa123456789!@#',
} = {}) => {
    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: email },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: password },
    })
}

export const submitButton = () => {
    const buttonSubmit = screen.getByRole("button", { name: /send/i })
    fireEvent.click(buttonSubmit)
}

export default {renderWithRouter, renderWithAuthProvider, goTo, fillInputs, submitButton}