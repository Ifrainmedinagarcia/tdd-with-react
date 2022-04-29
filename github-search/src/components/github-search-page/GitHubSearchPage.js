
import { Button, Container, Grid, TextField, Typography, Box } from '@material-ui/core'
import React, { useState } from 'react'
import {Content} from '../content'


const GitHubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])

  const handleClick = async () => {
    setIsSearching(true)
    const response = await fetch("https://api.github.com/search/repositories?q=react+language:python&page=2&per_page=50")
    const data = await response.json()
    setReposList(data.items)
    setIsSearchApplied(true)
    setIsSearching(false)
  }

  return (
    <Container>
       <Box my={4}>
        <Typography variant='h3' component="h1">
          Github repositories list
        </Typography>
       </Box>
      <Grid container spacing={2} justify="space-between">
        <Grid item md={6} xs={12}>
        <TextField fullWidth label="filter by" id='filterBy'/>
        </Grid>
        <Grid item md={3} xs={12}>
          <Button
            onClick={handleClick}
            disabled={isSearching}
            fullWidth 
            color='primary' 
            variant='contained'>Search</Button>
        </Grid>
      </Grid>
      <Box my={4}>
        <Content isSearchApplied={isSearchApplied} reposList={reposList}/>
      </Box>
    </Container>
  )
}

export default GitHubSearchPage
