
import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';

const COLORS = {
  emerald: '#059669',
  amber: '#d97706',
  indigo: '#4f46e5',
  slate: '#64748b',
  slateDark: '#475569',
  transparent: 'transparent'
};

const PIE_COLORS = [COLORS.amber, COLORS.indigo, COLORS.emerald, '#6366f1', '#06b6d4'];

const getTooltipStyle = () => ({
  backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
  border: document.documentElement.classList.contains('dark') ? '1px solid #1e293b' : '1px solid #e2e8f0',
  borderRadius: '12px',
  color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
  fontSize: '11px',
  fontWeight: '700',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
});

const getShortName = (name: string) => {
  if (!name) return '';
  const words = name.split(new RegExp('[\\s._-]+')).filter(Boolean);
  return words.map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

const getGridStroke = () => document.documentElement.classList.contains('dark') ? "#1e293b" : "#f1f5f9";

export const PeakHoursChart: React.FC<{ data: { time: string; sales: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={getGridStroke()} />
          <XAxis dataKey="time" stroke={COLORS.slate} fontSize={9} tickLine={false} axisLine={false} />
          <YAxis stroke={COLORS.slate} fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={getTooltipStyle()} />
          <Bar dataKey="sales" fill={COLORS.amber} radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EmployeePerformanceChart: React.FC<{ data: { name: string; services: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={getGridStroke()} />
          <XAxis dataKey="name" stroke={COLORS.slate} fontSize={9} tickLine={false} axisLine={false} tickFormatter={getShortName} />
          <YAxis stroke={COLORS.slate} fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={getTooltipStyle()} />
          <Bar dataKey="services" fill={COLORS.indigo} radius={[4, 4, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PaymentMethodChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip contentStyle={getTooltipStyle()} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TopItemsChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={getGridStroke()} />
          <XAxis dataKey="name" stroke={COLORS.slate} fontSize={9} tickLine={false} axisLine={false} tickFormatter={getShortName} />
          <YAxis stroke={COLORS.slate} fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={getTooltipStyle()} />
          <Bar dataKey="value" fill={COLORS.emerald} radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RevenueTrendChart: React.FC<{ data: { label: string; revenue: number; profit: number }[] }> = ({ data }) => {
  const isDark = document.documentElement.classList.contains('dark');
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isDark ? COLORS.slateDark : "#94a3b8"} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={isDark ? COLORS.slateDark : "#94a3b8"} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={getGridStroke()} />
          <XAxis dataKey="label" stroke={COLORS.slate} fontSize={9} tickLine={false} axisLine={false} />
          <YAxis stroke={COLORS.slate} fontSize={9} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={getTooltipStyle()} />
          <Area type="monotone" dataKey="revenue" stroke={isDark ? COLORS.slateDark : "#94a3b8"} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
          <Area type="monotone" dataKey="profit" stroke={COLORS.emerald} fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
