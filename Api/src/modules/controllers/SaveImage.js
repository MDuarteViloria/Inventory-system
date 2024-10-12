import fs from 'fs';

export default function saveImage(buffer, name) {

    const route = "./src/public/images/" + new Date().getTime() + "-" + name;
    fs.writeFileSync(route, buffer);

    return route;
}