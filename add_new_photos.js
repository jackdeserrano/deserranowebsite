const fs = require('fs');

const previous_photos = fs.readFileSync("photo_list.txt").toString().split("\n");

let files = fs.readdirSync("photos/");

files = files.filter(function (file) {
    return file !== '.DS_Store';
});

files = files.filter(function (file) {
    return !previous_photos.includes(file);
});

let old_files_json = fs.readFileSync("photos.json");

let old_files = JSON.parse(old_files_json);

for (file of files) {
    old_files.push({path: file, links: []});
    fs.appendFileSync("photo_list.txt", file + "\n");
}

let files_json = JSON.stringify(old_files, null, 2);

fs.writeFileSync("photos.json", files_json);