function fetchPic() {
    const url = `https://dog.ceo/api/breeds/image/random`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const Pic_url = `
            <img  src=${data.message}>
        `;
        document.getElementById('Pic').innerHTML = Pic_url;
    })

}

