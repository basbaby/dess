const { authJwt } = require("../middlewares");
const controller = require("../controllers/git.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    app.post("/api/v1/repo", [authJwt.verifyToken], controller.creategitrepos);

    app.get("/api/v1/repo", [authJwt.verifyToken], controller.getgitrepos);

    app.delete("/api/v1/repos", [authJwt.verifyToken], controller.deletegitrepos);

    app.delete("/api/v1/repo", [authJwt.verifyToken], controller.deletegitrepo);

};
