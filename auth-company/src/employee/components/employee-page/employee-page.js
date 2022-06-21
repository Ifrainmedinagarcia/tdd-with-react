import { Button, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { ADMIN_ROLE } from "../../../consts";
import { UserLayout } from "../../../utils/components/user-layout";
import { AuthContext } from "../../../utils/contexts/auth-context";

export const EmployeePage = () => {
    const { user } = useContext(AuthContext)

    return (
        <UserLayout user={user}>
            <Typography component="h1" variant="h6">Employee page</Typography>
            {user.role === ADMIN_ROLE && <Button type="button">delete</Button>}
        </UserLayout>
    )
}


export default { EmployeePage }