// src\components\UserList.tsx
import React from "react";

interface Props {
  users: string[];
}

const UserList: React.FC<Props> = ({ users }) => {
  // بررسی اگر لیست خالی بود، چیزی نمایش داده نشود
  if (users.length === 0) {
    return <div>No users online</div>; // یا هر پیغام دیگری که بخواهید
  }

  return (
    <div>
      <h2>Users in this room:</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
