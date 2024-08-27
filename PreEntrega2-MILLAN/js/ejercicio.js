document.addEventListener('DOMContentLoaded', () => {
    const formEstudiante = document.querySelector('#form-estudiante');
    const tablaEstudiantes = document.querySelector('#tabla-estudiantes tbody');
    const listadoEstudiantes = document.querySelector('#listado-estudiantes');
    const estudianteIdInput = document.querySelector('#estudiante-id');
    const notificationArea = document.querySelector('#notification-area');

    const estudiantes = [
        { 
          id: 1,
          nombre: 'Juan',
          imagen: './img/1.jpg'
        },
        { 
          id: 2,
          nombre: 'Andres',
          imagen: './img/2.jpg'
        },
        { 
          id: 3,
          nombre: 'Luis',
          imagen: './img/3.jpg'
        }
    ];

    estudiantes.forEach(est => {
        const card = document.createElement('div');
        card.classList.add('estudiante-card');
        card.dataset.id = est.id;

        card.innerHTML = `
            <img src="${est.imagen}" alt="${est.nombre}">
            <h4>${est.nombre}</h4>
        `;

        card.addEventListener('click', () => {
            seleccionarEstudiante(est.id, card);
        });

        listadoEstudiantes.appendChild(card);
    });

    function seleccionarEstudiante(id, card) {
   
        const tarjetas = listadoEstudiantes.querySelectorAll('.estudiante-card');
        tarjetas.forEach(tarjeta => tarjeta.classList.remove('selected'));

    
        card.classList.add('selected');
        estudianteIdInput.value = id;
    }

    formEstudiante.addEventListener('submit', (event) => {
        event.preventDefault();

        const estudianteId = parseInt(estudianteIdInput.value);
        const nota1 = parseFloat(document.querySelector('#nota1').value);
        const nota2 = parseFloat(document.querySelector('#nota2').value);
        const nota3 = parseFloat(document.querySelector('#nota3').value);

        if (estudianteId && !isNaN(nota1) && !isNaN(nota2) && !isNaN(nota3)) {
            const estudiante = estudiantes.find(est => est.id === estudianteId);
            agregarEstudiante(estudiante, nota1, nota2, nota3);
            formEstudiante.reset();
            mostrarNotificacion(`Las notas de ${estudiante.nombre} se han registrado correctamente.`);
        } else {
            mostrarNotificacion('Por favor, completa todos los campos correctamente.', 'error');
        }
    });

    function agregarEstudiante(estudiante, nota1, nota2, nota3) {
        const promedio = calcularPromedio(nota1, nota2, nota3);
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td><img src="${estudiante.imagen}" alt="${estudiante.nombre}" width="50"></td>
            <td>${estudiante.nombre}</td>
            <td>${nota1}</td>
            <td>${nota2}</td>
            <td>${nota3}</td>
            <td>${promedio.toFixed(1)}</td>
            <td><button class="remove-btn">Eliminar</button></td>
        `;

        fila.querySelector('.remove-btn').addEventListener('click', () => {
            fila.remove();
            mostrarNotificacion(`Las notas de ${estudiante.nombre} han sido eliminadas.`);
            guardarDatos();
        });

        tablaEstudiantes.appendChild(fila);
        guardarDatos();
    }

    function calcularPromedio(nota1, nota2, nota3) {
        const notas = [nota1, nota2, nota3];
        const suma = notas.reduce((acc, nota) => acc + nota, 0);
        return suma / notas.length;
    }

    function mostrarNotificacion(mensaje, tipo = 'success') {
        notificationArea.textContent = mensaje;
        notificationArea.className = tipo;
        setTimeout(() => {
            notificationArea.textContent = '';
            notificationArea.className = '';
        }, 3000);
    }

    function guardarDatos() {
        const filas = Array.from(tablaEstudiantes.querySelectorAll('tr'));
        const datos = filas.map(fila => {
            const celdas = fila.querySelectorAll('td');
            return {
                imagen: celdas[0].querySelector('img').src,
                nombre: celdas[1].textContent,
                notas: [
                    parseFloat(celdas[2].textContent),
                    parseFloat(celdas[3].textContent),
                    parseFloat(celdas[4].textContent)
                ],
                promedio: parseFloat(celdas[5].textContent)
            };
        });
        localStorage.setItem('datosEstudiantes', JSON.stringify(datos));
    }

    function cargarDatosAlmacenados() {
        const datos = JSON.parse(localStorage.getItem('datosEstudiantes'));
        if (datos) {
            datos.forEach(est => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td><img src="${est.imagen}" alt="${est.nombre}" width="50"></td>
                    <td>${est.nombre}</td>
                    <td>${est.notas[0]}</td>
                    <td>${est.notas[1]}</td>
                    <td>${est.notas[2]}</td>
                    <td>${est.promedio.toFixed(1)}</td>
                    <td><button class="remove-btn">Eliminar</button></td>
                `;
                fila.querySelector('.remove-btn').addEventListener('click', () => {
                    fila.remove();
                    mostrarNotificacion(`Las notas de ${est.nombre} han sido eliminadas.`);
                    guardarDatos();
                });
                tablaEstudiantes.appendChild(fila);
            });
        }
    }


    cargarDatosAlmacenados();
});

