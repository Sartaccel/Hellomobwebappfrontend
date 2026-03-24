import "./CategoryMenu.css";

function CategoryMenu() {
  const categories = [
    "MOBILES",
    "ACCESSORIES",
    "GIFT",
    "WATCHES",
    "CLOCK",
    "SWEET_NUTS",
    "PERFUME",
    "CAMERA",
    "SPEAKER"
  ];

  return (
    <div className="category-menu">
      {categories.map((cat, index) => (
        <span key={index}>{cat} ▼</span>
      ))}
    </div>
  );
}

export default CategoryMenu;