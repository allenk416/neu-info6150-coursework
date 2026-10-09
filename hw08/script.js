// Add more elements to these lists. The contents do not have to be real.
const GEOGRAPHY_LIST = [
    {
        country: 'United States',
        capital: 'Washington',
        largestCity: 'New York',
        subdivisionName: 'state',
        subdivisions: [
            {
                name: 'Louisiana',
                capital: 'Baton Rouge',
                largestCity: 'New Orleans',
                area: 134264,
            },
            {
                name: 'California',
                capital: 'Sacramento',
                largestCity: 'Los Angeles',
                area: 423970,
            },
            {
                name: 'Nevada',
                capital: 'Carson City',
                largestCity: 'Las Vegas',
                area: 286382,
            },
        ],
    },
    {
        country: 'Guatemala',
        capital: 'Guatemala City',
        largestCity: 'Guatemala City',
        subdivisionName: 'department',
        subdivisions: [
            {
                name: 'Huehuetenango',
                capital: 'Huehuetenango',
                largestCity: 'Huehuetenango',
                area: 7403,
            },
            {
                name: 'Izabal',
                capital: 'Puerto Barrios',
                largestCity: 'Puerto Barrios',
                area: 9038,
            },
            {
                name: 'El Progreso',
                capital: 'Guastatoya',
                largestCity: 'Guastatoya',
                area: 1922,
            },
        ],
    },
    {
        country: 'Brazil',
        capital: 'Brasília',
        largestCity: 'São Paulo',
        subdivisionName: 'state',
        subdivisions: [
            {
                name: 'São Paulo',
                capital: 'São Paulo',
                largestCity: 'São Paulo',
                area: 248219,
            },
            {
                name: 'Rio de Janeiro',
                capital: 'Rio de Janeiro',
                largestCity: 'Rio de Janeiro',
                area: 43780,
            },
            {
                name: 'Bahia',
                capital: 'Salvador',
                largestCity: 'Salvador',
                area: 564733,
            },
        ],
    },
    {
        country: 'China',
        capital: 'Beijing',
        largestCity: 'Shanghai',
        subdivisionName: 'province',
        subdivisions: [
            {
                name: 'Shanghai',
                capital: 'Shanghai',
                largestCity: 'Shanghai',
                area: 6340,
            },
            {
                name: 'Guangdong',
                capital: 'Guangzhou',
                largestCity: 'Guangzhou',
                area: 179800,
            },
            {
                name: 'Sichuan',
                capital: 'Chengdu',
                largestCity: 'Chengdu',
                area: 485000,
            },
        ],
    },
];

function generateHTML(geographyData) {
    let html = '';

    geographyData.forEach(countryData => {
        html += `<div class="country">
                    <h2>${countryData.country}</h2>
                    <p>Capital: ${countryData.capital}</p>
                    <p>Largest City: ${countryData.largestCity}</p>
                    <h3>${countryData.subdivisionName}s:</h3>
                    <ul class="subdivisions">`;

        countryData.subdivisions.forEach(subdivision => {
            html += `<li>
                        <strong>${subdivision.name}</strong>
                        <ul>
                            <li>Capital: ${subdivision.capital}</li>
                            <li>Largest City: ${subdivision.largestCity}</li>
                            <li>Area: ${subdivision.area} square kilometers</li>
                        </ul>
                    </li>`;
        });

        html += `</ul></div>`;
    });

    return html;
}

const mainElement = document.querySelector("main");
mainElement.insertAdjacentHTML("afterbegin",generateHTML(GEOGRAPHY_LIST));
