console.log('hola');

const modal = document.getElementById('myModal');

(() => {

    const url = "http://localhost:3000/api/total";

    const getData = async () => {

        try {
            const res = await fetch(url);
            const resJson = await res.json();
            console.log(resJson);
            const { data } = await resJson;
            console.log(data);
            casosConfirmados(data);
            tabla(data);

        } catch (error) {
            console.error(error);
        }

    }
    getData();

})();

const casosConfirmados = (datos) => {

    let casosMayores = datos.filter(caso => {
        return caso.confirmed > 1000000;
    })
    console.log(casosMayores);

    let estadisticasConfirmados = [];
    let estadisticasMuertos = [];
    

    casosMayores.forEach(element => {

        estadisticasConfirmados.push({
            label: element.location,
            y: element.confirmed,
        });

    });

    casosMayores.forEach( element => {

        estadisticasMuertos.push({
            label: element.location,
            y: element.deaths,
        });
    })

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Estadísticas Covid 19"

        },
        axisY: {
            title: "Millones ",
            titleFontSize: 14,
            interval:3000000,
            labelFontSize:11,
        },
        axisX: {
            title: "Países",
            labelAngle: 130,
            labelFontSize:11,
            interval: 1
        },
        data: [{
        type: "column",
        legendText: "Casos Confirmados",
		showInLegend: true, 
        dataPoints: estadisticasConfirmados  
        },
        {
        type: "column",
        dataPoints: estadisticasMuertos,
        legendText: "Muertos",
            showInLegend: true,
        }]
    });
    chart.render();
}


const getDataPais = async (pais) => {

    let bodyModal = document.querySelector('.modal-body');
    try {
        const respuesta = await fetch(`http://localhost:3000/api/countries/${pais}`);
        const respuestaJson = await respuesta.json();

        const { data } = await respuestaJson;        
        console.log(data);

        if(data.location == undifined)throw "Error simpatico: Info solicitada en estos momentos no se encuentra disponible";

        bodyModal.innerHTML = `<div id="chartContainerPais" style="height: 300px; width: 100%;"></div>`;
        
        var chart = new CanvasJS.Chart("chartContainerPais", {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            title: {
                text: `Estadísticas de ${data.location}`
            },
            axisY: {
                title: "Cantidad"
            },
            axisX: {
                title: `${data.location}`
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}",
                dataPoints: [
                    { y: `${data.active}`, label: "Activos" },
                    { y: `${data.deaths}`, label: "Muertes" },
                    { y: `${data.recovered}`, label: "Recuperados" },
                    { y: `${data.confirmed}`, label: "Confirmados" }
                ]
            }]
        });
        chart.render();
    
    } catch (error) {
        console.error(error);
        bodyModal.style.textAlign= 'center';
        bodyModal.style.backgroundColor='#7fffd4';

        bodyModal.innerHTML = `<img src="https://m.media-amazon.com/images/I/61B8MqUatSL._AC_SX466_.jpg" width= "200px">
        <p><mark><strong>${error}</strong></mark></p>`;
    }

}

const tabla = (datos) => {

    let tablita = document.getElementById('tablita');

    tablita.innerHTML = `
        <thead>
            <tr>
                <th scope="col">Localización</th>
                <th scope="col">Casos Activos</th>
                <th scope="col">Casos Confirmados</th>
                <th scope="col">Muertes</th>
                <th scope="col">Recuperados</th>
                <th scope="col">Detalle</th>
            </tr>
        </thead>`;

    datos.forEach(element => {

        tablita.innerHTML += `
            <tbody>
                <tr>
                    <th scope="row">${element.location}</th>
                    <td>${element.active}</td>
                    <td>${element.confirmed}</td>
                    <td>${element.deaths}</td>
                    <td>${element.recovered}</td>
                    <td>
                    <button type="button" onclick="verDetalle('${element.location}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Ver Detalle
                    </button>

                    </td>
                </tr>               
            </tbody>`;
    });
}

window.verDetalle = (pais) => {
    getDataPais(pais);
}





