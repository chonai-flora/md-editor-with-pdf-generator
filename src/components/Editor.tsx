import React, { useRef, useState } from 'react';
import 'katex/dist/katex.css';
import katex from 'katex';
import { saveAs } from 'file-saver';
import ReactToPrint from 'react-to-print';
import { getCodeString } from 'rehype-rewrite';
import { useSelector, useDispatch } from 'react-redux';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';


import {
    selectTitle,
    selectMdText,
    updateTitle,
    updateMdText
} from '../states/state';
import PdfPreview from './PdfPreview';
import { store } from '../store/store';

const Editor = () => {
    const pdfRef = useRef(null);

    const mdTitle = useSelector(selectTitle);
    const mdText = useSelector(selectMdText);
    const dispatch = useDispatch();
    const [state, setVisible] = useState<MDEditorProps>({
        visibleDragbar: true,
        hideToolbar: true,
        highlightEnable: true,
        enableScroll: true,
        value: mdText,
        preview: 'live',
    });

    const saveAsMd = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        const filename = `${mdTitle || "untitled"}.md`;
        const file = new File([`${state.value}`], filename, { type: 'text/plain;charset=utf-8' });
        saveAs(file);
    }

    return (
        <div data-color-mode='light'>
            <input
                type='text'
                value={mdTitle}
                className='title'
                placeholder="タイトル"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(updateTitle(e.target.value))}
            />
            <MDEditor
                autoFocus
                value={state.value}
                previewOptions={{
                    linkTarget: '_blank',
                    rehypePlugins: [
                        [
                            rehypeSanitize,
                            {
                                ...defaultSchema,
                                attributes: {
                                    ...defaultSchema.attributes,
                                    span: [
                                        // @ts-ignore
                                        ...(defaultSchema.attributes.span || []),
                                        // List of all allowed tokens:
                                        ['className'],
                                    ],
                                    code: [['className']],
                                },
                            },
                        ],
                    ],
                    components: {
                        code: ({ inline, children = [], className, ...props }) => {
                            const txt = children[0] || '';
                            if (inline) {
                                if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                                    const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                                        throwOnError: false,
                                    });
                                    return <code dangerouslySetInnerHTML={{ __html: html }} />;
                                }
                                return <code>{txt}</code>;
                            }
                            const code = props.node && props.node.children ? getCodeString(props.node.children) : txt;
                            if (
                                typeof code === 'string' &&
                                typeof className === 'string' &&
                                /^language-katex/.test(className.toLocaleLowerCase())
                            ) {
                                const html = katex.renderToString(code, {
                                    throwOnError: false,
                                });
                                return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
                            }
                            return <code className={String(className)}>{txt}</code>;
                        },
                    },
                }}
                height={400}
                highlightEnable={state.highlightEnable}
                hideToolbar={!state.hideToolbar}
                enableScroll={state.enableScroll}
                visibleDragbar={state.visibleDragbar}
                textareaProps={{
                    placeholder: "記事やレポートをMarkdown形式で記述してください",
                }}
                preview={state.preview}
                onChange={(newValue = '') => {
                    setVisible({ ...state, value: newValue });
                    dispatch(updateMdText(newValue));
                }}
            />

            <div className='doc-tools'>
                <label>
                    <input
                        type='checkbox'
                        checked={state.visibleDragbar}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setVisible({ ...state, visibleDragbar: e.target.checked });
                        }}
                    />
                    ドラッグバー
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.highlightEnable}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setVisible({ ...state, highlightEnable: e.target.checked });
                        }}
                    />
                    ハイライト
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.enableScroll}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setVisible({ ...state, enableScroll: e.target.checked });
                        }}
                    />
                    同時スクロール
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.hideToolbar}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setVisible({ ...state, hideToolbar: e.target.checked });
                        }}
                    />
                    ツールバー
                </label>
                <div className='save-button'>
                    <button
                        type='button'
                        disabled={!state.value}
                        style={{ marginLeft: 10 }}
                        onClick={saveAsMd}
                    >
                        Markdown形式で保存
                    </button>
                    <ReactToPrint
                        trigger={() => (
                            <button
                                type='button'
                                disabled={!state.value}
                                style={{ marginLeft: 10 }}
                            >
                                PDF形式にエクスポート
                            </button>
                        )}
                        content={() => pdfRef.current}
                        documentTitle={`${mdTitle || "untitled"}.pdf`}
                    />
                </div>
            </div>
            <br />

            <hr />
            <h3>PDF Preview</h3>
            <div ref={pdfRef}>
                {state.value!.split('<br>')
                    .map((section) => <PdfPreview source={section} />)}
            </div >
        </div >
    );
};

export default Editor;