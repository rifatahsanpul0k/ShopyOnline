import React, { useEffect, useState } from "react";
import {
    DollarSign,
    Users,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Package,
    Calendar,
    Download,
    ArrowUpRight,
    Star
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { fetchDashboardStats } from "../../services/adminService";
import { formatPrice } from "../../utils/currencyFormatter";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchDashboardStats();
                if (data.success) {
                    setStats(data);
                }
            } catch (err) {
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                <p className="text-sm font-bold tracking-widest uppercase text-gray-400">Loading Analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-black text-black mb-2">Error Loading Data</h2>
                <p className="text-gray-500">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-black text-white rounded-full font-bold text-sm">Retry</button>
            </div>
        );
    }

    // --- Data Processing ---
    const growthValue = parseFloat(stats?.revenueGrowth?.replace("%", "") || 0);
    const isPositiveGrowth = growthValue >= 0;

    const donutData = Object.keys(stats?.orderStatusCounts || {}).map((key) => ({
        name: key,
        value: stats.orderStatusCounts[key],
    }));

    // Monochrome Palette for Pie Chart
    const COLORS = ["#000000", "#404040", "#737373", "#D4D4D4"];

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white p-4 rounded-xl shadow-xl border border-gray-800">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</p>
                    <p className="text-lg font-bold">
                        {typeof payload[0].value === 'number' && payload[0].value > 1000
                            ? `$${payload[0].value.toLocaleString()}`
                            : payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase leading-none mb-2">
                        Analytics Overview
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Real-time performance metrics and inventory insights.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-bold text-gray-600">
                        <Calendar size={16} />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg">
                        <Download size={16} />
                        <span className="hidden sm:inline">Export Report</span>
                    </button>
                </div>
            </div>

            {/* 2. KPI Cards - Clean & Bold */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-black text-white rounded-2xl group-hover:scale-110 transition-transform">
                            <DollarSign size={24} />
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase">
                            All Time
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black text-black tracking-tight">{formatPrice(stats?.totalRevenueAllTime)}</h3>
                </div>

                {/* Today's Revenue */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-2xl group-hover:bg-gray-200 transition-colors">
                            <TrendingUp size={24} />
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${isPositiveGrowth ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {isPositiveGrowth ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {stats?.revenueGrowth}
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Today's Sales</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-black tracking-tight">{formatPrice(stats?.todayRevenue)}</h3>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-2">vs Yesterday: {formatPrice(stats?.yesterdayRevenue)}</p>
                </div>

                {/* Users Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-2xl group-hover:bg-gray-200 transition-colors">
                            <Users size={24} />
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase">
                            +{stats?.newUsersThisMonth} New
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Active Customers</p>
                    <h3 className="text-3xl font-black text-black tracking-tight">{stats?.totalUsersCount?.toLocaleString()}</h3>
                </div>

                {/* Alerts Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl transition-colors ${stats?.lowStockProducts?.length > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Inventory Alerts</p>
                    <h3 className="text-3xl font-black text-black tracking-tight">{stats?.lowStockProducts?.length || 0}</h3>
                    <p className="text-xs text-gray-400 font-medium mt-2">Items requiring attention</p>
                </div>
            </div>

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Monthly Sales Area Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-xl uppercase tracking-tight">Revenue Trends</h3>
                            <p className="text-gray-500 text-sm">Monthly sales performance over the last 6 months</p>
                        </div>
                        <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowUpRight size={20} className="text-gray-400" />
                        </button>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.monthlySales || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                <Area
                                    type="monotone"
                                    dataKey="totalsales"
                                    stroke="#000000"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#000' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Donut Chart */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="font-black text-xl uppercase tracking-tight mb-2">Order Status</h3>
                    <p className="text-gray-500 text-sm mb-8">Current breakdown of active orders</p>
                    <div className="flex-1 min-h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={donutData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {donutData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => <span className="text-sm font-bold text-gray-600 ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                            <span className="block text-3xl font-black">{Object.values(stats?.orderStatusCounts || {}).reduce((a, b) => a + b, 0)}</span>
                            <span className="text-xs text-gray-400 font-bold uppercase">Orders</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Data Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Selling Products */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-black text-xl uppercase tracking-tight">Top Sellers</h3>
                            <p className="text-gray-500 text-sm mt-1">Highest performing inventory items</p>
                        </div>
                        <Package className="text-gray-300" size={24} />
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                                    <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.topSellingProducts?.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-gray-100 p-1 border border-gray-200 group-hover:border-black transition-colors">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-black line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1 bg-yellow-50 w-fit px-2 py-1 rounded-md">
                                                <Star size={12} className="fill-yellow-500 text-yellow-500" />
                                                <span className="text-xs font-bold text-yellow-700">{product.ratings}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="font-black text-base">{product.total_sold}</span>
                                            <span className="text-xs text-gray-400 ml-1">sold</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-100 bg-red-50/30 flex justify-between items-center">
                        <div>
                            <h3 className="font-black text-xl uppercase tracking-tight text-red-600">Stock Alerts</h3>
                            <p className="text-red-400 text-sm mt-1">Immediate restock required</p>
                        </div>
                        <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle size={18} className="text-red-600" />
                        </div>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        {stats?.lowStockProducts?.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-red-300 uppercase tracking-widest">Product Name</th>
                                        <th className="px-8 py-4 text-right text-[10px] font-black text-red-300 uppercase tracking-widest">Availability</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-50">
                                    {stats.lowStockProducts.map((item, index) => (
                                        <tr key={index} className="hover:bg-red-50/50 transition-colors">
                                            <td className="px-8 py-5 text-sm font-bold text-gray-800">{item.name}</td>
                                            <td className="px-8 py-5 text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase ${item.stock === 0 ? "bg-red-600 text-white" : "bg-red-100 text-red-700"}`}>
                                                    {item.stock === 0 ? "Out of Stock" : `${item.stock} Remaining`}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                    <Package size={32} className="text-green-500" />
                                </div>
                                <h4 className="font-bold text-lg">All Systems Go</h4>
                                <p className="text-gray-500 text-sm">Inventory levels are healthy.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;