import "./ProductCard.css";

function ProductCard({image,name,price}) {

  return (
    <div className="product-card">

      <img src={image} alt={name}/>

      <p>{name}</p>
      <span>₹ {price}</span>

    </div>
  );
}

export default ProductCard;