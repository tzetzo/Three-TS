import express from "express";
import path from "path";
import http from "http";

const port: number = 5000;

class App {
  private server: http.Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    const app = express();
    app.use(express.static(path.join(__dirname, "../client")));
    // This server.ts is only useful if you are running this on a production server or you
    // want to see how the production version of bundle.js works
    //
    // to use this server.ts
    // # npm start
            // # creates the production version of bundle.js and places it in ./dist/client/
            // # compiles ./src/server/server.ts into ./dist/server/server.js
            // # starts node.js with express and serves the ./dist/client folder
    //
    // visit http://127.0.0.1:5000

    this.server = new http.Server(app);
  }

  public Start() {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}.`);
    });
  }
}

new App(port).Start();
