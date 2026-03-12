import Header from '../components/Header/Header';
import OrderList from '../components/OrderList/OrderList';
import OrderListSkeleton from '../components/OrderList/OrderListSkeleton';
import PageTransition from '../components/PageTransition/PageTransition';
import { useOrders } from '../hooks/useOrders';

const ExecutorHome = () => {
  const { orders, loading, error } = useOrders();

  return (
    <PageTransition>
      <div className="home-page">
        <Header />
        {loading
          ? <OrderListSkeleton count={3} />
          : error
            ? <p style={{ padding: '16px', color: '#888' }}>Ошибка: {error}</p>
            : <OrderList orders={orders} showTitle={false} limit={5} />
        }
      </div>
    </PageTransition>
  );
};

export default ExecutorHome;
