import { useEffect, useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  console.log(token);
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUser(data);
      console.log(data);
    };

    getUser();
  }, []);

  const deleteUser = async () => {
    await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
    },
});
};

const createEvent = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(' http://localhost:3001/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(eventInput),
      });
      const data = await response.json();

      console.log(data);
    //   navigate(`/login`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>{user?.email} </p>
      <button onClick={deleteUser}> delete</button>

      <form onSubmit={createEvent}>
        create event
        <input type="text" />
        <button>create event</button>
      </form>
    </div>
  );
};

export default UserProfile;
