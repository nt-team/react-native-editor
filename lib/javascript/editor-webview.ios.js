/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * Copyright (c) 2017-present, Huang Qi.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EditorWebView
 * @noflow
 */
'use strict';

import * as React from 'react'
import {
    StyleSheet, Text, UIManager, View, ScrollView,
    ActivityIndicator, EdgeInsetsPropType,
    NativeModules, requireNativeComponent,
    findNodeHandle, WebView
} from 'react-native'

const deprecatedPropType = require('react-native/Libraries/Utilities/deprecatedPropType');
const invariant = require('fbjs/lib/invariant');
const keyMirror = require('fbjs/lib/keyMirror');
const processDecelerationRate = require('react-native/Libraries/Components/ScrollView/processDecelerationRate');
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

const PropTypes = React.PropTypes;
const RNEditorWebViewManager = NativeModules.RNEditorWebViewManager;

var BGWASH = 'rgba(255,255,255,0.8)';
var RCT_WEBVIEW_REF = 'webview';

var WebViewState = keyMirror({
    IDLE: null,
    LOADING: null,
    ERROR: null,
});

const NavigationType = keyMirror({
    click: true,
    formsubmit: true,
    backforward: true,
    reload: true,
    formresubmit: true,
    other: true,
});

const JSNavigationScheme = 'react-js-navigation';

type ErrorEvent = {
    domain: any,
    code: any,
    description: any,
}

type Event = Object;

const DataDetectorTypes = [
    'phoneNumber',
    'link',
    'address',
    'calendarEvent',
    'none',
    'all',
];

const defaultRenderLoading = () => (
    <View style={styles.loadingView}>
        <ActivityIndicator />
    </View>
);
const defaultRenderError = (errorDomain, errorCode, errorDesc) => (
    <View style={styles.errorContainer}>
        <Text style={styles.errorTextTitle}>
            Error loading page
    </Text>
        <Text style={styles.errorText}>
            {'Domain: ' + errorDomain}
        </Text>
        <Text style={styles.errorText}>
            {'Error Code: ' + errorCode}
        </Text>
        <Text style={styles.errorText}>
            {'Description: ' + errorDesc}
        </Text>
    </View>
);

/**
 * `EditorWebView` renders web content in a native view.
 *
 *```
 * import React, { Component } from 'react';
 * import { EditorWebView } from 'react-native';
 *
 * class MyWeb extends Component {
 *   render() {
 *     return (
 *       <EditorWebView
 *         source={{uri: 'https://github.com/facebook/react-native'}}
 *         style={{marginTop: 20}}
 *       />
 *     );
 *   }
 * }
 *```
 *
 * You can use this component to navigate back and forth in the web view's
 * history and configure various properties for the web content.
 */
export default class EditorWebView extends React.Component {
    static JSNavigationScheme = JSNavigationScheme;
    static NavigationType = NavigationType;

    static propTypes = {
        ...WebView.propTypes,
        hideKeyboardAccessoryView: PropTypes.bool,
        keyboardDisplayRequiresUserAction: PropTypes.bool,
    };

    state = {
        viewState: WebViewState.IDLE,
        lastErrorEvent: (null: ?ErrorEvent),
        startInLoadingState: true,
    };

    componentWillMount() {
        if (this.props.startInLoadingState) {
            this.setState({ viewState: WebViewState.LOADING });
        }
    }

    render() {
        var otherView = null;

        if (this.state.viewState === WebViewState.LOADING) {
            otherView = (this.props.renderLoading || defaultRenderLoading)();
        } else if (this.state.viewState === WebViewState.ERROR) {
            var errorEvent = this.state.lastErrorEvent;
            invariant(
                errorEvent != null,
                'lastErrorEvent expected to be non-null'
            );
            otherView = (this.props.renderError || defaultRenderError)(
                errorEvent.domain,
                errorEvent.code,
                errorEvent.description
            );
        } else if (this.state.viewState !== WebViewState.IDLE) {
            console.error(
                'RNEditorWebView invalid state encountered: ' + this.state.loading
            );
        }

        var webViewStyles = [styles.container, styles.webView, this.props.style];
        if (this.state.viewState === WebViewState.LOADING ||
            this.state.viewState === WebViewState.ERROR) {
            // if we're in either LOADING or ERROR states, don't show the webView
            webViewStyles.push(styles.hidden);
        }

        var onShouldStartLoadWithRequest = this.props.onShouldStartLoadWithRequest && ((event: Event) => {
            var shouldStart = this.props.onShouldStartLoadWithRequest &&
                this.props.onShouldStartLoadWithRequest(event.nativeEvent);
            RNEditorWebViewManager.startLoadWithResult(!!shouldStart, event.nativeEvent.lockIdentifier);
        });

        var decelerationRate = processDecelerationRate(this.props.decelerationRate);

        var source = this.props.source || {};
        if (this.props.html) {
            source.html = this.props.html;
        } else if (this.props.url) {
            source.uri = this.props.url;
        }

        const messagingEnabled = typeof this.props.onMessage === 'function';

        var webView =
            <RNEditorWebView
                ref={RCT_WEBVIEW_REF}
                key="webViewKey"
                style={webViewStyles}
                source={resolveAssetSource(source)}
                injectedJavaScript={this.props.injectedJavaScript}
                bounces={this.props.bounces}
                scrollEnabled={this.props.scrollEnabled}
                decelerationRate={decelerationRate}
                contentInset={this.props.contentInset}
                automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
                onLoadingStart={this._onLoadingStart}
                onLoadingFinish={this._onLoadingFinish}
                onLoadingError={this._onLoadingError}
                messagingEnabled={messagingEnabled}
                onMessage={this._onMessage}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                scalesPageToFit={this.props.scalesPageToFit}
                allowsInlineMediaPlayback={this.props.allowsInlineMediaPlayback}
                mediaPlaybackRequiresUserAction={this.props.mediaPlaybackRequiresUserAction}
                dataDetectorTypes={this.props.dataDetectorTypes}

                hideKeyboardAccessoryView={this.props.hideKeyboardAccessoryView}
                keyboardDisplayRequiresUserAction={this.props.keyboardDisplayRequiresUserAction}
            />;

        return (
            <View style={styles.container}>
                {webView}
                {otherView}
            </View>
        );
    }

    /**
     * Go forward one page in the web view's history.
     */
    goForward = () => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNEditorWebView.Commands.goForward,
            null
        );
    };

    /**
     * Go back one page in the web view's history.
     */
    goBack = () => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNEditorWebView.Commands.goBack,
            null
        );
    };

    /**
     * Reloads the current page.
     */
    reload = () => {
        this.setState({ viewState: WebViewState.LOADING });
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNEditorWebView.Commands.reload,
            null
        );
    };

    /**
     * Stop loading the current page.
     */
    stopLoading = () => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNEditorWebView.Commands.stopLoading,
            null
        );
    };

    /**
     * Posts a message to the web view, which will emit a `message` event.
     * Accepts one argument, `data`, which must be a string.
     *
     * In your webview, you'll need to something like the following.
     *
     * ```js
     * document.addEventListener('message', e => { document.title = e.data; });
     * ```
     */
    postMessage = (data) => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNEditorWebView.Commands.postMessage,
            [String(data)]
        );
    };

    /**
    * Injects a javascript string into the referenced EditorWebView. Deliberately does not
    * return a response because using eval() to return a response breaks this method
    * on pages with a Content Security Policy that disallows eval(). If you need that
    * functionality, look into postMessage/onMessage.
    */
    injectJavaScript = (data) => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNEditorWebView.Commands.injectJavaScript,
            [data]
        );
    };

    /**
     * We return an event with a bunch of fields including:
     *  url, title, loading, canGoBack, canGoForward
     */
    _updateNavigationState = (event: Event) => {
        if (this.props.onNavigationStateChange) {
            this.props.onNavigationStateChange(event.nativeEvent);
        }
    };

    /**
     * Returns the native `EditorWebView` node.
     */
    getWebViewHandle = (): any => {
        return findNodeHandle(this.refs[RCT_WEBVIEW_REF]);
    };

    _onLoadingStart = (event: Event) => {
        var onLoadStart = this.props.onLoadStart;
        onLoadStart && onLoadStart(event);
        this._updateNavigationState(event);
    };

    _onLoadingError = (event: Event) => {
        event.persist(); // persist this event because we need to store it
        var {onError, onLoadEnd} = this.props;
        onError && onError(event);
        onLoadEnd && onLoadEnd(event);
        console.warn('Encountered an error loading page', event.nativeEvent);

        this.setState({
            lastErrorEvent: event.nativeEvent,
            viewState: WebViewState.ERROR
        });
    };

    _onLoadingFinish = (event: Event) => {
        var {onLoad, onLoadEnd} = this.props;
        onLoad && onLoad(event);
        onLoadEnd && onLoadEnd(event);
        this.setState({
            viewState: WebViewState.IDLE,
        });
        this._updateNavigationState(event);
    };

    _onMessage = (event: Event) => {
        var {onMessage} = this.props;
        onMessage && onMessage(event);
    }
}

var RNEditorWebView = requireNativeComponent('RNEditorWebView', EditorWebView, {
    nativeOnly: {
        onLoadingStart: true,
        onLoadingError: true,
        onLoadingFinish: true,
        onMessage: true,
        messagingEnabled: PropTypes.bool,
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BGWASH,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 2,
    },
    errorTextTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10,
    },
    hidden: {
        height: 0,
        flex: 0, // disable 'flex:1' when hiding a View
    },
    loadingView: {
        backgroundColor: BGWASH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    webView: {
        backgroundColor: '#ffffff',
    }
});
