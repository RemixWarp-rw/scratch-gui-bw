import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import AITrainingModalComponent from '../components/ai-training-modal/ai-training-modal.jsx';
import {closeAITrainingModal} from '../reducers/modals';
import {addBuCoins, AI_TRAINING_REWARD} from '../reducers/bu-coins';
import {addTrainingSample, trainModel} from '../lib/ai-training';

class AITrainingModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAddSample',
            'handleTrain',
            'handleClose'
        ]);
    }
    handleAddSample (input, output, category) {
        addTrainingSample(input, output, category);
    }
    handleTrain (onProgress) {
        return trainModel(onProgress).then(model => {
            this.props.onAddBuCoins(AI_TRAINING_REWARD, 'ai_training', 'AI训练奖励');
            return model;
        });
    }
    handleClose () {
        this.props.onCloseAITrainingModal();
    }
    render () {
        return (
            <AITrainingModalComponent
                onAddSample={this.handleAddSample}
                onTrain={this.handleTrain}
                onRequestClose={this.handleClose}
            />
        );
    }
}

AITrainingModal.propTypes = {
    onAddBuCoins: PropTypes.func,
    onCloseAITrainingModal: PropTypes.func
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onCloseAITrainingModal: () => dispatch(closeAITrainingModal()),
    onAddBuCoins: (amount, reason, description) => dispatch(addBuCoins(amount, reason, description))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AITrainingModal);
