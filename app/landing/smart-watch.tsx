"use client";

import React, { useState, useEffect, useRef } from 'react';
import { money } from '@/app/catalog';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Banknote,
  Activity,
  Monitor,
  Battery,
  Droplet,
  ShoppingCart
} from 'lucide-react';
import './landing.css';

export default function SmartWatchLandingPage() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const product = {
    name: "Everyday Smart Watch",
    price: 5490,
    originalPrice: 6990,
    image: "/images/watch.jpg",
    discount: 1500
  };

  useEffect(() => {
    // Random time between 2-5 hours
    const randomSeconds = Math.floor(Math.random() * (5 * 3600 - 2 * 3600 + 1) + 2 * 3600);
    setTimeLeft(randomSeconds);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !formRef.current) return;
      
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      const formTop = formRef.current.getBoundingClientRect().top;
      
      // Show sticky when hero is passed, hide when form is visible
      if (heroBottom < 0 && formTop > window.innerHeight) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Order Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Karachi',
    qty: 1
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        note: '',
        email: '',
        items: [{ id: 'smart-watch', qty: formData.qty, size: 'Standard' }]
      };
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok) {
        setOrderSuccess(data.id || 'ORD-' + Math.floor(Math.random() * 100000));
      } else {
        alert('Order failed. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const faqs = [
    { q: "How long is delivery?", a: "Delivery typically takes 3-5 working days across Pakistan." },
    { q: "What is COD?", a: "Cash on Delivery (COD) means you only pay when the rider hands you the parcel at your doorstep." },
    { q: "Can I return the product?", a: "Yes, we offer a 7-Day Easy Return policy if the product is defective or not as described." },
    { q: "Is this original?", a: "Absolutely! We guarantee 100% original and authentic products." },
    { q: "What cities do you deliver to?", a: "We deliver all over Pakistan!" },
    { q: "How do I track my order?", a: "Once your order is confirmed, you will receive a tracking link via SMS." }
  ];

  return (
    <div className="landing-page bg-gray-50 text-gray-900 font-sans pb-24 lg:pb-0">
      
      {/* 1. Hero Section */}
      <section ref={heroRef} className="bg-white pt-8 pb-12 px-4 shadow-sm relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-4 animate-pulse">
            🔥 Limited Stock — Only 47 Left!
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
            Pakistan's #1 Everyday Smart Watch
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your health, stay connected, and look incredibly stylish without breaking the bank.
          </p>
          
          <div className="relative max-w-md mx-auto mb-8 rounded-2xl overflow-hidden shadow-xl border-4 border-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-auto object-cover aspect-square" />
            <div className="absolute top-4 right-4 bg-green-500 text-white font-black px-4 py-2 rounded-full transform rotate-12 shadow-lg">
              SAVE<br/>{money(product.discount)}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-black text-red-600">{money(product.price)}</span>
              <span className="text-xl text-gray-400 line-through decoration-2">{money(product.originalPrice)}</span>
            </div>
            
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 mb-6">
              ⏳ Offer Ends In: <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
            </div>
            
            <button 
              onClick={scrollToForm}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={24} />
              Order Now — Cash on Delivery
            </button>
            <p className="mt-3 text-sm text-gray-500 font-medium">✅ Free Delivery All Over Pakistan</p>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="bg-gray-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck size={32} className="text-green-400" />
            <span className="text-sm font-semibold">Free Delivery<br/>All Over Pakistan</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Banknote size={32} className="text-green-400" />
            <span className="text-sm font-semibold">Cash on<br/>Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RefreshCcw size={32} className="text-green-400" />
            <span className="text-sm font-semibold">7-Day Easy<br/>Return</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck size={32} className="text-green-400" />
            <span className="text-sm font-semibold">100% Original<br/>Product</span>
          </div>
        </div>
      </section>

      {/* 3. Product Highlights */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Premium Features, Affordable Price</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full h-fit text-blue-600">
                <Activity size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Health & Fitness Tracking</h3>
                <p className="text-gray-600">Monitor your steps, heart rate, and sleep patterns effortlessly throughout the day.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-full h-fit text-purple-600">
                <Monitor size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Beautiful HD Display</h3>
                <p className="text-gray-600">Crystal clear digital display that is easy to read even in bright outdoor sunlight.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="bg-green-100 p-3 rounded-full h-fit text-green-600">
                <Battery size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">7-Day Battery Life</h3>
                <p className="text-gray-600">Charge once and forget it. Enjoy up to a full week of usage on a single charge.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="bg-cyan-100 p-3 rounded-full h-fit text-cyan-600">
                <Droplet size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Water Resistant IP67</h3>
                <p className="text-gray-600">Don't worry about sweat or rain. Your watch is protected against everyday splashes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Gallery */}
      <section className="py-12 bg-gray-100 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">See It From Every Angle</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[80vw] md:min-w-0 md:flex-1 snap-center bg-white p-2 rounded-xl shadow-sm border border-gray-200 shrink-0">
                <img src={product.image} alt={`Angle ${i}`} className="w-full h-auto rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Buy From Us?</h2>
          <ul className="space-y-4">
            {[
              "Premium Quality Guarantee — We only sell authentic, high-quality products.",
              "Cash on Delivery — Secure and hassle-free payment at your doorstep.",
              "Fast Shipping — Quick dispatch and delivery across Pakistan.",
              "Dedicated Customer Support — We are here to help you before and after your purchase.",
              "Easy Returns — No questions asked 7-day return policy for peace of mind."
            ].map((point, i) => (
              <li key={i} className="flex gap-3 items-start bg-green-50 p-4 rounded-lg border border-green-100">
                <Check className="text-green-600 shrink-0 mt-0.5" size={24} />
                <span className="text-gray-800 font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Ali Raza", text: "Amazing watch for the price! Battery lasts exactly as promised. Very happy with the fast delivery to Lahore.", rating: 5 },
              { name: "Fatima S.", text: "Looks very stylish and expensive. The strap is very comfortable for daily wear. Highly recommended!", rating: 5 },
              { name: "Usman Khan", text: "Good display and accurate step tracking. Value for money is excellent. Delivery rider was very polite.", rating: 4 },
              { name: "Ayesha M.", text: "I bought this for my brother and he loves it. The COD option made it so easy to order without any fear.", rating: 5 },
              { name: "Bilal Ahmed", text: "Superb quality. I have used other cheap smartwatches before but this one feels very premium.", rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-3 text-yellow-400">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={20} fill={j < review.rating ? "currentColor" : "none"} className={j >= review.rating ? "text-gray-300" : ""} />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{review.text}"</p>
                <p className="font-bold text-gray-900">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Order Form */}
      <section className="py-12 bg-white" id="order-form">
        <div className="max-w-2xl mx-auto px-4">
          {orderSuccess ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center shadow-lg">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">Order Confirmed!</h2>
              <p className="text-lg text-green-700 mb-6">Thank you for your order. We will dispatch it shortly.</p>
              <div className="bg-white p-4 rounded-xl inline-block shadow-sm">
                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Your Order ID</p>
                <p className="text-2xl font-mono font-bold text-gray-900">{orderSuccess}</p>
              </div>
              <p className="mt-8 text-gray-600">A confirmation SMS has been sent to your phone.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-900 text-white p-6 text-center">
                <h2 className="text-2xl font-bold">Complete Your Order</h2>
                <p className="text-gray-300 mt-1">Pay Cash on Delivery — No Advance Payment Needed</p>
              </div>
              
              <form ref={formRef} onSubmit={handleOrderSubmit} className="p-6 md:p-8 space-y-6">
                
                {/* Product Summary */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                  <img src={product.image} alt="Watch" className="w-16 h-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{product.name}</h4>
                    <p className="text-red-600 font-bold">{money(product.price)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Ali Khan"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      type="tel" 
                      pattern="^03\d{9}$"
                      placeholder="03XXXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: 03001234567</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    >
                      {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Mardan'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Complete Address <span className="text-red-500">*</span></label>
                    <textarea 
                      required 
                      rows={3}
                      placeholder="House #, Street, Area, Landmark"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
                      value={formData.qty}
                      onChange={e => setFormData({...formData, qty: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5].map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal ({formData.qty} item)</span>
                    <span className="font-semibold">{money(product.price * formData.qty)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 pt-4">
                    <span>Total Amount</span>
                    <span className="text-red-600">{money(product.price * formData.qty)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isOrdering}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xl font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 mt-4"
                >
                  {isOrdering ? 'Processing...' : `Confirm My Order — ${money(product.price * formData.qty)}`}
                </button>
                <p className="text-center text-sm text-gray-600 mt-4 flex items-center justify-center gap-1 font-medium">
                  <ShieldCheck size={16} className="text-green-600" />
                  No online payment needed — Pay cash when your order arrives
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Sticky Bottom Bar (Mobile) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-50 md:hidden transition-transform duration-300 flex items-center justify-between ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 line-through">{money(product.originalPrice)}</span>
          <span className="text-lg font-black text-red-600">{money(product.price)}</span>
        </div>
        <button 
          onClick={scrollToForm}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-md active:scale-95 transition-transform"
        >
          Order Now
        </button>
      </div>

    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <button
        className="w-full text-left px-6 py-4 font-bold text-gray-900 flex justify-between items-center hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 pt-2 text-gray-600 border-t border-gray-100 bg-gray-50">
          {answer}
        </div>
      )}
    </div>
  );
}
