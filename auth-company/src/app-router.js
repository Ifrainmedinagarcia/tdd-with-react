import React from "react";
import { Switch, Route , BrowserRouter as Router } from 'react-router-dom'
import { LoginPage } from "./auth/components/login-page/login-page";
import { PrivateRoute } from "./utils/components/private-route";
import { AdminPage } from "./admin/components/admin-page/admin-page";
import { EmployeePage } from "./employee/components/employee-page/employee-page";



export const AppRouter = () => {

    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <LoginPage />
                </Route>
                <PrivateRoute path="/admin" exact>
                    <AdminPage />
                </PrivateRoute>
                <PrivateRoute path="/employee" exact>
                    <EmployeePage />
                </PrivateRoute>
            </Switch>
        </Router>

    )
}

export default { AppRouter }