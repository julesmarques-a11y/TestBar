// Fonctions partagées du panier (localStorage, clé "cart").

function readCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function writeCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Vide le panier après confirmation. Renvoie true si le panier a été vidé.
function clearCart() {
    if (readCart().length === 0) {
        alert("Le panier est déjà vide.");
        return false;
    }
    if (!confirm("Vider le panier ? Tous les articles seront supprimés.")) return false;
    writeCart([]);
    return true;
}
