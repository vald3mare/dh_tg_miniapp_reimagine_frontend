import { Slider } from '../components/Slider/Slider';
import Header from '../components/Header/Header';
import SliderItem from '../components/SliderItem/SliderItem';
import CatalogList from '../components/CatalogList/CatalogList';
import CatalogListSkeleton from '../components/CatalogList/CatalogListSkeleton';
import TariffSection from '../components/TariffSection/TariffSection';
import PageTransition from '../components/PageTransition/PageTransition';
import { useCatalog } from '../hooks/useCatalog';
import './Home.css';

const Home = () => {
  const { catalog, loading, error } = useCatalog();

  return (
    <PageTransition>
      <div className="home-page">
        <Header />

        <Slider autoPlay={false} autoPlayTime={5000}>
          <SliderItem
            title={'Первая прогулка\nбесплатно!'}
            subtitle="Для новых пользователей"
            buttonText="Попробовать"
            buttonLink="#"
          />
          <SliderItem
            title={'Груминг со скидкой\n20%'}
            subtitle="Только до конца месяца"
            buttonText="Подробнее"
            buttonLink="#"
          />
        </Slider>

        {loading ? (
          <CatalogListSkeleton count={3} showTitle />
        ) : error ? (
          <p style={{ color: '#FA5252', padding: '0 4px' }}>Ошибка: {error}</p>
        ) : (
          <CatalogList catalog={catalog} showTitle carousel />
        )}

        <TariffSection />
      </div>
    </PageTransition>
  );
};

export default Home;
