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

export const Content = ({isSearchApplied}) => {
    return  (
      isSearchApplied ? (
          <Paper>
            <TableContainer>
            <Table>
                <TableHead>
                <TableRow>
                    {tableHeaders.map(name => <TableCell key={name}>{name}</TableCell>)}
                </TableRow>
                </TableHead>
                <TableBody>
                <TableRow>
                    <TableCell>
                    <Avatar alt='test' src='/logo192.png'/>
                    <Link href='https://localhost:3000/test'>Test</Link>
                    </TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>2020-01-01</TableCell>
                </TableRow>
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination 
                rowsPerPageOptions={[30,50,100]}
                component="div"
                count={1}
                rowsPerPage={30}
                page={0}
                onChangePage={()=> {}}
                onChangeRowsPerPage={()=>{}}
            />
          </Paper>
      ) 
      :(
      <Box height={400} display="flex" alignItems="center" justifyContent="center">
        <Typography>Please provide a search option and click in the search button</Typography>
      </Box>
      ))
  }

  Content.propTypes = {
    isSearchApplied: PropTypes.bool.isRequired
  }

  export default Content