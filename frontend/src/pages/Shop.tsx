import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import { ShoppingBag, BookOpen, Trash2, Droplets, Coffee, Package, Star, CheckCircle2, AlertCircle, MapPin, CreditCard, ChevronRight, X, ArrowLeft, Truck, Sun, Leaf } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    points: number;
    price: number;
    description: string;
    icon: React.ElementType;
    image: string;
    color: string;
}

const products: Product[] = [
    {
        id: '1',
        name: 'Bamboo Toothbrush Set',
        points: 50,
        price: 250,
        description: 'A set of 4 eco-friendly bamboo toothbrushes with biodegradable bristles.',
        icon: Droplets,
        image: '/images/bamboo_toothbrush.png',
        color: 'bg-emerald-100 text-emerald-600 border-emerald-200'
    },
    {
        id: '2',
        name: 'Recycled Notebook',
        points: 80,
        price: 400,
        description: '100 pages of high-quality, 100% recycled paper for all your ideas.',
        icon: BookOpen,
        image: '/images/recycled_notebook.png',
        color: 'bg-amber-100 text-amber-600 border-amber-200'
    },
    {
        id: '3',
        name: 'Natural Carry Bag',
        points: 100,
        price: 500,
        description: 'A sturdy, reusable bag made from natural jute fibers. Perfect for groceries.',
        icon: ShoppingBag,
        image: '/images/natural_carry_bag.png',
        color: 'bg-orange-100 text-orange-600 border-orange-200'
    },
    {
        id: '4',
        name: 'Compostable Trash Bags',
        points: 120,
        price: 600,
        description: 'A roll of 50 fully compostable plant-based trash bags.',
        icon: Trash2,
        image: '/images/compostable_trash_bags.png',
        color: 'bg-stone-100 text-stone-600 border-stone-200'
    },
    {
        id: '5',
        name: 'Reusable Steel Straws',
        points: 150,
        price: 750,
        description: 'Set of 4 stainless steel straws with a cleaning brush and cotton pouch.',
        icon: Coffee,
        image: '/images/reusable_steel_straws.png',
        color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    {
        id: '6',
        name: 'Organic Cotton Tote',
        points: 200,
        price: 1000,
        description: 'Premium heavy-duty tote bag made from 100% certified organic cotton.',
        icon: Package,
        image: '/images/organic_cotton_tote.png',
        color: 'bg-green-100 text-green-600 border-green-200'
    },
    {
        id: '7',
        name: 'Reusable Water Bottle',
        points: 250,
        price: 1200,
        description: 'Premium stainless steel insulated water bottle. Keeps drinks cold for 24 hours.',
        icon: Droplets,
        image: '/images/reusable_water_bottle.png',
        color: 'bg-teal-100 text-teal-600 border-teal-200'
    },
    {
        id: '8',
        name: 'Solar Power Bank',
        points: 500,
        price: 2500,
        description: 'Portable charger powered by the sun. Perfect for outdoor adventures.',
        icon: Sun,
        image: '/images/solar_power_bank.png',
        color: 'bg-yellow-100 text-yellow-600 border-yellow-200'
    },
    {
        id: '9',
        name: 'Beeswax Food Wraps',
        points: 150,
        price: 750,
        description: 'Eco-friendly natural alternative to plastic wrap. Washable and reusable.',
        icon: Leaf,
        image: '/images/beeswax_food_wraps.png',
        color: 'bg-lime-100 text-lime-600 border-lime-200'
    }
];

const Shop: React.FC = () => {
    const [userPoints, setUserPoints] = useState(0);
    const [message] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    
    // Checkout Modal State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);
    
    // Form State
    const [addressForm, setAddressForm] = useState({ fullName: '', address: '', city: '', zip: '' });
    const [paymentMethod, setPaymentMethod] = useState<'points' | 'card' | 'cod'>('points');

    const loadUser = () => {
        const storedUser = localStorage.getItem('greenary_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserPoints(user.points || 0);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    };

    useEffect(() => {
        loadUser();
        window.addEventListener('userUpdated', loadUser);
        return () => window.removeEventListener('userUpdated', loadUser);
    }, []);

    const handleInitiateRedeem = (product: Product) => {
        setSelectedProduct(product);
        setCheckoutStep(1);
        setIsCheckoutOpen(true);
        if (userPoints < product.points) {
            setPaymentMethod('card');
        } else {
            setPaymentMethod('points');
        }
    };

    const handleCompleteOrder = () => {
        if (!selectedProduct) return;

        if (paymentMethod === 'points') {
            const storedUser = localStorage.getItem('greenary_user');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    user.points -= selectedProduct.points;
                    localStorage.setItem('greenary_user', JSON.stringify(user));
                    window.dispatchEvent(new Event('userUpdated'));
                } catch (e) {
                    console.error("Error redeeming", e);
                }
            }
        }
        
        setCheckoutStep(3); // Success Step
    };

    const handleCloseModal = () => {
        setIsCheckoutOpen(false);
        setTimeout(() => {
            setSelectedProduct(null);
            setCheckoutStep(1);
            setAddressForm({ fullName: '', address: '', city: '', zip: '' });
            setPaymentMethod('points');
        }, 300);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Navbar />
            
            <div className="pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Eco-Shop</h1>
                        <p className="text-slate-500 mt-2 text-lg">Redeem your hard-earned points for natural, eco-friendly products.</p>
                    </div>
                    
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Balance</p>
                            <p className="text-2xl font-extrabold text-slate-900">{userPoints} pts</p>
                        </div>
                    </div>
                </div>

                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-medium ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => {
                        const canAfford = userPoints >= product.points;
                        
                        return (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="mb-6 relative">
                                    <div className={`w-full h-48 rounded-2xl overflow-hidden border ${product.color} group-hover:shadow-md transition-all duration-300`}>
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-1.5 border border-white/50">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        {product.points}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                                <p className="text-slate-500 text-sm flex-1 leading-relaxed mb-8">
                                    {product.description}
                                </p>
                                
                                <button 
                                    onClick={() => handleInitiateRedeem(product)}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                        canAfford 
                                        ? 'bg-green-900 text-white hover:bg-green-800 shadow-lg hover:-translate-y-0.5' 
                                        : 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg hover:-translate-y-0.5'
                                    }`}
                                >
                                    {canAfford ? 'Redeem with Points' : `Buy for ₹${product.price}`}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {isCheckoutOpen && selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={checkoutStep >= 3 ? handleCloseModal : undefined}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            {checkoutStep !== 3 && (
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        {checkoutStep === 2 && (
                                            <button onClick={() => setCheckoutStep(1)} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors">
                                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                                            </button>
                                        )}
                                        <h2 className="font-extrabold text-lg text-slate-900">
                                            {checkoutStep === 1 ? 'Delivery Details' : checkoutStep === 2 ? 'Payment Method' : 'Track Request'}
                                        </h2>
                                    </div>
                                    {checkoutStep < 3 && (
                                        <button onClick={handleCloseModal} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Progress Bar */}
                            {checkoutStep < 3 && (
                                <div className="flex gap-1 px-6 pt-4">
                                    <div className="h-1.5 flex-1 rounded-full bg-green-600"></div>
                                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${checkoutStep >= 2 ? 'bg-green-600' : 'bg-slate-100'}`}></div>
                                </div>
                            )}

                            {/* Content */}
                            <div className={checkoutStep === 3 ? "flex-1 overflow-y-auto bg-gradient-to-br from-green-950 to-emerald-900 relative p-8 md:p-12" : "p-6 overflow-y-auto"}>
                                {checkoutStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shadow-sm shrink-0 border border-amber-100">
                                                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{selectedProduct.name}</p>
                                                <p className="text-sm text-amber-700 font-medium mt-1">Total: {selectedProduct.points} pts</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={addressForm.fullName}
                                                    onChange={e => setAddressForm({...addressForm, fullName: e.target.value})}
                                                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" 
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Street Address</label>
                                                <input 
                                                    type="text" 
                                                    value={addressForm.address}
                                                    onChange={e => setAddressForm({...addressForm, address: e.target.value})}
                                                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" 
                                                    placeholder="123 Eco Street, Apt 4B"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                                                    <input 
                                                        type="text" 
                                                        value={addressForm.city}
                                                        onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                                                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" 
                                                        placeholder="Greenville"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">ZIP Code</label>
                                                    <input 
                                                        type="text" 
                                                        value={addressForm.zip}
                                                        onChange={e => setAddressForm({...addressForm, zip: e.target.value})}
                                                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" 
                                                        placeholder="12345"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => setCheckoutStep(2)}
                                            disabled={!addressForm.fullName || !addressForm.address || !addressForm.city || !addressForm.zip}
                                            className="w-full mt-6 bg-green-900 text-white font-bold py-3.5 rounded-xl transition-colors hover:bg-green-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            Continue to Payment <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}

                                {checkoutStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <div className="space-y-3">
                                            <label 
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-colors ${
                                                    userPoints < selectedProduct.points 
                                                    ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50' 
                                                    : paymentMethod === 'points' ? 'border-amber-400 bg-amber-50 cursor-pointer' : 'border-slate-100 hover:border-slate-200 cursor-pointer'
                                                }`}
                                                onClick={() => {
                                                    if (userPoints >= selectedProduct.points) setPaymentMethod('points');
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'points' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                                                        <Star className={`w-5 h-5 ${paymentMethod === 'points' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">Reward Points</p>
                                                        <p className="text-xs font-medium text-slate-500">
                                                            {userPoints < selectedProduct.points ? `Need ${selectedProduct.points - userPoints} more pts` : `Balance: ${userPoints} pts`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'points' ? 'border-amber-500' : 'border-slate-300'}`}>
                                                    {paymentMethod === 'points' && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>}
                                                </div>
                                            </label>

                                            <label 
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-green-600 bg-green-50' : 'border-slate-100 hover:border-slate-200'}`}
                                                onClick={() => setPaymentMethod('card')}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-green-100' : 'bg-slate-100'}`}>
                                                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-green-600' : 'text-slate-400'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">Online Payment</p>
                                                        <p className="text-xs font-medium text-slate-500">Credit / Debit / UPI</p>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-green-600' : 'border-slate-300'}`}>
                                                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>}
                                                </div>
                                            </label>

                                            <label 
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                                                onClick={() => setPaymentMethod('cod')}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                                        <Truck className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-blue-600' : 'text-slate-400'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">Cash on Delivery</p>
                                                        <p className="text-xs font-medium text-slate-500">Pay when delivered</p>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-blue-600' : 'border-slate-300'}`}>
                                                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                                </div>
                                            </label>
                                        </div>

                                        <div className="bg-[#F8F9FA] rounded-2xl p-4 mt-6">
                                            <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                                                <span>Subtotal</span>
                                                <span>{paymentMethod === 'points' ? `${selectedProduct.points} pts` : `₹${selectedProduct.price}`}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-medium text-slate-600 mb-3 pb-3 border-b border-slate-200">
                                                <span>Delivery Charges</span>
                                                {paymentMethod === 'points' ? (
                                                    <span className="text-emerald-600 font-bold">Free</span>
                                                ) : (
                                                    <span className="text-slate-600 font-bold">₹50</span>
                                                )}
                                            </div>
                                            <div className="flex justify-between text-lg font-extrabold text-slate-900">
                                                <span>Total</span>
                                                <span>{paymentMethod === 'points' ? `${selectedProduct.points} pts` : `₹${selectedProduct.price + 50}`}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleCompleteOrder}
                                            className="w-full mt-4 bg-green-900 text-white font-bold py-3.5 rounded-xl transition-all hover:bg-green-800 hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {paymentMethod === 'points' ? `Pay ${selectedProduct.points} pts` : `Pay ₹${selectedProduct.price + 50}`}
                                        </button>
                                    </motion.div>
                                )}

                                {checkoutStep === 3 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center relative z-10">
                                        <div className="w-20 h-20 bg-emerald-400/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-emerald-400/30">
                                            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-white mb-3">Order Confirmed!</h2>
                                        <p className="text-emerald-50/80 mb-10 max-w-sm text-sm">
                                            Your <strong>{selectedProduct.name}</strong> is being processed and will be shipped to {addressForm.address}, {addressForm.city}.
                                        </p>
                                        <div className="w-full space-y-3">
                                            <button 
                                                onClick={() => setCheckoutStep(4)}
                                                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white py-4 rounded-xl font-medium transition-all group border border-white/20 shadow-lg"
                                            >
                                                <MapPin className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                                                Track Your Request
                                            </button>
                                            <button 
                                                onClick={handleCloseModal}
                                                className="w-full bg-black/20 hover:bg-black/30 text-white font-bold py-4 rounded-xl transition-colors border border-transparent backdrop-blur-sm"
                                            >
                                                Back to Shop
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {checkoutStep === 4 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 py-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-extrabold text-slate-900">Live Tracking</h3>
                                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                In Transit
                                            </span>
                                        </div>

                                        {/* Map Placeholder */}
                                        <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                                            <img src="/images/delivery_map.png" alt="Delivery Map" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-2xl pointer-events-none"></div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shadow-sm shrink-0 border border-slate-200">
                                                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{selectedProduct.name}</p>
                                                <p className="text-sm text-slate-500">Tracking ID: <span className="font-mono font-medium">#GRN-{(Math.random() * 1000000).toFixed(0)}</span></p>
                                            </div>
                                        </div>

                                        <div className="relative pl-6 space-y-6 py-2">
                                            {/* Tracking Line */}
                                            <div className="absolute left-7 top-4 bottom-6 w-0.5 bg-slate-200"></div>
                                            <div className="absolute left-7 top-4 h-1/2 w-0.5 bg-emerald-500"></div>

                                            {/* Steps */}
                                            <div className="relative flex items-start gap-4">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 mt-1.5 shrink-0 z-10"></div>
                                                <div>
                                                    <p className="font-bold text-slate-900">Order Placed</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Today, 10:00 AM</p>
                                                </div>
                                            </div>

                                            <div className="relative flex items-start gap-4">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 mt-1.5 shrink-0 z-10"></div>
                                                <div>
                                                    <p className="font-bold text-slate-900">Packed & Shipped</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Today, 2:30 PM</p>
                                                </div>
                                            </div>

                                            <div className="relative flex items-start gap-4">
                                                <div className="w-3 h-3 rounded-full bg-white border-2 border-emerald-500 ring-4 ring-emerald-50 mt-1.5 shrink-0 z-10">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full m-auto mt-[1px]"></div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">In Transit</p>
                                                    <p className="text-sm text-slate-600 mt-0.5">On the way to {addressForm.city}.</p>
                                                    <p className="text-xs font-medium text-emerald-600 mt-1">Estimated delivery: Tomorrow</p>
                                                </div>
                                            </div>

                                            <div className="relative flex items-start gap-4">
                                                <div className="w-3 h-3 rounded-full bg-slate-200 ring-4 ring-slate-50 mt-1.5 shrink-0 z-10"></div>
                                                <div>
                                                    <p className="font-bold text-slate-400">Delivered</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleCloseModal}
                                            className="w-full bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl transition-colors hover:bg-slate-200 mt-2"
                                        >
                                            Close Tracking
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
