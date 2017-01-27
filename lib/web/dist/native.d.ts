import { IEditorBaseInfo } from './models';
declare const RN: {
    editorMounted: () => Promise<IEditorBaseInfo>;
    getClipboardText: (...args: any[]) => Promise<{}>;
};
export default RN;
