import React, { useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux';
import { loadTransactions } from '../transaction/thunks';
import { getTransactions, getTransactionsLoading } from '../transaction/selectors';
import { getMerchantsLoading } from '../merchant/selectors';
import { loadMerchants } from '../merchant/thunks';
import { getUsername } from '../user/selectors';

const Dashboard = ({ 
  username, 
  transactions, 
  transactionsLoading,
  merchantsLoading, 
  startLoadingTransactions,
  startLoadingMerchants
}) => {
  useEffect(() => {
    startLoadingTransactions(username)
    startLoadingMerchants(username)
  }, [])
  const theme = useTheme()
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
  }))
  const classes = useStyles(theme)
  const transactionsLoadingMessage = <div>Loading transactions...</div>
  const content = (
    <Grid container spacing={4}>
        {/* Recent Reviews */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {
              transactions.length === 0 ? <div>No data</div> : <div></div>
            }
          </Paper>
        </Grid>
      </Grid>
  )

  return transactionsLoading || merchantsLoading ? transactionsLoadingMessage : content;
}

const mapStateToProps = state =>({
  transactionsLoading: getTransactionsLoading(state),
  transactions: getTransactions(state),
  merchantsLoading: getMerchantsLoading(state),
  username: getUsername(state)
})

const mapDispatchToProps = dispatch => ({
  startLoadingTransactions: username => dispatch(loadTransactions(username)),
  startLoadingMerchants: username => dispatch(loadMerchants(username))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
