import emCart from '../assets/cart-empty.png';
import cart from '../assets/cart-full.png'
export default function NavBar({isFull}) {
    return <>
        <nav>
            <p>Hello, username</p>
            <h2>Groceries App 🍎</h2>
            {isFull == true? <img src={cart} alt='full cart icon'/> : <img src={emCart} alt='empty cart icon'/>}
        </nav>
    </>;
}