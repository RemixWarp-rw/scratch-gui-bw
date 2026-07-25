import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import log from '../lib/utils/log.js';
import bindAll from 'lodash.bindall';
import SecurityManagerModal from '../components/tw-security-manager-modal/security-manager-modal.jsx';
import SecurityModals from '../lib/constants/security-manager.js';
import {getPersistedUnsandboxed, setPersistedUnsandboxed} from '../lib/persistence/tw-unsandboxed.js';

/* eslint-disable require-atomic-updates */

/**
 * Set of extension URLs that the user has manually trusted to load unsandboxed.
 */
const extensionsTrustedByUser = new Set();

const manuallyTrustExtension = url => {
    extensionsTrustedByUser.add(url);
};

/**
 * Trusted extensions are loaded automatically and without a sandbox.
 * @param {string} url URL as a string.
 * @returns {boolean} True if the extension can is trusted
 */
const isTrustedExtension = url => (
    // Always trust our official extension repostiory.
    url.startsWith('https://extensions.turbowarp.org/') ||
    url.startsWith('https://extensions.bugwarp.org/') ||
    url.startsWith('https://extensions.mistium.com/') ||
    url.startsWith('https://sharkpools-extensions.vercel.app/') ||
    url.startsWith('https://editors.astras.top/extensions/') ||



    // For development.
    url.startsWith('http://localhost:8000/') ||

    extensionsTrustedByUser.has(url)
);

/**
 * Set of fetch resource hosts that were manually trusted by the user.
 * @type {Set<string>}
 */
const fetchHostsTrustedByUser = new Set();

/**
 * Set of hosts manually trusted by the user for embedding.
 * @type {Set<string>}
 */
const embedHostsTrustedByUser = new Set();

/**
 * @param {URL} parsed Parsed URL object
 * @returns {boolean} True if the URL is part of the builtin set of URLs to always trust fetching from.
 */
const isAlwaysTrustedForFetching = parsed => (
    // If we would trust loading an extension from here, we can trust loading resources too.
    isTrustedExtension(parsed.href) ||

    // Any TurboWarp service such as trampoline
    parsed.origin === 'https://turbowarp.org' ||
    parsed.origin.endsWith('.turbowarp.org') ||
    parsed.origin.endsWith('.turbowarp.xyz') ||

    // Any BugWarp service such as trampoline
    parsed.origin === 'https://bugwarp.org' ||
    parsed.origin.endsWith('.bugwarp.org') ||

    // GitHub API
    // GitHub Pages allows redirects, so not included here.
    parsed.origin === 'https://raw.githubusercontent.com' ||
    parsed.origin === 'https://gist.githubusercontent.com' ||
    parsed.origin === 'https://api.github.com' ||

    // GitLab API
    // GitLab Pages allows redirects, so not included here.
    parsed.origin === 'https://gitlab.com' ||

    // Sourcehut Pages
    parsed.origin.endsWith('.srht.site') ||

    // Itch
    parsed.origin.endsWith('.itch.io') ||

    // GameJolt
    parsed.origin === 'https://api.gamejolt.com' ||

    // httpbin
    parsed.origin === 'https://httpbin.org' ||

    // ScratchDB
    parsed.origin === 'https://scratchdb.lefty.one'
);

const FETCHABLE_PROTOCOLS = [
    'http:',
    'https:',
    'data:',
    'blob:',
    'ws:',
    'wss:'
];

const VISITABLE_PROTOCOLS = [
    // The important one we want to exclude is javascript:
    'http:',
    'https:',
    'data:',
    'blob:',
    'mailto:',
    'steam:',
    'calculator:'
];

/**
 * @param {string} url Original URL string
 * @param {string[]} protocols List of allowed protocols
 * @returns {URL|null} A URL object if it is valid and of a known protocol, otherwise null.
 */
const parseURL = (url, protocols) => {
    let parsed;
    try {
        parsed = new URL(url);
    } catch (e) {
        return null;
    }
    if (!protocols.includes(parsed.protocol)) {
        return null;
    }
    return parsed;
};

let allowedAudio = false;
let allowedVideo = false;
let allowedReadClipboard = false;
let allowedNotify = false;
let allowedGeolocation = false;

const SECURITY_MANAGER_METHODS = [
    'getSandboxMode',
    'canLoadExtensionFromProject',
    'canFetch',
    'canOpenWindow',
    'canRedirect',
    'canRecordAudio',
    'canRecordVideo',
    'canReadClipboard',
    'canNotify',
    'canGeolocate',
    'canEmbed',
    'canDownload'
];

class TWSecurityManagerComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAllowed',
            'handleDenied'
        ]);
        bindAll(this, SECURITY_MANAGER_METHODS);
        this.nextModalCallbacks = [];
        this.modalLocked = false;
        this.state = {
            type: null,
            data: null,
            callback: null,
            modalCount: 0
        };
    }

    componentDidMount () {
        const vmSecurityManager = this.props.vm.extensionManager.securityManager;
        const propsSecurityManager = this.props.securityManager;
        for (const method of SECURITY_MANAGER_METHODS) {
            vmSecurityManager[method] = propsSecurityManager[method] || this[method];
        }
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * @returns {Promise<() => Promise<boolean>>} Resolves with a function that you can call to show the modal.
     * The resolved function returns a promise that resolves with true if the request was approved.
     */
    async acquireModalLock () {
        // We need a two-step process for showing a modal so that we don't overwrite or overlap modals,
        // and so that multiple attempts to fetch resources from the same origin will all be allowed
        // with just one click. This means that some places have to wait until previous modals are
        // closed before it knows if it needs to display another modal.

        console.log('[Security Manager] acquireModalLock called, current lock state:', this.modalLocked);
        if (this.modalLocked) {
            console.log('[Security Manager] Modal is locked, waiting in queue...');
            await new Promise(resolve => {
                this.nextModalCallbacks.push(resolve);
            });
            console.log('[Security Manager] Wait complete, proceeding');
        } else {
            this.modalLocked = true;
            console.log('[Security Manager] Lock acquired');
        }

        const releaseLock = () => {
            console.log('[Security Manager] Releasing lock');
            if (this.nextModalCallbacks.length) {
                const nextModalCallback = this.nextModalCallbacks.shift();
                nextModalCallback();
            } else {
                this.modalLocked = false;
                this.setState({
                    // only clear type in case other data needs to be accessed
                    type: null
                });
            }
        };

        const showModal = async (type, data) => {
            console.log('[Security Manager] showModal called for type:', type);
            console.log('[Security Manager] showModal creating new Promise...');
            
            // 添加超时机制，防止无限等待
            const TIMEOUT_MS = 60000; // 60秒超时
            
            const result = await new Promise((resolve, reject) => {
                console.log('[Security Manager] Promise executor running, calling setState');
                
                // 设置超时
                const timeoutId = setTimeout(() => {
                    console.error('[Security Manager] Modal timeout after', TIMEOUT_MS, 'ms');
                    reject(new Error('Modal timeout'));
                }, TIMEOUT_MS);
                
                this.setState(oldState => ({
                    type,
                    data,
                    callback: (value) => {
                        clearTimeout(timeoutId);
                        resolve(value);
                    },
                    modalCount: oldState.modalCount + 1
                }), () => {
                    console.log('[Security Manager] setState callback fired');
                });
                console.log('[Security Manager] setState called');
            });
            
            console.log('[Security Manager] Modal resolved with result:', result);
            releaseLock();
            return result;
        };

        return {
            showModal,
            releaseLock
        };
    }

    handleAllowed () {
        console.log('[Security Manager] handleAllowed called, callback:', this.state.callback);
        this.state.callback(true);
    }

    handleDenied () {
        console.log('[Security Manager] handleDenied called, callback:', this.state.callback);
        this.state.callback(false);
    }

    /**
     * @param {string} url The extension's URL
     * @returns {string} The VM worker mode to use
     */
    getSandboxMode (url) {
        if (isTrustedExtension(url)) {
            log.info(`Loading extension ${url} unsandboxed`);
            return 'unsandboxed';
        }
        return 'iframe';
    }

    handleChangeUnsandboxed (e) {
        const checked = e.target.checked;
        this.setState(oldState => ({
            data: {
                ...oldState.data,
                unsandboxed: checked
            }
        }));
    }

    /**
     * @param {string} url The extension's URL
     * @returns {Promise<boolean>} Whether the extension can be loaded
     */
    async canLoadExtensionFromProject (url) {
        console.log('[Security Manager] canLoadExtensionFromProject called with URL:', url);
        
        // 添加整体超时保护，防止任何环节卡住
        const TIMEOUT_MS = 60000; // 60秒超时
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                console.error('[Security Manager] canLoadExtensionFromProject timeout');
                reject(new Error('Extension loading timeout'));
            }, TIMEOUT_MS);
        });
        
        const resultPromise = (async () => {
            if (isTrustedExtension(url)) {
                log.info(`Loading extension ${url} automatically`);
                console.log('[Security Manager] Extension is trusted, allowing automatically');
                return true;
            }
            console.log('[Security Manager] Extension is not trusted, acquiring modal lock...');
            const {showModal} = await this.acquireModalLock();
            console.log('[Security Manager] Modal lock acquired');
            if (url.startsWith('data:')) {
                console.log('[Security Manager] Extension is data:url, showing special modal');
                const allowed = await showModal(SecurityModals.LoadExtension, {
                    url,
                    unsandboxed: getPersistedUnsandboxed(),
                    onChangeUnsandboxed: this.handleChangeUnsandboxed.bind(this)
                });
                console.log('[Security Manager] Data:url extension modal result:', allowed);
                if (allowed) {
                    setPersistedUnsandboxed(this.state.data.unsandboxed);
                }
                if (allowed && this.state.data.unsandboxed) {
                    manuallyTrustExtension(url);
                }
                return allowed;
            }
            console.log('[Security Manager] Showing standard extension modal');
            return showModal(SecurityModals.LoadExtension, {
                url,
                unsandboxed: false
            });
        })();
        
        try {
            return await Promise.race([resultPromise, timeoutPromise]);
        } catch (error) {
            console.error('[Security Manager] canLoadExtensionFromProject failed:', error);
            // 返回false而不是抛出错误，这样扩展不会被加载但项目仍然可以打开
            return false;
        }
    }

    /**
     * @param {string} url The resource to fetch
     * @returns {Promise<boolean>} True if the resource is allowed to be fetched
     */
    async canFetch (url) {
        const parsed = parseURL(url, FETCHABLE_PROTOCOLS);
        if (!parsed) {
            return false;
        }
        if (isAlwaysTrustedForFetching(parsed)) {
            return true;
        }
        const {showModal, releaseLock} = await this.acquireModalLock();
        const host = (
            parsed.protocol === 'http:' ||
            parsed.protocol === 'https:' ||
            parsed.protocol === 'ws:' ||
            parsed.protocol === 'wss:'
        ) ? parsed.host : null;
        if (host && fetchHostsTrustedByUser.has(host)) {
            releaseLock();
            return true;
        }
        const allowed = await showModal(SecurityModals.Fetch, {
            url
        });
        if (host && allowed) {
            fetchHostsTrustedByUser.add(host);
        }
        return allowed;
    }

    /**
     * @param {string} url The website to open
     * @returns {Promise<boolean>} True if the website can be opened
     */
    async canOpenWindow (url) {
        const parsed = parseURL(url, VISITABLE_PROTOCOLS);
        if (!parsed) {
            return false;
        }
        const {showModal} = await this.acquireModalLock();
        return showModal(SecurityModals.OpenWindow, {
            url
        });
    }

    /**
     * @param {string} url The website to redirect to
     * @returns {Promise<boolean>} True if the website can be redirected to
     */
    async canRedirect (url) {
        const parsed = parseURL(url, VISITABLE_PROTOCOLS);
        if (!parsed) {
            return false;
        }
        const {showModal} = await this.acquireModalLock();
        return showModal(SecurityModals.Redirect, {
            url
        });
    }

    /**
     * @returns {Promise<boolean>} True if audio can be recorded
     */
    async canRecordAudio () {
        if (!allowedAudio) {
            const {showModal} = await this.acquireModalLock();
            allowedAudio = await showModal(SecurityModals.RecordAudio);
        }
        return allowedAudio;
    }

    /**
     * @returns {Promise<boolean>} True if video can be recorded
     */
    async canRecordVideo () {
        if (!allowedVideo) {
            const {showModal} = await this.acquireModalLock();
            allowedVideo = await showModal(SecurityModals.RecordVideo);
        }
        return allowedVideo;
    }

    /**
     * @returns {Promise<boolean>} True if the clipboard can be read
     */
    async canReadClipboard () {
        if (!allowedReadClipboard) {
            const {showModal} = await this.acquireModalLock();
            allowedReadClipboard = await showModal(SecurityModals.ReadClipboard);
        }
        return allowedReadClipboard;
    }

    /**
     * @returns {Promise<boolean>} True if the notifications are allowed
     */
    async canNotify () {
        if (!allowedNotify) {
            const {showModal} = await this.acquireModalLock();
            allowedNotify = await showModal(SecurityModals.Notify);
        }
        return allowedNotify;
    }

    /**
     * @returns {Promise<boolean>} True if geolocation is allowed.
     */
    async canGeolocate () {
        if (!allowedGeolocation) {
            const {showModal} = await this.acquireModalLock();
            allowedGeolocation = await showModal(SecurityModals.Geolocate);
        }
        return allowedGeolocation;
    }

    /**
     * @param {string} url Frame URL
     * @returns {Promise<boolean>} True if embed is allowed.
     */
    async canEmbed (url) {
        const parsed = parseURL(url, FETCHABLE_PROTOCOLS);
        if (!parsed) {
            return false;
        }
        const host = (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? parsed.host : null;
        const {showModal, releaseLock} = await this.acquireModalLock();
        if (host && embedHostsTrustedByUser.has(host)) {
            releaseLock();
            return true;
        }
        const allowed = await showModal(SecurityModals.Embed, {url});
        if (host && allowed) {
            embedHostsTrustedByUser.add(host);
        }
        return allowed;
    }

    /**
     * @param {string} url URL to download
     * @param {string} name Name to download as
     * @returns {Promise<boolean>} True if allowed
     */
    async canDownload (url, name) {
        const parsed = parseURL(url, FETCHABLE_PROTOCOLS);
        if (!parsed) {
            return false;
        }
        const {showModal} = await this.acquireModalLock();
        return showModal(SecurityModals.Download, {
            url,
            name
        });
    }

    render () {
        console.log('[Security Manager] render called, this.state.type:', this.state.type);
        if (this.state.type) {
            console.log('[Security Manager] Rendering modal, type:', this.state.type);
            return (
                <SecurityManagerModal
                    type={this.state.type}
                    data={this.state.data}
                    onAllowed={this.handleAllowed}
                    onDenied={this.handleDenied}
                    key={this.state.modalCount}
                />
            );
        }
        console.log('[Security Manager] No modal to render, type is null');
        return null;
    }
}

TWSecurityManagerComponent.propTypes = {
    vm: PropTypes.shape({
        extensionManager: PropTypes.shape({
            securityManager: PropTypes.shape(
                SECURITY_MANAGER_METHODS.reduce((obj, method) => {
                    obj[method] = PropTypes.func.isRequired;
                    return obj;
                }, {})
            ).isRequired
        }).isRequired
    }).isRequired,
    securityManager: PropTypes.shape(Object.fromEntries(SECURITY_MANAGER_METHODS.map(i => [i, PropTypes.func])))
};

TWSecurityManagerComponent.defaultProps = {
    securityManager: {}
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

const mapDispatchToProps = () => ({});

const ConnectedSecurityManagerComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(TWSecurityManagerComponent);

export {
    ConnectedSecurityManagerComponent as default,
    manuallyTrustExtension,
    isTrustedExtension
};