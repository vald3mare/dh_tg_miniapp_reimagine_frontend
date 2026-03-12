import { Slider } from '../components/Slider/Slider';
import Header from '../components/Header/Header';
import SliderItem from '../components/SliderItem/SliderItem';
import CatalogList from '../components/CatalogList/CatalogList';
import CatalogListSkeleton from '../components/CatalogList/CatalogListSkeleton';
import PageTransition from '../components/PageTransition/PageTransition';
import { useCatalog } from '../hooks/useCatalog';

const Home = () => {
  const { catalog, loading, error } = useCatalog();

  return (
    <PageTransition>
      <div className='home-page'>
        <Header />
        <Slider autoPlay={false} autoPlayTime={5000}>
          <SliderItem
            image="https://st5.depositphotos.com/1594920/69257/i/450/depositphotos_692576270-stock-photo-head-shot-happy-panting-golden.jpg"
            title="Заголовок УТП"
            subtitle="Текст текст текст текст текст\nТекст текст текст"
            buttonText="CTA"
            buttonLink="https://example.com"
          />
          <SliderItem name="Item 2" price="200" />
        </Slider>
        {loading
          ? <CatalogListSkeleton count={2} showTitle={true} />
          : error
            ? <p>Ошибка: {error}</p>
            : <CatalogList catalog={catalog} expanded={false} showTitle={true} />
        }
      </div>
    </PageTransition>
  );
};

export default Home;
