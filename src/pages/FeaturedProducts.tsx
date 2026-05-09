import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Package, Leaf, X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  tagline: string;
  tag: string;
  cardImage: string;
  images: string[];
  description: string;
  features: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 'z-panel-roofing',
    name: 'Z Panel Roofing',
    tagline: 'High-performance recycled roofing panels',
    tag: 'Industrial Grade',
    cardImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=80&w=900',
    ],
    description: 'TechzGreen\'s Z Panel Roofing is engineered from 100% recycled Multi-Layer Plastic (MLP) for exceptional strength and durability. Designed for tough industrial and commercial applications, these panels withstand extreme weather conditions while delivering unmatched longevity. A direct, eco-friendly replacement for conventional roofing materials.',
    features: [
      'Exceptional load-bearing capacity',
      'Weatherproof & UV resistant',
      'Made from 100% recycled MLP plastic',
      'Waterproof, pest-proof & fungus-resistant',
      'Low maintenance — lasts decades',
    ],
  },
  {
    id: 'z-board',
    name: 'Z Board',
    tagline: 'Versatile recycled boards for flooring & partitions',
    tag: 'Multi-Use',
    cardImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=900',
    ],
    description: 'Z Boards are high-density flat panels manufactured from recycled plastic, suitable for flooring, ceiling boards, wall partitions, TV units, and custom interior applications. High-density construction ensures structural integrity while remaining lightweight enough for easy installation.',
    features: [
      'High-density, lightweight construction',
      'Suitable for flooring, ceiling & partitions',
      'Termite-proof & moisture-resistant',
      'Customisable sizes & thickness',
      '100% recycled plastic — zero virgin material',
    ],
  },
  {
    id: 'school-furniture',
    name: 'School Furniture',
    tagline: 'Durable eco-friendly benches & desks for institutions',
    tag: 'Institutional',
    cardImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=900',
    ],
    description: 'Built for schools, colleges, and institutions — TechzGreen\'s school furniture range includes benches, desks, and tables crafted entirely from recycled plastic. Resistant to scratches, moisture, and pests, these pieces outlast conventional wood furniture at a fraction of the environmental cost.',
    features: [
      'Scratch-resistant surface',
      'No splinters — safe for children',
      'Pest-proof & fungus-resistant',
      'Easy to clean & maintain',
      'Ideal for classrooms & common areas',
    ],
  },
  {
    id: 'outdoor-furniture',
    name: 'Outdoor Furniture',
    tagline: 'Weather-ready benches & tables for public spaces',
    tag: 'Outdoor',
    cardImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900',
    ],
    description: 'Parks, gardens, bus stops, and public plazas — TechzGreen\'s outdoor furniture is engineered to thrive in Kerala\'s humid tropical climate. Crafted from recycled MLP plastic, these benches and tables never rot, rust, or require repainting, making them the lowest-maintenance outdoor solution available.',
    features: [
      'Fully weatherproof — rain, humidity & sun',
      'No painting or treatment required',
      'Anti-corrosion & rust-free',
      'Heavy-duty load capacity',
      'Ideal for parks, campuses & public spaces',
    ],
  },
  {
    id: 'z-momento',
    name: 'Z Momento',
    tagline: 'Premium eco trophies & corporate gifts',
    tag: 'Premium Eco Trophy',
    cardImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&q=80&w=900',
    ],
    description: 'Z Momento is a premium, eco-friendly trophy and memento handcrafted from recycled plastic and MLP waste. Elegant modern design carries a powerful sustainability message — awarded at corporate events, recognition ceremonies, or given as a thoughtful corporate gift. Every piece tells a story of circular economy in action.',
    features: [
      'Premium finish — looks & feels luxurious',
      '100% recycled plastic construction',
      'Custom branding & engraving available',
      'Ideal for corporate events & awards',
      'Sustainable alternative to conventional trophies',
    ],
  },
  {
    id: 'custom-products',
    name: 'Custom Products',
    tagline: 'Bespoke recycled plastic solutions for any need',
    tag: 'Custom',
    cardImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=80&w=900',
    ],
    description: 'Beyond our standard range, TechzGreen manufactures fully custom recycled plastic products to specification — from TV units and display stands to signage boards and partition systems. Share your requirements and our engineering team will design a solution that meets your functional, aesthetic, and sustainability goals.',
    features: [
      'Fully custom dimensions & design',
      'Any colour or surface finish',
      'Bulk manufacturing capability',
      'Engineering consultation included',
      'Corporate & institutional orders welcome',
    ],
  },
];

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black">
      <img
        src={images[idx]}
        alt={`${name} ${idx + 1}`}
        className="w-full h-72 sm:h-96 object-cover transition-opacity duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function FeaturedProducts() {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <div className="fade-in pb-28 sm:pb-20">
      <Helmet>
        <title>Featured Products – TechzGreen</title>
        <meta name="description" content="TechzGreen's flagship products crafted from recycled plastic for a sustainable future." />
        <link rel="canonical" href="https://techzgreen.in/featured-products" />
        <meta property="og:title" content="Featured Products – TechzGreen" />
        <meta property="og:description" content="Explore TechzGreen's signature eco-products built from recycled plastic." />
        <meta property="og:url" content="https://techzgreen.in/featured-products" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ── Header ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="section-label inline-flex mb-4"><Package className="w-3.5 h-3.5" />Our Products</span>
          <h1 className="text-3xl lg:text-4xl font-black text-[#1a3d1f] mt-4">Signature Eco-Products</h1>
          <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Six flagship products. One mission — turn plastic waste into lasting value.</p>
        </div>
      </section>

      {/* ── Product Card Grid ── */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(product => (
              <button
                key={product.id}
                onClick={() => setSelected(product)}
                className="glass-card overflow-hidden text-left group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="overflow-hidden">
                  <img
                    src={product.cardImage}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-[#2e7d32] bg-[rgba(46,125,50,0.1)] px-2.5 py-1 rounded-full border border-[rgba(46,125,50,0.2)]">
                    {product.tag}
                  </span>
                  <h3 className="text-lg font-black text-[#1a3d1f] mt-3 mb-1">{product.name}</h3>
                  <p className="text-[#5f7a60] text-sm leading-relaxed">{product.tagline}</p>
                  <span className="inline-block mt-4 text-xs font-bold text-[#2e7d32] group-hover:underline">
                    View details →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 bg-[rgba(46,125,50,0.03)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label inline-flex mb-4"><Leaf className="w-3.5 h-3.5" />Why It Matters</span>
            <h2 className="text-3xl font-black text-[#1a3d1f] mt-4">Every Product = Plastic Diverted from Landfills</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { val: '100%', label: 'Recycled MLP plastic', sub: 'No virgin plastic used in manufacturing' },
              { val: '32+', label: 'Years of expertise', sub: 'Pioneering plastic recycling since day one' },
              { val: '4.5T', label: 'Waste collected', sub: 'And growing with every community member' },
            ].map(({ val, label, sub }) => (
              <div key={label} className="glass-card p-8 text-center">
                <p className="text-4xl font-black text-[#2e7d32] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{val}</p>
                <p className="font-bold text-[#1a3d1f] text-sm mb-1">{label}</p>
                <p className="text-[#5f7a60] text-xs leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:rounded-2xl rounded-t-2xl overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <div className="sticky top-0 z-10 bg-white flex justify-between items-center px-6 py-4 border-b border-[rgba(46,125,50,0.1)]">
              <span className="text-xs font-bold text-[#2e7d32] bg-[rgba(46,125,50,0.1)] px-2.5 py-1 rounded-full border border-[rgba(46,125,50,0.2)]">
                {selected.tag}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg bg-[rgba(46,125,50,0.08)] hover:bg-[rgba(46,125,50,0.15)] text-[#5f7a60] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Carousel */}
              <ImageCarousel images={selected.images} name={selected.name} />

              {/* Info */}
              <div>
                <h2 className="text-2xl font-black text-[#1a3d1f] mb-2">{selected.name}</h2>
                <p className="text-[#5f7a60] leading-relaxed text-sm">{selected.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-black text-[#1a3d1f] mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {selected.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#2d4a30]">
                      <CheckCircle className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selected.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${selected.name} ${i + 1}`}
                    className="w-20 h-16 object-cover rounded-lg shrink-0 border-2 border-transparent hover:border-[#2e7d32] transition-colors cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
