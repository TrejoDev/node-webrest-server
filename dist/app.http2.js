"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http2_1 = __importDefault(require("http2"));
const fs_1 = __importDefault(require("fs"));
const server = http2_1.default.createSecureServer({
    key: fs_1.default.readFileSync("./keys/server.key"),
    cert: fs_1.default.readFileSync("./keys/server.crt"),
}, (req, res) => {
    //   const data = { name: "John Doe", age: 30, city: "New York" };
    //   res.writeHead(200, { "Content-type": "application/json" });
    //   res.end(JSON.stringify(data));
    var _a, _b;
    if (req.url === "/") {
        const htmlFile = fs_1.default.readFileSync("./public/index.html", "utf-8");
        res.writeHead(200, { "Content-type": "text/html" });
        res.end(htmlFile);
        return;
    }
    //! Express, Fastify => Nest.js
    if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.endsWith(".js")) {
        const jsFile = fs_1.default.readFileSync("./public/js/app.js");
        res.writeHead(200, { "Content-type": "application/javascript" });
        res.end(jsFile);
        return;
    }
    else if ((_b = req.url) === null || _b === void 0 ? void 0 : _b.endsWith(".css")) {
        const cssFile = fs_1.default.readFileSync("./public/css/styles.css");
        res.writeHead(200, { "Content-type": "text/css" });
        res.end(cssFile);
    }
    try {
        const responseContent = fs_1.default.readFileSync(`./public${req.url}`, "utf-8");
        res.end(responseContent);
    }
    catch (error) {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end();
    }
});
server.listen(8080, () => {
    console.log("Server running on port 8080");
});
