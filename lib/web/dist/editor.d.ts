/// <reference types="draft-js" />
/// <reference types="react" />
import 'draft-js/dist/Draft.css';
import * as React from 'react';
import { EditorState } from 'draft-js';
export interface RNEditorBrowserProperties {
}
export interface RNEditorBrowserStates {
    editorState?: EditorState;
}
export default class RNEditorBrowser extends React.Component<RNEditorBrowserProperties, RNEditorBrowserStates> {
    state: {
        editorState: EditorState;
    };
    onEditorStateChange: (editorState: EditorState) => void;
    componentDidMount(): void;
    render(): JSX.Element;
}
