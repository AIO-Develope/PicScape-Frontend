<template>
    <h2 style="margin-top: 20px">Youre Uploads</h2>

    <div>
        <div id="images-pre">
            <div id="images"></div>

        </div>
        <div id="info-box" style="display: none;" class="info-box">
            <p>Unable to reach the API.</p>
        </div>
        <Modal :modalId="modalId" />
    </div>
</template>
    
<script>
import Modal from './ImgModal.vue';

import { API_URL } from '../../config';


export default {
    components: {
        Modal
    },
    data() {
        return {
            modalId: 'imageModal'
        }
    },
    setup() {

        function getCookie(name) {
            const cookies = document.cookie.split(';').map(cookie => cookie.trim());
            for (const cookie of cookies) {
                const [cookieName, cookieValue] = cookie.split('=');
                if (cookieName === name) {
                    return cookieValue;
                }
            }
            return null;
        }
        async function fetchImages() {
            try {
                const CookieUserId = getCookie('uuid')
                const response = await fetch(`${API_URL}/api/account/images/${CookieUserId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching images:', error.message);
                displayInfoBox('Unable to reach the API.');
                return [];
            }
        }

        async function fetchAndDisplayImages() {
            try {
                const imagesData = await fetchImages();

                if (imagesData.length === 0) {
                    return;
                }

                const imagesDiv = document.getElementById('images');
                imagesData.forEach(imageData => {
                    const imageURL = `${API_URL}/api/images/${imageData.id}`;
                    const img = document.createElement('img');
                    img.src = imageURL;
                    const container = document.createElement('div');
                    container.classList.add('image-container');
                    container.appendChild(img);
                    const overlay = document.createElement('div');
                    overlay.classList.add('overlay');
                    const button = document.createElement('button');
                    button.innerText = 'View';
                    button.style.color = 'black'
                    button.dataset.imageId = imageData.id;
                    button.addEventListener('click', () => {
                        showImagePreview(imageData);
                    });
                    overlay.appendChild(button);
                    container.appendChild(overlay);
                    imagesDiv.appendChild(container);
                });
            } catch (error) {
                console.error('Error fetching and displaying images:', error.message);
                displayInfoBox('Unable to reach the API.');
            }
        }

        async function showImagePreview(imageData) {
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modal-image');
            const imgTitle = document.querySelector('.img-title');
            const imgId = document.querySelector('.img-id');
            const imgAuthor = document.querySelector('.img-author');

            const imgTags = document.querySelector('.img-tags');

            const imgUploadDate = document.querySelector('.img-upload-date')
            const imgDescription = document.querySelector('.img-description');
            const downloadButton = document.getElementById('downloadButton');
            const deleteButton = document.getElementById('delete-button');


            modalImage.src = `${API_URL}/api/images/${imageData.id}`;
            imgId.textContent = `${imageData.id}`

            if (Array.isArray(imageData.tags)) {
                imgTags.innerHTML = '';
                imageData.tags.forEach(tag => {
                    const tagElement = document.createElement('img-tag');
                    tagElement.textContent = tag;
                    imgTags.appendChild(tagElement);
                });
            }

            imgUploadDate.textContent = `${imageData.date}`

            try {
                const response = await fetch(`${API_URL}/api/uuiduser/${imageData.userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch username');
                }
                const userData = await response.json();
                imgAuthor.textContent = userData.username;
            } catch (error) {
                console.error('Error fetching username:', error.message);
                imgAuthor.textContent = 'Unknown';
            }

            imgTitle.textContent = `${imageData.title}`;
            imgDescription.textContent = `${imageData.description}`;

            modal.style.display = 'block';


            const isUserLoggedIn = checkCookieUserId(imageData.userId);
            deleteButton.style.display = isUserLoggedIn ? 'block' : 'none';

            const closeButton = document.querySelector('.close');
            closeButton.onclick = function () {
                modal.style.display = 'none';
            };
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            };

            downloadButton.onclick = function () {
                fetch(`${API_URL}/api/images/${imageData.id}`)
                    .then(response => response.blob())
                    .then(blob => {
                        var anchor = document.createElement('a');

                        var blobUrl = window.URL.createObjectURL(blob);

                        anchor.href = blobUrl;

                        anchor.setAttribute('download', `${imageData.title.replace(/ /g, "_")}-${imageData.id}.jpg`);

                        anchor.click();

                        window.URL.revokeObjectURL(blobUrl);
                    })
                    .catch(error => {
                        console.error('Error downloading file:', error);
                    });
            };

            deleteButton.onclick = async function () {
                try {
                    const response = await fetch(`${API_URL}/api/images/delete/${imageData.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${getTokenCookieValue('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete image');
                    }
                    console.log('Image deleted successfully');
                    modal.style.display = 'none';
                    const imagesDiv = document.getElementById('images');
                    imagesDiv.innerHTML = '';
                    await fetchAndDisplayImages();
                } catch (error) {
                    console.error('Error deleting image:', error);
                }
            };

            function getTokenCookieValue(cookieName) {
                const cookies = document.cookie.split(';').map(cookie => cookie.trim());
                for (const cookie of cookies) {
                    const [name, value] = cookie.split('=');
                    if (name === cookieName) {
                        return value;
                    }
                }
                return null;
            }

        }

        function displayInfoBox(message) {
            const infoBox = document.getElementById('info-box');
            infoBox.style.display = 'block';
            infoBox.querySelector('p').textContent = message;
        }

        function checkCookieUserId(userId) {
            const cookies = document.cookie.split(';').map(cookie => cookie.trim());
            let uuid = null;
            for (const cookie of cookies) {
                const [name, value] = cookie.split('=');
                if (name === 'uuid') {
                    uuid = value;
                    break;
                }
            }

            if (uuid === userId) {
                return true;
            } else {
                return false;
            }
        }

        fetchAndDisplayImages();
    }
}

</script>
<style>
#images-pre {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
}

#images {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    padding-top: 40px;
}

@media (min-width: 768px) {
    #images {
        padding-left: calc((100% - (200px * 4) - (3 * 10px)) / 2);
        padding-right: calc((100% - (200px * 4) - (3 * 10px)) / 2);
    }
}


.image-container {
    position: relative;
    border-radius: 15%;
    width: 120px;
    height: 120px;
    overflow: hidden;
    border: 1px solid #ccc;
    text-align: center;
    transition: transform 0.3s ease;
}

.image-container:hover {
    transform: scale(1.1);
}

.image-container img {
    height: 120px;
    width: 120px;
    transition: transform 0.3s ease;
}

.image-container:hover img {
    transform: scale(1.1);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    transition: opacity 0.3s ease;
}

.image-container:hover .overlay {
    display: block;
    opacity: 1;
}

.overlay button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

.container {
    padding-left: 2000px;
}

.info-box {
    background-color: #f8d7da;
    color: #721c24;
    padding: 10px;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
    margin: 10px auto;
    width: 500px;
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

}
</style>