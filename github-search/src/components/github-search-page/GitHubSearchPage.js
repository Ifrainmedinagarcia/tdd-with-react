
import { Button, Container, Grid, TextField, Typography, Box } from '@material-ui/core'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {Content} from '../content'
import {getRepos} from '../../services/getRepos'

const GitHubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])
  const [searchBy, setSearchBy] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(30)
  const didMount = useRef(false)

  const handleSearch = useCallback(async () => {
    setIsSearching(true)
    const response = await getRepos({q: searchBy, rowsPerPage})
    const data = await response.json()
    setReposList(data.items)
    setIsSearchApplied(true)
    setIsSearching(false)
  }, [rowsPerPage, searchBy])

  const handleChange = ({target: {value}}) => setSearchBy(value)

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
        <TextField value={searchBy} onChange={handleChange} fullWidth label="filter by" id='filterBy'/>
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
        <Content 
          isSearchApplied={isSearchApplied} 
          reposList={reposList} 
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Box>
    </Container>
  )
}

export default GitHubSearchPage
