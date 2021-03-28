let db = firebase.firestore();

let newUser = {
    nombre: 'jose',
    apellido: 'mendoza',
    edad: 24
};

let users = [];

// setInterval(() => {
//     addUser(newUser);
// }, 5000);


readUsersRealTime();

function createTable() {
    let table = document.createElement('table');
    table.id = 'myTable';
    table.classList.add('table');
    let thead = document.createElement('thead');
    thead.classList.add('table-dark')
    let tr = document.createElement('tr');
    let th1 = document.createElement('th');
    th1.innerText = 'id';
    let th2 = document.createElement('th');
    th2.innerText = 'nombre';
    let th3 = document.createElement('th');
    th3.innerText = 'apellido';
    let th4 = document.createElement('th');
    th4.innerText = 'edad';
    tr.append(th1, th2, th3, th4);
    thead.appendChild(tr);
    table.prepend(thead);

    let tbody = document.createElement('tbody');
    tbody.id = "idtbody"
    table.appendChild(tbody)
    document.getElementById('container-table').prepend(table);
}

function addRowToTable(user) {

    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    td1.innerText = 'id';
    td1.innerText = user.id;
    let td2 = document.createElement('td');
    td2.innerText = 'nombre';
    td2.innerText = user.nombre;
    let td3 = document.createElement('td');
    td3.innerText = 'apellido';
    td3.innerText = user.apellido;
    let td4 = document.createElement('td');
    td4.innerText = 'edad';
    td4.innerText = user.edad;
    tr.append(td1, td2, td3, td4);

    document.getElementById('idtbody').appendChild(tr);
}

function drawChart() {

    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: users.map(u => u.nombre),
            datasets: [{
                label: '# of Votes',
                data: users.map(u => u.edad),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function readUsers() {
    db.collection("usuarios").get().then((querySnapshot) => {
        createTable();
        querySnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                nombre: doc.data().nombre,
                apellido: doc.data().apellido,
                edad: doc.data().edad
            });
            addRowToTable({
                id: doc.id,
                nombre: doc.data().nombre,
                apellido: doc.data().apellido,
                edad: doc.data().edad
            });
        });
    });
}


function readUsersRealTime() {
    readUsers();
    drawChart();
    db.collection("usuarios").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                let user = {
                    id: change.doc.id,
                    nombre: change.doc.data().nombre,
                    apellido: change.doc.data().apellido,
                    edad: change.doc.data().edad
                };
                users.push(user);
                addRowToTable(user);
                drawChart();
            }
            if (change.type === "modified") {
                // console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                // console.log("Removed city: ", change.doc.data());
            }
        });
    });

}

function addUser(user) {
    db.collection("usuarios").add(user)
        .then((docRef) => {
            // console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            // console.error("Error adding document: ", error);
        });
}