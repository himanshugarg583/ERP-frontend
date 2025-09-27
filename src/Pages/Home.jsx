import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
// import Students from "../assests/students.svg"
import Students from "../assets/students.svg"
import { LightPurpleButton } from '../components/comman_components/ButtonStyles';

const HomePage = () => {
    return (
        // <div className='bg-amber-200'>
        //     hello
        // </div>
        <div className='bg-white overflow-auto relative z-1 flex-col justify-center  m-auto  w-full h-full'>
        <StyledContainer>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <img src={Students} alt="students" style={{ width: '100%' }} />
                    {/* <h1>i am student</h1> */}
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledPaper elevation={3}>
                        <StyledTitle>
                            Welcome to
                            <br />
                            School Management
                            <br />
                            System
                        </StyledTitle>
                        <StyledText>
                            Streamline school management, class organization, and add students and faculty.
                            Seamlessly track attendance, assess performance, and provide feedback.
                            Access records, view markseffortlessly.
                        </StyledText>
                        <StyledBox>
                            <StyledLink to="login">
                                <LightPurpleButton variant="contained" fullWidth>
                                   Login
                                </LightPurpleButton>
                            </StyledLink>
                          
                            {/* <StyledText>
                                Don't have an account?{' '}
                                <Link to="/Adminregister" style={{color:"#550080"}}>
                                    Sign up
                                </Link>
                            </StyledText> */}
                        </StyledBox>
                    </StyledPaper>
                </Grid>
            </Grid>
          </StyledContainer>
          </div>
    );
};

export default HomePage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledPaper = styled.div`
  padding: 24px;
  height: 100vh;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  gap: 16px;
  padding: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #252525;
  /* font-family: "Manrope"; */
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledText = styled.p`
  /* color: #550080; */
  margin-top: 30px;
  margin-bottom: 30px; 
  letter-spacing: normal;
  line-height: normal;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
