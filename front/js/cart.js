let kanapCart = JSON.parse(localStorage.getItem('kanapCart'));
console.log(kanapCart);

function displayAllArticles() {
    for(i=0;i < kanapCart.length; i++) {
        let productId = kanapCart[i][0].substring(0, kanapCart[i][0].indexOf('_'));
        let productColor = kanapCart[i][0].substring(kanapCart[i][0].indexOf('_') + 1);
        let itemData = JSON.parse(kanapCart[i][1].data);
        let itemArticle = document.createElement('article');
        itemArticle.setAttribute('class', "cart__item");
        itemArticle.setAttribute('data-id', productId);
        itemArticle.setAttribute('data-color', productColor);
        let imgContainer = document.createElement('div');
        imgContainer.setAttribute('class', "cart__item__img");
        let productImage = document.createElement('img');
        productImage.src = itemData.imageUrl;
        productImage.alt = itemData.altTxt;
        imgContainer.appendChild(productImage);
        itemArticle.appendChild(imgContainer);

        let productContent = document.createElement('div');
        productContent.setAttribute('class', "cart__item__content");

        let productDescription = document.createElement('div');
        productDescription.setAttribute('class', "cart__item__content__description");
        
        let productTitle = document.createElement('h2');
        productTitle.appendChild(document.createTextNode(itemData.name));
        productDescription.appendChild(productTitle);

        let productColorSpan = document.createElement('p');
        productColorSpan.appendChild(document.createTextNode(productColor));
        productDescription.appendChild(productColorSpan);


        let productPrice = document.createElement('p');
        productPrice.appendChild(document.createTextNode(itemData.price + ' €'));
        productDescription.appendChild(productPrice);

        productContent.appendChild(productDescription);

        let productSettings = document.createElement('div');
        productSettings.setAttribute('class', 'cart__item__content__settings');

        let productQty = document.createElement('div');
        productQty.setAttribute('class', 'cart__item__content__settings__quantity');
        let qtyLabel = document.createElement('p');
        qtyLabel.appendChild(document.createTextNode('Qté : '));
        productQty.appendChild(qtyLabel);

        let qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.setAttribute('class', 'itemQuantity');
        qtyInput.name = 'itemQuantity';
        qtyInput.min = 1;
        qtyInput.max = 100;
        qtyInput.value = kanapCart[i][1].qty;
        productQty.appendChild(qtyInput);

        productSettings.appendChild(productQty);
        
        let deleteButton = document.createElement('div');
        deleteButton.setAttribute('class', 'cart__item__content__settings__delete');
        let deleteButtonLabel = document.createElement('p');
        deleteButtonLabel.setAttribute('class', 'deleteItem');
        deleteButtonLabel.appendChild(document.createTextNode('Supprimer'));
        deleteButton.appendChild(deleteButtonLabel);

        productSettings.appendChild(deleteButton);

        productContent.appendChild(productSettings);
        itemArticle.appendChild(productContent);
        document.getElementById('cart__items').appendChild(itemArticle);
    }
}

function calculateTotalArticles() {
    let result = 0;
    for(let item of kanapCart) {
        result += parseInt(item[1].qty);
    }
    return result;
}

function calculateTotalPrice() {
    let result = 0;
    for(let item of kanapCart) {
        let itemData = JSON.parse(item[1].data);
        result += item[1].qty * itemData.price;
    }
    return result;
}

function updateTotal() {
    //display total number of items
    document.getElementById('totalQuantity').firstChild.remove();
    document.getElementById('totalQuantity').appendChild(document.createTextNode(calculateTotalArticles()));
    //display total price
    document.getElementById('totalPrice').firstChild.remove();
    document.getElementById('totalPrice').appendChild(document.createTextNode(calculateTotalPrice()));
}

function deleteHandler(event) {
    let ancestorArticle = event.target.parentElement.parentElement.parentElement.parentElement;
    let itemId = ancestorArticle.getAttribute('data-id');
    let itemColor = ancestorArticle.getAttribute('data-color');
    let itemKey = itemId + '_' + itemColor;
    //remove item from kanapCart
    let cartMap = new Map(kanapCart);
    cartMap.delete(itemKey);
    localStorage.setItem('kanapCart', JSON.stringify(Array.from(cartMap)));
    kanapCart = JSON.parse(localStorage.getItem('kanapCart'));
    console.log(kanapCart);
   //remove article element from document
    ancestorArticle.remove();
    updateTotal();
}

function qtyChangeHandler(event) {
    let ancestorArticle = event.target.parentElement.parentElement.parentElement.parentElement;
    let itemKey = ancestorArticle.getAttribute('data-id') + '_' + ancestorArticle.getAttribute('data-color');
    let cartMap = new Map(kanapCart);
    let itemOject = cartMap.get(itemKey);
    itemOject.qty = parseInt(event.target.value);
    cartMap.set(itemKey, itemOject);
    console.log(cartMap);
    localStorage.setItem('kanapCart', JSON.stringify(Array.from(cartMap)));
    kanapCart = JSON.parse(localStorage.getItem('kanapCart'));
    updateTotal();
}

function orderHandler(event) {
    event.preventDefault();
    let dataToSend = {};
    dataToSend.contact = {};
    dataToSend.products = [];
    ////
    // traitement des champs vides
    ////
    let emptyFields = false;
    let firstName = document.getElementById('firstName');
    if(!firstName.value) {
        emptyFields = [firstName];
    }
    let lastName = document.getElementById('lastName');
    if(!lastName.value) {
        emptyFields ? emptyFields.push(lastName) : emptyFields = [lastName];
    }
    let address = document.getElementById('address');
    if(!address.value) {
        emptyFields ? emptyFields.push(address) : emptyFields = [address];
    }
    let city = document.getElementById('city');
    if(!city.value) {
        emptyFields ? emptyFields.push(city) : emptyFields = [city];
    }
    let email = document.getElementById('email');
    if(!email.value) {
        emptyFields ? emptyFields.push(email) : emptyFields = [email];
    }
    if(emptyFields) {
        //colorer les inputs
        for(field of emptyFields) {
            field.style.backgroundColor = '#ffbbbb';
            //console.log(field.nextElementSibling);
            field.nextElementSibling.appendChild(document.createTextNode('Vous devez remplir ce champ'));
        }
        //return;
    }

    ////
    // traitement des champs non valides
    ////
    let invalidFields = false;
    const nameRegexp = /[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð.' -]+$/u;
    if(!firstName.value.match(nameRegexp)) {
        firstName.style.color = '#ffbbbb';
        firstName.nextElementSibling.appendChild(document.createTextNode("ce prénom n'est pas valide.\nIl ne doit contenir ni chiffre, ni caractères spéciaux autres que le tiret et l'apostrophe simple."));
        invalidFields = [firstName];
    }else{
        dataToSend.contact.firstName = firstName.value;
    }
    if(!lastName.value.match(nameRegexp)) {
        lastName.style.color = '#ffbbbb';
        lastName.nextElementSibling.appendChild(document.createTextNode("Ce nom n'est pas valide.\nIl ne doit contenir ni chiffre, ni caractères spéciaux autres que le tiret et l'apostrophe simple"));
        invalidFields ? invalidFields.push(lastName) : invalidFields = [lastName];
    }else{
        dataToSend.contact.lastName = lastName.value;
    }
    const addressRegexp = /[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð.' -]+$/u;
    if(!address.value.match(addressRegexp)) {
        address.style.color = '#ffbbbb';
        address.nextElementSibling.appendChild(document.createTextNode("Cette adresse n'est pas valide.\nElle ne doit pas contenir de caractères spéciaux autres que le tiret et l'apostrophe simple"));
        invalidFields ? invalidFields.push(address) : invalidFields = [address];
    }else{
        dataToSend.contact.address = address.value;
    }
    if(!city.value.match(addressRegexp)) {
        city.style.color = '#ffbbbb';
        city.nextElementSibling.appendChild(document.createTextNode("Cette ville n'est pas valide.\nElle ne doit pas contenir de caractères spéciaux autres que le tiret et l'apostrophe simple"));
        invalidFields ? invalidFields.push(city) : invalidFields = [city];
    }else{
        dataToSend.contact.city = city.value;
    }
    const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!email.value.match(emailRegexp)) {
        email.style.color = '#ffbbbb';
        email.nextElementSibling.appendChild(document.createTextNode("Ceci n'est pas une adresse mail valide."));
        invalidFields ? invalidFields.push(email) : invalidFields = [email];
    }else{
        dataToSend.contact.email = email.value;
    }
    if(invalidFields)
        return;
    let products = [];
    for(item of kanapCart) {
        dataToSend.products.push(item[0].substring(0, item[0].indexOf('_')));
    }
    console.log(dataToSend);
    ////
    // envoyer la requête vers le serveur et traiter la réponse
    ////
    /*
    const postConfirm = new XMLHttpRequest();
    postConfirm.onload = () => { console.log('response :' + responseText)};
    postConfirm.open("post", "http://localhost:3000/api/products/order", true);
    postConfirm.setRequestHeader("Content-Type", "application/json");
    postConfirm.send(JSON.stringify(dataToSend));
    */
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: { "Content-Type" : "Application/json"},
        body: JSON.stringify(dataToSend)
    }).then(res => {
        //console.log(res.json());
        return res.json();
    }).then((data) => {
        console.log(data);
        ////
        // assurer la redirection
        ////
        //console.log(window.location.href.substring(0, window.location.href.lastIndexOf('/')));
        //window.location = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + '/confirmation.html?orderid=' + data.orderId;
        window.location.href = `./confirmation.html?orderid=${data.orderId}`;
    });
}

if(!localStorage.getItem('kanapCart') || JSON.parse(localStorage.getItem('kanapCart')).length < 1) {
    console.log('panier vide');
    document.getElementsByTagName('h1')[0].innerText += '\n est vide';
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', 'go-index');
    document.getElementsByTagName('h1')[0].after(newDiv);
    document.getElementById('go-index').style.textAlign = 'center';
    let newLink = document.createElement('a');
    newLink.href = "./index.html";
    newLink.title = "revenir à l'accueil";
    newLink.appendChild(document.createTextNode('Visitez note catalogue'));
    document.getElementById('go-index').appendChild(newLink);
    newLink.style.textDecoration = "none";
    newLink.style.color = '#FFFFFF';
}
else {
    if(document.getElementById('cartAndFormContainer')) {// page panier
        //display all articles
        displayAllArticles();
        //display total number of items
        updateTotal();
        //ajouter eventListeners
        let deleteButtons = document.getElementsByClassName('deleteItem');
        for(let button of deleteButtons){
            button.addEventListener('click', deleteHandler);
        }
        let qtyInputs = document.getElementsByClassName('itemQuantity');
        for(let input of qtyInputs){
            input.addEventListener('change', qtyChangeHandler);
        }
        document.getElementById('order').addEventListener('click', orderHandler);
    }
    if(document.getElementById('orderId')) {
        //console.log(new URL(document.location).searchParams.get('orderid'));
        document.getElementById('orderId').appendChild(document.createTextNode(new URL(document.location).searchParams.get('orderid')));
    }
    

}
