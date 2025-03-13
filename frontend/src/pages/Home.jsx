import React from 'react';
import Navbar from '../components/Navbar';
import QuestionsList from '../components/QuestionList';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
      <Navbar />
      <QuestionsList />
      <Footer/>
    </div>
  );
};

export default Home;