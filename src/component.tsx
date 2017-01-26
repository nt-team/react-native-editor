import * as React from 'react'
import {
    WebView, Keyboard, Clipboard
} from 'react-native'
import createInvoke, { IMessager } from 'react-native-webview-invoke/native'

export interface RNEditorProperties {
    source?: number | React.WebViewUriSource | React.WebViewHtmlSource
    autoHeight?: boolean
}

export default class RNEditor extends React.Component<RNEditorProperties, any>{
    static defaultProps = {
        source: {uri: 'http://localhost:8888/'}, // require('../lib/web/dist/RNEditor.html'),
        autoHeight: false
    }
    private webview: WebView
    private invoke: IMessager = createInvoke(() => this.webview)
    private editorMounted = () => {
        alert('mounted')
    }

    // apis
    

    // fix android

    // fix ios

    componentWillMount() {
        this.invoke.define('editorMounted', this.editorMounted)
        // fix android
        this.invoke.define('getClipboardText', Clipboard.getString)
    }
    render () {
        return <WebView
            ref={(w: any) => this.webview = w}
            source={this.props.source}
            bounces={!this.props.autoHeight}
            onMessage={this.invoke.listener}
        />
    }
}