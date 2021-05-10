import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { addTribe, removeTribe } from '../../actions/poolActions';
import { Button } from '@material-ui/core';
import store from '../../store';
import './TribalChangeButtons.css';

const CustomButton = withStyles({
    root: {
        background: 'black',
        borderRadius: 3,
        border: 0,
        color: 'yellow',
        height: 48,
        padding: '0 20px',
        position: 'absolute',
        right: '-50px',
        top: '150px',
        "&:hover": {
            backgroundColor: "black"
        }
    },
    label: {
        textTransform: 'capitalize',
    }
})(Button);

class TribalChangeButtons extends Component {

    toggleTribe = (tribe) => {
        const { tribes } = store.getState().pool;
        tribes.includes(tribe) ? this.props.removeTribe(tribe) : this.props.addTribe(tribe);
    }

    isVisible = (tribe) => {
        const { tribes } = store.getState().pool;
        return {
            display: !tribes.includes(tribe) ? '' : 'none'
        };
    }

    formatTribe = (tribe) => (
        tribe.charAt(0).toLowerCase() + tribe.slice(1)
    );

    omitTwoRandomTribes = () => {
        const tribes = store.getState().pool.tribes.filter((tribe) => tribe !== 'Neutral');
        const allTribes = ['Beast', 'Demon', 'Dragon', 'Elemental', 'Mech', 'Murloc', 'Pirate', 'Quilboar'];
        const intersection = allTribes.filter(x => !tribes.includes(x));
        intersection.forEach((tribe) => this.props.addTribe(tribe));
        const set = new Set();
        while(set.size < 2) {
            set.add(Math.floor(Math.random() * 7));
        }
        for(let i of Array.from(set)) {
            this.props.removeTribe(allTribes[i]);
        }
    }
    
    render() {
        const tribes = ['Beast', 'Demon', 'Dragon', 'Elemental', 'Mech', 'Murloc', 'Pirate', 'Quilboar'];
        const serverUri = process.env.NODE_ENV.trim() === 'development' ? 'http://localhost:8000' : '';
        return (
            <div>
                {tribes.map((tribe) =>
                    tribe !== 'Neutral' ?
                        <React.Fragment key={tribe}>
                            <img className='redx' style={this.isVisible(tribe)} src={`${serverUri}/assets/img/redx.png`} onClick={() => this.toggleTribe(tribe)} alt='Red X' />
                            <img className={`${this.formatTribe(tribe)}s`} src={`${serverUri}/assets/img/Tribes/${tribe}.png`} onClick={() => this.toggleTribe(tribe)} alt={tribe} />
                        </React.Fragment>
                    : <React.Fragment key={tribe} />
                )}
                <CustomButton onClick={() => this.omitTwoRandomTribes()}>Exclude 2 Random Tribes</CustomButton>
            </div>
        );
    }
}

TribalChangeButtons.propTypes = {
    addTribe: PropTypes.func.isRequired,
    removeTribe: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    tribes: state.pool.tribes
});

export default connect(mapStateToProps, { addTribe, removeTribe })(TribalChangeButtons);