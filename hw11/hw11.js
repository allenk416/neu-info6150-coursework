const pictureContainer = document.getElementById('Pic');
const getDogButton = document.getElementById('get-dog');

async function fetchPic() {
    getDogButton.disabled = true;
    pictureContainer.textContent = 'Loading a dog photo…';

    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!response.ok) throw new Error('The dog image service returned an error.');

        const data = await response.json();
        const imageUrl = new URL(data.message);
        if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== 'images.dog.ceo') {
            throw new Error('The dog image service returned an invalid image URL.');
        }

        const image = document.createElement('img');
        image.src = imageUrl.href;
        image.alt = 'A randomly selected dog';
        pictureContainer.replaceChildren(image);
    } catch {
        pictureContainer.textContent = 'Could not load a dog photo. Please try again.';
    } finally {
        getDogButton.disabled = false;
    }
}

getDogButton.addEventListener('click', fetchPic);
