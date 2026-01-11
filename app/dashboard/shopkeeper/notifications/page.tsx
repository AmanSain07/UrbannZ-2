"use client";

import { Bell, Package, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "You have a new order from Rahul Sharma for 'Cyberpunk Bomber'.",
      time: "2 mins ago",
      type: "order",
      read: false,
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Inventory for 'Neo-Tokyo Runners' (Size M) is running low.",
      time: "1 hour ago",
      type: "alert",
      read: false,
    },
    {
      id: 3,
      title: "Payout Processed",
      message: "Weekly payout of ₹12,500 has been initiated to your account.",
      time: "1 day ago",
      type: "success",
      read: true,
    },
    {
      id: 4,
      title: "Platform Update",
      message: "New feature: You can now add multiple images to your products!",
      time: "2 days ago",
      type: "info",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "order": return <Package className="w-5 h-5 text-blue-500" />;
      case "alert": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "success": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "info": return <Info className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 mb-[100px]">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your store activity.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-all hover:shadow-md flex gap-4 items-start ${notif.read ? "bg-card border-border/50" : "bg-primary/5 border-primary/20"
              }`}
          >
            <div className={`p-2 rounded-full flex-shrink-0 ${notif.read ? "bg-secondary" : "bg-white shadow-sm"}`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`font-bold text-sm ${!notif.read && "text-primary"}`}>{notif.title}</h4>
                <span className="text-xs text-muted-foreground font-medium">{notif.time}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {notif.message}
              </p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <button className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          Mark all as read
        </button>
      </div>
    </div>
  );
}
