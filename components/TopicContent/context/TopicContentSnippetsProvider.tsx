import React, {createContext, PropsWithChildren} from 'react';
import useData from '../../../context/Data/useData';

export const TopicContentSnippetsContext = createContext(null);

export const TopicContentSnippetsProvider = ({
  selectedSnippetsState,
  setSelectedSnippetsState,
  children,
}: PropsWithChildren<{}>) => {
  const {addSnippet, removeSnippet} = useData();

  const handleAddSnippet = async snippetData => {
    try {
      const snippetResponse = await addSnippet(snippetData);
      const updatedSnippetState = selectedSnippetsState.map(snipData => {
        if (snipData.id === snippetData.id) {
          return {...snippetResponse, saved: true};
        }
        return snipData;
      });
      setSelectedSnippetsState(updatedSnippetState);
    } catch (error) {
      console.error('## failed to add snippet state');
    }
  };

  const deleteSnippet = ({snippetId, sentenceId}) => {
    removeSnippet({snippetId, sentenceId});
    setSelectedSnippetsState(prev =>
      prev.filter(snippetData => snippetData.id !== snippetId),
    );
  };

  return (
    <TopicContentSnippetsContext.Provider
      value={{
        handleAddSnippet,
        selectedSnippetsState,
        setSelectedSnippetsState,
        deleteSnippet,
      }}>
      {children}
    </TopicContentSnippetsContext.Provider>
  );
};
