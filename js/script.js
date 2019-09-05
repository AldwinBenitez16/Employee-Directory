const randomUser = 'https://randomuser.me/api/?nat=us&results=12';

// Fetch Functions
// Fetches the data, checks the status, and parses the response into json
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(data => data.json())
            .catch(error => console.log('Looks like there was a problem!', error))
};

function checkStatus(response) {
    if(response.status === 200) {
        return Promise.resolve(response);
    } else {
        return reject(new Error(response.responseText));
    }
}

// Helper Functions
// Takes data from API to create html elements with corresponding data
const directory = document.querySelector('#directory');
 
function generateEmployees(data) {
    let employee = '';
    for(let i = 0; i < data.length; i++) {
        let html = `
        <div id='${data[i].name.first} ${data[i].name.last}' class='employee'>
        <img src=${data[i].picture.large}>
            <div class='employee-info'>
                <h3>${data[i].name.first} ${data[i].name.last}</h3>
                <p>
                    <a href='mailto:${data[i].email}'>
                    ${data[i].email}</a>
                </p>
                <p>${data[i].location.city}</p>
            </div>
        </div>
        `;

        employee += html;
    }
    directory.innerHTML += employee;
}

// Fetches the data from API 
fetchData(randomUser)
    .then(data => {        
        const parent = document.querySelector('.wrapper');
        addOverlay(parent);
        addDetails(data.results);
        return data.results;
    })
    .then(response => generateEmployees(response))
    .then(response => {
        // Event listener to show overlay
        const employees = document.getElementsByClassName('employee');
        const overlayDiv = document.querySelector('.overlay-div');

        for(let i = 0; i < employees.length; i++) {
            employees[i].addEventListener('click', e => {
                if(e.target.tagName === 'IMG') {
                    document.querySelector('body').style.overflow = 'hidden';
                    overlayDiv.style.visibility = 'visible';
                    showDetails(e.target.parentNode.id);
                } else if(e.target.tagName === 'H3') {
                    document.querySelector('body').style.overflow = 'hidden';
                    overlayDiv.style.visibility = 'visible';
                    showDetails(e.target.parentNode.parentNode.id);
                } else if(e.target.className === 'employee'){
                    document.querySelector('body').style.overflow = 'hidden';
                    overlayDiv.style.visibility = 'visible';
                    showDetails(e.target.id);
                }
            });
        }

        // Display the overlay to none if you click on it
        // Also has exit listener
        // And navigation
        const navLeft = employeeDetails[0].querySelector('.nav-left');
        const navRight = employeeDetails[employeeDetails.length-1].querySelector('.nav-right');
        navRight.remove();
        navLeft.remove(); 


        overlayDiv.addEventListener('click', function(e) {
            if(e.target.className === 'exit' ||
            e.target.className === 'overlay-div'){
                document.querySelector('body').style.overflow = 'scroll';
                overlayDiv.style.visibility = 'hidden';
                removeDetails();
            } else if(e.target.className === 'nav-right') {
                let data = e.target.parentNode.parentNode.id;
                for(let i = 0; i < employees.length; i++) {
                    if(employees[i].id === data) {
                        if(employeeDetails[i+1]) {
                            employeeDetails[i].style.display = 'none';
                            employeeDetails[i+1].style.display = 'initial';
                        }
                    }
                }
            } else if(e.target.className === 'nav-left') {
                let data = e.target.parentNode.parentNode.id;
                for(let i = 0; i < employees.length; i++) {
                    if(employees[i].id === data) {
                        if(employeeDetails[i-1]) {
                            employeeDetails[i].style.display = 'none';
                            employeeDetails[i-1].style.display = 'initial';
                        }
                    }
                }
            }
        });

        // Search Functionality
        const search = document.querySelector('#search');
        search.addEventListener('input', e => {
            for(let i = 0; i < employees.length; i++) {
                if((employees[i].id.toLowerCase()).indexOf(e.target.value.toLowerCase()) === -1) {
                    employees[i].style.display = 'none';
                } else {
                    employees[i].style.display = 'flex';
                }
            }
        });

        
    })

// Overlay and Employee Details
function addOverlay(parentElement) {
    const body = document.querySelector('body');
    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay-div';

    parentElement.parentNode.insertBefore(overlayDiv,parentElement);
}

let employeeDetails = [];
function addDetails(data) {
    console.log(data);
    const overlayDiv = document.querySelector('.overlay-div');
    for(let i = 0; i <data.length; i++) {
        
        employeeDetails[i] = document.createElement('div');
        employeeDetails[i].className = `employee-details`;
        employeeDetails[i].style.display = 'none';
        employeeDetails[i].id = `${data[i].name.first} ${data[i].name.last}`;

        const infoContainer = document.createElement('div');
        infoContainer.className = 'infoContainer';
        const infoHtml = `
            <p class='exit'>X</p>
            <p class='nav-right'>></p>
            <p class='nav-left'><</p>
            <img src='${data[i].picture.large}'>
            <h3>${data[i].name.first} ${data[i].name.last}</h3>
            <p>
                <a href='${data[i].email}'>
                ${data[i].email}</a>
            </p>
            <p>${data[i].location.city}</p>
        `;
        infoContainer.innerHTML = infoHtml;

        const extraInfoContainer = document.createElement('div');
        extraInfoContainer.className = 'extraInfoContainer';
        const day = data[i].dob.date.substring(8,10);
        const month = data[i].dob.date.substring(5,7);
        const year = data[i].dob.date.substring(2,4);

        const extraInfoHtml = `
            <p>${data[i].phone}</p>
            <p>${data[i].location.street}, ${data[i].location.city}, ${data[i].location.state}, ${data[i].location.postcode}</p>
            <p>Birthday: ${day}/${month}/${year}</p>
        `;
        extraInfoContainer.innerHTML = extraInfoHtml;

        employeeDetails[i].appendChild(infoContainer);
        employeeDetails[i].appendChild(extraInfoContainer);
        overlayDiv.appendChild(employeeDetails[i]);
    }
}

// Detail display functions
function showDetails(employeeName) {
    for(let i = 0; i < employeeDetails.length; i++) {
        if(employeeDetails[i].id === employeeName) {
            employeeDetails[i].style.display = 'initial';
        }
    }
}

function removeDetails() {
    for(let i = 0; i < employeeDetails.length; i++) {
        employeeDetails[i].style.display = 'none';
    }
}

console.log(employeeDetails);