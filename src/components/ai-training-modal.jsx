import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import Modal from '../../containers/windowed-modal.jsx';
import Box from '../box/box.jsx';
import styles from './ai-training-modal.css';
import {getTrainingStats} from '../../lib/ai-training';

const messages = defineMessages({
    title: {
        defaultMessage: 'AI训练',
        description: 'AI训练模态框标题',
        id: 'gui.aiTrainingModal.title'
    },
    stats: {
        defaultMessage: '训练数据统计',
        description: '训练统计标题',
        id: 'gui.aiTrainingModal.stats'
    },
    totalSamples: {
        defaultMessage: '总样本数',
        description: '总训练样本',
        id: 'gui.aiTrainingModal.totalSamples'
    },
    trainedModels: {
        defaultMessage: '已训练模型',
        description: '已训练模型数量',
        id: 'gui.aiTrainingModal.trainedModels'
    },
    addSample: {
        defaultMessage: '添加训练样本',
        description: '添加样本按钮',
        id: 'gui.aiTrainingModal.addSample'
    },
    train: {
        defaultMessage: '开始训练',
        description: '训练按钮',
        id: 'gui.aiTrainingModal.train'
    },
    training: {
        defaultMessage: '训练中...',
        description: '训练中状态',
        id: 'gui.aiTrainingModal.training'
    },
    input: {
        defaultMessage: '输入文本',
        description: '输入标签',
        id: 'gui.aiTrainingModal.input'
    },
    output: {
        defaultMessage: '输出积木',
        description: '输出标签',
        id: 'gui.aiTrainingModal.output'
    },
    category: {
        defaultMessage: '分类',
        description: '分类标签',
        id: 'gui.aiTrainingModal.category'
    },
    reward: {
        defaultMessage: '训练奖励: +{amount} Bu币',
        description: '训练奖励提示',
        id: 'gui.aiTrainingModal.reward'
    }
});

class AITrainingModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAddSample',
            'handleTrain',
            'handleClose',
            'handleInputChange',
            'handleOutputChange',
            'handleCategoryChange'
        ]);
        this.state = {
            inputText: '',
            outputText: '',
            category: 'general',
            training: false,
            progress: 0,
            stats: getTrainingStats()
        };
    }
    handleInputChange (e) {
        this.setState({inputText: e.target.value});
    }
    handleOutputChange (e) {
        this.setState({outputText: e.target.value});
    }
    handleCategoryChange (e) {
        this.setState({category: e.target.value});
    }
    handleAddSample () {
        if (this.props.onAddSample && this.state.inputText && this.state.outputText) {
            this.props.onAddSample(this.state.inputText, this.state.outputText, this.state.category);
            this.setState({
                inputText: '',
                outputText: '',
                stats: getTrainingStats()
            });
        }
    }
    handleTrain () {
        if (this.props.onTrain) {
            this.setState({training: true, progress: 0});
            this.props.onTrain(progress => {
                this.setState({progress});
            }).then(() => {
                this.setState({training: false, progress: 100, stats: getTrainingStats()});
            }).catch(() => {
                this.setState({training: false, progress: 0});
            });
        }
    }
    handleClose () {
        this.props.onRequestClose();
    }
    render () {
        const {intl} = this.props;
        const {inputText, outputText, category, training, progress, stats} = this.state;
        return (
            <Modal
                className={styles.aiTrainingModal}
                contentLabel={intl.formatMessage(messages.title)}
                onRequestClose={this.handleClose}
            >
                <Box className={styles.aiTrainingBox}>
                    <div className={styles.header}>
                        <h2>{intl.formatMessage(messages.title)}</h2>
                    </div>
                    <div className={styles.statsSection}>
                        <h3>{intl.formatMessage(messages.stats)}</h3>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>{intl.formatMessage(messages.totalSamples)}</span>
                                <span className={styles.statValue}>{stats.totalSamples}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>{intl.formatMessage(messages.trainedModels)}</span>
                                <span className={styles.statValue}>{stats.trainedModels}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.addSampleSection}>
                        <h3>{intl.formatMessage(messages.addSample)}</h3>
                        <div className={styles.formGroup}>
                            <label>{intl.formatMessage(messages.input)}</label>
                            <input
                                type="text"
                                value={inputText}
                                onChange={this.handleInputChange}
                                className={styles.input}
                                placeholder="描述你想要的积木..."
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{intl.formatMessage(messages.output)}</label>
                            <input
                                type="text"
                                value={outputText}
                                onChange={this.handleOutputChange}
                                className={styles.input}
                                placeholder="积木类型或JSON..."
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{intl.formatMessage(messages.category)}</label>
                            <select value={category} onChange={this.handleCategoryChange} className={styles.select}>
                                <option value="general">通用</option>
                                <option value="motion">运动</option>
                                <option value="looks">外观</option>
                                <option value="sound">声音</option>
                                <option value="event">事件</option>
                                <option value="control">控制</option>
                                <option value="sensing">侦测</option>
                                <option value="operators">运算</option>
                            </select>
                        </div>
                        <button className={styles.addButton} onClick={this.handleAddSample} disabled={training}>
                            {intl.formatMessage(messages.addSample)}
                        </button>
                    </div>
                    <div className={styles.trainSection}>
                        {training ? (
                            <div className={styles.trainingProgress}>
                                <p>{intl.formatMessage(messages.training)}</p>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{width: `${progress}%`}}></div>
                                </div>
                                <p>{progress}%</p>
                            </div>
                        ) : (
                            <button className={styles.trainButton} onClick={this.handleTrain}>
                                {intl.formatMessage(messages.train)}
                            </button>
                        )}
                        <p className={styles.rewardText}>
                            {intl.formatMessage(messages.reward, {amount: 20})}
                        </p>
                    </div>
                </Box>
            </Modal>
        );
    }
}

AITrainingModal.propTypes = {
    intl: intlShape.isRequired,
    onAddSample: PropTypes.func,
    onRequestClose: PropTypes.func,
    onTrain: PropTypes.func
};

export default injectIntl(AITrainingModal);
