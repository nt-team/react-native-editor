/// <reference types="react-native" />
/// <reference types="react" />
import * as React from 'react';
export interface RNEditorProperties {
    source?: number | React.WebViewUriSource | React.WebViewHtmlSource;
    autoHeight?: boolean;
    style?: React.ViewStyle;
    placeholder?: string;
    initialContent?: any;
}
export interface RNEditorState {
    height?: number;
}
export default class RNEditor extends React.Component<RNEditorProperties, RNEditorState> {
    static defaultProps: {
        source: any;
        autoHeight: boolean;
        placeholder: string;
    };
    state: {
        height: number;
    };
    private webview;
    private invoke;
    private editorMounted;
    private handleEditorHeightChange;
    insertImage: (url: string) => Promise<void>;
    insertVideo: (url: string) => Promise<void>;
    insertText: (text: string) => Promise<void>;
    setPlaceHolder: (placeholder: string) => Promise<void>;
    setContent: (content: any) => Promise<void>;
    getContent: () => Promise<any>;
    setAutoHeight: (autoHeight: boolean) => Promise<void>;
    focus: (...args: any[]) => Promise<void>;
    blur: (...args: any[]) => Promise<void>;
    private getWebViewStyle;
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: RNEditorProperties): void;
    render(): JSX.JSXElement;
}
