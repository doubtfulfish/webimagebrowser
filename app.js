const express = require("express");
const path = require("path");
const fs = require("fs");

// modifiable settings
const PORT = 80;
// directory of content you wish to display
const root = "C:/Users/user/Pictures";
// display files with these extensions as image
const displayList = ["png", "jpg", "jpeg", "gif"];
// exclude from displaying
const excludeList = ["zip", "rar"];

const app = express();
app.use(express.static(root));
app.set("view engine", "ejs");

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server running on port ${PORT}`);
        console.log(`Root directory: ${root}`);
    }
});

// handle favicon requests
app.get("/favicon.ico", (req, res) => {
    res.sendStatus(200);
});

// catches all
app.get("/*/", (req, res) => {
    console.log(req.url);
    let url = decodeURI(req.url);

    let data = {
        path: url,
        folders: [],
        files: [],
        other: [],
    };

    // filter into respective arrays
    fs.readdirSync(path.join(root, url)).forEach((name) => {
        if (fs.lstatSync(path.join(root, url, name)).isDirectory()) {
            data.folders.push(name);
            return;
        }
        let ext = name.split(".").at(-1).toLowerCase();
        if (displayList.includes(ext)) {
            data.files.push(name);
        } else if (!excludeList.includes(ext)) {
            data.other.push(name);
        }
    });

    // sort files using natural sort
    data.files.sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true });
    });

    res.render("index.ejs", { data: data });
});
