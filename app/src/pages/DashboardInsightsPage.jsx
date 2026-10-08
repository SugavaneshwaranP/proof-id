import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Eye, Users, MessageSquare, Share2, 
  Calendar, Globe, Paperclip, ArrowRight, Compass, Sparkles 
} from 'lucide-react';

export default function DashboardInsightsPage({ setActivePage }) {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [hasData, setHasData] = useState(true);

  // Sample weekly trend data for tactile bar chart rendering
  const trendData = [
    { day: 'Mon', views: 42, visitors: 30 },
    { day: 'Tue', views: 78, visitors: 55 },
    { day: 'Wed', views: 110, visitors: 85 },
    { day: 'Thu', views: 95, visitors: 70 },
    { day: 'Fri', views: 140, visitors: 105 },
    { day: 'Sat', views: 88, visitors: 60 },
    { day: 'Sun', views: 165, visitors: 120 }
  ];

  const topSources = [
    { name: 'Direct Link (backed.app/alexrivera)', percentage: '45%', count: '558 visits', color: 'bg-emerald-300' },
    { name: 'LinkedIn Posts & Profile', percentage: '30%', count: '372 visits', color: 'bg-sky-300' },
    { name: 'Google & Organic Search', percentage: '15%', count: '186 visits', color: 'bg-amber-300' },
    { name: 'WhatsApp & Messaging Shares', percentage: '10%', count: '124 visits', color: 'bg-rose-300' }
  ];

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#bae6fd] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>ANALYTICS DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Real Analytics
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “How your page is doing”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Simple numbers, no guesswork.
          </p>
        </div>

        {/* Date Range Picker Controls & Data Toggle */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-mono font-black text-slate-900 uppercase">DATE RANGE:</span>
            <div className="flex items-center gap-1.5">
              {['7 Days', 'Last 30 Days', 'All Time'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-black border-2 transition-all cursor-pointer ${
                    dateRange === range
                      ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#059669]'
                      : 'bg-white text-slate-900 border-slate-900/40 hover:border-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHasData(!hasData)}
            className="text-[11px] font-mono font-black text-slate-800 underline hover:text-slate-900 cursor-pointer"
          >
            {hasData ? 'Simulate Empty State' : 'Simulate Live Traffic'}
          </button>
        </div>

        {!hasData ? (
          /* Empty State */
          <div className="pt-8">
            <div className="bg-white p-12 rounded-2xl border-3 border-dashed border-slate-900 text-center space-y-3">
              <Compass className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">No activity recorded yet</h3>
              <p className="text-xs font-extrabold text-slate-700 max-w-sm mx-auto">
                Numbers will show up here once people start visiting your page.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 pt-6">
            
            {/* Stat Tiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Tile 1: Page views */}
              <div className="bg-white rounded-2xl p-5 border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase">PAGE VIEWS</span>
                  <Eye className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">1,240</div>
                <span className="text-[10px] font-mono font-black text-emerald-700 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +24% this month
                </span>
              </div>

              {/* Tile 2: Unique visitors */}
              <div className="bg-white rounded-2xl p-5 border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase">UNIQUE VISITORS</span>
                  <Users className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">890</div>
                <span className="text-[10px] font-mono font-black text-emerald-700 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +15% this month
                </span>
              </div>

              {/* Tile 3: Messages received */}
              <div className="bg-white rounded-2xl p-5 border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase">MESSAGES RECEIVED</span>
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">12</div>
                <span className="text-[10px] font-mono font-black text-emerald-700 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +8% this month
                </span>
              </div>

              {/* Tile 4: Link shares */}
              <div className="bg-white rounded-2xl p-5 border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase">LINK SHARES</span>
                  <Share2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">45</div>
                <span className="text-[10px] font-mono font-black text-emerald-700 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +30% this month
                </span>
              </div>

            </div>

            {/* Tactile Trend Bar Chart */}
            <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3">
                <span className="text-xs font-mono font-black text-slate-900 uppercase flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  WEEKLY TRAFFIC TRENDS
                </span>
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase">DAILY VIEWS</span>
              </div>

              {/* SVG / Bar Chart Representation */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b-2 border-slate-900">
                {trendData.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-mono font-black text-slate-900">{d.views}</span>
                    <div 
                      style={{ height: `${(d.views / 180) * 100}%` }}
                      className="w-full bg-emerald-400 border-2 border-slate-900 rounded-t-lg shadow-[2px_0px_0px_0px_#0f172a] hover:bg-emerald-300 transition-all cursor-pointer relative group"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap">
                        {d.visitors} unique
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-slate-900 pt-1">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Where People Found You (Top Sources List) */}
            <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
              <div className="border-b-2 border-slate-900/20 pb-3 flex items-center justify-between">
                <div>
                  <span className="pill-header text-[10px] bg-yellow-300 text-slate-900">TRAFFIC SOURCES</span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight pt-1">Where people found you</h3>
                </div>
                <Globe className="w-5 h-5 text-slate-600" />
              </div>

              <div className="space-y-3">
                {topSources.map((source) => (
                  <div key={source.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                      <span>{source.name}</span>
                      <span className="font-mono font-black">{source.percentage} ({source.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-slate-900 overflow-hidden">
                      <div 
                        style={{ width: source.percentage }}
                        className={`${source.color} h-full rounded-full border-r-2 border-slate-900`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
