import * as React from 'react'
import {
    WebView
} from 'react-native'
import createInvoke, { IMessager } from 'react-native-webview-invoke/native'

export interface RNEditorProperties {

}

export default class RNEditor extends React.Component<RNEditorProperties, any>{
    private webview: WebView
    private invoke: IMessager = createInvoke(() => this.webview)
    render () {
        return <WebView
            ref={(w: any) => this.webview = w}
            source={require('../lib/web/dist/RNEditor.html')}
            onMessage={this.invoke.listener}
        />
    }
}