import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    Star,
    Zap,
    ShoppingCart
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
    BarChart,
    Bar,
} from "recharts";
import { getDashboardStats } from "../../store/slices/adminSlice";
import { formatPrice } from "../../utils/currencyFormatter";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, statsLoading: loading, error } = useSelector((state) => state.admin);
    const [exporting, setExporting] = useState(false);
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        dispatch(getDashboardStats()).finally(() => setInitLoading(false));

        // Poll for updates every 30 seconds
        const pollInterval = setInterval(() => {
            dispatch(getDashboardStats());
        }, 30000);

        return () => clearInterval(pollInterval);
    }, [dispatch]);

    if (initLoading || (loading && !stats)) {
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
                <h2 className="text-2xl font-black text-black mb-2 uppercase tracking-tighter">Error Loading Data</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                    Retry
                </button>
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
                <div className="bg-black text-white p-4 rounded-2xl shadow-xl border border-gray-800">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">{label}</p>
                    <p className="text-xl font-black">
                        {typeof payload[0].value === 'number' && payload[0].value > 1000
                            ? `$${payload[0].value.toLocaleString()}`
                            : payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };
    const handleExportPDF = async () => {
        setExporting(true);
        try {
            // Load jsPDF library
            const jsPDFScript = document.createElement('script');
            jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

            jsPDFScript.onload = () => {
                // Load AutoTable plugin
                const autoTableScript = document.createElement('script');
                autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';

                autoTableScript.onload = () => {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4'
                    });

                    const pageHeight = doc.internal.pageSize.getHeight();
                    const pageWidth = doc.internal.pageSize.getWidth();
                    let yPosition = 20;

                    // ===== HEADER =====
                    doc.setFillColor(0, 0, 0);
                    doc.rect(0, 0, pageWidth, 28, 'F');
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(24);
                    doc.setFont('helvetica', 'bold');
                    doc.text('SHOPY ONLINE', pageWidth / 2, 12, { align: 'center' });
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'normal');
                    doc.text('Admin Dashboard - Analytics Report', pageWidth / 2, 22, { align: 'center' });

                    yPosition = 38;

                    // ===== REPORT TITLE & DATE =====
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(16);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Dashboard Analytics Report', 20, yPosition);
                    yPosition += 8;

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(100, 100, 100);
                    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
                    yPosition += 12;

                    // ===== KEY METRICS SECTION =====
                    doc.setFontSize(13);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(0, 0, 0);
                    doc.text('1. KEY METRICS', 20, yPosition);
                    yPosition += 8;

                    const metricsData = [
                        ['Total Revenue (All Time)', formatPrice(stats?.totalRevenueAllTime || 0)],
                        ['Today\'s Revenue', formatPrice(stats?.todayRevenue || 0)],
                        ['Active Customers', stats?.totalUsersCount?.toLocaleString() || '0'],
                        ['New Customers (This Month)', stats?.newUsersThisMonth || '0'],
                        ['Revenue Growth Rate', stats?.revenueGrowth || '0%'],
                        ['Inventory Alerts', stats?.lowStockProducts?.length || '0'],
                    ];

                    doc.autoTable({
                        startY: yPosition,
                        head: [['Metric', 'Value']],
                        body: metricsData,
                        theme: 'grid',
                        headStyles: {
                            fillColor: [0, 0, 0],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            fontSize: 11,
                            halign: 'left'
                        },
                        bodyStyles: {
                            fontSize: 10,
                            textColor: [0, 0, 0]
                        },
                        columnStyles: {
                            0: { cellWidth: 100, halign: 'left' },
                            1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
                        },
                        margin: { left: 20, right: 20 },
                        didDrawPage: (data) => {
                            // Footer
                            const pageSize = doc.internal.pageSize;
                            const pageCount = doc.internal.getNumberOfPages();
                            doc.setFontSize(9);
                            doc.setTextColor(150, 150, 150);
                            doc.text(
                                `Page ${data.pageNumber} of ${pageCount} | Generated: ${new Date().toLocaleDateString()}`,
                                pageSize.getWidth() / 2,
                                pageSize.getHeight() - 8,
                                { align: 'center' }
                            );
                        }
                    });

                    yPosition = doc.lastAutoTable.finalY + 12;

                    // Check page break
                    if (yPosition > pageHeight - 30) {
                        doc.addPage();
                        yPosition = 20;
                    }

                    // ===== MONTHLY SALES SECTION =====
                    doc.setFontSize(13);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(0, 0, 0);
                    doc.text('2. MONTHLY SALES PERFORMANCE', 20, yPosition);
                    yPosition += 8;

                    if (stats?.monthlySales && stats.monthlySales.length > 0) {
                        const monthlySalesData = stats.monthlySales.map(item => [
                            item.month,
                            formatPrice(item.totalsales)
                        ]);

                        doc.autoTable({
                            startY: yPosition,
                            head: [['Month', 'Sales Amount']],
                            body: monthlySalesData,
                            theme: 'grid',
                            headStyles: {
                                fillColor: [0, 0, 0],
                                textColor: [255, 255, 255],
                                fontStyle: 'bold',
                                fontSize: 11
                            },
                            bodyStyles: { fontSize: 10 },
                            columnStyles: {
                                0: { cellWidth: 100, halign: 'left' },
                                1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
                            },
                            margin: { left: 20, right: 20 }
                        });

                        yPosition = doc.lastAutoTable.finalY + 12;
                    }

                    // Check page break
                    if (yPosition > pageHeight - 30) {
                        doc.addPage();
                        yPosition = 20;
                    }

                    // ===== TOP SELLING PRODUCTS SECTION =====
                    doc.setFontSize(13);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(0, 0, 0);
                    doc.text('3. TOP SELLING PRODUCTS', 20, yPosition);
                    yPosition += 8;

                    if (stats?.topSellingProducts && stats.topSellingProducts.length > 0) {
                        const topProductsData = stats.topSellingProducts.slice(0, 10).map(item => [
                            item.name.substring(0, 40),
                            item.category,
                            item.total_sold,
                            item.ratings
                        ]);

                        doc.autoTable({
                            startY: yPosition,
                            head: [['Product Name', 'Category', 'Units Sold', 'Rating']],
                            body: topProductsData,
                            theme: 'grid',
                            headStyles: {
                                fillColor: [0, 0, 0],
                                textColor: [255, 255, 255],
                                fontStyle: 'bold',
                                fontSize: 10
                            },
                            bodyStyles: { fontSize: 9 },
                            columnStyles: {
                                0: { cellWidth: 70, halign: 'left' },
                                1: { cellWidth: 35, halign: 'center' },
                                2: { cellWidth: 30, halign: 'center' },
                                3: { cellWidth: 25, halign: 'center' }
                            },
                            margin: { left: 20, right: 20 }
                        });

                        yPosition = doc.lastAutoTable.finalY + 12;
                    }

                    // Check page break
                    if (yPosition > pageHeight - 30) {
                        doc.addPage();
                        yPosition = 20;
                    }

                    // ===== ORDER STATUS BREAKDOWN =====
                    doc.setFontSize(13);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(0, 0, 0);
                    doc.text('4. ORDER STATUS BREAKDOWN', 20, yPosition);
                    yPosition += 8;

                    if (stats?.orderStatusCounts) {
                        const totalOrders = Object.values(stats.orderStatusCounts).reduce((a, b) => a + b, 0);
                        const orderStatusData = Object.entries(stats.orderStatusCounts).map(([status, count]) => [
                            status.charAt(0).toUpperCase() + status.slice(1),
                            count,
                            totalOrders > 0 ? `${((count / totalOrders) * 100).toFixed(1)}%` : '0%'
                        ]);

                        doc.autoTable({
                            startY: yPosition,
                            head: [['Status', 'Count', 'Percentage']],
                            body: orderStatusData,
                            theme: 'grid',
                            headStyles: {
                                fillColor: [0, 0, 0],
                                textColor: [255, 255, 255],
                                fontStyle: 'bold',
                                fontSize: 11
                            },
                            bodyStyles: { fontSize: 10 },
                            columnStyles: {
                                0: { cellWidth: 80, halign: 'left' },
                                1: { cellWidth: 40, halign: 'center' },
                                2: { cellWidth: 40, halign: 'center' }
                            },
                            margin: { left: 20, right: 20 }
                        });

                        yPosition = doc.lastAutoTable.finalY + 12;
                    }

                    // Check page break
                    if (yPosition > pageHeight - 30) {
                        doc.addPage();
                        yPosition = 20;
                    }

                    // ===== KEY INSIGHTS - CURRENT MONTH =====
                    doc.setFontSize(13);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(0, 0, 0);
                    doc.text('5. KEY INSIGHTS (CURRENT MONTH)', 20, yPosition);
                    yPosition += 8;

                    const insightsData = [
                        ['Total Sales This Month', formatPrice(stats?.currentMonthSales || 0)],
                        ['Total Orders This Month', stats?.totalOrdersThisMonth || '0'],
                        ['New Customers Acquired', stats?.newUsersThisMonth || '0'],
                        ['Top Performing Product', stats?.topSellingProducts?.[0]?.name || 'N/A'],
                        ['Low Stock Alert Items', stats?.lowStockProducts?.length || '0'],
                        ['Revenue Growth vs Last Month', stats?.revenueGrowth || '0%'],
                    ];

                    doc.autoTable({
                        startY: yPosition,
                        head: [['Insight', 'Value']],
                        body: insightsData,
                        theme: 'grid',
                        headStyles: {
                            fillColor: [0, 0, 0],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            fontSize: 11
                        },
                        bodyStyles: { fontSize: 10 },
                        columnStyles: {
                            0: { cellWidth: 100, halign: 'left' },
                            1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
                        },
                        margin: { left: 20, right: 20 }
                    });

                    // Save PDF
                    const fileName = `Dashboard-Report-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
                    doc.save(fileName);
                    setExporting(false);
                };

                document.head.appendChild(autoTableScript);
            };

            document.head.appendChild(jsPDFScript);
        } catch (err) {
            console.error('PDF Export Error:', err);
            alert('Error generating PDF. Please try again.');
            setExporting(false);
        }
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
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">{exporting ? "Exporting..." : "Export Report"}</span>
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

                {/* Order Status Bar Chart */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="font-black text-xl uppercase tracking-tight mb-2">Order Status Breakdown</h3>
                    <p className="text-gray-500 text-sm mb-8">Distribution of orders by status</p>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={donutData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
                                    width={90}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                />
                                <Bar dataKey="value" fill="#000000" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 4. Data Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Selling Products */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-black text-xl uppercase tracking-tight">Top Selling Items</h3>
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

            {/* 5. Summary Card Section - Key Insights */}
            <div className="bg-gradient-to-br from-black to-gray-900 rounded-3xl border border-gray-700 shadow-lg overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="mb-10">
                        <h3 className="font-black text-2xl uppercase tracking-tight text-white mb-3 flex items-center gap-3">
                            <div className="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <Zap size={24} className="text-yellow-400" />
                            </div>
                            Key Insights
                        </h3>
                        <p className="text-sm text-gray-400 ml-13">For the current month — Here all the insights data are for the current month</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Total Sales This Month */}
                        <div className="border-b md:border-b-0 md:border-r border-gray-700 pb-8 md:pb-0 md:pr-8 group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <DollarSign size={24} className="text-blue-400" />
                                </div>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Total Sales This Month</p>
                            <p className="text-4xl font-black text-white">{formatPrice(stats?.currentMonthSales || 0)}</p>
                        </div>

                        {/* Total Orders Placed - Current Month */}
                        <div className="border-b md:border-b-0 md:border-r border-gray-700 pb-8 md:pb-0 md:pr-8 group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShoppingCart size={24} className="text-purple-400" />
                                </div>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Total Orders This Month</p>
                            <p className="text-4xl font-black text-white">{stats?.totalOrdersThisMonth || 0}</p>
                        </div>

                        {/* New Customers This Month */}
                        <div className="border-b lg:border-b-0 pb-8 lg:pb-0 group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users size={24} className="text-green-400" />
                                </div>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">New Customers This Month</p>
                            <p className="text-4xl font-black text-white">{stats?.newUsersThisMonth || 0}</p>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-700">

                        {/* Top Selling Product */}
                        <div className="border-b md:border-b-0 md:border-r border-gray-700 pb-8 md:pb-0 md:pr-8 group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Package size={24} className="text-orange-400" />
                                </div>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Top Selling Product</p>
                            <p className="text-lg font-black text-white mb-2">{stats?.topSellingProducts?.[0]?.name || "N/A"}</p>
                            <p className="text-sm text-gray-300">{stats?.topSellingProducts?.[0]?.total_sold || 0} units sold</p>
                        </div>

                        {/* Low Stock Alerts */}
                        <div className="border-b lg:border-b-0 lg:border-r border-gray-700 pb-8 lg:pb-0 lg:pr-8 group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <AlertCircle size={24} className="text-red-400" />
                                </div>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Low Stock Alerts</p>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-3xl font-black text-red-400">{stats?.lowStockProducts?.length || 0}</p>
                                    <p className="text-xs text-gray-400">products</p>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Growth Rate */}
                        <div className="group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`h-12 w-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${parseFloat(stats?.revenueGrowth?.replace("%", "") || 0) >= 0 ? "bg-green-500/20" : "bg-red-500/20"}`}>
                                    {parseFloat(stats?.revenueGrowth?.replace("%", "") || 0) >= 0 ? (
                                        <TrendingUp size={24} className="text-green-400" />
                                    ) : (
                                        <TrendingDown size={24} className="text-red-400" />
                                    )}
                                </div>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Revenue Growth Rate</p>
                            <div className="flex items-center gap-2">
                                <p className={`text-3xl font-black ${parseFloat(stats?.revenueGrowth?.replace("%", "") || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                                    {stats?.revenueGrowth}
                                </p>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">vs last month</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;