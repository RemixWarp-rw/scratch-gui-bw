import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import Modal from '../../containers/windowed-modal.jsx';
import Box from '../box/box.jsx';
import styles from './checkin-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: '每日签到',
        description: '签到模态框标题',
        id: 'gui.checkinModal.title'
    },
    success: {
        defaultMessage: '签到成功！',
        description: '签到成功提示',
        id: 'gui.checkinModal.success'
    },
    reward: {
        defaultMessage: '获得 {amount} Bu币',
        description: '签到奖励',
        id: 'gui.checkinModal.reward'
    },
    streak: {
        defaultMessage: '连续签到 {days} 天',
        description: '连续签到天数',
        id: 'gui.checkinModal.streak'
    },
    alreadyChecked: {
        defaultMessage: '今日已签到',
        description: '已签到提示',
        id: 'gui.checkinModal.alreadyChecked'
    },
    close: {
        defaultMessage: '关闭',
        description: '关闭按钮',
        id: 'gui.checkinModal.close'
    }
});

class CheckinModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCheckin',
            'handleClose'
        ]);
    }
    handleCheckin () {
        this.props.onCheckin();
    }
    handleClose () {
        this.props.onRequestClose();
    }
    render () {
        const {intl, alreadyChecked, reward, streak} = this.props;
        return (
            <Modal
                className={styles.checkinModal}
                contentLabel={intl.formatMessage(messages.title)}
                onRequestClose={this.handleClose}
            >
                <Box className={styles.checkinBox}>
                    <div className={styles.header}>
                        <h2>{intl.formatMessage(messages.title)}</h2>
                    </div>
                    {alreadyChecked ? (
                        <div className={styles.alreadyChecked}>
                            <p>{intl.formatMessage(messages.alreadyChecked)}</p>
                            <p className={styles.streakText}>
                                {intl.formatMessage(messages.streak, {days: streak})}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.checkinContent}>
                            <div className={styles.successIcon}>✓</div>
                            <p className={styles.successText}>
                                {intl.formatMessage(messages.success)}
                            </p>
                            <p className={styles.rewardText}>
                                {intl.formatMessage(messages.reward, {amount: reward})}
                            </p>
                            <p className={styles.streakText}>
                                {intl.formatMessage(messages.streak, {days: streak})}
                            </p>
                        </div>
                    )}
                    <div className={styles.actions}>
                        <button className={styles.closeButton} onClick={this.handleClose}>
                            {intl.formatMessage(messages.close)}
                        </button>
                    </div>
                </Box>
            </Modal>
        );
    }
}

CheckinModal.propTypes = {
    alreadyChecked: PropTypes.bool,
    intl: intlShape.isRequired,
    onCheckin: PropTypes.func,
    onRequestClose: PropTypes.func,
    reward: PropTypes.number,
    streak: PropTypes.number
};

export default injectIntl(CheckinModal);
