import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
  
const useStyles = makeStyles({
    root: ({ color }) =>({
      backgroundColor: color
    })
});

export default function SummaryCard({ title = "", data = 0, color = "#ffffff"}) {
    const classes = useStyles({ color });

    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {String(data)}
          </Typography>
        </CardContent>
      </Card>
    );
}
