import React from "react"
import { 
    Avatar,
    Box, 
    Link, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow, 
    Typography 
  } from '@material-ui/core'
  import PropTypes from "prop-types"

const tableHeaders = ["Repository", "Stars", "Forks", "Open Issues", "Updated at"]


export const Content = ({isSearchApplied , reposList, rowsPerPage, setRowsPerPage}) => {
    const handleChangeRowsPerPage = ({target: { value }}) => {
      setRowsPerPage(value)
    }
    const renderWithBox = (cb) => (
      <Box height={400} display="flex" alignItems="center" justifyContent="center">
        {cb}
      </Box>
    )

    if (isSearchApplied && !!reposList.length) {
      return(     
        <Paper>
            <TableContainer>
            <Table>
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
            <TablePagination
                rowsPerPageOptions={[30,50,100]}
                component="div"
                count={1}
                rowsPerPage={rowsPerPage}
                page={0}
                onChangePage={()=> {}}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
      )
    }

    if (isSearchApplied && !reposList.length) {
      return renderWithBox(()=> (
        <Typography>You search has no results</Typography>
      ))
    }

    return renderWithBox(()=> (
      <Typography>Please provide a search option and click in the search button</Typography>
    ))
  }

  Content.propTypes = {
    isSearchApplied: PropTypes.bool.isRequired,
    reposList: PropTypes.arrayOf.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    setRowsPerPage: PropTypes.func.isRequired
  }

  export default Content