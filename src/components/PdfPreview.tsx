import 'katex/dist/katex.css';
import katex from 'katex';
import rehypeIgnore from 'rehype-ignore';
import MDEditor from '@uiw/react-md-editor';
import { getCodeString } from 'rehype-rewrite';
import { CodeComponent, ReactMarkdownNames } from 'react-markdown/lib/ast-to-react';

const CodePreview: CodeComponent | ReactMarkdownNames = ({ inline, children = [], className, ...props }) => {
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
};

const PdfPreview = (props: { source: string }) => {
    return (
        <div id='pdf' data-color-mode='light' style={{ marginBottom: '80px' }}>
            <MDEditor.Markdown
                style={{ margin: '30px', pageBreakAfter: 'always' }}
                disableCopy={true}
                rehypePlugins={[rehypeIgnore]}
                source={props.source || ``}
                components={{
                    code: CodePreview,
                }}
            />
        </div>
    );
}

export default PdfPreview;