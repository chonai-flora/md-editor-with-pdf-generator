import { createSlice } from '@reduxjs/toolkit';

const readme = `作成・編集したMarkdown文書をPDF化することができます。  

\`<br>\` タグを挿入することでページを分割できます。

数式は
\`$$c = \\pm\\sqrt{a^2 + b^2}$$\`
のように一行で表示するか、

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
のように複数行にまたがって記述してください。

エディタ部分は https://github.com/uiwjs/react-md-editor を参考にしています。`;

export interface MdState {
    title: string;
    text: string;
}

export const initialState: MdState = {
    title: ``,
    text: readme
};

export const mdSlice = createSlice({
    name: 'editing-markdown',
    initialState,
    reducers: {
        updateTitle: (state, action) => {
            state.title = action.payload;
        },
        updateMdText: (state, action) => {
            state.text = action.payload;
        },
    },
});


export const selectTitle = (state: MdState) => {
    return state.title;
}

export const selectMdText = (state: MdState) => {
    return state.text;
}
  
export const { updateTitle, updateMdText } = mdSlice.actions;