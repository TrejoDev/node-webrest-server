import http2 from "http2";
import fs from "fs";

const server = http2.createSecureServer(
  {
    key: fs.readFileSync("./keys/server.key"),
    cert: fs.readFileSync("./keys/server.crt"),
  },
  (req, res) => {
    //   const data = { name: "John Doe", age: 30, city: "New York" };
    //   res.writeHead(200, { "Content-type": "application/json" });
    //   res.end(JSON.stringify(data));

    if (req.url === "/") {
      const htmlFile = fs.readFileSync("./public/index.html", "utf-8");
      res.writeHead(200, { "Content-type": "text/html" });
      res.end(htmlFile);
      return;
    }

    //! Express, Fastify => Nest.js
    if (req.url?.endsWith(".js")) {
      const jsFile = fs.readFileSync("./public/js/app.js");
      res.writeHead(200, { "Content-type": "application/javascript" });
      res.end(jsFile);
      return;
    } else if (req.url?.endsWith(".css")) {
      const cssFile = fs.readFileSync("./public/css/styles.css");
      res.writeHead(200, { "Content-type": "text/css" });
      res.end(cssFile);
    }

    try {
      const responseContent = fs.readFileSync(`./public${req.url}`, "utf-8");
      res.end(responseContent);
    } catch (error) {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end();
    }
  }
);

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
