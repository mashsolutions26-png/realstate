import React, { useState, useEffect } from "react";
import {
  Home as HomeIcon, Search, ChevronDown, Heart, MapPin, Shield, Headphones,
  Sparkles, Check, ArrowRight, Menu, X, Bed, Bath, Square, Star, Mail, Phone,
  Instagram, Facebook, Twitter, Linkedin, User, LogOut, Calendar, Settings,
  Car, Wifi, Dumbbell, TreePine, Wind, Lock, Clock, Building2, Users,
  ChevronLeft, ChevronRight, SlidersHorizontal, Sun, LoaderCircle
} from "lucide-react";
import {
  auth, onAuthStateChanged, type User as FirebaseUser,
  loginWithEmail, registerWithEmail, loginWithGoogle, logout,
  fetchFavorites, saveFavorites,
} from "./firebase";

const NAVY = "#1B2140";

const PROPERTIES = [
  { id: 1, title: "Modern Ocean Villa", location: "Miami, Florida", price: 4200, badge: "Featured", type: "Villa", beds: 4, baths: 3, area: 3200, parking: 2, year: 2022,
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80"],
    desc: "A sun-drenched oceanfront villa with floor-to-ceiling glass, a private infinity pool, and uninterrupted views of the Atlantic. Designed for effortless indoor-outdoor living." },
  { id: 2, title: "Urban Luxury Apartment", location: "Chicago, Illinois", price: 2850, badge: "New", type: "Apartment", beds: 2, baths: 2, area: 1450, parking: 1, year: 2021,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80","https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80","https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80"],
    desc: "A refined high-rise residence in the heart of downtown, featuring wide-plank oak floors, a chef's kitchen, and panoramic skyline views from every room." },
  { id: 3, title: "Sunny Autumn House", location: "Austin, Texas", price: 3100, badge: "Hot Deal", type: "House", beds: 3, baths: 2, area: 2100, parking: 2, year: 2019,
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80","https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80"],
    desc: "A warm, light-filled family house set on a quiet tree-lined street, with a landscaped garden, an open-concept kitchen, and a sun room that catches the morning light." },
  { id: 4, title: "Glass House Retreat", location: "Aspen, Colorado", price: 5400, badge: "Featured", type: "Villa", beds: 5, baths: 4, area: 4100, parking: 3, year: 2023,
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80","https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"],
    desc: "A striking mountainside retreat wrapped in glass, blending contemporary architecture with sweeping views of the surrounding peaks." },
  { id: 5, title: "Riverside Loft", location: "Portland, Oregon", price: 2450, badge: "New", type: "Apartment", beds: 1, baths: 1, area: 980, parking: 1, year: 2020,
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80","https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80","https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80"],
    desc: "An industrial-chic loft with exposed brick, oversized windows, and a private balcony overlooking the river walk." },
  { id: 6, title: "Coastal Family Home", location: "San Diego, California", price: 3800, badge: "Hot Deal", type: "House", beds: 4, baths: 3, area: 2800, parking: 2, year: 2018,
    img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80","https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80"],
    desc: "A breezy coastal home just minutes from the beach, with a wraparound porch, an open family room, and a backyard built for entertaining." },
  { id: 7, title: "Downtown Skyline Suite", location: "Seattle, Washington", price: 3300, badge: "Featured", type: "Apartment", beds: 2, baths: 2, area: 1320, parking: 1, year: 2022,
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80","https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"],
    desc: "A polished residence in a full-amenity tower, with a private terrace, floor-to-ceiling windows, and views over the bay." },
  { id: 8, title: "Hillside Modern Estate", location: "Los Angeles, California", price: 6200, badge: "New", type: "Villa", beds: 5, baths: 5, area: 4600, parking: 3, year: 2023,
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80","https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80","https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80","https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80"],
    desc: "A sculptural hillside estate with disappearing glass walls, a cantilevered pool, and city-light views that stretch to the ocean." },
  { id: 9, title: "Maple Street Cottage", location: "Nashville, Tennessee", price: 1950, badge: "Hot Deal", type: "House", beds: 2, baths: 1, area: 1150, parking: 1, year: 2015,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80","https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80"],
    desc: "A charming cottage with a picket-fenced yard, original hardwood floors, and a freshly renovated kitchen, walkable to the city's best cafes." },
];

const AMENITY_ICONS = {
  "Swimming Pool": Sun, "WiFi": Wifi, "Parking": Car, "Air Conditioning": Wind,
  "Security": Lock, "Garden": TreePine, "Gym": Dumbbell, "Balcony": Building2,
};

function fmt(n) { return "$" + n.toLocaleString(); }

function Badge({ children, tone = "purple" }) {
  const tones = {
    purple: "bg-[#EFEBFB] text-[#5B4FC4]",
    green: "bg-[#E7F6EE] text-[#2E9E5B]",
    amber: "bg-[#FDECE3] text-[#C5622B]",
  };
  return <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${tones[tone]}`}>{children}</span>;
}

function BadgeForType(t) {
  if (t === "Featured") return <Badge tone="purple">Featured</Badge>;
  if (t === "New") return <Badge tone="green">New</Badge>;
  return <Badge tone="amber">Hot Deal</Badge>;
}

function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 shrink-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: NAVY }}>
        <HomeIcon size={18} color="white" strokeWidth={2.5} />
      </div>
      <div className="text-left">
        <p className="font-bold text-[17px] leading-none" style={{ color: NAVY }}>Nestoria</p>
        <p className="text-[10px] text-gray-400 leading-none mt-1 tracking-wide">Live Elevated</p>
      </div>
    </button>
  );
}

function Navbar({ page, setPage, favCount, currentUser, onLogout }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "home"], ["Listings", "listings"], ["Services", "services"],
    ["Favorite", "favorites"], ["Blog", "blog"], ["About Us", "about"],
  ];
  return (
    <div className="sticky top-0 z-40 px-4 pt-4">
      <div className="max-w-[1280px] mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-[0_2px_20px_rgba(27,33,64,0.07)] px-5 py-3 flex items-center justify-between">
        <Logo onClick={() => { setPage("home"); setOpen(false); }} />
        <nav className="hidden lg:flex items-center gap-7">
          {links.map(([label, key]) => (
            <button key={key} onClick={() => setPage(key)}
              className={`text-[14px] font-medium transition-colors relative ${page === key ? "" : "text-gray-500 hover:text-[#1B2140]"}`}
              style={page === key ? { color: NAVY } : {}}>
              {label}
              {key === "favorites" && favCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#5B4FC4] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{favCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {currentUser ? (
            <>
              <button onClick={() => setPage("dashboard")} className="flex items-center gap-2 text-[14px] font-medium" style={{ color: NAVY }}>
                <div className="w-8 h-8 rounded-full bg-[#EFEBFB] flex items-center justify-center">
                  <User size={14} color="#5B4FC4" />
                </div>
                {currentUser.displayName || currentUser.email?.split("@")[0]}
              </button>
              <button onClick={onLogout} className="text-[14px] font-medium text-gray-400 hover:text-[#1B2140]" title="Log out">
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")} className="text-[14px] font-medium text-gray-500 hover:text-[#1B2140]">Log In</button>
              <button onClick={() => setPage("register")} className="text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition" style={{ background: NAVY }}>
                Get Started
              </button>
            </>
          )}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} color={NAVY} /> : <Menu size={22} color={NAVY} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden max-w-[1280px] mx-auto bg-white rounded-2xl shadow-lg mt-2 p-4 flex flex-col gap-1">
          {links.map(([label, key]) => (
            <button key={key} onClick={() => { setPage(key); setOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl text-[14px] font-medium hover:bg-gray-50" style={{ color: NAVY }}>
              {label}
            </button>
          ))}
          <div className="border-t border-gray-100 my-2" />
          {currentUser ? (
            <>
              <button onClick={() => { setPage("dashboard"); setOpen(false); }} className="text-left px-3 py-2.5 text-[14px] font-medium" style={{ color: NAVY }}>
                {currentUser.displayName || currentUser.email?.split("@")[0]}
              </button>
              <button onClick={() => { onLogout(); setOpen(false); }} className="text-left px-3 py-2.5 text-[14px] font-medium text-gray-400">Log out</button>
            </>
          ) : (
            <>
              <button onClick={() => { setPage("login"); setOpen(false); }} className="text-left px-3 py-2.5 text-[14px] font-medium text-gray-500">Log In</button>
              <button onClick={() => { setPage("register"); setOpen(false); }} className="text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl" style={{ background: NAVY }}>Get Started</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SearchPanel({ onSearch }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(27,33,64,0.15)] p-3 flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
      {[
        ["Location", "New York, USA"],
        ["Property Type", "Any Type"],
        ["Price Range", "$1000 - $5000"],
      ].map(([label, val], i) => (
        <div key={label} className={`flex-1 px-4 py-2 md:py-1 flex items-center justify-between ${i < 2 ? "md:border-r border-gray-100" : ""}`}>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">{label}</p>
            <p className="text-[13px] font-semibold" style={{ color: NAVY }}>{val}</p>
          </div>
          <ChevronDown size={16} className="text-gray-300" />
        </div>
      ))}
      <button onClick={onSearch} className="text-white font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 text-[14px] shrink-0" style={{ background: NAVY }}>
        <Search size={16} /> Search
      </button>
    </div>
  );
}

function Hero({ setPage }) {
  return (
    <section className="px-4 pt-6">
      <div className="max-w-[1280px] mx-auto relative rounded-[28px] overflow-hidden h-[560px] md:h-[520px]">
        <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80" alt="Luxury modern villa" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
        <div className="absolute top-6 right-6 bg-white/95 rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2 shadow-md">
          <div className="flex -space-x-2">
            {["1494790108377-be9c29b29330","1507003211169-0a1dd7228f2d","1500648767791-00dcc994a43e"].map((id) => (
              <img key={id} src={`https://images.unsplash.com/photo-${id}?w=60&q=80`} className="w-6 h-6 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <span className="text-[12px] font-semibold" style={{ color: NAVY }}>Trusted by 25K+</span>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-7 md:px-12 max-w-xl">
          <h1 className="text-white font-bold text-[34px] md:text-[46px] leading-[1.08] mb-4">
            Discover Spaces<br />That Feel Like Home
          </h1>
          <p className="text-white/85 text-[15px] mb-6 max-w-sm">
            Find handpicked properties for rent that match your lifestyle and budget.
          </p>
        </div>
        <div className="absolute left-6 right-6 md:left-12 md:right-12 bottom-6">
          <SearchPanel onSearch={() => setPage("listings")} />
        </div>
      </div>
    </section>
  );
}

function TrustFeatures() {
  const items = [
    [HomeIcon, "Verified Properties", "All properties are verified for your peace of mind.", "#EFEBFB", "#5B4FC4"],
    [Shield, "Safe & Secure", "Your safety is our priority in every transaction.", "#E9F1FE", "#2E6FE0"],
    [Headphones, "24/7 Support", "Our team is here to help you anytime, anywhere.", "#E7F6EE", "#2E9E5B"],
    [Sparkles, "Best Price Guarantee", "Get the best deals at the best prices.", "#FDECE3", "#C5622B"],
  ];
  return (
    <section className="px-4 mt-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(([Icon, title, desc, bg, fg]) => (
          <div key={title} className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(27,33,64,0.05)] flex flex-col gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: bg }}>
              <Icon size={19} color={fg} />
            </div>
            <div>
              <p className="font-semibold text-[14px]" style={{ color: NAVY }}>{title}</p>
              <p className="text-[12px] text-gray-400 mt-1 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyChoose({ setPage }) {
  const points = [
    "Wide range of premium rental options",
    "Flexible rent terms & easy agreements",
    "Personalized recommendations",
    "Trusted by thousands of happy clients",
  ];
  return (
    <section className="px-4 mt-16">
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[12px] font-bold tracking-widest text-[#5B4FC4] mb-3">WHY CHOOSE NESTORIA</p>
          <h2 className="text-[32px] md:text-[38px] font-bold leading-tight mb-4" style={{ color: NAVY }}>More Than Just<br />A Property</h2>
          <p className="text-gray-400 text-[15px] mb-6 max-w-md">We offer more than just spaces. We deliver experiences that fit your life and future.</p>
          <div className="flex flex-col gap-3 mb-8">
            {points.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EFEBFB] flex items-center justify-center shrink-0">
                  <Check size={12} color="#5B4FC4" strokeWidth={3} />
                </div>
                <span className="text-[14px] text-gray-600">{p}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setPage("about")} className="text-white font-semibold rounded-xl px-6 py-3 text-[14px]" style={{ background: NAVY }}>Learn More</button>
        </div>
        <div className="rounded-[28px] overflow-hidden h-[380px] md:h-[440px]">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" className="w-full h-full object-cover" alt="Luxury interior" />
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ p, favorites, toggleFav, onView }) {
  const isFav = favorites.includes(p.id);
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(27,33,64,0.05)] overflow-hidden group">
      <div className="relative h-[190px] overflow-hidden">
        <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3">{BadgeForType(p.badge)}</div>
        <button onClick={() => toggleFav(p.id)} className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
          <Heart size={15} fill={isFav ? "#D4537E" : "none"} color={isFav ? "#D4537E" : "#9CA3AF"} />
        </button>
      </div>
      <div className="p-4">
        <p className="font-semibold text-[15px] mb-1" style={{ color: NAVY }}>{p.title}</p>
        <p className="text-[12px] text-gray-400 flex items-center gap-1 mb-3"><MapPin size={12} /> {p.location}</p>
        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
          <span className="flex items-center gap-1"><Bed size={13} /> {p.beds}</span>
          <span className="flex items-center gap-1"><Bath size={13} /> {p.baths}</span>
          <span className="flex items-center gap-1"><Square size={13} /> {p.area} sqft</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-[15px]" style={{ color: NAVY }}>{fmt(p.price)}<span className="text-[12px] font-normal text-gray-400"> / month</span></p>
          <button onClick={() => onView(p.id)} className="text-[12px] font-semibold text-[#5B4FC4]">View Details</button>
        </div>
      </div>
    </div>
  );
}

function FeaturedProperties({ setPage, favorites, toggleFav, onView }) {
  return (
    <section className="px-4 mt-16">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[26px] md:text-[30px] font-bold" style={{ color: NAVY }}>Featured Properties</h2>
          <button onClick={() => setPage("listings")} className="text-[13px] font-semibold text-[#5B4FC4] flex items-center gap-1 shrink-0">
            View All Properties <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PROPERTIES.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} p={p} favorites={favorites} toggleFav={toggleFav} onView={onView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ setPage }) {
  const cols = [
    ["Company", [["About Us", "about"], ["Services", "services"], ["Blog", "blog"], ["Contact", "contact"]]],
    ["Properties", [["All Listings", "listings"], ["Featured", "home"], ["Luxury Homes", "listings"], ["Apartments", "listings"]]],
    ["Support", [["Help Center", "contact"], ["Privacy Policy", "contact"], ["Terms", "contact"], ["FAQ", "contact"]]],
  ];
  return (
    <footer className="mt-20 px-4">
      <div className="max-w-[1280px] mx-auto bg-white rounded-[28px] mt-4 p-8 md:p-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <Logo onClick={() => setPage("home")} />
            <p className="text-[13px] text-gray-400 mt-4 max-w-[220px]">Discover spaces that feel like home, handpicked for your lifestyle.</p>
            <div className="flex gap-2 mt-5">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#F4F2FC] flex items-center justify-center">
                  <Icon size={14} color={NAVY} />
                </div>
              ))}
            </div>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <p className="font-semibold text-[14px] mb-4" style={{ color: NAVY }}>{title}</p>
              <div className="flex flex-col gap-2.5">
                {links.map(([label, key]) => (
                  <button key={label} onClick={() => setPage(key)} className="text-left text-[13px] text-gray-400 hover:text-[#5B4FC4] w-fit">{label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-10 pt-6 text-center">
          <p className="text-[12px] text-gray-400">© 2026 Nestoria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ setPage, favorites, toggleFav, onView }) {
  return (
    <>
      <Hero setPage={setPage} />
      <TrustFeatures />
      <WhyChoose setPage={setPage} />
      <FeaturedProperties setPage={setPage} favorites={favorites} toggleFav={toggleFav} onView={onView} />
    </>
  );
}

function ListingsPage({ favorites, toggleFav, onView }) {
  const [type, setType] = useState("Any Type");
  const [sort, setSort] = useState("Recommended");
  const [page, setPageNum] = useState(1);
  const perPage = 6;

  let list = [...PROPERTIES];
  if (type !== "Any Type") list = list.filter((p) => p.type === type);
  if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
  if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(list.length / perPage);
  const paged = list.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="px-4 pt-10 max-w-[1280px] mx-auto">
      <h1 className="text-[32px] font-bold text-center" style={{ color: NAVY }}>Find Your Perfect Place</h1>
      <p className="text-center text-gray-400 text-[14px] mt-2">Explore handpicked properties designed around your lifestyle.</p>

      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(27,33,64,0.05)] p-4 mt-8 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-[13px] text-gray-400"><SlidersHorizontal size={15} /> Filters</div>
        <select value={type} onChange={(e) => { setType(e.target.value); setPageNum(1); }} className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 outline-none" style={{ color: NAVY }}>
          {["Any Type", "Villa", "Apartment", "House"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 outline-none text-gray-500"><option>Bedrooms</option><option>1+</option><option>2+</option><option>3+</option></select>
        <select className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 outline-none text-gray-500"><option>Bathrooms</option><option>1+</option><option>2+</option><option>3+</option></select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 outline-none" style={{ color: NAVY }}>
          {["Recommended", "Price: Low to High", "Price: High to Low"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => { setType("Any Type"); setSort("Recommended"); setPageNum(1); }} className="text-[13px] font-semibold text-gray-400 ml-auto">Reset Filters</button>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-8">
        {paged.map((p) => <PropertyCard key={p.id} p={p} favorites={favorites} toggleFav={toggleFav} onView={onView} />)}
      </div>

      <div className="flex items-center justify-center gap-2 mt-10 mb-10">
        <button onClick={() => setPageNum(Math.max(1, page - 1))} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center"><ChevronLeft size={15} /></button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => setPageNum(i + 1)} className="w-9 h-9 rounded-xl text-[13px] font-semibold" style={page === i + 1 ? { background: NAVY, color: "white" } : { color: NAVY }}>{i + 1}</button>
        ))}
        <button onClick={() => setPageNum(Math.min(totalPages, page + 1))} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center"><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

function PropertyDetailsPage({ id, favorites, toggleFav, setPage }) {
  const p = PROPERTIES.find((x) => x.id === id) || PROPERTIES[0];
  const [mainImg, setMainImg] = useState(p.img);
  const isFav = favorites.includes(p.id);
  const amenities = ["Swimming Pool", "WiFi", "Parking", "Air Conditioning", "Security", "Garden", "Gym", "Balcony"];

  return (
    <div className="px-4 pt-10 max-w-[1280px] mx-auto">
      <button onClick={() => setPage("listings")} className="text-[13px] text-gray-400 mb-4 flex items-center gap-1"><ChevronLeft size={14} /> Back to listings</button>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="rounded-2xl overflow-hidden h-[380px]">
            <img src={mainImg} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {p.gallery.map((g) => (
              <button key={g} onClick={() => setMainImg(g)} className="rounded-xl overflow-hidden h-[70px]">
                <img src={g} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-start justify-between">
            <div>
              <h1 className="text-[26px] font-bold" style={{ color: NAVY }}>{p.title}</h1>
              <p className="text-gray-400 text-[13px] flex items-center gap-1 mt-1"><MapPin size={13} /> {p.location}</p>
            </div>
            <button onClick={() => toggleFav(p.id)} className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow shrink-0">
              <Heart size={17} fill={isFav ? "#D4537E" : "none"} color={isFav ? "#D4537E" : "#9CA3AF"} />
            </button>
          </div>
          <p className="text-gray-500 text-[14px] leading-relaxed mt-4">{p.desc}</p>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-8 bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
            {[["Bedrooms", p.beds, Bed], ["Bathrooms", p.baths, Bath], ["Area", p.area + " sqft", Square], ["Parking", p.parking, Car], ["Type", p.type, Building2], ["Built", p.year, Calendar]].map(([label, val, Icon]) => (
              <div key={label} className="text-center">
                <Icon size={16} className="mx-auto mb-1" color="#5B4FC4" />
                <p className="text-[12px] font-semibold" style={{ color: NAVY }}>{val}</p>
                <p className="text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          <p className="font-semibold text-[16px] mt-8 mb-4" style={{ color: NAVY }}>Amenities</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {amenities.map((a) => {
              const Icon = AMENITY_ICONS[a] || Check;
              return (
                <div key={a} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
                  <Icon size={14} color="#5B4FC4" /><span className="text-[12px] text-gray-500">{a}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(27,33,64,0.08)] p-6 md:sticky md:top-28">
            <p className="text-[24px] font-bold" style={{ color: NAVY }}>{fmt(p.price)}<span className="text-[13px] font-normal text-gray-400"> / month</span></p>
            <div className="flex flex-col gap-3 mt-5">
              <button className="text-white font-semibold rounded-xl py-3 text-[14px]" style={{ background: NAVY }}>Schedule a Visit</button>
              <button className="border border-gray-200 font-semibold rounded-xl py-3 text-[14px]" style={{ color: NAVY }}>Contact Agent</button>
              <button className="bg-[#EFEBFB] text-[#5B4FC4] font-semibold rounded-xl py-3 text-[14px]">Apply Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FavoritesPage({ favorites, toggleFav, onView }) {
  const list = PROPERTIES.filter((p) => favorites.includes(p.id));
  return (
    <div className="px-4 pt-10 max-w-[1280px] mx-auto min-h-[400px]">
      <h1 className="text-[28px] font-bold" style={{ color: NAVY }}>Your Favorites</h1>
      <p className="text-gray-400 text-[14px] mt-1">Properties you've saved for later.</p>
      {list.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 text-[14px]">No favorites yet. Tap the heart on any property to save it here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-8">
          {list.map((p) => <PropertyCard key={p.id} p={p} favorites={favorites} toggleFav={toggleFav} onView={onView} />)}
        </div>
      )}
    </div>
  );
}

function ServicesPage() {
  const services = [
    [HomeIcon, "Property Rental", "Find handpicked rentals that match your lifestyle and budget."],
    [Building2, "Property Buying", "Guided support from search to closing on your next home."],
    [Settings, "Property Management", "Full-service management for owners, hands-off and worry-free."],
    [Users, "Real Estate Consultation", "One-on-one advice tailored to your goals and market."],
    [Sparkles, "Investment Guidance", "Data-backed insight into high-potential rental markets."],
    [MapPin, "Relocation Assistance", "Smooth moves across cities, handled start to finish."],
  ];
  return (
    <div className="px-4 pt-10 max-w-[1280px] mx-auto">
      <h1 className="text-[32px] font-bold text-center" style={{ color: NAVY }}>Our Services</h1>
      <p className="text-center text-gray-400 text-[14px] mt-2 max-w-md mx-auto">Everything you need for your next move, under one roof.</p>
      <div className="grid md:grid-cols-3 gap-6 mt-10 mb-10">
        {services.map(([Icon, title, desc]) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
            <div className="w-12 h-12 rounded-full bg-[#EFEBFB] flex items-center justify-center mb-4"><Icon size={20} color="#5B4FC4" /></div>
            <p className="font-semibold text-[16px] mb-2" style={{ color: NAVY }}>{title}</p>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-4">{desc}</p>
            <button className="text-[13px] font-semibold text-[#5B4FC4] flex items-center gap-1">Learn More <ArrowRight size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogPage() {
  const posts = [
    ["How to Choose the Perfect Home", "Buying Tips", "Jul 12, 2026", "A practical checklist for narrowing down your search without losing sight of what matters.", "1512917774080-9991f1c4c750"],
    ["5 Things to Check Before Renting a Property", "Renting", "Jul 3, 2026", "The small details that save renters from big headaches down the line.", "1600585154340-be6161a56a0c"],
    ["Best Cities for Real Estate Investment", "Investment", "Jun 21, 2026", "Where yields and lifestyle appeal are both trending upward this year.", "1570129477492-45c003edd2be"],
    ["Modern Home Design Trends for 2026", "Design", "Jun 9, 2026", "From warm minimalism to biophilic details, what's shaping new builds.", "1600596542815-ffad4c1539a9"],
  ];
  return (
    <div className="px-4 pt-10 max-w-[1280px] mx-auto">
      <h1 className="text-[32px] font-bold text-center" style={{ color: NAVY }}>Nestoria Journal</h1>
      <p className="text-center text-gray-400 text-[14px] mt-2">Insights and stories from the world of real estate.</p>
      <div className="grid md:grid-cols-2 gap-6 mt-10 mb-10">
        {posts.map(([title, cat, date, desc, img]) => (
          <div key={title} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
            <img src={`https://images.unsplash.com/photo-${img}?w=800&q=80`} className="w-full h-[200px] object-cover" />
            <div className="p-5">
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                <Badge tone="purple">{cat}</Badge><span>{date}</span>
              </div>
              <p className="font-semibold text-[16px] mb-2" style={{ color: NAVY }}>{title}</p>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-3">{desc}</p>
              <button className="text-[13px] font-semibold text-[#5B4FC4] flex items-center gap-1">Read More <ArrowRight size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  const stats = [["25K+", "Happy Clients"], ["8K+", "Properties"], ["50+", "Cities"], ["98%", "Satisfaction"]];
  return (
    <div className="px-4 pt-10 max-w-[1280px] mx-auto">
      <h1 className="text-[30px] md:text-[36px] font-bold text-center max-w-xl mx-auto" style={{ color: NAVY }}>Making Every Space Feel Like Home</h1>
      <div className="grid md:grid-cols-2 gap-10 items-center mt-10">
        <div className="rounded-[28px] overflow-hidden h-[360px]">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-4">Nestoria started with a simple belief: finding a home should feel exciting, not exhausting. We built a platform that pairs handpicked listings with genuine, human support, so every move feels considered rather than rushed.</p>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-4"><span className="font-semibold" style={{ color: NAVY }}>Our mission </span>is to connect people with spaces that truly fit their lives. <span className="font-semibold" style={{ color: NAVY }}>Our vision </span>is a rental market built on trust, transparency, and genuine care.</p>
          <p className="text-[14px] text-gray-500 leading-relaxed">Clients stay with us because we verify every listing, respond quickly, and treat every move like it's our own.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 mb-14">
        {stats.map(([num, label]) => (
          <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
            <p className="text-[26px] font-bold" style={{ color: NAVY }}>{num}</p>
            <p className="text-[12px] text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <div className="px-4 pt-10 max-w-[1280px] mx-auto">
      <h1 className="text-[32px] font-bold text-center" style={{ color: NAVY }}>Get in Touch</h1>
      <p className="text-center text-gray-400 text-[14px] mt-2">We'd love to help you find your next home.</p>
      <div className="grid md:grid-cols-2 gap-8 mt-10 mb-14">
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(27,33,64,0.05)] flex flex-col gap-3">
          {sent && <div className="bg-[#E7F6EE] text-[#2E9E5B] text-[13px] rounded-xl px-4 py-2.5">Message sent. We'll get back to you shortly.</div>}
          <input required value={form.name} onChange={set("name")} placeholder="Your name" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
          <input required type="email" value={form.email} onChange={set("email")} placeholder="Email address" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
          <input value={form.phone} onChange={set("phone")} placeholder="Phone number" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
          <input value={form.subject} onChange={set("subject")} placeholder="Subject" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
          <textarea required value={form.message} onChange={set("message")} placeholder="Your message" rows={4} className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none resize-none" />
          <button className="text-white font-semibold rounded-xl py-3 text-[14px] mt-1" style={{ background: NAVY }}>Send Message</button>
        </form>
        <div className="flex flex-col gap-4">
          {[[Mail, "Email", "hello@nestoria.com"], [Phone, "Phone", "+1 (415) 555-0134"], [MapPin, "Office Address", "128 Harbor View St, San Francisco, CA"], [Clock, "Working Hours", "Mon–Fri, 9am – 6pm"]].map(([Icon, label, val]) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(27,33,64,0.05)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EFEBFB] flex items-center justify-center shrink-0"><Icon size={16} color="#5B4FC4" /></div>
              <div><p className="text-[12px] text-gray-400">{label}</p><p className="text-[13px] font-semibold" style={{ color: NAVY }}>{val}</p></div>
            </div>
          ))}
          <div className="bg-white rounded-2xl h-[160px] shadow-[0_2px_16px_rgba(27,33,64,0.05)] flex items-center justify-center">
            <p className="text-[12px] text-gray-300 flex items-center gap-2"><MapPin size={14} /> Map preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthCard({ title, children }) {
  return (
    <div className="px-4 py-16 max-w-[440px] mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(27,33,64,0.07)] p-8">
        <h1 className="text-[22px] font-bold text-center mb-6" style={{ color: NAVY }}>{title}</h1>
        {children}
      </div>
    </div>
  );
}

function LoginPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await loginWithEmail(email, password);
      setPage("dashboard");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError(""); setLoading(true);
    try {
      await loginWithGoogle();
      setPage("dashboard");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back">
      <form onSubmit={submit} className="flex flex-col gap-3">
        {error && <div className="bg-[#FCEBEB] text-[#A32D2D] text-[12px] rounded-xl px-4 py-2.5">{error}</div>}
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
        <button disabled={loading} type="submit" className="text-white font-semibold rounded-xl py-3 text-[14px] mt-1 flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: NAVY }}>
          {loading && <LoaderCircle size={15} className="animate-spin" />} Log In
        </button>
        <button disabled={loading} type="button" onClick={google} className="border border-gray-200 font-semibold rounded-xl py-3 text-[13px] flex items-center justify-center gap-2 disabled:opacity-60" style={{ color: NAVY }}>Continue with Google</button>
        <p className="text-center text-[12px] text-gray-400 mt-2">Don't have an account? <button type="button" onClick={() => setPage("register")} className="text-[#5B4FC4] font-semibold">Sign up</button></p>
      </form>
    </AuthCard>
  );
}

function RegisterPage({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6) { setError("Password should be at least 6 characters."); return; }
    setLoading(true);
    try {
      await registerWithEmail(name, email, password);
      setPage("dashboard");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError(""); setLoading(true);
    try {
      await loginWithGoogle();
      setPage("dashboard");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create your account">
      <form onSubmit={submit} className="flex flex-col gap-3">
        {error && <div className="bg-[#FCEBEB] text-[#A32D2D] text-[12px] rounded-xl px-4 py-2.5">{error}</div>}
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
        <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className="border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none" />
        <button disabled={loading} type="submit" className="text-white font-semibold rounded-xl py-3 text-[14px] mt-1 flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: NAVY }}>
          {loading && <LoaderCircle size={15} className="animate-spin" />} Create Account
        </button>
        <button disabled={loading} type="button" onClick={google} className="border border-gray-200 font-semibold rounded-xl py-3 text-[13px] disabled:opacity-60" style={{ color: NAVY }}>Continue with Google</button>
        <p className="text-center text-[12px] text-gray-400 mt-2">Already have an account? <button type="button" onClick={() => setPage("login")} className="text-[#5B4FC4] font-semibold">Log in</button></p>
      </form>
    </AuthCard>
  );
}

function friendlyAuthError(err) {
  const code = err?.code || "";
  if (code.includes("email-already-in-use")) return "That email is already registered. Try logging in instead.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "Incorrect email or password.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("popup-closed-by-user")) return "Google sign-in was closed before finishing.";
  if (code.includes("invalid-email")) return "That email address doesn't look right.";
  return "Something went wrong. Please try again.";
}

function DashboardPage({ setPage, favorites, currentUser, onLogout, favoritesList, toggleFav, onView }) {
  const [tab, setTab] = useState("Dashboard");
  const items = ["Dashboard", "Favorites", "My Inquiries", "Scheduled Visits", "Profile", "Logout"];

  if (!currentUser) {
    return (
      <div className="px-4 pt-16 max-w-[1280px] mx-auto text-center pb-16">
        <p className="text-[18px] font-semibold mb-2" style={{ color: NAVY }}>You're not logged in</p>
        <p className="text-[13px] text-gray-400 mb-6">Log in to see your dashboard, saved properties, and inquiries.</p>
        <button onClick={() => setPage("login")} className="text-white font-semibold rounded-xl px-6 py-3 text-[14px]" style={{ background: NAVY }}>Log In</button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-10 max-w-[1280px] mx-auto grid md:grid-cols-4 gap-6 mb-14">
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_16px_rgba(27,33,64,0.05)] h-fit flex md:flex-col gap-1 overflow-x-auto">
        {items.map((it) => (
          <button key={it} onClick={() => it === "Logout" ? onLogout() : setTab(it)}
            className="text-left px-4 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap"
            style={tab === it ? { background: "#EFEBFB", color: "#5B4FC4" } : { color: "#6B7280" }}>
            {it}
          </button>
        ))}
      </div>
      <div className="md:col-span-3">
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(27,33,64,0.05)] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EFEBFB] flex items-center justify-center"><User size={20} color="#5B4FC4" /></div>
            <div>
              <p className="font-semibold text-[16px]" style={{ color: NAVY }}>Welcome back{currentUser.displayName ? `, ${currentUser.displayName}` : ""}!</p>
              <p className="text-[12px] text-gray-400">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {tab === "Dashboard" && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[["Saved Properties", favorites.length], ["Inquiries", 0], ["Scheduled Visits", 0]].map(([label, val]) => (
                <div key={label} className="bg-white rounded-2xl p-5 text-center shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
                  <p className="text-[22px] font-bold" style={{ color: NAVY }}>{val}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
              <p className="font-semibold text-[14px] mb-3" style={{ color: NAVY }}>Recent activity</p>
              <p className="text-[13px] text-gray-400">No recent activity yet. Explore listings to get started.</p>
              <button onClick={() => setPage("listings")} className="text-white font-semibold rounded-xl px-5 py-2.5 text-[13px] mt-4" style={{ background: NAVY }}>Browse Listings</button>
            </div>
          </>
        )}

        {tab === "Favorites" && (
          favoritesList.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
              <p className="text-[13px] text-gray-400">No saved properties yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {favoritesList.map((p) => <PropertyCard key={p.id} p={p} favorites={favorites} toggleFav={toggleFav} onView={onView} />)}
            </div>
          )
        )}

        {(tab === "My Inquiries" || tab === "Scheduled Visits") && (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0_2px_16px_rgba(27,33,64,0.05)]">
            <p className="text-[13px] text-gray-400">Nothing here yet.</p>
          </div>
        )}

        {tab === "Profile" && (
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(27,33,64,0.05)] flex flex-col gap-3 max-w-md">
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Name</p>
              <p className="text-[14px] font-medium" style={{ color: NAVY }}>{currentUser.displayName || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Email</p>
              <p className="text-[14px] font-medium" style={{ color: NAVY }}>{currentUser.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPageRaw] = useState("home");
  const [selectedId, setSelectedId] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const setPage = (p) => { setPageRaw(p); window.scrollTo?.({ top: 0, behavior: "smooth" }); };
  const onView = (id) => { setSelectedId(id); setPage("details"); };

  // Watch Firebase auth state; when a user logs in, pull their saved
  // favorites from Firestore (users/{uid}.favorites).
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        try {
          const remote = await fetchFavorites(user.uid);
          setFavorites(remote);
        } catch {
          // Firestore read failed (e.g. rules not set up yet) — keep local state
        }
      } else {
        setFavorites([]);
      }
    });
    return () => unsub();
  }, []);

  const toggleFav = (id) => {
    setFavorites((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      if (currentUser) saveFavorites(currentUser.uid, next).catch(() => {});
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    setPage("home");
  };

  const favoritesList = PROPERTIES.filter((p) => favorites.includes(p.id));

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }} className="min-h-screen bg-[#F8F7FA] pb-4">
      <Navbar page={page} setPage={setPage} favCount={favorites.length} currentUser={currentUser} onLogout={handleLogout} />
      {page === "home" && <HomePage setPage={setPage} favorites={favorites} toggleFav={toggleFav} onView={onView} />}
      {page === "listings" && <ListingsPage favorites={favorites} toggleFav={toggleFav} onView={onView} />}
      {page === "details" && <PropertyDetailsPage id={selectedId} favorites={favorites} toggleFav={toggleFav} setPage={setPage} />}
      {page === "favorites" && <FavoritesPage favorites={favorites} toggleFav={toggleFav} onView={onView} />}
      {page === "services" && <ServicesPage />}
      {page === "blog" && <BlogPage />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}
      {page === "login" && (currentUser ? <DashboardPage setPage={setPage} favorites={favorites} currentUser={currentUser} onLogout={handleLogout} favoritesList={favoritesList} toggleFav={toggleFav} onView={onView} /> : <LoginPage setPage={setPage} />)}
      {page === "register" && (currentUser ? <DashboardPage setPage={setPage} favorites={favorites} currentUser={currentUser} onLogout={handleLogout} favoritesList={favoritesList} toggleFav={toggleFav} onView={onView} /> : <RegisterPage setPage={setPage} />)}
      {page === "dashboard" && <DashboardPage setPage={setPage} favorites={favorites} currentUser={currentUser} onLogout={handleLogout} favoritesList={favoritesList} toggleFav={toggleFav} onView={onView} />}
      <Footer setPage={setPage} />
    </div>
  );
}
