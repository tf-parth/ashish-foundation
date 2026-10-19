"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  MessageSquare,
  Users,
  Calendar,
  IndianRupee,
  TrendingUp,
  Mail,
  UserPlus,
} from "lucide-react";
import { getAdminStats } from "@/lib/storage";
import { getDonations, getContacts, getVolunteers } from "@/lib/storage";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonationAmount: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalVolunteers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
  });
  const [recentDonations, setRecentDonations] = useState<
    { name: string; amount: number; date: string; status: "pending" | "completed" }[]
  >([]);
  const [recentMessages, setRecentMessages] = useState<
    { name: string; subject: string; date: string }[]
  >([]);
  const [recentVolunteers, setRecentVolunteers] = useState<
    { name: string; interest: string; date: string }[]
  >([]);

  useEffect(() => {
    setStats(getAdminStats());
    setRecentDonations(
      getDonations()
        .slice(0, 5)
        .map((d) => ({ name: d.name, amount: d.amount, date: d.date, status: d.status }))
    );
    setRecentMessages(
      getContacts()
        .slice(0, 5)
        .map((c) => ({ name: c.name, subject: c.subject, date: c.date }))
    );
    setRecentVolunteers(
      getVolunteers()
        .slice(0, 5)
        .map((v) => ({ name: v.name, interest: v.interest, date: v.date }))
    );
  }, []);

  const statCards = [
    {
      label: "Total Donations",
      value: stats.totalDonations,
      icon: Heart,
      color: "bg-saffron/10 text-saffron",
      iconBg: "bg-saffron/10",
    },
    {
      label: "Amount Raised",
      value: `₹${stats.totalDonationAmount.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green/10 text-green",
      iconBg: "bg-green/10",
    },
    {
      label: "Messages",
      value: stats.totalMessages,
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : undefined,
      icon: MessageSquare,
      color: "bg-forest/10 text-forest",
      iconBg: "bg-forest/10",
    },
    {
      label: "Volunteers",
      value: stats.totalVolunteers,
      icon: Users,
      color: "bg-terracotta/10 text-terracotta",
      iconBg: "bg-terracotta/10",
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-forest"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          Overview of your foundation&apos;s activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-forest/5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color.split(" ")[1]}`} />
              </div>
              {stat.badge && (
                <span className="px-2 py-0.5 bg-saffron/10 text-saffron text-xs font-medium rounded-full">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-forest" style={{ fontFamily: "var(--font-heading)" }}>
              {stat.value}
            </p>
            <p className="text-xs text-charcoal-light mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-forest/5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-saffron" />
            <h2 className="text-sm font-semibold text-forest">
              Recent Donations
            </h2>
          </div>
          {recentDonations.length === 0 ? (
            <p className="text-sm text-charcoal-light/60 italic text-center py-8">
              No donations yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentDonations.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-forest/5 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {d.name}
                    </p>
                    <p className="text-xs text-charcoal-light">
                      {formatDate(d.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-forest block">
                      ₹{d.amount.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        d.status === "completed"
                          ? "bg-green/10 text-green"
                          : "bg-saffron/15 text-saffron-dark"
                      }`}
                    >
                      {d.status === "completed" ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-forest/5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-forest" />
            <h2 className="text-sm font-semibold text-forest">
              Recent Messages
            </h2>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-charcoal-light/60 italic text-center py-8">
              No messages yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m, i) => (
                <div
                  key={i}
                  className="py-2 border-b border-forest/5 last:border-0"
                >
                  <p className="text-sm font-medium text-charcoal">
                    {m.name}
                  </p>
                  <p className="text-xs text-charcoal-light truncate">
                    {m.subject || "No subject"}
                  </p>
                  <p className="text-xs text-charcoal-light/60 mt-0.5">
                    {formatDate(m.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Volunteers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-forest/5"
        >
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-terracotta" />
            <h2 className="text-sm font-semibold text-forest">
              Recent Volunteers
            </h2>
          </div>
          {recentVolunteers.length === 0 ? (
            <p className="text-sm text-charcoal-light/60 italic text-center py-8">
              No volunteers yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentVolunteers.map((v, i) => (
                <div
                  key={i}
                  className="py-2 border-b border-forest/5 last:border-0"
                >
                  <p className="text-sm font-medium text-charcoal">
                    {v.name}
                  </p>
                  <p className="text-xs text-charcoal-light">
                    {v.interest}
                  </p>
                  <p className="text-xs text-charcoal-light/60 mt-0.5">
                    {formatDate(v.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
