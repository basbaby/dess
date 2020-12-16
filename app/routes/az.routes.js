const { authJwt } = require("../middlewares");
const controller = require("../controllers/az.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.post("/api/v1/azresource", [authJwt.verifyToken], controller.createresource);

    app.delete("/api/v1/azresource", [authJwt.verifyToken], controller.deleteresource);

    app.get("/api/v1/azresource", [authJwt.verifyToken], controller.azureresources);

    app.post("/api/v1/azprojectbuild", [authJwt.verifyToken], controller.startprojectbuild);

    app.delete("/api/v1/projectbuild", [authJwt.verifyToken], controller.deleteprojectbuild);

    app.post("/api/v1/deployapplication", [authJwt.verifyToken], controller.deployapplication);

    app.post("/api/v1/aksstatus", [authJwt.verifyToken], controller.getaksstatus);

    // app.get("/api/v1/azstatus", [authJwt.verifyToken], controller.getazstatus);

    app.get("/api/v1/projectbuildstat", [authJwt.verifyToken], controller.getprojectbuild);

    // app.post("/api/v1/buildstatus", [authJwt.verifyToken], controller.checkbuildsucceded);

    // app.post("/api/v1/buildpipelines", [authJwt.verifyToken], controller.getbuildpipelines);

    app.get("/api/v1/pipeline", [authJwt.verifyToken], controller.checkbuildstarted);

    app.post("/api/v1/createrelease", [authJwt.verifyToken], controller.createrelease);

};
