export default function QuantityCounter({qty, setQty}) {
    return <div className="qty-counter">
        {/* Does not allow for values under 0. */}
        <button onClick={() => (qty <= 0 || qty === undefined)? setQty(0) : setQty(qty - 1)}>-</button>
        <p>{qty}</p>
        <button onClick={() => setQty(qty + 1)}>+</button>
    </div>
}