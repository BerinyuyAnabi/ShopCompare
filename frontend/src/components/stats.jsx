import { useState, useEffect } from "react";
import "../styles/stats.css";
import { apiFetch } from '../config/api';

function Stats() {
  const [stats, setStats] = useState({
    total_shops: 0,
    total_customers: 0,
    total_products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiFetch('/stats.php');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stats-container">
      <h1>Platform Statistics</h1>
      <div className="shoplist">
        <div className="stat-card num_shops">
          <div className="stat-icon">🏪</div>
          <div className="stat-number">{loading ? '...' : stats.total_shops}</div>
          <div className="stat-label">Total Shops</div>
        </div>
        <div className="stat-card products_available">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{loading ? '...' : stats.total_customers}</div>
          <div className="stat-label">Customers</div>
        </div>
        <div className="stat-card average_savings">
          <div className="stat-icon">📦</div>
          <div className="stat-number">{loading ? '...' : stats.total_products}</div>
          <div className="stat-label">Products</div>
        </div>
      </div>
    </div>
  );
}

export default Stats;