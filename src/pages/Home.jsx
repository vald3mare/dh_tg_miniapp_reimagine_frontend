import UserPreview from '../components/UserPreview/UserPreview';
import { Slider } from '../components/Slider/Slider';
import ShoppingCart from '../components/ShoppingCart/ShoppingCart';
import Notify from '../components/Notify/Notify';
import Header from '../components/Header/Header';
import SliderItem from '../components/SliderItem/SliderItem';
import ServicesList from '../components/ServicesList/ServicesList';

const Home = () => {
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
        <SliderItem name="Item 3" price="300" />
      </Slider>
      <ServicesList 
        services={[
          { id: 1, name: 'Услуга 1', backgroundImage: '/path/to/your-svg.svg' },
          { id: 2, name: 'Услуга 2', backgroundImage: '/path/to/another-svg.svg' },
          { id: 3, name: 'Услуга 3', backgroundImage: '/path/to/another-svg.svg' },
          { id: 4, name: 'Услуга 4', backgroundImage: '/path/to/another-svg.svg' },
          { id: 5, name: 'Услуга 5', backgroundImage: '/path/to/another-svg.svg' },
          { id: 6, name: 'Услуга 6', backgroundImage: '/path/to/another-svg.svg' },
          // ... до 4+ для теста expanded
        ]}
        expanded={false} // Или true для полного списка
      />
      <h1>Главная страница</h1>
      <p>Это заглушка для главной</p>
    </div>
  );
};

export default Home;