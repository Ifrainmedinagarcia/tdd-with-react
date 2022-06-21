import React from "react";
import { screen } from "@testing-library/react";
import { AdminPage } from "./admin-page"
import { AuthContext } from "../../../utils/contexts/auth-context"
import {renderWithAuthProvider} from "../../../utils/tests"

describe('When the admin page is mounted', () => {
    test('Must display the admin user name', () => {
        renderWithAuthProvider(
            <AuthContext.Provider value={{user: {username: "Jhon doe"}}}>
                <AdminPage />
            </AuthContext.Provider>
        )
        expect(screen.getByText(/Jhon Doe/i)).toBeInTheDocument()
    });
});