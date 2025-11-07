import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import products from "../data/products";

export default function Home({ favorites, toggleFav }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filtered = products.filter((p) => {
    const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !filters.category || p.category === filters.category;
    const matchesColor = !filters.color || p.color === filters.color;
    const matchesSize = !filters.size || p.size.includes(filters.size);
    const matchesPrice =
      !filters.maxPrice || p.price <= parseInt(filters.maxPrice);
    const matchesDiscount =
      !filters.minDiscount || p.discount >= parseInt(filters.minDiscount);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesColor &&
      matchesSize &&
      matchesPrice &&
      matchesDiscount
    );
  });


  const sorted = [...filtered].sort((a, b) => {
    if (!sortOption) return 0;

    if (sortOption === "newest") {
      return sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }

    return sortOrder === "asc"
      ? a[sortOption] - b[sortOption]
      : b[sortOption] - a[sortOption];
  });

  const firstFour = sorted.slice(0, 4);

  const brands = [
    "Zara", "H&M", "New Yorker", "Waikiki", "Mango", "Nike", "Adidas",
    "Uniqlo", "Puma", "Levis","Zara", "H&M", "New Yorker", "Waikiki", "Mango", "Nike", "Adidas",
    "Uniqlo", "Puma", "Levis","Zara", "H&M", "New Yorker", "Waikiki", "Mango", "Nike", "Adidas",
    "Uniqlo", "Puma", "Levis","Zara", "H&M", "New Yorker", "Waikiki", "Mango", "Nike", "Adidas",
    "Uniqlo", "Puma", "Levis","Zara", "H&M", "New Yorker", "Waikiki", "Mango", "Nike", "Adidas",
    "Uniqlo", "Puma", "Levis","Zara", "H&M", "New Yorker", "Waikiki", "Mango", "Nike", "Adidas",
    "Uniqlo", "Puma", "Levis"
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between
                      bg-gray-900 text-white h-[500px] md:h-[600px] px-6 md:px-20
                      relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/splash.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.8
          }}
        ></div>

        <div className="absolute inset-0 bg-gray-900/70"></div>

        <div className="relative z-10 md:w-1/2 mt-6 md:mt-0 md:ml-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">ReStyle</h1>
          <p className="text-xl md:text-2xl font-medium">
            "Where fashion meets savings."
          </p>
        </div>
      </div>

      <div className="overflow-hidden py-6 bg-gray-50 relative">
  <div className="flex gap-8 whitespace-nowrap animate-marquee-fast">
    {brands.concat(brands).map((b, i) => (
      <div
        key={i}
        className="px-6 py-3 bg-white shadow rounded-full font-bold text-gray-900 flex-shrink-0
                   transform transition-transform duration-300 hover:scale-140"
      >
        {b}
      </div>
    ))}
  </div>
</div>



      <div className="flex flex-wrap justify-center items-center gap-3 my-6 px-4 md:px-20">
        <input
          type="text"
          placeholder="Search items..."
          className="border p-2 rounded w-full md:w-1/2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
          onClick={() => setFilterOpen(true)}
        >
          Filters
        </button>

        <div className="flex items-center border rounded">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border-none p-2 rounded-l outline-none bg-white"
          >
            <option value="">Sort by</option>
            <option value="price">Price</option>
            <option value="discount">Discount</option>
            <option value="newest">Newest</option>
          </select>

          <button
            onClick={toggleSortOrder}
            className="px-3 bg-gray-100 hover:bg-gray-200 rounded-r transition"
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>


      {filterOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/3 relative">
            <button
              onClick={() => setFilterOpen(false)}
              className="absolute top-2 right-2 text-gray-500 font-bold"
            >
              ×
            </button>
            <Filters
              filters={filters}
              setFilters={setFilters}
              close={() => setFilterOpen(false)}
            />
          </div>
        </div>
      )}


      {["Hot", "New", "Top Sales", "Biggest Discount"].map((section, idx) => (
        <div key={idx} className="my-8 px-4 md:px-20">
          <h2 className="text-2xl font-bold mb-4">{section}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {firstFour.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                onToggleFav={toggleFav}
                isFav={favorites.includes(p.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


