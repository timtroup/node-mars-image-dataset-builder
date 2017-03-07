const execSync = require('child_process').execSync;
const fs = require("fs");
const request = require('request-promise');
const sleep = require('sleep');

const API_KEY = 'Y5T3wqwLAJUHWXyDlJtQGeK0anjuaye0QLtgTCyn';
const MANIFEST_URL =`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=Y5T3wqwLAJUHWXyDlJtQGeK0anjuaye0QLtgTCyn`;
const PHOTO_URL =`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`;


const analyseImage = async (src) => {
    let img = await request(src, { encoding : null });
    fs.writeFileSync(src.substring(src.lastIndexOf('/')+1, src.length), img);
    console.log(src);
    //TODO use imagemagick to check if grayscale and delete file if it is
};

const buildColourImageDataset = async () => {
    let manifestResponse = await request(MANIFEST_URL);
    let manifest = JSON.parse(manifestResponse);

    for(let i=0; i<=manifest.photo_manifest.max_sol; i++) {
        let photosResponse;
        try {
            photosResponse = await request(`${PHOTO_URL}?sol=${i}&api_key=${API_KEY}`);
        } catch (e) {
            console.log(e);
            continue;
        }
        let photos = JSON.parse(photosResponse);

        photos.photos.forEach(photo => {
            analyseImage(photo.img_src);
        });
        sleep.sleep(3);
    }
};

buildColourImageDataset();