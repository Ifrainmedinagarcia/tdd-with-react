import React from "react"
import { 
    Box,
    Typography 
  } from '@material-ui/core'
import PropTypes from "prop-types"


export const Content = ({isSearchApplied , reposList, children}) => {
   
    const renderWithBox = (cb) => (
      <Box height={400} display="flex" alignItems="center" justifyContent="center">
        {cb}
      </Box>
    )

    if (isSearchApplied && !!reposList.length) {
      return children
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
    children: PropTypes.node.isRequired
  }

  export default Content