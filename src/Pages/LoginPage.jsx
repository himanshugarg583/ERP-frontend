import React, { useState } from 'react';
// import { AdminSignInContainer } from '../styles/AdminSignInStyles';
import { AdminSignInContainer, FormContainer, InputField, SubmitButton } from '../styles/AdminSignInStyles';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    try {
      // const response = await axios.post('http://192.168.1.39:8001/user/login', { email, password }); 
      if (true){
        // response.status === 200
        // Sign-in successful, redirect to admin dashboard
        console.log("Login Successful");
        window.location.href = '/AdminDashboard';
      } else {
        // Handle sign-in errors
        // window.location.href = '/admin/dashboard';
        console.error('Sign-in failed');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <AdminSignInContainer>
      <h2>Admin Sign In</h2>
      <FormContainer>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /> 
        <SubmitButton onClick={handleSignIn}>Sign In</SubmitButton>
      </FormContainer>
    </AdminSignInContainer>
   
  );
};

export default LoginPage;
