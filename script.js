const usernameHtml = document.querySelector(".username")
const passwordHtml = document.querySelector(".password")
const loginButton = document.querySelector(".login")
const registerButton = document.querySelector(".register")
const storeLocation = document.querySelector(".location-storage") // criei isso aqui so para botar o valor do endereço quando eu encontra-lo na função
const showAll = document.querySelector(".see-all");

async function init(sucess, err) {
    navigator.geolocation.getCurrentPosition(sucess, err);
}

function showError(err) {
    console.warn(err);
    
}

function getCoords(pos) {
    let latitude = pos.coords.latitude;
    let longitude = pos.coords.longitude
    getLocation(latitude, longitude)
}

async function getLocation(lat, longi) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${longi}&format=json`);
        if (!response.ok) {
            throw new Error('Something went wrong...')
        }
        const data = await response.json();
        const address = data.address
        storeLocation.innerText = `${address.road}, ${address.suburb}, ${address.city} - ${address.state}, CEP: ${address.postcode}`
    } catch(err) {
        console.log(err);
    }
}

async function registerNewPerson(url, info) { // essa parte eu nao botei a url bruta porque o CrudCrud vai ficar mudando todo dia minha url;
    try {
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(info)
        });

        if (response.ok) {
            console.log("Data successfully added.");
        }

    } catch (err) {
        console.log(err);
    }

}

function getUserData() {
    return {
        username: usernameHtml.value,
        password: passwordHtml.value
    }
}

async function verifyLogin(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        let userData = getUserData();
        if (data.length <= 0) {
            alert("Maybe you can be the first to register...");
            return;
        }
        for (i of data) {
            if (i.username === userData.username && i.password === userData.password) {
                alert(`Welcome, ${userData.username}! `);
                return;
            }
        }
        alert("You're are not registered yet");
    } catch (err) {
        console.warn(err);
    }
}

async function isAlreadyRegistered(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        let userData = getUserData();
        for (let i of data) {
            if (i.username === userData.username || i.password === userData.password) {
                alert("Please try other credential, someone is alredy using this...")
                return 0;
            }
        }

        alert("Account created! ")

        registerNewPerson(url, {
            username: userData.username,
            password: userData.password,
            location: storeLocation.innerText
        })
    } catch (err) {
        console.warn(err)
    }
}

async function showAllAcounts(url) {
    const response = await fetch(url);
    const data = await response.json();
    for (let users of data) {
        console.log(users);
    }
}

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    try {
        verifyLogin("https://crudcrud.com/api/342092447f4943a889936a6db86a1ee6/users");
    } catch (err) {
        console.warn(err)
    }    
})

registerButton.addEventListener("click", (e) => {
    e.preventDefault();
    try {
        isAlreadyRegistered("https://crudcrud.com/api/342092447f4943a889936a6db86a1ee6/users")
    } catch (err) {
        console.warn(err)
    }
})

showAll.addEventListener("click", () => {
    try {
        showAllAcounts("https://crudcrud.com/api/342092447f4943a889936a6db86a1ee6/users")
    } catch (err) {
        console.warn(err);
    }
})

init(getCoords, showError)

console.log("Se estiver tendo problemas com a api, como por exemplo : Access to fetch at 'https://crudcrud.com/api/b3d114083cd74d3b9671364c11e3f984/users' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled, \nPor favor va no CrudCrud, crie um novo crud, e substitua o link das tres ultimas funções com o link que o site ira te disponibilizar com /users no final.");
