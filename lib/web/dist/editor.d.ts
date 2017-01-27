/// <reference types="draft-js" />
/// <reference types="react" />
import 'draft-js/dist/Draft.css';
import '../global/index.css';
import * as React from 'react';
import { EditorState, RawDraftContentState, CompositeDecorator } from 'draft-js';
export interface RNEditorBrowserProperties {
}
export interface RNEditorBrowserStates {
    editorState?: EditorState;
    placeholder?: string;
}
export default class RNEditorBrowser extends React.Component<RNEditorBrowserProperties, RNEditorBrowserStates> {
    state: RNEditorBrowserStates;
    composite: CompositeDecorator;
    private onEditorStateChange;
    private insertMedia;
    getContent: () => RawDraftContentState;
    setContent: (content: any) => void;
    setPlaceHolder: (placeholder: string) => void;
    insertImage: (uri: string) => void;
    insertVideo: (uri: string) => void;
    insertText: (text: string) => void;
    handlePaste: (text: string) => "handled" | "not-handled";
    handleKeyCommand: (command: any) => "handled" | "not-handled";
    registerAPIs: () => void;
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
