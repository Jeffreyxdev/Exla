import React,{useState, useEffect} from 'react'
import { categories } from '../Constant';

const Search = () => {
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState({
    location: "",
    price: "",
    date: "",
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Find Events</h2>
      <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "10px" }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            style={{
              textAlign: "center",
              cursor: "pointer",
              padding: "10px",
              border: selectedCategory === cat.id ? "2px solid black" : "1px solid lightgray",
              borderRadius: "10px",
              minWidth: "100px",
            }}
          >
            <div style={{ fontSize: "24px", opacity:"80%" }}>{cat.icon}</div>
            <p style={{ fontSize: "14px", margin: "5px 0" }}>{cat.name}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
          <option value="">Nigeria</option>
          <option value="lagos">Lagos</option>
          <option value="abuja">Abuja</option>
          <option value="port-harcourt">Port Harcourt</option>
        </select>

        <select
          value={filters.price}
          onChange={(e) => handleFilterChange("price", e.target.value)}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
          <option value="">Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          style={{ padding: "10px", borderRadius: "5px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>{categories.find((cat) => cat.id === selectedCategory).name}</h3>
        {/* Here you'd show filtered event results */}
        <p>{categories.entries} events found</p>{/*add number of total events from database*/}
      </div>
    </div>
  )
}

export default Search