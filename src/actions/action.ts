import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const actions = {
  updateTitle: actionCreator<string>('ACTIONS_UPDATE_TITLE'),
  updateMdText: actionCreator<string>('ACTIONS_UPDATE_MD_TEXT'),
};