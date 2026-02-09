import React, { useState, useEffect } from 'react';
import { Slider } from '../components/Slider/Slider';
import Header from '../components/Header/Header';
import SliderItem from '../components/SliderItem/SliderItem';
import CatalogList from '../components/CatalogList/CatalogList';

const Home = () => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/catalog')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сервера');
        return res.json();
      })
      .then(data => {
        setCatalog(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка каталога...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className='home-page'>
      <Header />
      <Slider autoPlay={true} autoPlayTime={5000}>
        <SliderItem 
          image="https://st5.depositphotos.com/1594920/69257/i/450/depositphotos_692576270-stock-photo-head-shot-happy-panting-golden.jpg"
          title="Заголовок УТП"
          subtitle="Текст текст текст текст текст\nТекст текст текст"
          buttonText="CTA"
          buttonLink="https://example.com"
        />
        <SliderItem name="Item 2" price="200" />
      </Slider>
      <CatalogList 
        catalog={catalog}
        expanded={false}
        showTitle={true}
      />
    </div>
  );
};

export default Home;