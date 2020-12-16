const { authJwt } = require("../middlewares");
const controller = require("../controllers/project.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.post("/api/v1/project", [authJwt.verifyToken], controller.createproject);

    app.delete("/api/v1/project", [authJwt.verifyToken], controller.deleteproject);

    app.delete("/api/v1/projects", [authJwt.verifyToken], controller.deleteprojects);

    app.get("/api/v1/project", [authJwt.verifyToken], controller.getprojects);

    app.get("/api/detail/project", [authJwt.verifyToken], controller.getproject);

};
