import React from "react";

interface Props {
  setFile: (file: File | null) => void;
  sendFile: () => void;
}

const FileForm: React.FC<Props> = ({ setFile, sendFile }) => {
  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <button onClick={sendFile}>Send File</button>
    </div>
  );
};

export default FileForm;
