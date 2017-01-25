import * as React from 'react'
import {
    WebView
} from 'react-native'
import createInvoke, { IMessager } from 'react-native-webview-invoke/native'

export interface RNEditorProperties {
    source?: number | React.WebViewUriSource | React.WebViewHtmlSource
    autoHeight?: boolean
}

export default class RNEditor extends React.Component<RNEditorProperties, any>{
    static defaultProps = {
        source: require('../lib/web/dist/RNEditor.html'),
        autoHeight: false
    }
    private webview: WebView
    private invoke: IMessager = createInvoke(() => this.webview)
    render () {
        return <WebView
            ref={(w: any) => this.webview = w}
            source={this.props.source}
            bounces={!this.props.autoHeight}
            onMessage={this.invoke.listener}
        />
    }
}