import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import CheckinModalComponent from '../components/checkin-modal/checkin-modal.jsx';
import {closeCheckinModal} from '../reducers/modals';
import {recordCheckin, CHECKIN_REWARD} from '../reducers/bu-coins';

class CheckinModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCheckin',
            'handleClose'
        ]);
    }
    handleCheckin () {
        this.props.onRecordCheckin();
    }
    handleClose () {
        this.props.onCloseCheckinModal();
    }
    render () {
        const today = new Date().toDateString();
        const alreadyChecked = this.props.lastCheckinDate === today;
        const reward = Math.min(this.props.checkinStreak + (alreadyChecked ? 0 : 1), 7) * CHECKIN_REWARD;
        return (
            <CheckinModalComponent
                alreadyChecked={alreadyChecked}
                reward={reward}
                streak={this.props.checkinStreak}
                onCheckin={this.handleCheckin}
                onRequestClose={this.handleClose}
            />
        );
    }
}

CheckinModal.propTypes = {
    checkinStreak: PropTypes.number,
    lastCheckinDate: PropTypes.string,
    onCloseCheckinModal: PropTypes.func,
    onRecordCheckin: PropTypes.func
};

const mapStateToProps = state => ({
    lastCheckinDate: state.scratchGui.buCoins.lastCheckinDate,
    checkinStreak: state.scratchGui.buCoins.checkinStreak
});

const mapDispatchToProps = dispatch => ({
    onCloseCheckinModal: () => dispatch(closeCheckinModal()),
    onRecordCheckin: () => dispatch(recordCheckin())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckinModal);
