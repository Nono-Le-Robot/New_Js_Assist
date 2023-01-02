const router = require("express").Router();

const APIController = require("../controllers/api.controller");

// Association de la route POST "/register" avec la méthode "register" du contrôleur d'authentification
router.post("/OPEN-AI-API", APIController.getRequest);

// Export du routeur
module.exports = router;
