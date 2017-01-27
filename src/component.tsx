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
        source: require('../lib/web/dist/RNEditor.html'),// { uri: 'http://localhost:8888/' }, // require('../lib/web/dist/RNEditor.html'),
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
        this.insertImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1486098973&di=9f8132ec90dd9de2ddbf405bf91dcedd&imgtype=jpg&er=1&src=http%3A%2F%2Fi4.piimg.com%2F11340%2F7f638e192b9079e6.jpg')
        this.insertText('hjajajsetset')
        this.insertVideo('http://techslides.com/demos/sample-videos/small.mp4')
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