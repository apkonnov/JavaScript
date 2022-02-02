'use strict';

/*
Сам не стал придумывать ход решения, 
прочитал файл подсказки и стал реализовывать.

1. Скопировал из подсказок общий html для окошка корзины.
Вставил эту разметку после тега `<span class="cartIconWrap">`.

2. Скопировал из подсказок стили.
Вставил после стиля `.cartIconWrap span`.

3.1. Переименовал товары, чтоб у них были разные названия и поменял
цены, чтоб они также отличались.

4. Создал отдельный basket.js файл, подключил в html. Далее работа будет только
в данном js-файле.
*/

/*
basket.js

3.2. Каждому товару добавил data-атрибуты с id, ценой и названием товара:
Каждой кнопке добавления товара поставил класс addToCart.
*/
const divFeaturedItem = document.querySelectorAll('.featuredItem');
for (let i = 0; i < divFeaturedItem.length; i++) {
  divFeaturedItem[i].setAttribute('data-id', i);
    
  divFeaturedItem[i].setAttribute('data-name', 
    divFeaturedItem[i].querySelector('.featuredName').innerText); 

  divFeaturedItem[i].setAttribute('data-price', 
    divFeaturedItem[i].querySelector('.featuredPrice').innerText);
 
  divFeaturedItem[i].querySelector('button').classList.add('addToCart');  
}

/*
5. Поставил в js обработчик на открытие/закрытие окна корзины (ставлю/снимаю)
класс hidden у элемента с классом basket при клике на элемент с классом
cartIconWrap.
*/
const btnBasket = document.querySelector('.cartIconWrap');
const divBasket = document.querySelector('.basket');

btnBasket.addEventListener('click', event => {
  divBasket.classList.toggle('hidden');
});

/*
6. Создал пустой объект, который в памяти страницы будет хранить добавленные
товары:
*/

/**
 * В корзине хранится количество каждого товара
 * Ключ это id продукта, значение это товар в корзине - объект, содержащий
 * id, название товара, цену, и количество штук, например:
 * {
 *    1: {id: 1, name: "product 1", price: 30, count: 2},
 *    3: {id: 3, name: "product 3", price: 25, count: 1},
 * }
 */
const basket = {};

/*
7. Далее надо сделать так, чтоб при клике на кнопки "Добавить в корзину"
(в макете "Add to cart"), мы могли обработать добавление в корзину данных.
Для этого я делегировал событие, повесил один обработчик события клика на
ближайшего общего предка всех кнопок, это элемент с классом featuredItems.
Внутри обработчика надо проверить, если мы кликнули не по тому элементу, по
которому нужно было (по кнопке добавить в корзину), то просто возвращаюсь из
функции.

Если клик был по нужному элементу (по "кнопке"), тогда получаю у родителя с
классом featuredItem данные из data-атрибутов, которые ставили в п.3. И вызываю
созданную мной функцию addToCart, в которой происходит добавление продукта.
*/
document.querySelector('.featuredItems').addEventListener('click', event => {
  if (!event.target.classList.contains('addToCart')) {
    return;
  }
  let id = event.target.parentElement.parentElement.parentElement
    .dataset.id;
  let name = event.target.parentElement.parentElement.parentElement
    .dataset.name;
  let price = event.target.parentElement.parentElement.parentElement
    .dataset.price.slice(1);
   
  addToCart(id, name, price);
});

/*
8. Функция addToCart должна:
8.1. В объект basket добавить новый продукт или изменить имеющийся.
8.2. В html отрисовать новое количество добавленных товаров у значка корзины.
8.3. Отрисовать новую общую стоимость товаров в корзине.
8.4. Отрисовать правильно строку в окне корзины, в которой записаны все данные
о товаре.
*/
const spanBasket = btnBasket.querySelector('span');
const divBasketTotal = document.querySelector('.basketTotal');
const spanBasketTotalValue = divBasketTotal.querySelector('.basketTotalValue');

function addToCart(id, name, price) {
  if (basket.hasOwnProperty(id)) {
    basket[id].count++;
    divBasket.querySelector(`[data-id="${id}"] .productCount`)
      .textContent = basket[id].count;
    divBasket.querySelector(`[data-id="${id}"] .productTotal`)
      .textContent = (basket[id].count * basket[id].price).toFixed(2);
  
  } else {
    basket[id] = {id: id, name: name, price: price, count: 1};
    divBasketTotal.insertAdjacentHTML('beforeBegin', 
      `<div class="basketRow" data-id="${id}"> 
      <div>${basket[id].name}</div> 
      <div><span class="productCount">${basket[id].count}</span> шт.</div> 
      <div>$${basket[id].price}</div> 
      <div>$<span class="productTotal">${(basket[id].count*basket[id].price)
        .toFixed(2)}</span></div></div>`);
  }

  let totalCount = 0;
  let totalValue = 0;
  for (let id in basket) {
    totalCount += basket[id].count;
    totalValue += basket[id].count*basket[id].price;
  }
  spanBasket.textContent = totalCount;
  spanBasketTotalValue.textContent = totalValue.toFixed(2);
}
