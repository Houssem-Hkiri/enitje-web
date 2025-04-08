"use client"

import React, { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { 
  Activity, 
  AlertCircle, 
  BarChart, 
  Calendar, 
  ChevronDown,
  Clock, 
  Download, 
  MapPin,
  Globe, 
  MousePointerClick, 
  RefreshCw, 
  Settings, 
  Smartphone, 
  Store, 
  Tablet, 
  Users,
  Loader2,
  Search,
  MousePointer,
  TrendingUp,
  InfoIcon
} from "lucide-react"
import Link from "next/link"
import { fetchGoogleAnalyticsData, AnalyticsData, clearAnalyticsCache, canUseGoogleAPIs } from "../../lib/analytics"

export default function AnalyticsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | 'custom'>('7d')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [gaSetupComplete, setGaSetupComplete] = useState(true) // Set to true to avoid setup screen
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<Record<string, AnalyticsData>>({})
  const [currentData, setCurrentData] = useState<AnalyticsData | null>(null)
  const [activeTab, setActiveTab] = useState<'analytics' | 'search-console'>('analytics')
  const [usingRealData, setUsingRealData] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/admin/login")
          return
        }
        
        // Set the Google Analytics ID from environment if available
        setGoogleAnalyticsId(process.env.NEXT_PUBLIC_GA_ID || null)
        
        // Skip the Google Analytics setup check - we'll use our static data instead
        setGaSetupComplete(true)
        
        // Only proceed after confirming the user is logged in
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router, supabase])

  // Load analytics data whenever the period changes
  useEffect(() => {
    async function loadData() {
      try {
        if (!gaSetupComplete) {
          setLoading(false)
          return
        }
        
        setLoading(true)
        setError(null)
        
        // Note: canUseGoogleAPIs will always return false in the browser
        // Real data can only be loaded from the server
        // We'll know if we got real data based on the response
        setUsingRealData(false) // Default to false
        
        const data = await fetchGoogleAnalyticsData(
          selectedPeriod, 
          selectedPeriod === 'custom' ? startDate : undefined,
          selectedPeriod === 'custom' ? endDate : undefined
        )
        
        // Store the data
        setAnalyticsData({
          ...analyticsData,
          [selectedPeriod]: data
        })
        
        setCurrentData(data)
        setLoading(false)
        
        // Note: we don't know if it's real data, but that's fine
        // we're showing mock data in any case, but with real numbers if available
      } catch (err) {
        console.error("Error loading analytics data:", err)
        setError("Failed to load analytics data. Please try again.")
        setLoading(false)
      }
    }
    
    loadData()
  }, [selectedPeriod, startDate, endDate, gaSetupComplete])

  const refreshData = async () => {
    try {
      setIsRefreshing(true)
      
      // Clear cache to get fresh data
      clearAnalyticsCache()
      
      // Fetch fresh data
      const data = await fetchGoogleAnalyticsData(
        selectedPeriod,
        selectedPeriod === 'custom' ? startDate : undefined,
        selectedPeriod === 'custom' ? endDate : undefined
      )
      
      // Update the data
      setAnalyticsData({
        ...analyticsData,
        [selectedPeriod]: data
      })
      
      setCurrentData(data)
      setIsRefreshing(false)
    } catch (err) {
      console.error("Error refreshing data:", err)
      setError("Failed to refresh data. Please try again.")
      setIsRefreshing(false)
    }
  }

  const handleExportData = () => {
    if (!currentData) return
    
    let csvContent
    
    if (activeTab === 'analytics') {
      // Create CSV content for analytics data
      csvContent = [
        ['Date Range', selectedPeriod],
        ['Visitors', currentData.visitors],
        ['PageViews', currentData.pageViews],
        ['Bounce Rate', currentData.bounceRate],
        ['Avg Duration', currentData.avgDuration],
        [''],
        ['Top Pages'],
        ['Path', 'Views', 'Percentage'],
        ...currentData.topPages.map(page => [page.path, page.views, page.percentage]),
        [''],
        ['Device Data'],
        ['Device', 'Percentage'],
        ...currentData.deviceData.map(device => [device.device, device.percentage]),
        [''],
        ['Geographic Data'],
        ['Country', 'Visits', 'Percentage'],
        ...currentData.geographicData.map(geo => [geo.country, geo.visits, geo.percentage]),
        [''],
        ['Conversions'],
        ['Contact Submissions', currentData.conversionData.contactSubmissions],
        ['Newsletter Signups', currentData.conversionData.newsletterSignups],
        [''],
        ['Traffic Sources'],
        ['Source', 'Percentage'],
        ...currentData.trafficSourceData.map(source => [source.source, source.percentage])
      ]
    } else {
      // Create CSV content for search console data
      csvContent = [
        ['Date Range', selectedPeriod],
        ['Total Impressions', currentData.searchConsoleData.totalImpressions],
        ['Total Clicks', currentData.searchConsoleData.totalClicks],
        ['Average CTR', currentData.searchConsoleData.avgCTR],
        ['Average Position', currentData.searchConsoleData.avgPosition.toFixed(1)],
        [''],
        ['Top Queries'],
        ['Query', 'Impressions', 'Clicks', 'CTR', 'Position'],
        ...currentData.searchConsoleData.topQueries.map(q => [
          q.query, q.impressions, q.clicks, q.ctr, q.position.toFixed(1)
        ])
      ]
    }
    
    // Convert to CSV format
    const csvString = csvContent
      .map(row => row.join(','))
      .join('\n')
    
    // Create and download the CSV file
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${activeTab}-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00adb5]"></div>
      </div>
    )
  }

  // Ensure we have data for the current period
  if (!currentData && analyticsData[selectedPeriod]) {
    setCurrentData(analyticsData[selectedPeriod])
  }

  // If we still don't have data, show loading
  if (!currentData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00adb5]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <BarChart className="w-5 h-5 mr-2 text-[#00adb5]" />
          Analytics Dashboard
        </h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-3 pr-8 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          {selectedPeriod === "custom" && (
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
              />
              <span className="text-gray-500 dark:text-gray-400 self-center">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
              />
            </div>
          )}
          
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00adb5] disabled:opacity-50"
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
          
          <button
            onClick={handleExportData}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Data Source Indicator */}
      <div className={`px-4 py-2 rounded-md text-white text-sm font-medium flex items-center ${
        usingRealData ? 'bg-green-600' : 'bg-yellow-600'
      }`}>
        {usingRealData ? (
          <>
            <Activity className="w-4 h-4 mr-2" />
            Using real Google Analytics data
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            Using mock data (Google Analytics API not configured)
          </>
        )}
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'analytics'
              ? 'border-b-2 border-[#00adb5] text-[#00adb5]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <div className="flex items-center">
            <BarChart className="w-4 h-4 mr-2" />
            Analytics
          </div>
        </button>
        <button
          onClick={() => setActiveTab('search-console')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'search-console'
              ? 'border-b-2 border-[#00adb5] text-[#00adb5]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <div className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Search Console
          </div>
        </button>
      </div>
      
      {activeTab === 'analytics' ? (
        // Analytics Content
        <>
          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Visitors</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentData.visitors.toLocaleString()}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Views</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentData.pageViews.toLocaleString()}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <MousePointerClick className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bounce Rate</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentData.bounceRate}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Duration</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentData.avgDuration}</p>
            </div>
          </div>
          
          {/* Top pages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Top Pages</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Path
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentData.topPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {page.path}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{page.percentage}</span>
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-[#00adb5] h-2 rounded-full" 
                              style={{ width: page.percentage }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Two column layout for devices and geographic data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Device Breakdown</h3>
              <div className="space-y-4">
                {currentData.deviceData.map((device, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 mr-4 text-gray-400">
                      {device.device === 'Desktop' && <Store className="w-6 h-6" />}
                      {device.device === 'Mobile' && <Smartphone className="w-6 h-6" />}
                      {device.device === 'Tablet' && <Tablet className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{device.device}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{device.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-[#00adb5] h-2 rounded-full" 
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Geographic data */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Geographic Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Country
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Visits
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentData.geographicData.map((country, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {country.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {country.visits.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{country.percentage}</span>
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-[#00adb5] h-2 rounded-full" 
                                style={{ width: country.percentage }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Two column layout for conversions and traffic sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Conversions</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Contact Form Submissions</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{currentData.conversionData.contactSubmissions.toLocaleString()}</p>
                    </div>
                  </div>
                  {/* Conversion rate indicator */}
                  <div className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium">
                    {Math.round((currentData.conversionData.contactSubmissions / currentData.visitors) * 100 * 10) / 10}% Rate
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                      <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Newsletter Signups</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{currentData.conversionData.newsletterSignups.toLocaleString()}</p>
                    </div>
                  </div>
                  {/* Conversion rate indicator */}
                  <div className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium">
                    {Math.round((currentData.conversionData.newsletterSignups / currentData.visitors) * 100 * 10) / 10}% Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic sources */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Traffic Sources</h3>
              <div className="space-y-4">
                {currentData.trafficSourceData.map((source, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{source.source}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-[#00adb5] h-2 rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        // Search Console Content
        <>
          {/* Search Console Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <Search className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Impressions</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentData.searchConsoleData.totalImpressions.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <MousePointer className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Clicks</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentData.searchConsoleData.totalClicks.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">CTR</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentData.searchConsoleData.avgCTR}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <BarChart className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Position</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentData.searchConsoleData.avgPosition.toFixed(1)}
              </p>
            </div>
          </div>
          
          {/* Top Queries */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Top Search Queries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Query
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Impressions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CTR
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Position
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentData.searchConsoleData.topQueries.map((query, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {query.query}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {query.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {query.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {query.ctr}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <span className="text-sm mr-2">{query.position.toFixed(1)}</span>
                          <div className={`h-4 w-4 rounded-full ${
                            query.position <= 3 
                              ? 'bg-green-500' 
                              : query.position <= 10 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Performance Over Time - Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Performance Over Time</h3>
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="text-center p-6">
                <BarChart className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Performance chart would appear here with real Search Console data</p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Debug information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <details className="text-sm text-gray-500">
          <summary className="cursor-pointer font-medium">Debug Information</summary>
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs font-mono">
            <p>GA ID: {googleAnalyticsId || 'Not set'}</p>
            <p>Env GA ID: {process.env.NEXT_PUBLIC_GA_ID || 'Not set'}</p>
            <p>Period: {selectedPeriod}</p>
            <p>Active Tab: {activeTab}</p>
            <p className={usingRealData ? "text-green-500" : "text-yellow-500"}>
              Using: {usingRealData ? 'Real Google Analytics Data' : 'Mock Data (Google credentials not configured)'}
            </p>
            <div className="mt-2">
              <p className="text-xs text-blue-600 dark:text-blue-400">To use real data, set these environment variables:</p>
              <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 pl-2 mt-1">
                <li>NEXT_PUBLIC_GA_ID - Google Analytics 4 Property ID</li>
                <li>GOOGLE_SERVICE_ACCOUNT_KEY - Complete service account JSON key</li>
                <li>NEXT_PUBLIC_SITE_URL - Site URL for Search Console (optional)</li>
              </ul>
              <p className="mt-2 text-xs">
                <Link href="/README-analytics.md" className="text-blue-500 hover:underline">
                  See setup instructions for details
                </Link>
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  )
} 