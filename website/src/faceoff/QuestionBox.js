import React from 'react';
import Typography from '@material-ui/core/Typography';
// import { styled } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(5, 3),
    },
    catgAndPrize: {
        typeface: "italic", // ???
        color: "blue",
        padding: theme.spacing(6, 6)
    }
}));

const QuestionBox = ({ category, prize, question }) => {
    const classes = useStyles();
    return (
        <Paper
            className={classes.root}
            elevation={3}
        >
            <Typography variant="h3" className={classes.catgAndPrize}>
                {category} for ${prize}
            </Typography>
            <Typography variant="h2">
                {question}
            </Typography>
        </Paper>
    );
}

export default QuestionBox;
