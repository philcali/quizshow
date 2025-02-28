import React from 'react';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/styles';
import GameBoard from "../gameboard/GameBoard";
import API, { graphqlOperation } from "@aws-amplify/api"
import gql from "graphql-tag"

const GameTitle = styled(Typography)({
    margin: "40px",
    padding: "40px"
});

const GET_GAME_GQL = gql(`
    query Query($id: Int!) {
        getGameById(gameId: $id) {
            title
            categories {
                catgId
                categoryName
            }
            questions {
                quesId
                catgId
                prize
                question
                answer
            }
        }
    }
`);

class HostGame extends React.Component {

    constructor(props) {
        super();
        this.props = props;
    }

    state = {
        game: null
    };

    componentDidMount = () => {
        const { gameId } = this.props.match.params;
        let me = this;
        API.graphql(graphqlOperation(GET_GAME_GQL, { id: gameId }))
            .then(game => me.setState({ game: game.data.getGameById }))
            .catch(err => console.log(`catch:`, err));
    }

    render() {
        if (!this.state.game) {
            return (<span>Loading...</span>);
        } else {
            return (
                <div>
                    <GameTitle
                        variant="h3"
                        align="center"
                    >
                        {this.state.game.title}
                    </GameTitle>
                    <GameBoard game={this.state.game} />
                </div>
            );
        }
    }
}

export default HostGame;
