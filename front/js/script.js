function displayAllProducts() {
    let productsElement = document.getElementById('items');
    let allProducts = JSON.parse(this.responseText);
    for(let product of allProducts) {
        //console.log(product.name);
        let productElement = document.createElement('a');
        productElement.href = "./product.html?id=" + product._id;
        let productArticle = document.createElement('article');
        let productImage = document.createElement('img');
        productImage.src = product.imageUrl;
        productImage.alt = product.altTxt;
        productArticle.appendChild(productImage);
        let productHeader = document.createElement('h3');
        productHeader.setAttribute('class', 'productName');
        productHeader.appendChild(document.createTextNode(product.name));
        productArticle.appendChild(productHeader);
        let productDescription = document.createElement('p');
        productDescription.setAttribute('class', 'productDescription');
        productDescription.appendChild(document.createTextNode(product.description));
        productArticle.appendChild(productDescription);
        productElement.appendChild(productArticle);
        
        productsElement.appendChild(productElement);
    }
}

const getAllProducts = new XMLHttpRequest();
getAllProducts.onload = displayAllProducts;
getAllProducts.open("get", "http://localhost:3000/api/products", true);
getAllProducts.send();