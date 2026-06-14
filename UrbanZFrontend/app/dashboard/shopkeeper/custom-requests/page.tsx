"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { PenTool, CheckCircle, XCircle, Clock, Image as ImageIcon, Send, Loader2 } from "lucide-react";

const MOCK_REQUESTS = [
  {
    id: "CR-1029",
    customer: "Rahul Sharma",
    date: "2026-06-12",
    description: "I want a custom denim jacket with an anime character painted on the back. It should be oversized. Similar to the attached reference.",
    budget: 4500,
    status: "pending",
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&q=80",
    quoted_price: null,
    delivery_days: null,
  },
  {
    id: "CR-1030",
    customer: "Priya Patel",
    date: "2026-06-13",
    description: "Need a custom embroidered hoodie with my company logo. I have attached the logo file. Size M.",
    budget: 2000,
    status: "quoted",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80",
    quoted_price: 2200,
    delivery_days: 7,
  }
];

export default function CustomRequestsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [quoteForm, setQuoteForm] = useState({ price: "", days: "" });
  const [loading, setLoading] = useState(false);

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setRequests(prev => prev.map(r => 
        r.id === selectedRequest.id 
          ? { ...r, status: "quoted", quoted_price: parseFloat(quoteForm.price), delivery_days: parseInt(quoteForm.days) }
          : r
      ));
      setSelectedRequest(null);
      setLoading(false);
      setQuoteForm({ price: "", days: "" });
    }, 1000);
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    if (selectedRequest?.id === id) setSelectedRequest(null);
  };

  const handleAccept = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "accepted" } : r));
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Custom Orders</h1>
        <p className="text-muted-foreground">Review customer design requests and send your quotes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          {requests.map(req => (
            <div 
              key={req.id} 
              onClick={() => setSelectedRequest(req)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedRequest?.id === req.id 
                  ? "bg-primary/5 border-primary shadow-sm" 
                  : "bg-card border-border/50 hover:border-primary/50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm">{req.id}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                  ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    req.status === 'quoted' ? 'bg-blue-100 text-blue-700' : 
                    req.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                    'bg-red-100 text-red-700'}`}
                >
                  {req.status}
                </span>
              </div>
              <p className="text-sm font-medium line-clamp-1">{req.customer}</p>
              <p className="text-xs text-muted-foreground mt-1">Budget: {formatPrice(req.budget)}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          {selectedRequest ? (
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm sticky top-24">
              <div className="flex justify-between items-center border-b border-border/50 pb-4 mb-4">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <PenTool size={20} className="text-primary"/> 
                  Request Details
                </h2>
                <span className="text-sm font-medium text-muted-foreground">{selectedRequest.date}</span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Customer</h4>
                  <p className="font-medium">{selectedRequest.customer}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Budget Target</h4>
                  <p className="font-black text-green-600">{formatPrice(selectedRequest.budget)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Description</h4>
                <p className="bg-secondary/10 p-4 rounded-xl text-sm leading-relaxed border border-border/50">
                  {selectedRequest.description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                  <ImageIcon size={14} /> Reference Image
                </h4>
                <div className="h-48 w-full rounded-xl overflow-hidden bg-secondary/10 border border-border/50 relative">
                  <img src={selectedRequest.image} alt="Reference" className="w-full h-full object-cover" />
                </div>
              </div>

              {selectedRequest.status === "pending" ? (
                <form onSubmit={handleSendQuote} className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-4">
                  <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                    <Send size={16} /> Send a Quote
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Your Price (₹)</label>
                      <input 
                        required 
                        type="number" 
                        value={quoteForm.price} 
                        onChange={e => setQuoteForm({...quoteForm, price: e.target.value})}
                        className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Est. Days</label>
                      <input 
                        required 
                        type="number" 
                        value={quoteForm.days} 
                        onChange={e => setQuoteForm({...quoteForm, days: e.target.value})}
                        className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => handleReject(selectedRequest.id)} className="flex-1 py-2 rounded-lg font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                      Reject Request
                    </button>
                    <button type="submit" disabled={loading} className="flex-[2] py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Quote to Customer"}
                    </button>
                  </div>
                </form>
              ) : selectedRequest.status === "quoted" ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-blue-800">Quote Sent</h3>
                    <p className="text-xs text-blue-600 mt-1">You quoted {formatPrice(selectedRequest.quoted_price)} taking {selectedRequest.delivery_days} days.</p>
                  </div>
                  <Clock className="text-blue-500 w-8 h-8 opacity-50" />
                </div>
              ) : selectedRequest.status === "accepted" ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-green-800">Order Confirmed!</h3>
                    <p className="text-xs text-green-600 mt-1">The customer has accepted your quote and paid.</p>
                  </div>
                  <CheckCircle className="text-green-500 w-8 h-8 opacity-50" />
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-red-800">Request Rejected</h3>
                    <p className="text-xs text-red-600 mt-1">You rejected this custom request.</p>
                  </div>
                  <XCircle className="text-red-500 w-8 h-8 opacity-50" />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <PenTool size={48} className="text-muted-foreground opacity-20 mb-4" />
              <h3 className="font-bold text-lg text-muted-foreground">Select a Request</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Click on a custom request from the list to view details and send quotes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
