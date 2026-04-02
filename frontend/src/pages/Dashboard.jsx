import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../services/dashboard';

const dummyChartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const StatCard = ({ title, value, icon, trend, up }) => (
  <div className="card animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{value}</h3>
      </div>
      <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
        {icon}
      </div>
    </div>
    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: up ? 'var(--success)' : 'var(--danger)' }}>
      {up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      <span style={{ fontWeight: '500' }}>{trend}</span>
      <span style={{ color: 'var(--text-secondary)' }}>vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 1245,
    totalOrders: 356,
    totalUsers: 892,
    totalRevenue: 124500
  });
  const [chartData, setChartData] = useState(dummyChartData);
  const [recentOrders, setRecentOrders] = useState([
    { _id: '1', orderNo: 'ORD-00125', total: 12500, status: 'completed' },
    { _id: '2', orderNo: 'ORD-00124', total: 4200, status: 'processing' },
    { _id: '3', orderNo: 'ORD-00123', total: 8900, status: 'pending' },
    { _id: '4', orderNo: 'ORD-00122', total: 3150, status: 'completed' },
    { _id: '5', orderNo: 'ORD-00121', total: 24500, status: 'cancelled' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res.data) {
        setStats(res.data.stats);
        if (res.data.recentOrders?.length > 0) setRecentOrders(res.data.recentOrders);
      }
      setError(null);
    } catch (err) {
      console.error('API Error:', err);
      setError('Cannot connect to backend server. Displaying offline overview mode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Dashboard Overview</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, here's what's happening today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={fetchDashboard}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-primary">Download Report</button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Revenue" value={`฿${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={24} />} trend="+12.5%" up={true} />
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={<ShoppingCart size={24} />} trend="+5.2%" up={true} />
        <StatCard title="Total Products" value={stats.totalProducts.toLocaleString()} icon={<Package size={24} />} trend="-1.2%" up={false} />
        <StatCard title="Active Users" value={stats.totalUsers.toLocaleString()} icon={<Users size={24} />} trend="+18.7%" up={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Revenue Overview</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `฿${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Orders</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.map((order, i) => (
              <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: i !== recentOrders.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingCart size={18} color="var(--text-secondary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500' }}>{order.orderNo}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Just now</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>฿{order.total.toLocaleString()}</div>
                  <span style={{ 
                    fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '100px', textTransform: 'capitalize',
                    ...(order.status === 'completed' ? { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' } :
                        order.status === 'processing' ? { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' } :
                        order.status === 'cancelled' ? { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' } :
                        { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' })
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
