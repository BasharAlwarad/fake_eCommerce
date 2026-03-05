import { useState } from 'react';
// import { useNavigate } from 'react-router';

const Login = () => {
  //   const navigate = useNavigate();

  const [userInput, setUserInput] = useState({ email: '', password: '' });

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(' http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });
      const data = await response.json();

      console.log(data);
      localStorage.setItem('token', data.token);
      //   navigate(`/login`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUserInput((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div>
      <form onSubmit={createUser}>
        <input
          name="email"
          type="email"
          placeholder="your email"
          onChange={handleChange}
        />
        <input
          max={10}
          min={8}
          name="password"
          type="password"
          placeholder="your password"
          onChange={handleChange}
        />
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
