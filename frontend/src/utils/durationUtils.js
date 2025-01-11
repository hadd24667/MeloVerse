export const getDuration = (file) => {
    return new Promise((resolve, reject) => {
        const audio = document.createElement('audio');
        audio.src = URL.createObjectURL(file);
        audio.addEventListener('loadedmetadata', () => {
            resolve(Math.round(audio.duration));
        });
        audio.addEventListener('error', (e) => {
            reject(e);
        });
    });
};

export  const makeDurationString = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}