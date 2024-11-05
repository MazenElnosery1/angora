let rowdata = document.querySelector('#rowdata')
let searchContainer = document.querySelector('#searchContainer')
let nameInput = document.querySelector('#nameInput');
let emailInput = document.querySelector('#emailInput');
let phoneInput = document.querySelector('#phoneInput');
let ageInput = document.querySelector('#ageInput');
let passwordInput = document.querySelector('#passwordInput');
let repasswordInput = document.querySelector('#repasswordInput');
let submitbtn = document.querySelector('#submitBtn')


function openSideNav() {
    $(".side-nav-menu").animate({
        'left': '0'
    }, 500)


    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");


    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    $(".links li").animate({
        top: 300
    }, 500)
}

closeSideNav()
$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})


//display meals 

fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
  .then(response => response.json())
  .then(data => {
    var meals = data.meals; 
    displayMeals(meals)
  })
  .catch(error => console.error('Error fetching data:', error));




function displayMeals(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3 rounded ">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="item rounded position-relative overflow-hidden">
                    <div class="item-img ">
                        <img class='img-fluid rounded' src="${arr[i].strMealThumb}" alt="">
                    </div>
                    <div class="item-caption position-absolute top-0 end-0 start-0 bottom-0 d-flex ps-4 align-items-center rounded ">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>`
    }

    rowdata.innerHTML = box
}

//search input by name and letter
function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class=" inp1 form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class=" inp1 form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    rowdata.innerHTML = ""
}

async function searchByName(name1) {
    closeSideNav()
    rowdata.innerHTML = ""

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name1}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
   
}

async function searchByFLetter(name) {
    closeSideNav()
    rowdata.innerHTML = ""

    name == "" ? name = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${name}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])    

}

//display category 

async function getCategory(){
    rowdata.innerHTML = ''
    searchContainer.innerHTML=''
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    response = await response.json()
    console.log(response.categories);

    let category=response.categories;
    displayCategory(category)
    
}


function displayCategory(arr){
    let box =``
    for (i= 0 ; i <arr.length ; i++)
    {
        box += `
        <div class="col-md-3 rounded ">
                <div onclick="categoryMeal('${arr[i].strCategory}')" class="item rounded position-relative overflow-hidden ">
                    <div class="item-img ">
                        <img class='img-fluid rounded' src="${arr[i].strCategoryThumb}" alt="">
                    </div>
                    <div class="item-caption position-absolute top-0 end-0 start-0 bottom-0  p-4 text-center rounded ">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
            </div>`

            rowdata.innerHTML=box
    }

}


async function categoryMeal(category){
    rowdata.innerHTML = ''
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    respone =await respone.json()
    displayMeals(respone.meals.slice(0,20))
}

//display area

async function getArea() {
    rowdata.innerHTML = ""
    searchContainer.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayArea(respone.meals);

}


function displayArea(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center text-white area-class">
                        <i class="fa-solid fa-house-laptop fa-4x "></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowdata.innerHTML = box
}
//display area meal 

async function getAreaMeals(area) {
    rowdata.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
}



//meal details

function displayMealDetails(meal) {
    
    searchContainer.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let box = `
    <div class="col-md-4 ">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2 class='text-white'>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowdata.innerHTML = box
}

//get meal details
async function getMealDetails(mealID) {
    closeSideNav()
    rowdata.innerHTML = ""
    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();
    displayMealDetails(respone.meals[0])

}

//ingredients
async function getIngredients() {
    rowdata.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayIngredients(respone.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}


function displayIngredients(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center text-white cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowdata.innerHTML = box
}

async function getIngredientsMeals(ingredients) {
    rowdata.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}


//Contact us

function showContacts() {
    rowdata.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" oninput="chekInput(this)" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="inputalert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" oninput="chekInput(this)"  type="email" class="form-control " placeholder="Enter Your Email">
                <div id="inputalert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" oninput="chekInput(this)"  type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="inputalert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" oninput="chekInput(this)"  type="number" class="form-control " placeholder="Enter Your Age">
                <div id="inputalert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" oninput="chekInput(this)"  type="password" class="form-control " placeholder="Enter Your Password">
                <div id="inputalert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" oninput="chekInput(this)"  type="password" class="form-control " placeholder="Repassword">
                <div id="inputalert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn"  class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
}



//rejex

function chekInput(element) {
    let inputs = {
      nameInput: /^[A-Z][a-zA-Z\s]{2,8}$/,  
      emailInput: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 
      phoneInput: /^01[0125]\d{8}$/, 
      ageInput: /^(?:1[01][0-9]|120|[1-9][0-9]?)$/, 
      passwordInput: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 
      repasswordInput: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ 
    };
    
  
    if (inputs[element.id].test(element.value)){       
      element.nextElementSibling.classList.replace("d-block", "d-none"); 
     
    } else {
        element.nextElementSibling.classList.replace("d-none", "d-block"); 
        
    }
    
    
  }
