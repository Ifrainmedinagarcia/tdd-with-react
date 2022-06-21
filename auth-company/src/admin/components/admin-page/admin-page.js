import { Typography } from "@material-ui/core"
import React, { useContext } from "react"
import { AuthContext } from "../../../utils/contexts/auth-context"
import { UserLayout } from "../../../utils/components/user-layout"


export const AdminPage = () => {
  const { user } = useContext(AuthContext)
  return (
    <UserLayout user={user}>
      <Typography component="h1" variant="h6">Admin page</Typography>
    </UserLayout>
  )
}


export default { AdminPage }