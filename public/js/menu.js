function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex'; // Cambiado a 'flex' para centrar el modal
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

let cropper;

function loadImage(event) {
    const image = document.getElementById('image');
    image.src = URL.createObjectURL(event.target.files[0]);

    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 2,
        preview: '.img-preview',
    });
}


//imagen

function cropImage() {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 300,
        });

        canvas.toBlob(function(blob) {
            const formData = new FormData();
            formData.append('croppedImage', blob);

            fetch('/dash-bca/change-photo', {
                method: 'POST',
                body: formData,
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        if (data.success) {
                            document.querySelector('.profile-pic').src = data.newImageUrl;
                            closeModal('changePhotoModal');
                        } else {
                            alert('Error al subir la imagen');
                        }
                    });
                } else {
                    alert('Error al subir la imagen');
                }
            }).catch(error => {
                console.error('Error:', error);
            });
        });
    }
}
