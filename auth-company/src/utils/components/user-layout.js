import React from "react";
import { AppBar, Button, Container, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"

export const UserLayout = ({ user, children }) => {
    return (
        <Container>
            <AppBar>
                <Toolbar>
                    <Typography>
                        {user.username}
                    </Typography>
                    <Button component={Link} color="inherit" to="/employee">Employees</Button>
                </Toolbar>
            </AppBar>
            {children}
        </Container>
    )
}

UserLayout.propTypes = {
    user: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
    children: PropTypes.node.isRequired
}


export default { UserLayout }