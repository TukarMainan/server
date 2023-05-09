const { Chat, User } = require("../models");
const { validate: uuidValidate } = require('uuid');

class TradeController {
    static async readBySender(req, res, next) {
        try {
            
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "TradeController: readBySender";
            next(err);
        }
    }

    static async readByTarget(req, res, next) {
        try {
            
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "TradeController: readByTarget";
            next(err);
        }
    }

    static async createTrade(req, res, next) {
        try {
            
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "TradeController: createTrade";
            next(err);
        }
    }

    static async changeStatus(req, res, next) {
        try {
            
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "TradeController: changeStatus";
            next(err);
        }
    }
}

module.exports = TradeController;
