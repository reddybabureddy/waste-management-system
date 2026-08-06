import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Image as ImageIcon, CheckCircle2, ChevronDown, Navigation } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon not showing correctly in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map clicks
const LocationSelector = ({ onSelect }: { onSelect: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

// Helper to pan the map dynamically
const MapPanTo = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const Report: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('general');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    // Map States (Default to a general view, e.g. London or New York)
    const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi for this user
    const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.display_name) {
                return data.display_name;
            }
        } catch (error) {
            console.error("Error reverse geocoding:", error);
        }
        return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    };

    // Geocode location input automatically when user types
    useEffect(() => {
        if (!location || location === "Fetching address..." || location === "Live Location Acquired!" || location === "Map Pin Dropped!") return;

        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    const newLat = parseFloat(data[0].lat);
                    const newLng = parseFloat(data[0].lon);
                    setMapCenter([newLat, newLng]);
                    setMarkerPos([newLat, newLng]);
                }
            } catch (error) {
                console.error("Error geocoding location:", error);
            }
        }, 800); // 800ms delay to wait for user to stop typing

        return () => clearTimeout(delayDebounceFn);
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newReport = {
            id: Date.now().toString(),
            title,
            category,
            description,
            location: location,
            status: 'Pending',
            date: new Date().toISOString(),
            imageUrl: imageBase64
        };

        // Always save to localStorage for frontend persistence
        try {
            let existingReports = JSON.parse(localStorage.getItem('greenary_reports') || '[]');
            existingReports.push(newReport);
            localStorage.setItem('greenary_reports', JSON.stringify(existingReports));
        } catch (e) {
            console.error("Error saving to localStorage", e);
        }

        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReport)
            });

            if (!response.ok) {
                console.warn("Backend failed to save report");
            }
        } catch (error) {
            console.log("Backend not available, but saved to localStorage successfully.");
        }

        // Update User Points
        const storedUser = localStorage.getItem('greenary_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                user.points = (user.points || 0) + 20;
                localStorage.setItem('greenary_user', JSON.stringify(user));
                window.dispatchEvent(new Event('userUpdated'));
            } catch (e) {
                console.error('Error updating points:', e);
            }
        }

        window.dispatchEvent(new Event('reportAdded'));
        setSubmitted(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGetLiveLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapCenter([latitude, longitude]);
                    setMarkerPos([latitude, longitude]);
                    setLocation("Fetching address...");
                    const address = await reverseGeocode(latitude, longitude);
                    setLocation(address);
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("Could not get your live location. Please allow location access in your browser.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setMarkerPos([lat, lng]);
        setLocation("Fetching address...");
        const address = await reverseGeocode(lat, lng);
        setLocation(address);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Navbar />

            <div className="pt-28 pb-16 px-4 sm:px-8 max-w-3xl mx-auto">
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Report Submitted!</h2>
                        <p className="text-slate-500 mb-8 max-w-md">
                            Thank you for keeping our community clean. Our teams have been notified and will address the issue shortly.
                        </p>
                        <p className="text-sm font-medium text-green-700 animate-pulse">
                            Redirecting to dashboard...
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100"
                    >
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Report an Issue</h1>
                        <p className="text-slate-500 mb-10 text-[0.95rem]">
                            Help us keep the community clean. Provide details about the waste issue so our teams can resolve it quickly.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Issue Title</label>
                                    <div className="relative">
                                        <select
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-colors appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select an issue...</option>
                                            <option value="Overflowing Public Bin">Overflowing Public Bin</option>
                                            <option value="Illegal Dumping">Illegal Dumping</option>
                                            <option value="Missed Garbage Collection">Missed Garbage Collection</option>
                                            <option value="Damaged / Broken Bin">Damaged / Broken Bin</option>
                                            <option value="Roadkill / Dead Animal">Roadkill / Dead Animal</option>
                                            <option value="Street Sweeping Required">Street Sweeping Required</option>
                                            <option value="Chemical / Hazardous Spill">Chemical / Hazardous Spill</option>
                                            <option value="E-Waste Abandoned">E-Waste Abandoned</option>
                                            <option value="Downed Tree / Branches">Downed Tree / Branches</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Waste Category</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-colors appearance-none"
                                        >
                                            <option value="general">General Waste</option>
                                            <option value="recyclable">Recyclables</option>
                                            <option value="hazardous">Hazardous / Chemical</option>
                                            <option value="bulk">Bulk / Furniture</option>
                                            <option value="organic">Organic / Green Waste</option>
                                            <option value="ewaste">Electronic Waste (E-Waste)</option>
                                            <option value="medical">Medical / Biohazardous</option>
                                            <option value="construction">Construction / Demolition</option>
                                            <option value="dumping">Illegal Dumping</option>
                                            <option value="overflow">Overflowing Public Bin</option>
                                            <option value="glass">Glass / Sharp Objects</option>
                                            <option value="liquid">Liquid Waste / Spills</option>
                                            <option value="textiles">Clothing / Textiles</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-bold text-slate-700">Exact Location</label>
                                    <button
                                        type="button"
                                        onClick={handleGetLiveLocation}
                                        className="text-sm flex items-center gap-1.5 font-bold text-green-700 hover:text-green-800 transition-colors bg-green-50 px-3 py-1.5 rounded-lg"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        Get Live Location
                                    </button>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-colors"
                                        placeholder="Type an address or drop a pin on the map below"
                                        required
                                    />
                                </div>

                                {/* Map Container */}
                                <div className="h-[250px] w-full rounded-2xl overflow-hidden border-2 border-slate-200 z-0 relative">
                                    <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <LocationSelector onSelect={handleMapClick} />
                                        <MapPanTo center={mapCenter} />
                                        {markerPos && (
                                            <Marker position={markerPos}></Marker>
                                        )}
                                    </MapContainer>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-colors resize-none"
                                    placeholder="Please provide any additional details that might help our team..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Upload Photo Evidence</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-[#F8F9FA] transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center pointer-events-none">
                                        {fileName ? (
                                            <>
                                                {imageBase64 ? (
                                                    <img src={imageBase64} alt="Preview" className="w-24 h-24 object-cover rounded-xl mb-3 shadow-sm border border-slate-200" />
                                                ) : (
                                                    <ImageIcon className="w-12 h-12 text-green-600 mb-3" />
                                                )}
                                                <p className="text-sm font-bold text-slate-900">{fileName}</p>
                                                <p className="text-xs text-slate-500 mt-1">Click to change file</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                    <Camera className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 mb-1">Click to upload or drag and drop</p>
                                                <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <button
                                    type="submit"
                                    className="w-full bg-green-900 text-white font-bold rounded-xl px-4 py-4 hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Report;
