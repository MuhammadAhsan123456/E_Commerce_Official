import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBJRB9XlIJJ2HfFe8UxRoEoplDxip0_dDQ",
    authDomain: "first-project-3d66d.firebaseapp.com",
    projectId: "first-project-3d66d",
    storageBucket: "first-project-3d66d.firebasestorage.app",
    messagingSenderId: "1024105981606",
    appId: "1:1024105981606:web:89cb0b2a86edb1f348b667",
    measurementId: "G-DSC5F4713V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



// Login Function
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "product.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Signup Function
async function signup(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await auth.signOut(); // Logout the user after signup
        alert("Signup successful! Please login to continue.");
        window.location.href = "index.html";  // Redirect to login page
    } catch (error) {
        alert("Error: " + error.message);
    }
}



// Fetch Products
async function fetchProducts() {
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    const products = data.products;
    const container = document.getElementById('product-container');
    container.innerHTML = ""; 

    products.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart('${product.id}', '${product.title}', ${product.price}, '${product.thumbnail}')">Add to Cart</button>
                <button onclick="addToFavourite('${product.id}', '${product.title}', ${product.price}, '${product.thumbnail}')">❤️</button>
            </div>
        `;
    });
}

// Add to Cart
async function addToCart(productId, productName, productPrice, productImage) {
    const user = auth.currentUser;
    if (!user) return alert("Please login first!");

    try {
        await addDoc(collection(db, 'carts', user.uid, 'items'), { id: productId, name: productName, price: productPrice, image: productImage });
        alert("Product added to cart!");
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Load Cart
async function loadCart() {
    const user = auth.currentUser;
    if (!user) return alert("Please login first!");

    const container = document.getElementById('cart-container');
    if (!container) return;

    container.innerHTML = "";

    try {
        const cartRef = collection(db, 'carts', user.uid, 'items');
        const querySnapshot = await getDocs(cartRef);

        if (querySnapshot.empty) {
            container.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        querySnapshot.forEach(doc => {
            const item = doc.data();
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                </div>
            `;
        });
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Add to Favourite
async function addToFavourite(productId, productName, productPrice, productImage) {
    const user = auth.currentUser;
    if (!user) return alert("Please login first!");

    try {
        await addDoc(collection(db, 'favourites', user.uid, 'items'), { id: productId, name: productName, price: productPrice, image: productImage });
        alert("Product added to favourites!");
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Load Favourites
async function loadFavouriteProducts() {
    const user = auth.currentUser;
    if (!user) return alert("Please login first!");

    const container = document.getElementById('favourite-container');
    if (!container) return;

    container.innerHTML = "";

    try {
        const favRef = collection(db, 'favourites', user.uid, 'items');
        const querySnapshot = await getDocs(favRef);

        if (querySnapshot.empty) {
            container.innerHTML = "<p>No favourite products yet.</p>";
            return;
        }

        querySnapshot.forEach(doc => {
            const item = doc.data();
            container.innerHTML += `
                <div class="favourite-item">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                </div>
            `;
        });
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Logout
async function logout() {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = card.querySelector('h3').textContent.toLowerCase().includes(searchTerm) ? 'block' : 'none';
    });
}

// Toggle Menu
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Auth State Listener (Single Instance)
onAuthStateChanged(auth, (user) => {
    console.log(user ? "User logged in: " + user.uid : "No user logged in");

    const path = window.location.pathname;
    if (user) {
        if (path.includes('product.html')) fetchProducts();
        if (path.includes('cart.html')) loadCart();
        if (path.includes('favourite.html')) loadFavouriteProducts();
    } else {
        if (!path.includes('index.html') && !path.includes('signup.html')) window.location.href = "index.html";
    }
});
// CONTACT KA JAVASCRIPT
// ✅ Contact Form Submit Function
async function submitContactForm(event) {
    event.preventDefault();  // 🛑 Prevent page reload

    // ✅ Get User Inputs
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // ✅ Validation (Ensure fields are filled)
    if (!name || !email || !message) {
        alert("Please fill all fields!");
        return;
    }

    try {
        // ✅ Firestore Me Data Save Karein
        await addDoc(collection(db, "claims"), {
            name: name,
            email: email,
            message: message,
            timestamp: new Date()
        });

        alert("Your claim has been submitted successfully!");
        document.querySelector("form").reset();  // ✅ Form clear karna
    } catch (error) {
        console.error("Error submitting claim:", error);
        alert("Failed to submit your claim. Try again!");
    }
}

// ✅ Function ko Window Object se Attach Karein
window.submitContactForm = submitContactForm;


// Export Functions to Window
window.login = login;
window.signup = signup;
window.logout = logout;
window.toggleMenu = toggleMenu;
window.addToCart = addToCart;
window.addToFavourite = addToFavourite;
window.searchProducts = searchProducts;
