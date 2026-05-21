"use client";
import { useQuery } from "@tanstack/react-query";
import { certificateService } from "@/services/certificateService";
import { Award, CheckCircle, Clock, TrendingUp, Plus, List, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/utils";

export default function DashboardPage() {
  const {
    data: certificates = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["certificates"],
    queryFn: certificateService.getAll,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const published = certificates.filter((c) => c.status === "published").length;
  const drafts = certificates.filter((c) => c.status === "draft").length;
  const thisMonth = certificates.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: "Total Certificates", value: certificates.length, icon: Award, color: "bg-blue-500", bg: "bg-blue-50" },
    { label: "Published", value: published, icon: CheckCircle, color: "bg-green-500", bg: "bg-green-50" },
    { label: "Drafts", value: drafts, icon: Clock, color: "bg-yellow-500", bg: "bg-yellow-50" },
    { label: "This Month", value: thisMonth, icon: TrendingUp, color: "bg-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome to the admin panel</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500" />
          <p className="text-red-700 text-sm flex-1">Failed to load data.</p>
          <button onClick={() => refetch()} className="text-red-600 text-sm font-medium underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
              <div className={`${stat.color} p-2 rounded-xl`}>
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
            ) : (
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/certificates/create"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0d2353] text-white hover:bg-[#1a3a6e] transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              Create New Certificate
            </Link>
            <Link
              href="/admin/certificates"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
            >
              <List size={18} />
              View All Certificates
            </Link>
          </div>
        </div>

        {/* Recent certificates */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Certificates</h3>
            <Link href="/admin/certificates" className="text-xs text-[#0d2353] hover:underline font-medium">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-9 flex-1 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">No certificates yet.</p>
              <Link href="/admin/certificates/create" className="text-[#0d2353] text-xs font-medium hover:underline mt-1 inline-block">
                Create the first one →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {certificates.slice(0, 6).map((cert) => (
                <div
                  key={cert._id}
                  className="flex items-center justify-between text-sm py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{cert.full_name}</p>
                    <p className="text-gray-400 text-xs font-mono">{cert.ref_no}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ml-2 flex-shrink-0 ${
                    cert.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

