"use strict";
import api_Key from "./apiKey.js";
const btn = document.querySelector(".btn--logo");
const logo = document.getElementById("logo");
const sidebar = document.querySelector(".sidebar");
const btnOpenSidebar = document.getElementById("btn--opensidebar");
const btnCloseSidebar = document.getElementById("btn--closesidebar");
const xbtnCloseSidebar = document.querySelector(".close--sidebar");
const btnRecipeSec = document.getElementById("btn--recipe--section");
const sec1 = document.querySelector(".section--1");
const header = document.head;
const linksContainer = document.getElementById("links");
const overlay = document.querySelector(".overlay");
const btnRecipe = document.querySelector(".recipe--btn");
const modalWindow1 = document.querySelector(".modal-window1");
const modalWindow2 = document.querySelector(".modal-window2");
const btnCloseModal = document.querySelectorAll(".close--modal");
const btnBackModal = document.querySelector(".back--btn--modal");
const foodItemSubmitBtn = document.getElementById("foodItem--submitButton");
const foodItemValue = document.getElementById("foodItem--name");
const outputFoodItem = document.querySelector(".output--fooditem");
const outputIngredient = document.querySelector(".output--ingredient");
const favBtn = document.querySelector(".favourite--btn");
const containerBtns = document.querySelectorAll(".cont--button");
const containerBtn = document.querySelector(".container--button");
const containerTxts = document.querySelectorAll(".cont--text");
const sectionObserve = document.querySelector(".section--observe");
const navBar = document.querySelector(".nav--bar");
const sideBarBtn = document.querySelector(".sidebar--btn--icon");
const sidebarIconImg = document.getElementById("sidebar--icon");
const sidebarContent = document.querySelector(".sidebar--content");

let modalState = 0,
  sidebarState = false;
let state = { searchResults: [], curIngredient: [], favIngredient: [] };

//Functions
// View related functions
const timeOutFunc = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
const capitaliseFirstWord = function (el) {
  return el.name[0].toUpperCase() + el.name.slice(1);
};
const renderSpinner = function (element) {
  element.innerHTML = "";
  element.insertAdjacentHTML(
    "afterBegin",
    '<img class="render--spinner" src="./images/spinner.gif"/>'
  );
};
const displayError = function (element, errorMsg) {
  element.innerHTML = "";
  element.insertAdjacentHTML("afterBegin", errorMsg);
};
const addToFav = function (el) {
  console.log("added to fav");
  state.favIngredient.push(state.curIngredient);
  el.setAttribute("src", "./images/icon11.png");
  // renderFavSidebar(state.favIngredient);
};
const removeFromFav = function (el, index) {
  console.log("removed from fav");
  state.favIngredient.splice(index, 1);
  el.setAttribute("src", "./images/icon22.png");
  // renderFavSidebar(state.favIngredient);
};
const renderList = function (item) {
  outputFoodItem.innerHTML = "";
  let html = "";
  item.forEach((el) => {
    html += `<ol class="food--item">
<a class="preview__link" href="#${el.id}">
  <figure class="preview__fig">
  <img src='https://spoonacular.com/cdn/ingredients_100x100/${
    el.image
  }'  alt="Test" />              
   </figure>
   <p class="preview__name">
    ${capitaliseFirstWord(el)} 
   </p>  
</a>
</ol> `;
  });
  outputFoodItem.insertAdjacentHTML("afterbegin", html);
};
const renderIngredient = function (el) {
  const caloriesEl = el.nutrition.nutrients.filter(
    (el) => el.name === "Calories"
  );
  const iconState = state.favIngredient.filter((elF) => elF.id === el.id);
  console.log(iconState);
  console.log(state.favIngredient);

  outputIngredient.innerHTML = "";
  let html = "";
  html += ` 
  <img src="https://spoonacular.com/cdn/ingredients_100x100/${
    el.image
  }" class="output--ingredient--image"/>
    <div class="ingredient--info"><p>Name: ${capitaliseFirstWord(
      el
    )}  <br></p><p>Nutrition:${caloriesEl[0].amount} ${
    caloriesEl[0].name
  } <br></p><p>Estimated cost:${el.estimatedCost.value}${
    el.estimatedCost.unit
  } <br></p>
  </div> 
  <img class='favourite--btn' src="./images/icon${
    iconState.length > 0 ? 11 : 22
  }.png"/> 
  `;
  outputIngredient.insertAdjacentHTML("afterbegin", html);
};
const renderFavSidebar = function (parEl) {
  if (parEl.length === 0)
    return displayError(parEl, "No ingredients added to fav list");
  sidebarContent.innerHTML = "";
  let html = "";
  parEl.forEach(
    (el) =>
      (html += `<ol class="food--item">
  <a class="preview__link" href="#${el.id}">
    <figure class="preview__fig" style="height: 1.5rem ;width:1.5rem;
    width: auto;">
    <img src='https://spoonacular.com/cdn/ingredients_100x100/${
      el.image
    }'   alt="Test" />              
     </figure>
     <p class="preview__name" style='font-size:0.9rem'>
     ${capitaliseFirstWord(el)}
     </p>  
  </a>
  </ol>`)
  );
  sidebarContent.insertAdjacentHTML("afterbegin", html);
};

// API calls functions
const getFoodItemID = async function (query) {
  try {
    renderSpinner(outputFoodItem);
    let apiCall = fetch(
      `https://api.spoonacular.com/food/ingredients/search?apiKey=${api_Key}&query=${query}`
    );

    const req = await Promise.race([apiCall, timeOutFunc(5)]);
    const reqFullfilled = await req.json();
    // console.log(reqFullfilled);
    const { results } = reqFullfilled;
    state.searchResults = results;
    if (reqFullfilled.status === "failure")
      return displayError(outputFoodItem, reqFullfilled.message);
    // console.log(state.searchResults);
    renderList(state.searchResults);
  } catch (err) {
    console.log(err);
    displayError(outputFoodItem, `${err}`);
  }
};
const getIngredientInfo = async function (id) {
  // renderSpinner();
  try {
    renderSpinner(outputIngredient);
    const apiCall = fetch(
      `https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${api_Key}&amount=1`
    );
    const req = await Promise.race([apiCall, timeOutFunc(5)]);
    const reqFullfilled = await req.json();
    console.log(reqFullfilled);
    if (reqFullfilled.status === "failure")
      return displayError(outputIngredient, reqFullfilled.message);
    // const { results } = reqFullfilled;
    state.curIngredient = reqFullfilled;
    // console.log(state.curIngredient);
    renderIngredient(state.curIngredient);
  } catch (err) {
    console.log(err);
    return displayError(outputIngredient, `${err}`);
  }
};
// Control related functions
const openSidebar = function () {
  // e.preventDefault();
  sidebar.style.display = "block";
  sidebarState = true;
  setTimeout(function () {
    sidebar.style.transform = "translate(-200px,0)";
    sidebar.style.position = "fixed";
    overlay.style.display = "block";
    renderFavSidebar(state.favIngredient);
    // sidebar.style.display = "fixed";
  }, 500);
};
const closeSidebar = function () {
  // e.preventDefault();
  sidebarState = false;
  sidebar.style.transform = "translate(200px,0)";
  overlay.style.display = "none";
  setTimeout(function () {
    sidebar.style.display = "none";
  }, 500);
};
const openModal = function (modal, state) {
  // btnRecipe.style.backgroundColor = `${randomColor()}`;
  modal.style.display = "block";
  overlay.style.display = "grid";
  modalState = state;
};
const closeModal = function (modal) {
  modal.style.display = "none";
  overlay.style.display = "none";
  modalState = 0;
};
const makeNavBarSticky = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting === false) {
    navBar.classList.add("nav--bar--sticky");
  } else {
    navBar.classList.remove("nav--bar--sticky");
  }
};
const observerNav = new IntersectionObserver(makeNavBarSticky, {
  root: null,
  threshold: 0.1,
  rootMargin: "400px",
});
observerNav.observe(sectionObserve);

// Event listeners
btnRecipeSec.addEventListener("click", function () {
  sec1.scrollIntoView({ block: "end", behavior: "smooth" });
});

btn.addEventListener("click", function () {
  logo.style.transform = "translate(0,35px)";
});
sideBarBtn.addEventListener("mouseover", function () {
  sidebarIconImg.setAttribute("src", "./images/icons-sidebar-hover.png");
});
sideBarBtn.addEventListener("mouseout", function () {
  sidebarIconImg.setAttribute("src", "./images/icon-sidebar.png");
});
[btnOpenSidebar, sidebarIconImg].forEach((el) =>
  el.addEventListener("click", openSidebar)
);
[btnCloseSidebar, xbtnCloseSidebar].forEach((el) =>
  el.addEventListener("click", closeSidebar)
);
btnRecipe.addEventListener("click", function () {
  openModal(modalWindow1, 1);
});
//Clicking on overlay to close Modals and sidebar
overlay.addEventListener("click", function (e) {
  if (modalState === 1) {
    closeModal(modalWindow1);
  }
  if (modalState === 2) {
    closeModal(modalWindow2);
  }
  if (sidebarState === true) {
    closeSidebar();
  }
});
// Escape key to close Modals and sidebar
document.addEventListener("keydown", function (e) {
  const styL1 = getComputedStyle(sidebar).display;
  const styL2 = getComputedStyle(overlay).display;
  if (styL1 !== "none" && e.key === "Escape") {
    closeSidebar();
  }
  if (styL2 !== "none" && e.key === "Escape") {
    if (modalState === 1) {
      closeModal(modalWindow1);
    }
    if (modalState === 2) {
      closeModal(modalWindow2);
    }
  }
});

btnCloseModal.forEach((el) =>
  el.addEventListener("click", function () {
    // closeModal(modalWindow1);
    if (modalState === 1) {
      closeModal(modalWindow1);
    }
    if (modalState === 2) {
      closeModal(modalWindow2);
    }
  })
);
btnBackModal.addEventListener("click", function () {
  closeModal(modalWindow2);
  openModal(modalWindow1, 1);
});
//Submit search query
foodItemSubmitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const foodItemis = foodItemValue.value;
  // outputFoodItem.textContent = foodItemis;
  getFoodItemID(foodItemis);
  foodItemValue.value = "";
});
//Opening ingredient liks from search results
outputFoodItem.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(e.target);
  const clicked = e.target.closest(".preview__link");
  console.log(clicked);
  if (!clicked) return;
  if (clicked) {
    const id = clicked.getAttribute("href").slice(1);
    closeModal(modalWindow1);
    getIngredientInfo(id);
    openModal(modalWindow2, 2);
  }
});
//Opening ingredient links from sidebar
sidebarContent.addEventListener("click", function (e) {
  const clicked = e.target.closest(".preview__link");
  if (!clicked) return;
  if (clicked) {
    console.log(clicked);
    const idFav = clicked.getAttribute("href").slice(1);
    console.log(idFav);
    const loadIng = state.favIngredient.filter((el) => el.id === +idFav);

    console.log(loadIng);
    if (loadIng.length > 0) {
      closeSidebar();
      openModal(modalWindow2, 2);
      renderIngredient(loadIng[0]);
    }
  }
});
// Checking if current ingredient is added to favorites
outputIngredient.addEventListener("click", function (e) {
  const clicked = e.target.closest(".favourite--btn");
  if (!clicked) return;
  if (clicked) {
    if (state.favIngredient.length >= 0) {
      const isBookmarked = state.favIngredient.filter(
        (el) => el.id === state.curIngredient.id
      );
      const elToRemove = state.favIngredient.findIndex(
        (el) => el.id === state.curIngredient.id
      );
      console.log(isBookmarked);
      if (isBookmarked.length === 0) {
        addToFav(clicked);
      } else {
        console.log("already there");
        removeFromFav(clicked, elToRemove);
      }
    }
  }
});

//Tabbed component
containerBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const clicked = e.target.classList.contains("cont--button");
  if (!clicked) return;
  containerTxts.forEach((el) => {
    el.style.opacity = 0;
    // el.style.display = "none";
  });
  containerBtns.forEach((el) => el.classList.remove("cont--button--active"));
  if (clicked) {
    e.target.classList.add("cont--button--active");
    const targetEl = e.target.dataset.vehicle;
    const elclickedText = document.querySelector(`.cont--text--${targetEl}`);
    // elclickedText.style.display = "block";
    setTimeout(function () {
      elclickedText.style.opacity = 1;
    }, 500);
  }
});
