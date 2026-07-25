import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import Modal from '../../containers/windowed-modal.jsx';
import Box from '../box/box.jsx';
import styles from './workbench-modal.css';
import {CRAFTING_RECIPES} from '../../lib/workbench-recipes';

const messages = defineMessages({
    title: {
        defaultMessage: '工作台',
        description: '工作台模态框标题',
        id: 'gui.workbenchModal.title'
    },
    craft: {
        defaultMessage: '合成',
        description: '合成按钮',
        id: 'gui.workbenchModal.craft'
    },
    crafted: {
        defaultMessage: '已合成',
        description: '已合成状态',
        id: 'gui.workbenchModal.crafted'
    },
    ingredients: {
        defaultMessage: '所需材料',
        description: '合成材料标题',
        id: 'gui.workbenchModal.ingredients'
    },
    myBlocks: {
        defaultMessage: '我的合成',
        description: '我的合成标题',
        id: 'gui.workbenchModal.myBlocks'
    }
});

class WorkbenchModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCraft',
            'handleClose'
        ]);
    }
    handleCraft (recipe) {
        if (this.props.onCraft) {
            this.props.onCraft(recipe);
        }
    }
    handleClose () {
        this.props.onRequestClose();
    }
    isCrafted (recipeId) {
        return this.props.craftedBlocks && this.props.craftedBlocks.some(b => b.recipeName === recipeId || b.blockType === recipeId);
    }
    render () {
        const {intl, craftedBlocks} = this.props;
        return (
            <Modal
                className={styles.workbenchModal}
                contentLabel={intl.formatMessage(messages.title)}
                onRequestClose={this.handleClose}
            >
                <Box className={styles.workbenchBox}>
                    <div className={styles.header}>
                        <h2>{intl.formatMessage(messages.title)}</h2>
                    </div>
                    <div className={styles.recipesSection}>
                        <h3>{intl.formatMessage(messages.ingredients)}</h3>
                        <div className={styles.recipesGrid}>
                            {CRAFTING_RECIPES.map(recipe => {
                                const crafted = this.isCrafted(recipe.id) || this.isCrafted(recipe.result);
                                return (
                                    <div key={recipe.id} className={styles.recipeCard}>
                                        <div className={styles.recipeName}>{recipe.name}</div>
                                        <div className={styles.recipeDesc}>{recipe.description}</div>
                                        <div className={styles.ingredientsList}>
                                            {recipe.ingredients.map((ing, idx) => (
                                                <span key={idx} className={styles.ingredient}>
                                                    {ing.type === 'bu_coins' ? `${ing.count} Bu币` : `${ing.id} x${ing.count}`}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            className={crafted ? styles.craftedButton : styles.craftButton}
                                            onClick={() => !crafted && this.handleCraft(recipe)}
                                            disabled={crafted}
                                        >
                                            {crafted ? intl.formatMessage(messages.crafted) : intl.formatMessage(messages.craft)}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {craftedBlocks && craftedBlocks.length > 0 && (
                        <div className={styles.craftedSection}>
                            <h3>{intl.formatMessage(messages.myBlocks)}</h3>
                            <div className={styles.craftedList}>
                                {craftedBlocks.map((block, idx) => (
                                    <div key={idx} className={styles.craftedItem}>
                                        {block.recipeName || block.blockType}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>
        );
    }
}

WorkbenchModal.propTypes = {
    craftedBlocks: PropTypes.array,
    intl: intlShape.isRequired,
    onCraft: PropTypes.func,
    onRequestClose: PropTypes.func
};

export default injectIntl(WorkbenchModal);
