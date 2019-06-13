import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UserDoc } from '@caravan/buddy-reading-types';

export interface UserCardProps {
  userId: string;
}

export function UserCard(props: UserCardProps) {
  const [user, setUser] = useState<UserDoc | null>(null);
  useEffect(() => {
    async function getUser() {
      const res = await axios.get(`/api/user/${props.userId}`);
      const userReceived: UserDoc = res.data;
      setUser(userReceived);
    };
    getUser();
  }, [props.userId]);
  // The [props.userId] ensures only performing the network call when the userId changes (thus only on first render)
  if (!user) {
    return <div>Loading...</div>
  }
  return (
    <div>
      {user.name}
      {user.createdAt}
    </div>
  )
}
