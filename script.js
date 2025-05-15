async function getMealDetails(name) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  const data = await res.json();
  const meal = data.meals[0];

  let tags = meal.strTags ? meal.strTags.split(',') : [];
  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    let ing = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients += `<li class="badge bg-info m-1">${measure} ${ing}</li>`;
    }
  }

  openMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuList.classList.toggle("d-none");
  });

  mealData.innerHTML = `
    <div class="col-md-4 text-center">
      <img src="${meal.strMealThumb}" class="img-fluid rounded mb-2" />
      <h3>${meal.strMeal}</h3>
    </div>
    <div class="col-md-8">
      <h5>Instructions</h5>
      <p>${meal.strInstructions}</p>
      <h6><strong>Area:</strong> ${meal.strArea}</h6>
      <h6><strong>Category:</strong> ${meal.strCategory}</h6>
      <h6><strong>Ingredients:</strong></h6>
      <ul class="list-unstyled d-flex flex-wrap">${ingredients}</ul>
      <div class="mt-3">
        <a href="${meal.strSource}" target="_blank" class="btn btn-primary">Source</a>
        <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">YouTube</a>
      </div>
    </div>`;
}


const mealData = document.getElementById("mealData");
const contentContainer = document.getElementById("contentContainer");
const sidebar = document.getElementById("sidebar");
const menuList = document.getElementById("menuList");
const openMenu = document.getElementById("openMenu");

// Toggle sidebar
openMenu.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuList.classList.toggle("d-none");
});

// Fetch and display meals
async function getMeals(query = "") {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();
  displayMeals(data.meals);
}

// Display meals
function displayMeals(meals) {
  let html = "";
  if (meals) {
    meals.forEach(meal => {
      html += `
        <div class="col-md-3 mb-4">
          <div class="meal-card bg-dark rounded overflow-hidden text-center">
            <img src="${meal.strMealThumb}" class="img-fluid rounded-top" />
            <h5 class="p-2">${meal.strMeal}</h5>
          </div>
        </div>`;
    });
  } else {
    html = `<div class="text-center fs-4">No meals found.</div>`;
  }
  mealData.innerHTML = html;
  document.querySelectorAll('.meal-card').forEach(card => {
    card.addEventListener('click', () => {
      const mealName = card.querySelector('h5').innerText;
      getMealDetails(mealName);
    });
  });

}

// Show search inputs
function showSearch() {
  mealData.innerHTML = `
    <div class="row mb-3">
      <div class="col-md-6">
        <input type="text" id="searchName" placeholder="Search by name..." class="form-control" oninput="searchByName(this.value)">
      </div>
      <div class="col-md-6">
        <input type="text" id="searchLetter" maxlength="1" placeholder="Search by first letter..." class="form-control" oninput="searchByLetter(this.value)">
      </div>
    </div>`;
}

// Search functions
async function searchByName(term) {
  const res = await fetch(`www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata`);
  const data = await res.json();
  displayMeals(data.meals);
}

async function searchByLetter(letter) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  const data = await res.json();
  displayMeals(data.meals);
}

// Get categories
async function getCategories() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const data = await res.json();
  let html = "";
  data.categories.forEach(cat => {
    html += `
      <div class="col-md-3 mb-4">
        <div class="meal-card bg-dark text-center p-2">
          <img src="${cat.strCategoryThumb}" class="img-fluid rounded mb-2" />
          <h5>${cat.strCategory}</h5>
        </div>
      </div>`;
  });
  mealData.innerHTML = html;
}

// Get area
async function getArea() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=Canadian");
  const data = await res.json();
  let html = "";
  data.meals.forEach(area => {
    html += `
      <div class="col-md-3 mb-4 text-center">
        <div class="bg-dark p-4 rounded">${area.strArea}</div>
      </div>`;
  });
  mealData.innerHTML = html;
}

// Get ingredients
async function getIngredients() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast");
  const data = await res.json();
  let html = "";
  data.meals.slice(0, 20).forEach(ing => {
    html += `
      <div class="col-md-3 mb-4 text-center">
        <div class="bg-dark p-3 rounded">
          <h5>${ing.strIngredient}</h5>
          <p>${ing.strDescription?.split(" ").slice(0, 20).join(" ") || ""}</p>
        </div>
      </div>`;
  });
  mealData.innerHTML = html;
}

// Show contact form
function showContact() {
  mealData.innerHTML = `
    <form class="row g-3 justify-content-center align-items-start text-white" id="contactForm" autocomplete="off">
      <div class="col-md-6">
        <input type="text" class="form-control mb-2" id="contactName" placeholder="Enter Your Name">
        <div id="nameError" class="alert alert-danger py-2 d-none">Special characters and numbers not allowed</div>
      </div>
      <div class="col-md-6">
        <input type="email" class="form-control mb-2" id="contactEmail" placeholder="Enter Your Email">
      </div>
      <div class="col-md-6">
        <input type="text" class="form-control mb-2" id="contactPhone" placeholder="Enter Your Phone">
      </div>
      <div class="col-md-6">
        <input type="number" class="form-control mb-2" id="contactAge" placeholder="Enter Your Age">
      </div>
      <div class="col-md-6">
        <input type="password" class="form-control mb-2" id="contactPassword" placeholder="Enter Your Password">
      </div>
      <div class="col-md-6">
        <input type="password" class="form-control mb-2" id="contactRepassword" placeholder="Repassword">
      </div>
      <div class="col-12 text-center">
        <button class="btn btn-outline-danger px-5" id="submitBtn" type="submit">Submit</button>
      </div>
    </form>
  `;
}

// Load meals on start
getMeals();
