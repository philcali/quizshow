import QuizDialog from "./QuizDialog";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Redirect } from 'react-router';

class PickGameDialog extends React.Component {

    constructor(props) {
        super();
        this.props = props;
    }

    state = {
        gameId: null,
        cancelPressed: false
    };

    handleChoose = (event) => this.setState({ gameId: event.target.value });

    gameChosen = (event) => this.props.onGameChosen(this.state.gameId);

    handleCancel = () => this.setState({ cancelPressed: true });


    render() {
        if (this.state.cancelPressed) {
            return (<Redirect to={this.props.cancelUri} />);
        } else {
            const { games, isOpen } = this.props;
            return (
                <QuizDialog
                    isOpen={isOpen}
                    title="Choose a Quiz Game"
                    onCancel={this.handleCancel}
                    onAccept={this.gameChosen}
                >
                    <RadioGroup>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Quiz Title</TableCell>
                                    <TableCell>Emcee</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {games.map(row => (
                                    <TableRow key={row.gameId}>
                                        <TableCell>
                                            <FormControlLabel
                                                value={row.gameId}
                                                control={<Radio />}
                                                label={row.title}
                                                onChange={this.handleChoose}
                                            />
                                        </TableCell>
                                        <TableCell>{row.emcee}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </RadioGroup>
                </QuizDialog>
            );
        }
    }
}

export default PickGameDialog;
