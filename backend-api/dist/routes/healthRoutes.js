"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_1 = require("../controllers/healthController");
const router = (0, express_1.Router)();
// Health check routes
router.get('/health', healthController_1.getHealthStatus);
router.get('/gemini-chat/health', healthController_1.getHealthStatus); // Add specific health endpoint for chat
// Simple ping route that always responds quickly
router.get('/ping', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'pong' });
});
exports.default = router;
