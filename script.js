// script.js
document.getElementById('panicButton').addEventListener('click', () => {
  // URL del archivo MP3 en Google Drive (debe ser un enlace directo)
  const mp3Url = 'https://drive.usercontent.google.com/u/0/uc?id=18UGHBVmZdTwAIF28XvNg_MlBQFZ6Ia2B&export=download';

  // Crear un elemento de audio y reproducir el sonido
  const audio = new Audio(mp3Url);
  audio.play()
    .then(() => {
      console.log('Sonido de pánico reproducido.');
    })
    .catch((error) => {
      console.error('Error al reproducir el sonido:', error);
    });
});