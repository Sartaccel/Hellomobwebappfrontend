import "./CategoryMenu.css";

function CategoryMenu() {

  const categories = [
    "Mobiles",
    "Accessories",
    "Gifts",
    "Watches",
    "Clocks",
    "Sweets nuts",
    "Prefume",
    "Camera",
    "Speakers"
  ];

  return (
    <div className="category-menu">
      {categories.map((cat,index)=>(
        <span key={index}>{cat} ▼</span>
      ))}
    </div>
  );
}

export default CategoryMenu;