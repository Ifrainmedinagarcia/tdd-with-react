import { Button, Typography } from "@material-ui/core";
import React, {useContext} from "react";
import { ADMIN_ROLE } from "../../../consts";
import { AuthContext } from "../../../utils/contexts/auth-context";

export const EmployeePage = () => {
    const {user} = useContext(AuthContext)

    return (
        <>
            <Typography component="h1" variant="h5">Employee Page</Typography>
            {user.role === ADMIN_ROLE && <Button type="button">delete</Button>}
        </>
    )
}


export default {EmployeePage}