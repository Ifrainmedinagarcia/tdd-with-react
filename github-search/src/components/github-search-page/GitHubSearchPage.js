
import { Button, Container, Grid, TextField, Typography, Box } from '@material-ui/core'
import React, { useState } from 'react'
import {Content} from '../content'


const GitHubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)

  const handleClick = async ()=> {
    setIsSearching(true)
    await Promise.resolve()
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
        <Content isSearchApplied={isSearchApplied}/>
      </Box>
    </Container>
  )
}

export default GitHubSearchPage
