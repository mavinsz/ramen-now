document.addEventListener('alpine:init', () => {
    Alpine.data('menus', () => ({
        items: [
            { id: 1, name: 'Udon Gyakku', img: '1.jpg', price:2000},
            { id: 2, name: 'Tori Ramen', img: '2.jpg', price:2500},
            { id: 3, name: 'Salad Ramen', img: '3.jpg', price:1200},
            { id: 4, name: 'Karaage', img: '4.jpg', price:3600}   
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity:0,
        add(newItem) {
            //cek barang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem .id);

            //jika cart kosong
            if(!cartItem) { 
                this.items.push({...newItem, quantity: 1, total: newItem.price });
            this.quantity++;
            this.total += newItem.price;
            } else {
                //jika barang ada dicek apakah barang beda or sama di cart
                this.item = this.items.map((item) => {
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        //jika barang ada tambah total dan quantity
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price; 
                        return item;
                    }
                });
            }
        },
        remove(id) {
            //ambil item diremove berdasar id
            const cartItem = this.items.find((item) => item.id === id);
            
            //jika item lebih dari 1
            if(cartItem.quantity > 1) {
                //telusuri 1 1
                this.items = this.items.map((item) => {
                    //jika nukan barang yang diklik
                    if(item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                //jika barang sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;

            }
        },
    });
});

//form validasi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function(){
    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !==0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

//kirim data ketika checkout diklik
checkoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open('http://wa.me/6285158387008?text=' + encodeURIComponent(message));
});

//whatsapp pesan format
const formatMessage = (obj) => {
    return `Data Customer
     Name: ${obj.name}
     Email: ${obj.email}
     Phone: ${obj.phone}
    Data Pesanan
     ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`)}
TOTAL: ${rupiah(obj.total)}
Thank You.`;
};

//konversi rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID',{
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};