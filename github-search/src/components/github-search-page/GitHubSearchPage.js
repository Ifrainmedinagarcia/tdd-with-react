
import { Button, Container, Grid, TextField, Typography, Box, TablePagination } from '@material-ui/core'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {Content} from '../content'
import {getRepos} from '../../services/getRepos'
import { GithubTable } from '../github-table'

const ROWS_PER_PAGE_DEFAULT = 30
const INITIAL_CURRENT_PAGE = 0
const INITIAL_TOTAL_COUNT = 0

const GitHubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_DEFAULT)
  const [currentPage, setCurrentPage] = useState(INITIAL_CURRENT_PAGE)
  const [totalCount, setTotalCount] = useState(INITIAL_TOTAL_COUNT)
  const didMount = useRef(false)
  const searchByInput = useRef(null)

  const handleSearch = useCallback(async () => {
    setIsSearching(true)
    const response = await getRepos({q: searchByInput.current.value, rowsPerPage, currentPage})
    const data = await response.json()
    setReposList(data.items)
    setTotalCount(data.total_count)
    setIsSearchApplied(true)
    setIsSearching(false)
  }, [rowsPerPage, currentPage])

  const handleChangeRowsPerPage = ({target: { value }}) => {
    setRowsPerPage(value)
  }

  const handlerChangePage = (event, newPage) => setCurrentPage(newPage)

  useEffect(()=>{
    if (!didMount.current) {
      didMount.current = true
      return
    }
    handleSearch()
  }, [handleSearch])

  return (
    <Container>
       <Box my={4}>
        <Typography variant='h3' component="h1">
          Github repositories list
        </Typography>
       </Box>
      <Grid container spacing={2} justify="space-between">
        <Grid item md={6} xs={12}>
        <TextField 
          inputRef={searchByInput}
          fullWidth 
          label="filter by" 
          id='filterBy'
        />
        </Grid>
        <Grid item md={3} xs={12}>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            fullWidth 
            color='primary' 
            variant='contained'>Search</Button>
        </Grid>
      </Grid>
      <Box my={4}>
        <Content isSearchApplied={isSearchApplied} reposList={reposList}>
          <>
            <GithubTable reposList={reposList}/>
            <TablePagination
                  rowsPerPageOptions={[30,50,100]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={currentPage}
                  onChangePage={handlerChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </>
        </Content>
      </Box>
    </Container>
  )
}

export default GitHubSearchPage
