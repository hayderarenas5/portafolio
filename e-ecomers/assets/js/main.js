async function getProducts() {
    try {
        const data= await fetch('https://ecommercebackend.fundamentos-29.repl.co/');
        
        const res= await data.json();
        window.localStorage.setItem('products', JSON.stringify(res));
        return res;
    } catch (error) {
        console.log(error);
    }
}
function loading() {
    
    document.querySelector('.loader-wrapper').style.display = 'flex';
    document.body.style.overflow = 'hidden'; 

    setTimeout(function() {
        
        document.querySelector('.loader-wrapper').style.display = 'none';
        
        document.body.style.overflow = 'auto';
    }, 2000);
}
function modal() {

    var modal = document.querySelector("#myModal"); 
    var btn = document.querySelector("#modalButton"); 
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function menu() {
    document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainMenu = document.querySelector('.main-menu ul');

        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('show-menu');
        });
    });
}
function filtros(db) {
    const buttons = document.querySelectorAll(".filtros button");
    const products = document.querySelectorAll(".product");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const filterValue = button.getAttribute("data-filter");
            filterProducts(products, filterValue);
        });
    });
}

function filterProducts(products, filterValue) {
    products.forEach((product) => {
        if (filterValue === "all") {
            product.style.display = "block"; // Muestra todos los productos si se selecciona "All"
        } else {
            if (product.classList.contains(filterValue)) {
                product.style.display = "block"; // Muestra el producto si coincide con el filtro
            } else {
                product.style.display = "none"; // Oculta el producto si no coincide con el filtro
            }
        }
    });
}
function printProducts(db) {
    const productsHTML= document.querySelector(".products");

    let html="";

    for (const product of db.products) {
        const buttonAdd=product.quantity
        ? `<i class='bx bx-plus' id="${product.id}"></i>`
        : '<span class="soldOut">sold out</span>';
        html+= `
            <div class="product">
                <div class="product__img">
                    <img src="${product.image}" alt="image"/>
                </div>

                <div class="product__info">
                    <h4>${product.name} <span><b>Stock</b>: ${product.quantity}</span></h4>
                    <h5>
                        $${product.price}
                        ${buttonAdd}
                    </h5>
                </div>      
            </div>
        `;
    }
    productsHTML.innerHTML=html
    
}
   
function handleShaowCart() {
    const iconCartHTML=document.querySelector(".bx-cart");
    const cartHTML=document.querySelector(".cart");

    let count=0;
    iconCartHTML.addEventListener('click', function(){
        cartHTML.classList.toggle("cart__show")
    })
}
function addToCartFromProducts(db) {
    
    const productsHTML= document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {    
        if (e.target.classList.contains("bx-plus")) {
            const id=Number(e.target.id);
            
            /* let productFind=null
            for (const product of db.products) {
                if (product.id===id){
                    productFind=product
                    break
                }
            } */
            const productFind= db.products.find(
                (product)=>product.id===id
            ); 
            if(db.cart[productFind.id]){
                if (productFind.quantity=== db.cart[productFind.id].amount) return alert("No tenemos mas bodega");
                db.cart[productFind.id].amount++;
            }else{
                db.cart[productFind.id]={...productFind, amount:1 }
            }

            window.localStorage.setItem('cart', JSON.stringify(db.cart));
            printProductsInCart(db);
            printTotal(db);
            handlePrintAmountProducts(db)
        }   
    });
}

function printProductsInCart(db) {
    const cartProducts= document.querySelector(".cart__products");
    let html='';
    for (const product in db.cart) {
        const {quantity, price, name, image, id, amount}=db.cart[product];
        html+=`
            <div class="cart__product">
                <div class="cart__product--img">
                    <img src="${image}" alt="image"/>
                </div>
                <div class="cart__product--body">
                    <h4>${name} | ${price}</h4>
                    <p>Stock: ${quantity}</p>
                    <div class="cart__product--body-op" id='${id}'>
                        <i class='bx bx-minus'></i>
                        <span>${amount} Unit</span>
                        <i class='bx bx-plus' ></i>
                        <i class='bx bx-trash' ></i>
                    </div>
                </div>
            </div>
        `;
    }
    cartProducts.innerHTML=html;
}
function handleProductsInCart(db) {
    const cart__products = document.querySelector(".cart__products");

    cart__products.addEventListener("click", function(e) {
        if (e.target.classList.contains("bx-plus")) {
            const id= Number(e.target.parentElement.id);

            const productFind= db.products.find(
                (product)=>product.id===id
            );
            if (productFind.quantity=== db.cart[productFind.id].amount) 
            return alert("No tenemos mas bodega");

            db.cart[id].amount++;
        }
        if (e.target.classList.contains("bx-minus")) {
            const id= Number(e.target.parentElement.id);
            if (db.cart[id].amount===1) {
                const responde=confirm('¿Estas seguro de que quieres eliminar este producto?')
                if (!responde)return
                delete db.cart[id];
            }else{
                db.cart[id].amount--;
            }
        }
        if (e.target.classList.contains("bx-trash")) {
            const id= Number(e.target.parentElement.id);
            const responde=confirm('¿Estas seguro de que quieres eliminar este producto?')
            if (!responde)return
            delete db.cart[id];
        }
        window.localStorage.setItem('cart', JSON.stringify(db.cart))
        printProductsInCart(db);
        printTotal(db);
        handlePrintAmountProducts(db);
    })
}
function printTotal(db) {
    const infoTotal = document.querySelector(".info__total");
    const infoAmount= document.querySelector(".info__amount");

    let totalProducts=0;
    let amountProducts=0;

    for (const product in db.cart) {
        const {amount,price}=db.cart[product];
        totalProducts+= price * amount;
        amountProducts+=amount;
    }

    infoAmount.textContent= amountProducts+" units";
    infoTotal.textContent= "$" +totalProducts+".00";
}
function handleTotal(db) {
    
    const btnBuy =document.querySelector(".btn__buy");

    btnBuy.addEventListener("click", function(){
        if(!Object.values(db.cart).length)return alert("Tienes que tener al menos 1 producto en el carrito")
        const responde =confirm("Seguro que quieres compara?");
        if(!responde) return;
        const currentProducts=[];

        for (const product of db.products) {
            const productCart=db.cart[product.id];
            if(product.id=== productCart?.id){
                currentProducts.push({
                    ...product,
                    quantity: product.quantity-productCart.amount
                });
            }else{
                currentProducts.push(product);
            }
        }

        db.products=currentProducts;
        db.cart={};

        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart))

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlePrintAmountProducts(db);
    });
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");

    // Guarda la preferencia del usuario en el almacenamiento local
    if (typeof(Storage) !== "undefined") {
        if (localStorage.getItem("modoOscuro") === "true") {
            localStorage.setItem("modoOscuro", "false");
        } else {
            localStorage.setItem("modoOscuro", "true");
        }
    }
}

function modoOscuro() {
    const modoOscuroBtn = document.querySelector(".bx-moon"); // Cambiamos el selector a ".bx-moon"

    // Agrega un evento click al botón para cambiar el modo
    modoOscuroBtn.addEventListener("click", toggleDarkMode);

    // Comprueba si el usuario ya eligió el modo oscuro en el pasado y aplica el estilo correspondiente
    if (typeof(Storage) !== "undefined" && localStorage.getItem("modoOscuro") === "true") {
        toggleDarkMode();
    }
}

function handlePrintAmountProducts(db) {
    const amountProducts=document.querySelector(".amountProducts");
    
    let amount=0;
    for (const product in db.cart) {
        console.log(db.cart[product]);

        amount+=db.cart[product].amount
    }

    amountProducts.textContent=amount;

}

async function main() {
    const db={
        products: JSON.parse(window.localStorage.getItem("products"))||(await getProducts()),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    };
    loading();
    modal();
    menu();
    printProducts(db);
    handleShaowCart();
    addToCartFromProducts(db);
    printProductsInCart(db);
    handleProductsInCart(db);
    printTotal(db); 
    handleTotal(db);
    handlePrintAmountProducts(db);
    modoOscuro();
    filtros(db);
}   

main();