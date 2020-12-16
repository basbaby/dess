const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);

    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

    app.get("/api/delete/user", [authJwt.verifyToken], controller.userBoard);

    // app.post("/api/v1/resource", [authJwt.verifyToken], controller.createresource);

    // app.delete("/api/v1/resource", [authJwt.verifyToken], controller.deleteresource);

    // app.get("/api/v1/resource", [authJwt.verifyToken], controller.azureresources);

    // app.post("/api/v1/project", [authJwt.verifyToken], controller.createproject);

    // app.delete("/api/v1/project", [authJwt.verifyToken], controller.deleteproject);

    // app.delete("/api/v1/projects", [authJwt.verifyToken], controller.deleteprojects);

    // app.get("/api/v1/project", [authJwt.verifyToken], controller.getprojects);

    // app.get("/api/detail/project", [authJwt.verifyToken], controller.getproject);

    // app.post("/api/v1/projectbuild", [authJwt.verifyToken], controller.startprojectbuild);

    // app.delete("/api/v1/projectbuild", [authJwt.verifyToken], controller.deleteprojectbuild);

    // app.post("/api/v1/deployapplication", [authJwt.verifyToken], controller.deployapplication);

    // app.post("/api/v1/aksstatus", [authJwt.verifyToken], controller.getaksstatus);

    // app.get("/api/v1/azstatus", [authJwt.verifyToken], controller.getazstatus);

    // app.get("/api/v1/projectbuildstat", [authJwt.verifyToken], controller.getprojectbuild);

    // app.post("/api/v1/buildstatus", [authJwt.verifyToken], controller.checkbuildsucceded);

    // app.post("/api/v1/repo", [authJwt.verifyToken], controller.creategitrepos);

    // app.get("/api/v1/repo", [authJwt.verifyToken], controller.getgitrepos);

    // app.delete("/api/v1/repos", [authJwt.verifyToken], controller.deletegitrepos);

    // app.delete("/api/v1/repo", [authJwt.verifyToken], controller.deletegitrepo);

    // app.post("/api/v1/buildpipelines", [authJwt.verifyToken], controller.getbuildpipelines);

    // app.get("/api/v1/pipeline", [authJwt.verifyToken], controller.checkbuildstarted);

    // app.post("/api/v1/createrelease", [authJwt.verifyToken], controller.createrelease);

    // app.get(
    //     "/api/test/mod",
    //     [authJwt.verifyToken, authJwt.isModerator],
    //     controller.moderatorBoard
    // );

    // app.get(
    //     "/api/test/admin",
    //     [authJwt.verifyToken, authJwt.isAdmin],
    //     controller.adminBoard
    // );
};
