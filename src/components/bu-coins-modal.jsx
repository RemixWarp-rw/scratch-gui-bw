import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import Modal from '../../containers/windowed-modal.jsx';
import Box from '../box/box.jsx';
import styles from './bu-coins-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Bu币',
        description: 'Bu币模态框标题',
        id: 'gui.buCoinsModal.title'
    },
    balance: {
        defaultMessage: '当前余额',
        description: 'Bu币余额',
        id: 'gui.buCoinsModal.balance'
    },
    totalEarned: {
        defaultMessage: '累计获得',
        description: '累计获得Bu币',
        id: 'gui.buCoinsModal.totalEarned'
    },
    totalSpent: {
        defaultMessage: '累计消耗',
        description: '累计消耗Bu币',
        id: 'gui.buCoinsModal.totalSpent'
    },
    checkinStreak: {
        defaultMessage: '连续签到',
        description: '连续签到天数',
        id: 'gui.buCoinsModal.checkinStreak'
    },
    checkin: {
        defaultMessage: '立即签到',
        description: '签到按钮',
        id: 'gui.buCoinsModal.checkin'
    },
    exportRecord: {
        defaultMessage: '导出记录',
        description: '导出记录文件按钮',
        id: 'gui.buCoinsModal.exportRecord'
    },
    importRecord: {
        defaultMessage: '导入记录',
        description: '导入记录文件按钮',
        id: 'gui.buCoinsModal.importRecord'
    },
    history: {
        defaultMessage: '交易记录',
        description: '交易记录标题',
        id: 'gui.buCoinsModal.history'
    }
});

class BuCoinsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCheckin',
            'handleExport',
            'handleImport',
            'handleFileChange',
            'handleClose'
        ]);
        this.fileInputRef = React.createRef();
    }
    handleCheckin () {
        this.props.onCheckin();
    }
    handleExport () {
        this.props.onExport();
    }
    handleImport () {
        if (this.fileInputRef.current) {
            this.fileInputRef.current.click();
        }
    }
    handleFileChange (e) {
        const file = e.target.files[0];
        if (file && this.props.onImport) {
            this.props.onImport(file);
        }
        e.target.value = '';
    }
    handleClose () {
        this.props.onRequestClose();
    }
    render () {
        const {intl, balance, totalEarned, totalSpent, checkinStreak, transactionHistory} = this.props;
        return (
            <Modal
                className={styles.buCoinsModal}
                contentLabel={intl.formatMessage(messages.title)}
                onRequestClose={this.handleClose}
            >
                <Box className={styles.buCoinsBox}>
                    <div className={styles.header}>
                        <h2>{intl.formatMessage(messages.title)}</h2>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>{intl.formatMessage(messages.balance)}</span>
                            <span className={styles.statValue}>{balance}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>{intl.formatMessage(messages.totalEarned)}</span>
                            <span className={styles.statValue}>{totalEarned}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>{intl.formatMessage(messages.totalSpent)}</span>
                            <span className={styles.statValue}>{totalSpent}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>{intl.formatMessage(messages.checkinStreak)}</span>
                            <span className={styles.statValue}>{checkinStreak} 天</span>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.checkinButton} onClick={this.handleCheckin}>
                            {intl.formatMessage(messages.checkin)}
                        </button>
                        <button className={styles.secondaryButton} onClick={this.handleExport}>
                            {intl.formatMessage(messages.exportRecord)}
                        </button>
                        <button className={styles.secondaryButton} onClick={this.handleImport}>
                            {intl.formatMessage(messages.importRecord)}
                        </button>
                        <input
                            ref={this.fileInputRef}
                            type="file"
                            accept=".json"
                            style={{display: 'none'}}
                            onChange={this.handleFileChange}
                        />
                    </div>
                    <div className={styles.historySection}>
                        <h3>{intl.formatMessage(messages.history)}</h3>
                        <div className={styles.historyList}>
                            {transactionHistory && transactionHistory.length > 0 ? (
                                transactionHistory.slice(0, 20).map((item, index) => (
                                    <div key={index} className={styles.historyItem}>
                                        <span className={styles.historyDesc}>{item.description}</span>
                                        <span className={item.amount > 0 ? styles.historyPositive : styles.historyNegative}>
                                            {item.amount > 0 ? '+' : ''}{item.amount}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyHistory}>暂无记录</p>
                            )}
                        </div>
                    </div>
                </Box>
            </Modal>
        );
    }
}

BuCoinsModal.propTypes = {
    balance: PropTypes.number,
    checkinStreak: PropTypes.number,
    intl: intlShape.isRequired,
    onCheckin: PropTypes.func,
    onExport: PropTypes.func,
    onImport: PropTypes.func,
    onRequestClose: PropTypes.func,
    totalEarned: PropTypes.number,
    totalSpent: PropTypes.number,
    transactionHistory: PropTypes.array
};

export default injectIntl(BuCoinsModal);
