import React from 'react';
import { Avatar } from '@mantine/core';

const UserCard = ({ imageUrl, userName, userGreeting }) => {
  const styles = {
    userCard: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f5f9ff',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '400px',
      margin: '20px auto',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      margin: 0,
      fontSize: '24px',
      color: '#333',
    },
    userGreeting: {
      margin: '5px 0 0',
      fontSize: '16px',
      color: '#666',
    },
  };

  return (
    <div style={styles.userCard}>
      <Avatar
        src={imageUrl}
        alt={userName || 'User profile picture'}
        size={100}
        radius="xl"
        color="blue"
        style={{ marginRight: '20px' }} 
      >
        {userName ? userName.substring(0, 2).toUpperCase() : null}
      </Avatar>
      <div style={styles.userInfo}>
        <h2 style={styles.userName}>{userName}</h2>
        <p style={styles.userGreeting}>{userGreeting}</p>
      </div>
    </div>
  );
};

export default UserCard;