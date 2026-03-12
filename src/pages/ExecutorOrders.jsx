import Header from '../components/Header/Header';
import OrderList from '../components/OrderList/OrderList';
import OrderListSkeleton from '../components/OrderList/OrderListSkeleton';
import PageTransition from '../components/PageTransition/PageTransition';
import { useOrders } from '../hooks/useOrders';

const ExecutorOrders = () => {
  const { orders, loading, error } = useOrders();

  return (
    <PageTransition>
      <div className="home-page">
        <Header />
        {loading
          ? <OrderListSkeleton count={5} />
          : error
            ? <p style={{ padding: '16px', color: '#888' }}>Ошибка: {error}</p>
            : <OrderList orders={orders} showTitle={false} />
        }
      </div>
    </PageTransition>
  );
};

export default ExecutorOrders;
