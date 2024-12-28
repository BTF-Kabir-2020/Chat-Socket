import React from "react";

interface Props {
  name: string;
  room: string;
  setName: (value: string) => void;
  setRoom: (value: string) => void;
  joinRoom: () => void;
}

const JoinRoomForm: React.FC<Props> = ({
  name,
  room,
  setName,
  setRoom,
  joinRoom,
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoomForm;
