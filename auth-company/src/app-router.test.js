import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import {setupServer} from "msw/node"
import { rest } from "msw";
import {handlers} from "./mocks/handlers";
import { AppRouter } from "./app-router";
import {renderWithRouter} from "./utils/tests"


const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

const fillInputs = ({
    email = 'john.doe@test.com',
    password = 'Aa123456789!@#',
  } = {}) => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: email},
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: password},
    })
  }

  const submitButton = () => {
    const buttonSubmit = screen.getByRole("button", {name: /send/i})
    fireEvent.click(buttonSubmit)
}

describe('When the user is not authenticated and enters on admin page', () => {
    test('Must be redirected to login page', () => {
        renderWithRouter(<AppRouter />, {route: "/admin"})
        expect(screen.getByText(/login page/i)).toBeInTheDocument()
    });
});

describe('When the user is not aouthenticated and enters on employee page', () => {
    test('Must be redirected to login page ', () => {
        renderWithRouter(<AppRouter />, {route: "/employee"})
        expect(screen.getByText(/login page/i)).toBeInTheDocument()
    });
});

describe('When the user is authenticated and enters on admin page', () => {
    test("Must be redirected to login page", ()=> {
        renderWithRouter(<AppRouter isAuth/>, {route: "/admin"})

        expect(screen.getByText(/admin page/i)).toBeInTheDocument()
    })
});

describe('When the admin is authenticated in login page', () => {
    test('Must be redirected to admin page', async () => {
        renderWithRouter(<AppRouter />)
        fillInputs({email: "admin@mail.com"})
        submitButton()
        expect(await screen.findByText(/Admin Page/i)).toBeInTheDocument()
    });
    
});