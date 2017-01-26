import * as React from 'react'
import {
    WebView, Keyboard, Clipboard
} from 'react-native'
import createInvoke, { IMessager } from 'react-native-webview-invoke/native'
import { IEditorBaseInfo } from './models'

export interface RNEditorProperties {
    source?: number | React.WebViewUriSource | React.WebViewHtmlSource
    autoHeight?: boolean
    style?: React.ViewStyle
    placeholder?: string
    initialContent?: any
}

export default class RNEditor extends React.Component<RNEditorProperties, any>{
    static defaultProps = {
        source: { uri: 'http://localhost:8888/' }, // require('../lib/web/dist/RNEditor.html'),
        autoHeight: false,
        placeholder: '21111',
    }
    private webview: WebView
    private invoke: IMessager = createInvoke(() => this.webview)
    private editorMounted = async (): Promise<IEditorBaseInfo> => {
        alert('mounted')
        return {
            placeholder: this.props.placeholder,
            content: this.props.initialContent
        }
    }
    private handleEditorHeightChange = (height: number) => {
        if (this.props.autoHeight) {

        }
    }

    // apis
    insertImage = this.invoke.bind<void>('editorInsertImage') as (url: string) => Promise<void>
    insertVideo = this.invoke.bind<void>('editorInsertVideo') as (url: string) => Promise<void>
    insertText = this.invoke.bind<void>('editorInsertText') as (text: string) => Promise<void>
    setPlaceHolder = this.invoke.bind<void>('editorSetPlaceHolder') as (placeholder: string) => Promise<void>
    setContent = this.invoke.bind<void>('editorSetContent') as (content: any) => Promise<void>
    getContent = this.invoke.bind<void>('editorGetContent') as () => Promise<any>

    // fix android

    // fix ios

    // component
    componentWillMount() {
        this.invoke.define('editorMounted', this.editorMounted)
        this.invoke.define('editorHeightChange', this.handleEditorHeightChange)
        // fix android
        this.invoke.define('getClipboardText', Clipboard.getString)
    }
    componentWillReceiveProps(nextProps: RNEditorProperties) {
        if (this.props.placeholder !== nextProps.placeholder) {
            this.setPlaceHolder(nextProps.placeholder)
        }
    }
    render() {
        return <WebView
            ref={(w: any) => this.webview = w}
            source={this.props.source}
            style={this.props.style}
            bounces={!this.props.autoHeight}
            onMessage={this.invoke.listener}
        />
    }
}