import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {injectIntl} from 'react-intl';

import BilmeModalComponent from '../components/bl-bilme/bilme-modal.jsx';
import {closeBilmeModal} from '../reducers/modals';
import {setTheme} from '../reducers/theme';
import {CustomTheme} from '../lib/themes/custom-themes.js';
import {applyTheme} from '../lib/themes/themePersistance.js';

class BilmeModal extends React.Component {
    constructor (props) {
        super(props);
        this.handleThemeApply = this.handleThemeApply.bind(this);
    }

  handleThemeApply (themeData) {
    // themeData comes from Bilme export API in BugWarp format
    // The format is: { themes: [{ accent, gui, blocks, menuBarAlign, wallpaper, fonts }] }
    if (!themeData.themes || themeData.themes.length === 0) {
      console.error('Invalid theme data format');
      return;
    }

    const themeConfig = themeData.themes[0];

    // Use CustomTheme.import to properly handle the theme data
    const bugwarpTheme = CustomTheme.import(themeConfig);

    // Apply the theme
    this.props.onSetTheme(bugwarpTheme);
    applyTheme(bugwarpTheme);

    // Close the modal
    this.props.onClose();
  }

  render () {
    if (!this.props.visible) return null;
    return (
      <BilmeModalComponent
        onClose={this.props.onClose}
        onThemeApply={this.handleThemeApply}
      />
    );
  }
}

BilmeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSetTheme: PropTypes.func.isRequired,
  visible: PropTypes.bool
};

const mapStateToProps = state => ({
    visible: state.scratchGui.modals.bilmeModal
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeBilmeModal()),
    onSetTheme: theme => dispatch(setTheme(theme))
});

export default compose(
    injectIntl,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(BilmeModal);