import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Login failed');
      const token = body.token;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_username', username);
      onLogin({ username, token });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper sx={{ p: 3, width: 360 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Login</Typography>
        <TextField label="Username" fullWidth sx={{ mb: 2 }} value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={e => setPassword(e.target.value)} />
        {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
        <Button variant="contained" fullWidth onClick={submit}>Sign in</Button>
      </Paper>
    </Box>
  );
}
