import React from "react";
import { screen, render} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import {EmployeePage}  from "./employee-page"
import { AuthContext } from "../../../utils/contexts/auth-context";
import {ADMIN_ROLE, EMPLOYEE_ROLE} from "../../../consts/index"

const renderWith = ({role, username = "Jhon Doe"}) => {
    return render(
        <AuthContext.Provider value={{user: {username, role}}}>
            <EmployeePage />
        </AuthContext.Provider>, {wrapper: Router}
    )
}

describe('When the Admin access to employee page', () => {
    test('Must have access to delete the employee button', () => {
        renderWith({role: ADMIN_ROLE})
        expect(screen.getByRole("button", {name: /delete/i})).toBeInTheDocument()
    });
});

describe('When the employee access to employee page', () => {
    test('Must doesnt have access to delete the employee button', () => {
        renderWith({role: EMPLOYEE_ROLE})
        expect(screen.queryByRole("button", {name: /delete/i})).not.toBeInTheDocument()
    });

    test('The employee username sould be displayed on the common navbar ', () => {
        renderWith({role: EMPLOYEE_ROLE, username: "joana doe"})
        expect(screen.getByText(/Joana doe/i)).toBeInTheDocument()
    });
});