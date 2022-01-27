import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function UnsavedData({ headers = [], rows = []}) {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                {
                    headers.map((header, index) => (
                        <TableCell align="left" key={`header-${index}`}>{header}</TableCell>
                    ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row[0]}>
                  <TableCell component="th" scope="row">
                    {row[0]}
                  </TableCell>
                  {
                      row.filter((item, index) => index != 0)
                      .map((item, index) => <TableCell align="left" key={`data-${index}`}>{item ? item : "N/A"}</TableCell>)
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    );
}

export default UnsavedData;
