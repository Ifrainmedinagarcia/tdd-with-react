import { AppBar, Button, Toolbar, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import React, {useContext} from "react"
import { AuthContext } from "../../../utils/contexts/auth-context"


export const AdminPage = () => {
    const {user} = useContext(AuthContext)
    return (
        <>
        <Typography component="h1" variant="h6">Admin page</Typography>
        <AppBar>
            <Toolbar>
              <Typography>
                {user.username}
              </Typography>
              <Button component={Link} color="inherit" to="/employee">Employees</Button>
            </Toolbar>
        </AppBar>
        </>
    )
}


export default { AdminPage }