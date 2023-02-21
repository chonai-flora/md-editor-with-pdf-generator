import React, { useState } from 'react';
import 'katex/dist/katex.css';
import katex from 'katex';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { getCodeString } from 'rehype-rewrite';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

import PdfPreview from './PdfPreview';

const Editor = () => {
    const [mdTitle, setTitle] = useState("");
    const [state, setVisible] = useState<MDEditorProps>({
        visibleDragbar: true,
        hideToolbar: true,
        highlightEnable: true,
        enableScroll: true,
        value: '',
        preview: 'live',
    });

    const saveAsMd = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        const filename = `${mdTitle || "untitled"}.md`;
        const file = new File([`${state.value}`], filename, { type: 'text/plain;charset=utf-8' });
        saveAs(file);
    }

    const saveAsPdf = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        const target = document.getElementById('pdf');
        const filename = `${mdTitle || "untitled"}.pdf`;

        html2canvas(target as HTMLElement, { scale: 5.0 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/svg', 5.0);
            const pdf = new jsPDF();
            const width = pdf.internal.pageSize.width;
            pdf.addImage(imgData, 'SVG', width * 0.05, width * 0.01, width * 0.9, 0);
            pdf.save(filename);
        });
    }

    return (
        <div data-color-mode='light'>
            <input
                type='text'
                value={mdTitle}
                className='title'
                placeholder="タイトル"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
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
                }}
            />

            <div className='doc-tools'>
                <label>
                    <input
                        type='checkbox'
                        checked={state.visibleDragbar}
                        onChange={(e) => {
                            setVisible({ ...state, visibleDragbar: e.target.checked });
                        }}
                    />
                    ドラッグバー
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.highlightEnable}
                        onChange={(e) => {
                            setVisible({ ...state, highlightEnable: e.target.checked });
                        }}
                    />
                    ハイライト
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.enableScroll}
                        onChange={(e) => {
                            setVisible({ ...state, enableScroll: e.target.checked });
                        }}
                    />
                    同時スクロール
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.hideToolbar}
                        onChange={(e) => {
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
                    <button
                        type='button'
                        disabled={!state.value}
                        style={{ marginLeft: 10 }}
                        onClick={saveAsPdf}
                    >
                        PDF形式でエクスポート
                    </button>
                </div>
            </div>

            <br />
            <hr />
            <h3>PDF Preview</h3>
            <PdfPreview source={state.value!} />
        </div>
    );
};

export default Editor;