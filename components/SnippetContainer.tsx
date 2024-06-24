import {useRef} from 'react';
import useMasterAudioLoad from '../hooks/useMasterAudioLoad';
import Snippet from './Snippet';

const SnippetContainer = ({
  snippetsLocalAndDb,
  setIsPlaying,
  isPlaying,
  deleteSnippet,
  addSnippet,
  removeSnippet,
  url,
}) => {
  const masterSoundRef = useRef(null);
  const instance = useMasterAudioLoad({soundRef: masterSoundRef, url});

  return snippetsLocalAndDb?.map((snippet, index) => {
    return (
      <Snippet
        key={index}
        snippet={snippet}
        setMasterAudio={setIsPlaying}
        masterAudio={isPlaying}
        deleteSnippet={deleteSnippet}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
        index={index}
        instance={instance}
      />
    );
  });
};

export default SnippetContainer;
