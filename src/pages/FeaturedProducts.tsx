import { useState } from 'react';
import zCeil2 from '../assets/z ceiling/2.webp';
import zCeil3 from '../assets/z ceiling/3.jpg';
import zCeil18 from '../assets/z ceiling/18.webp';
import zCeil19 from '../assets/z ceiling/19.jpg';
import zCeil22 from '../assets/z ceiling/22.jpeg';
import zPanel1 from '../assets/Z panel/1.png';
import zPanel2 from '../assets/Z panel/2.png';
import zPanel4 from '../assets/Z panel/4.png';
import zPanel5 from '../assets/Z panel/5.jpeg';
import zPanel6 from '../assets/Z panel/6.jpeg';
import zPanel7 from '../assets/Z panel/7.png';
import zPanel8 from '../assets/Z panel/8.jpeg';
import zRoof1 from '../assets/Z roofing/1.png';
import zRoof2 from '../assets/Z roofing/2.jpeg';
import zRoof3 from '../assets/Z roofing/3.png';
import zRoof4 from '../assets/Z roofing/4.png';
import zRoof5 from '../assets/Z roofing/5.jpeg';
import zRoof6 from '../assets/Z roofing/6.jpeg';
import zPole1 from '../assets/Z pole/15050w-1000x638.png';
import zPole2 from '../assets/Z pole/cyruPLQslnd2euc3tZ00XY1TWtOFRATB1662037381.jpeg';
import zPole3 from '../assets/Z pole/images (10).jpeg';
import zPole4 from '../assets/Z pole/images (11).jpeg';
import zPole5 from '../assets/Z pole/recycled-lumber-250x250.jpg.jpeg';
import zPole6 from '../assets/Z pole/Substructure3_1823ec89-d183-48ef-ad8c-4439e822278e.jpg.jpeg';
import zPallet1 from '../assets/z pallet/1.jpeg';
import zPallet2 from '../assets/z pallet/2.jpeg';
import zPallet3 from '../assets/z pallet/3.png';
import productsBanner from '../assets/products.png';
import zMomento1 from '../assets/Z momento/images (12).jpeg';
import zMomento2 from '../assets/Z momento/images (13).jpeg';
import { Helmet } from 'react-helmet-async';
import { Package, ChevronLeft, ChevronRight, Play, X, Star, Link as LinkIcon, Info } from 'lucide-react';
import { ZLeaf } from '../components/ZLeaf';

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
    cardImage: zPanel1,
    images: [zPanel1, zPanel2, zPanel4, zPanel5, zPanel6, zPanel7, zPanel8],
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
    id: 'z-ceiling-panel',
    name: 'Z Ceiling Panel',
    tagline: 'Smart, waterproof ceiling panels for high-moisture spaces',
    tag: 'New',
    cardImage: zCeil2,
    images: [zCeil2, zCeil3, zCeil18, zCeil19, zCeil22],
    description: 'Z Ceiling Panel is a smart, durable, and eco-friendly ceiling solution made from advanced Z Panel technology. Designed for modern interiors, these panels excel in high-moisture environments — washrooms, kitchens, utility spaces, offices, and commercial interiors. Available in 2ft × 2ft with 3mm & 4mm thickness in an elegant white-grey mixed finish. Unlike conventional ceiling materials, Z Ceiling Panels never absorb water, warp, rust, or decay. Manufactured from recycled and sustainable materials for minimal environmental impact.',
    features: [
      '100% Waterproof — ideal for washrooms & kitchens',
      '100% Pest proof, termite free & fungus free',
      'Size: 2ft × 2ft | Thickness: 3mm & 4mm',
      'White-grey mixed finish — clean premium look',
      'Flexible, lightweight & easy to install',
      'Reusable, long lasting & eco-friendly',
      'Customization available',
    ],
  },
  {
    id: 'z-roofing',
    name: 'Z Roofing',
    tagline: 'Durable recycled roofing sheets for any structure',
    tag: 'Weatherproof',
    cardImage: zRoof1,
    images: [zRoof1, zRoof2, zRoof3, zRoof4, zRoof5, zRoof6],
    description: 'Z Roofing sheets deliver long-lasting weather protection for residential, agricultural, and industrial structures. Made from 100% recycled plastic, they resist corrosion, UV degradation, and extreme heat — outperforming conventional metal and fibre sheets while keeping interiors cooler.',
    features: [
      'UV-stable & corrosion-free',
      'Lightweight — easy to install',
      'Heat-reflective surface keeps interiors cool',
      '100% recycled plastic construction',
      'Long service life with zero rust',
    ],
  },
  {
    id: 'z-pole',
    name: 'Z Pole',
    tagline: 'Recycled plastic poles for fencing & support',
    tag: 'Structural',
    cardImage: zPole1,
    images: [zPole1, zPole2, zPole3, zPole4, zPole5, zPole6],
    description: 'Z Poles are heavy-duty recycled plastic posts engineered for fencing, signage, marine docks, and outdoor support structures. Unlike timber, they never rot or splinter; unlike steel, they never rust. A truly maintenance-free alternative for outdoor installations.',
    features: [
      'Rot-proof, rust-proof & termite-free',
      'No painting or sealing required',
      'Available in multiple lengths & diameters',
      'Ideal for fencing, signage & marine use',
      '100% recycled plastic — never warps',
    ],
  },
  {
    id: 'z-pallet',
    name: 'Z Pallet',
    tagline: 'Heavy-duty logistics pallets from recycled plastic',
    tag: 'Industrial',
    cardImage: zPallet1,
    images: [zPallet1, zPallet2, zPallet3],
    description: 'Z Pallets are robust, hygienic, and reusable logistics pallets manufactured from recycled plastic. Built to handle warehouse, food, pharma, and export operations, they replace traditional wooden pallets with a moisture-proof, pest-free, and fully recyclable alternative.',
    features: [
      'High load capacity for industrial use',
      'Moisture-proof & easy to sanitize',
      'Pest-free — no fumigation required',
      'Reusable & 100% recyclable',
      'Suitable for export & food-grade logistics',
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
    id: 'z-momento',
    name: 'Z Momento',
    tagline: 'Premium eco trophies & corporate gifts',
    tag: 'Premium Eco Trophy',
    cardImage: zMomento1,
    images: [zMomento1, zMomento2],
    description: 'Z Momento is a premium, eco-friendly trophy and memento handcrafted from recycled plastic and MLP waste. Elegant modern design carries a powerful sustainability message — awarded at corporate events, recognition ceremonies, or given as a thoughtful corporate gift. Every piece tells a story of circular economy in action.',
    features: [
      'Premium finish — looks & feels luxurious',
      '100% recycled plastic construction',
      'Custom branding & engraving available',
      'Ideal for corporate events & awards',
      'Sustainable alternative to conventional trophies',
    ],
  },
];

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="w-full h-72 sm:h-96">
        <img
          src={images[idx]}
          alt={`${name} ${idx + 1}`}
          className="w-full h-full object-contain bg-transparent transition-opacity duration-300"
        />
      </div>
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
          <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Seven flagship products. One mission — turn plastic waste into lasting value.</p>
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
                <div className="overflow-hidden h-56">
                  <img
                    src={product.cardImage}
                    alt={product.name}
                    className="w-full h-full object-contain bg-transparent group-hover:scale-105 transition-transform duration-300"
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
            <span className="section-label inline-flex mb-4"><ZLeaf className="w-3.5 h-3.5" color="green" />Why It Matters</span>
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

      {/* ── Products Banner ── */}
      <section className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <img
            src={productsBanner}
            alt="TechzGreen products"
            className="w-full h-auto rounded-2xl object-contain"
          />
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
