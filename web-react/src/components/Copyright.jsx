import React from 'react';
import { 
    Link as MUILink,
    Typography 
} from "@material-ui/core";
const Copyright = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <MUILink color="inherit" href="#">
          FinIris
        </MUILink>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    )
}

export default Copyright;