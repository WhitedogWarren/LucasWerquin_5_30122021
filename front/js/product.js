let productAdded;

function displayProduct() {
    productAdded = this.responseText;
    let product = JSON.parse(this.responseText);
    let imageContainer = document.getElementsByClassName('item__img')[0];
    let imageElement = document.createElement('img');
    imageElement.src = product.imageUrl;
    imageElement.alt = product.altTxt;
    imageContainer.appendChild(imageElement);
    document.getElementById('title').appendChild(document.createTextNode(product.name));
    document.getElementById('price').appendChild(document.createTextNode(product.price));
    document.getElementById('description').appendChild(document.createTextNode(product.description));
    for(let i=0; i<product.colors.length; i++) {
        let colorFragment = document.createElement('option');
        colorFragment.value = product.colors[i];
        colorFragment.appendChild(document.createTextNode(product.colors[i]));
        document.getElementById('colors').appendChild(colorFragment);
    }
}

const getProduct = new XMLHttpRequest();
getProduct.onload = displayProduct;
getProduct.open("get", "http://localhost:3000/api/products/" + new URL(document.location).searchParams.get('id'), true);
getProduct.send();

function addToCart() {
    let addError = false;
    let itemAdded = document.location.href.substring(document.location.href.indexOf('=') + 1);
    let colorAdded = document.getElementById('colors').value;
    if(colorAdded == ''){
        addError = 'Pas de couleur choisie !';
    }
    let qtyAdded = document.getElementById('quantity').value;
    if(qtyAdded < 1){
        addError ? addError += '\n' : addError = '';
        addError += 'Quantité nulle';
    }
    if(addError) {
        console.error('addError :\n' + addError);
        return;
    }
    if(!localStorage.getItem('kanapCart')) {
        let newCart = JSON.stringify([[itemAdded + '_' + colorAdded, {qty: parseInt(qtyAdded), data: productAdded}]]);
        localStorage.setItem('kanapCart', newCart);
    }
    else {
        let kanapCart = new Map(JSON.parse(localStorage.getItem('kanapCart')));
        let productKey = itemAdded + '_' + colorAdded;
        
        
        if(kanapCart.has(productKey)){
            let oldQty = kanapCart.get(productKey).qty;
            let newQty = oldQty + parseInt(qtyAdded);
            console.log('old qty :\n' + oldQty + '\nnewQty :\n' + newQty);
            kanapCart.get(productKey).qty = newQty;
            
            kanapCart.set(productKey, kanapCart.get(productKey)/* + parseInt(qtyAdded)*/);
        }
        else {
            kanapCart.set(productKey, {qty: qtyAdded, data: productAdded});
        }
        
        //kanapCart.set(productKey, {qty: parseInt(qtyAdded), data: productAdded});
        let updatedCart = [];
        kanapCart.forEach((value, key, map) => {
            updatedCart.push([key, value]);
        })
        localStorage.setItem('kanapCart', JSON.stringify(updatedCart));
    }
    console.log(JSON.parse(localStorage.getItem('kanapCart')));
}
document.getElementById('addToCart').addEventListener('click', addToCart);