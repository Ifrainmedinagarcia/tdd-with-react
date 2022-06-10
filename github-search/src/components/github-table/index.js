import React from "react";
import { 
    Avatar,
    Link, 
    makeStyles, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
  } from '@material-ui/core'
import PropTypes from "prop-types"

const tableHeaders = ["Repository", "Stars", "Forks", "Open Issues", "Updated at"]

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  }
})

export const GithubTable = ({reposList})=> {
  const classes = useStyles()
  return (
    <TableContainer className={classes.container}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {tableHeaders.map(name => <TableCell key={name}>{name}</TableCell>)}
          </TableRow>
          </TableHead>
            <TableBody>
              {reposList.map(
                  ({
                    name,
                    id,
                    stargazers_count: stargazersCount,
                    forks_count: forksCount,
                    open_issues_count: openIssuesCount,
                    updated_at: updatedAt,
                    html_url: htmlUrl,
                    owner: {avatar_url: avatarUrl},
                  }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <Avatar alt={name} src={avatarUrl} />
                      <Link href={htmlUrl}>{name}</Link>
                    </TableCell>
                    <TableCell>{stargazersCount}</TableCell>
                    <TableCell>{forksCount}</TableCell>
                    <TableCell>{openIssuesCount}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
                  </TableRow>
                  ),
                )}
              </TableBody>
          </Table>
          </TableContainer>
  )
}

GithubTable.propTypes = {
  reposList:  PropTypes.arrayOf.isRequired,
}

export default {GithubTable}