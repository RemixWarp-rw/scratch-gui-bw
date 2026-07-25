import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import WorkbenchModalComponent from '../components/workbench-modal/workbench-modal.jsx';
import {closeWorkbenchModal} from '../reducers/modals';
import {craftBlock} from '../reducers/workbench';
import {addBuCoins} from '../reducers/bu-coins';

class WorkbenchModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCraft',
            'handleClose'
        ]);
    }
    handleCraft (recipe) {
        this.props.onCraft(recipe);
    }
    handleClose () {
        this.props.onCloseWorkbenchModal();
    }
    render () {
        return (
            <WorkbenchModalComponent
                craftedBlocks={this.props.craftedBlocks}
                onCraft={this.handleCraft}
                onRequestClose={this.handleClose}
            />
        );
    }
}

WorkbenchModal.propTypes = {
    craftedBlocks: PropTypes.array,
    onCloseWorkbenchModal: PropTypes.func,
    onCraft: PropTypes.func
};

const mapStateToProps = state => ({
    craftedBlocks: state.scratchGui.workbench.craftedBlocks
});

const mapDispatchToProps = dispatch => ({
    onCloseWorkbenchModal: () => dispatch(closeWorkbenchModal()),
    onCraft: recipe => dispatch(craftBlock(recipe))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkbenchModal);
