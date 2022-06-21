import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { setupServer } from "msw/node"
import { handlers } from "./mocks/handlers";
import { AppRouter } from "./app-router";
import { renderWithAuthProvider, goTo, fillInputs, submitButton } from "./utils/tests"


const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())


describe('When the user is not authenticated and enters on admin page', () => {
    test('Must be redirected to login page', () => {
        goTo("/admin")
        renderWithAuthProvider(<AppRouter />)

        expect(screen.getByText(/login page/i)).toBeInTheDocument()
    });
});

describe('When the user is not aouthenticated and enters on employee page', () => {
    test('Must be redirected to login page ', () => {
        goTo("/employee")
        renderWithAuthProvider(<AppRouter />)

        expect(screen.getByText(/login page/i)).toBeInTheDocument()
    });
});

describe('When the user is authenticated and enters on admin page', () => {
    test("Must be redirected to login page", () => {
        goTo("/admin")
        renderWithAuthProvider(<AppRouter />, { isAuth: true })

        expect(screen.getByText(/admin page/i)).toBeInTheDocument()
    })
});

describe('When the admin is authenticated in login page', () => {
    test('Must be redirected to admin page', async () => {
        renderWithAuthProvider(<AppRouter />)
        fillInputs({ email: "admin@mail.com" })
        submitButton()

        expect(await screen.findByText(/Admin Page/i)).toBeInTheDocument()
        expect(await screen.findByText(/Jhon Doe/i)).toBeInTheDocument()
    });
});

describe('When the admin goes to employee page', () => {
    test('Must have access', async () => {
        goTo("/admin")

        renderWithAuthProvider(<AppRouter />, { isAuth: true })

        fireEvent.click(screen.getByText(/Employees/i))

        expect(await screen.findByText(/Employee Page/i)).toBeInTheDocument()
    });
});
