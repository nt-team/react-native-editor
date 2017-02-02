import * as React from 'react'
import {
    Keyboard, Clipboard, View, WebView
} from 'react-native'
import createInvoke, { IMessager } from 'react-native-webview-invoke/native'
import { IEditorBaseInfo } from './models'
import EditorWebView from '../lib/javascript/editor-webview'

export interface RNEditorProperties {
    source?: number | React.WebViewUriSource | React.WebViewHtmlSource
    autoHeight?: boolean
    style?: React.ViewStyle
    placeholder?: string
    initialContent?: any
}

export interface RNEditorState {
    height?: number
}

export default class RNEditor extends React.Component<RNEditorProperties, RNEditorState>{
    static defaultProps = {
        source: require('../lib/web/dist/RNEditor.html'),//{ uri: 'http://localhost:8888/' }, // require('../lib/web/dist/RNEditor.html'),
        autoHeight: false,
        placeholder: '',
    }
    state = {
        height: 0
    }
    private webview: WebView
    private invoke: IMessager = createInvoke(() => this.webview)
    // native apis
    private editorMounted = async (): Promise<IEditorBaseInfo> => {
        // alert('mo')
        return {
            placeholder: this.props.placeholder,
            content: this.props.initialContent,
            autoHeight: this.props.autoHeight
        }
    }
    private handleEditorHeightChange = (height: number) => {
        if (this.props.autoHeight) {
            this.setState({ height })
        }
    }

    // web apis
    insertImage = this.invoke.bind<void>('editorInsertImage') as (url: string) => Promise<void>
    insertVideo = this.invoke.bind<void>('editorInsertVideo') as (url: string) => Promise<void>
    insertText = this.invoke.bind<void>('editorInsertText') as (text: string) => Promise<void>
    setPlaceHolder = this.invoke.bind<void>('editorSetPlaceHolder') as (placeholder: string) => Promise<void>
    setContent = this.invoke.bind<void>('editorSetContent') as (content: any) => Promise<void>
    getContent = this.invoke.bind<void>('editorGetContent') as () => Promise<any>
    setAutoHeight = this.invoke.bind<void>('editorSetAutoHeight') as (autoHeight: boolean) => Promise<void>

    // fix android

    // fix ios

    // others
    private getWebViewStyle = () => {
        const webviewStyle: React.ViewStyle[] = []
        if (this.props.autoHeight) {
            webviewStyle.push({
                height: this.state.height
            })
        }
        webviewStyle.push(this.props.style)
        return webviewStyle
    }

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
        if (this.props.autoHeight !== nextProps.autoHeight) {
            this.setAutoHeight(nextProps.autoHeight)
        }
    }
    render() {
        return (
            <View style={this.getWebViewStyle()}>
                <EditorWebView
                    ref={(w: any) => this.webview = w}
                    source={this.props.source}
                    bounces={!this.props.autoHeight}
                    scrollEnabled={!this.props.autoHeight}
                    automaticallyAdjustContentInsets={!this.props.autoHeight}
                    onMessage={this.invoke.listener}
                    mediaPlaybackRequiresUserAction
                />
            </View>
        )
    }
}