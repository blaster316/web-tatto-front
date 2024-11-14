import React from 'react';
import Header from './Header';
import Banner from './Banner';
import Section from './Section';
import Gallery from './Gallery';
import Cita from './Cita';
import Footer from './Footer';
import Recomendados from './Recomendado';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <Banner />
      <Section />
      <Recomendados/>
      <Gallery />
      <Cita />
      <Footer />
    </div>
  );
};

export default Home;