import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import BuCoinsModalComponent from '../components/bu-coins-modal/bu-coins-modal.jsx';
import {closeBuCoinsModal, openCheckinModal} from '../reducers/modals';
import {recordCheckin, setBuCoins} from '../reducers/bu-coins';
import {exportBuCoinsRecord, importBuCoinsRecord} from '../lib/bu-coins-manager';

class BuCoinsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCheckin',
            'handleExport',
            'handleImport',
            'handleClose'
        ]);
    }
    handleCheckin () {
        this.props.onRecordCheckin();
    }
    handleExport () {
        const {balance, totalEarned, totalSpent, lastCheckinDate, checkinStreak, transactionHistory} = this.props;
        exportBuCoinsRecord({balance, totalEarned, totalSpent, lastCheckinDate, checkinStreak, transactionHistory});
    }
    handleImport (file) {
        importBuCoinsRecord(file).then(data => {
            this.props.onSetBuCoins(data.balance, data.totalEarned, data.totalSpent);
        }).catch(err => {
            alert(err.message);
        });
    }
    handleClose () {
        this.props.onCloseBuCoinsModal();
    }
    render () {
        return (
            <BuCoinsModalComponent
                balance={this.props.balance}
                totalEarned={this.props.totalEarned}
                totalSpent={this.props.totalSpent}
                checkinStreak={this.props.checkinStreak}
                transactionHistory={this.props.transactionHistory}
                onCheckin={this.handleCheckin}
                onExport={this.handleExport}
                onImport={this.handleImport}
                onRequestClose={this.handleClose}
            />
        );
    }
}

BuCoinsModal.propTypes = {
    balance: PropTypes.number,
    checkinStreak: PropTypes.number,
    lastCheckinDate: PropTypes.string,
    onCloseBuCoinsModal: PropTypes.func,
    onRecordCheckin: PropTypes.func,
    onSetBuCoins: PropTypes.func,
    totalEarned: PropTypes.number,
    totalSpent: PropTypes.number,
    transactionHistory: PropTypes.array
};

const mapStateToProps = state => ({
    balance: state.scratchGui.buCoins.balance,
    totalEarned: state.scratchGui.buCoins.totalEarned,
    totalSpent: state.scratchGui.buCoins.totalSpent,
    lastCheckinDate: state.scratchGui.buCoins.lastCheckinDate,
    checkinStreak: state.scratchGui.buCoins.checkinStreak,
    transactionHistory: state.scratchGui.buCoins.transactionHistory
});

const mapDispatchToProps = dispatch => ({
    onCloseBuCoinsModal: () => dispatch(closeBuCoinsModal()),
    onRecordCheckin: () => dispatch(recordCheckin()),
    onSetBuCoins: (balance, totalEarned, totalSpent) => dispatch(setBuCoins(balance, totalEarned, totalSpent))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuCoinsModal);
