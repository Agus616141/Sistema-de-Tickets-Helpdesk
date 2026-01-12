export function notFoundHandler(err, _req, res, _next) {
    res.status(505).json({
        error: "Internal server error",
    });
}
//# sourceMappingURL=errorHandler.js.map