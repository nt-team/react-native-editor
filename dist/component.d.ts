/// <reference types="react-native" />
/// <reference types="react" />
import * as React from 'react';
export interface RNEditorProperties {
    source?: number | React.WebViewUriSource | React.WebViewHtmlSource;
    autoHeight?: boolean;
    style?: React.ViewStyle;
    placeholder?: string;
}
export default class RNEditor extends React.Component<RNEditorProperties, any> {
    static defaultProps: {
        source: {
            uri: string;
        };
        autoHeight: boolean;
        placeholder: string;
    };
    private webview;
    private invoke;
    private editorMounted;
    private handleEditorHeightChange;
    insertImage: (url: string) => Promise<void>;
    insertVideo: (url: string) => Promise<void>;
    setPlaceHolder: (placeholder: string) => Promise<void>;
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: RNEditorProperties): void;
    render(): JSX.Element;
}
