import React from 'react'

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { Redirect } from 'react-router'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import {
  CssBaseline,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
} from '@material-ui/icons'
import Dashboard from './screens/Dashboard'
import Copyright from './components/Copyright'
import Register from './screens/Register'
import TransactionsUpload from './screens/TransactionsUpload'
import Login from './screens/Login'
import { connect } from 'react-redux'
import { getUser } from './user/selectors'
import { logUserOut } from './user/actions'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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
  navLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  appBarImage: {
    maxHeight: '75px',
    paddingRight: '20px',
  },
}))

const App = ({ user = { isLoggedIn: false }, onUserLogout }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <>
      {user.isLoggedIn ? (
        <Router>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar
              position="absolute"
              className={clsx(classes.appBar, open && classes.appBarShift)}
            >
              <Toolbar className={classes.toolbar}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  className={clsx(
                    classes.menuButton,
                    open && classes.menuButtonHidden
                  )}
                >
                  <MenuIcon />
                </IconButton>
                <img
                  className={classes.appBarImage}
                  src="img/grandstack.png"
                  alt="GRANDstack logo"
                />
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  className={classes.title}
                >
                  Welcome To FinIris
                </Typography>
                <Button color="inherit" onClick={() => onUserLogout()}>
                  Logout
                </Button>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              classes={{
                paper: clsx(
                  classes.drawerPaper,
                  !open && classes.drawerPaperClose
                ),
              }}
              open={open}
            >
              <div className={classes.toolbarIcon}>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              <List>
                <Link to="/" className={classes.navLink}>
                  <ListItem button>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                </Link>
                <Divider />
                <Link to="/upload" className={classes.navLink}>
                  <ListItem button>
                    <ListItemIcon>
                      <UploadIcon />
                    </ListItemIcon>
                    <ListItemText primary="Upload" />
                  </ListItem>
                </Link>
              </List>
              <Divider />
            </Drawer>
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <Route exact path="/upload" component={TransactionsUpload} />
                  <Route exact path="/login">
                    <Redirect to="/" />
                  </Route>
                  <Route exact path="*">
                    <Redirect to="/" />
                  </Route>
                </Switch>

                <Box pt={4}>
                  <Copyright />
                </Box>
              </Container>
            </main>
          </div>
        </Router>
      ) : (
        <Router>
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="*">
                <Redirect to="/login" />
              </Route>
            </Switch>

            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </Router>
      )}
    </>
  )
}

const mapStateToProps = (state) => ({
  user: getUser(state),
})

const mapDispatchToProps = (dispatch) => ({
  onUserLogout: () => dispatch(logUserOut()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
