const GEOGRAPHY_LIST = [
    {
        country: 'United States', capital: 'Washington', largestCity: 'New York', subdivisionName: 'state',
        subdivisions: [
            { name: 'Louisiana', capital: 'Baton Rouge', largestCity: 'New Orleans', area: 134264 },
            { name: 'California', capital: 'Sacramento', largestCity: 'Los Angeles', area: 423970 },
            { name: 'Nevada', capital: 'Carson City', largestCity: 'Las Vegas', area: 286382 },
        ],
    },
    {
        country: 'Guatemala', capital: 'Guatemala City', largestCity: 'Guatemala City', subdivisionName: 'department',
        subdivisions: [
            { name: 'Huehuetenango', capital: 'Huehuetenango', largestCity: 'Huehuetenango', area: 7403 },
            { name: 'Izabal', capital: 'Puerto Barrios', largestCity: 'Puerto Barrios', area: 9038 },
            { name: 'El Progreso', capital: 'Guastatoya', largestCity: 'Guastatoya', area: 1922 },
        ],
    },
    {
        country: 'Brazil', capital: 'Brasília', largestCity: 'São Paulo', subdivisionName: 'state',
        subdivisions: [
            { name: 'São Paulo', capital: 'São Paulo', largestCity: 'São Paulo', area: 248219 },
            { name: 'Rio de Janeiro', capital: 'Rio de Janeiro', largestCity: 'Rio de Janeiro', area: 43780 },
            { name: 'Bahia', capital: 'Salvador', largestCity: 'Salvador', area: 564733 },
        ],
    },
    {
        country: 'China', capital: 'Beijing', largestCity: 'Shanghai', subdivisionName: 'province',
        subdivisions: [
            { name: 'Shanghai', capital: 'Shanghai', largestCity: 'Shanghai', area: 6340 },
            { name: 'Guangdong', capital: 'Guangzhou', largestCity: 'Guangzhou', area: 179800 },
            { name: 'Sichuan', capital: 'Chengdu', largestCity: 'Chengdu', area: 485000 },
        ],
    },
];

function createTextElement(tagName, text, parent) {
    const element = document.createElement(tagName);
    element.textContent = text;
    parent.append(element);
    return element;
}

function renderGeography(geographyData, container) {
    const fragment = document.createDocumentFragment();

    geographyData.forEach((countryData) => {
        const countrySection = document.createElement('section');
        countrySection.className = 'country';
        createTextElement('h2', countryData.country, countrySection);
        createTextElement('p', `Capital: ${countryData.capital}`, countrySection);
        createTextElement('p', `Largest City: ${countryData.largestCity}`, countrySection);
        createTextElement('h3', `${countryData.subdivisionName[0].toUpperCase()}${countryData.subdivisionName.slice(1)}s`, countrySection);

        const subdivisionList = document.createElement('ul');
        subdivisionList.className = 'subdivisions';
        countryData.subdivisions.forEach((subdivision) => {
            const item = document.createElement('li');
            createTextElement('strong', subdivision.name, item);
            const details = document.createElement('ul');
            createTextElement('li', `Capital: ${subdivision.capital}`, details);
            createTextElement('li', `Largest City: ${subdivision.largestCity}`, details);
            createTextElement('li', `Area: ${subdivision.area.toLocaleString()} square kilometers`, details);
            item.append(details);
            subdivisionList.append(item);
        });
        countrySection.append(subdivisionList);
        fragment.append(countrySection);
    });

    container.replaceChildren(fragment);
}

const mainElement = document.querySelector('main');
if (mainElement) renderGeography(GEOGRAPHY_LIST, mainElement);
