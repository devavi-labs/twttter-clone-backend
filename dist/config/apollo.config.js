"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apolloConfig = void 0;
const type_graphql_1 = require("type-graphql");
const block_1 = require("../resolvers/block");
const follow_1 = require("../resolvers/follow");
const quack_1 = require("../resolvers/quack");
const user_1 = require("../resolvers/user");
const likeLoader_1 = require("../utils/likeLoader");
const requackLoader_1 = require("../utils/requackLoader");
const userLoader_1 = require("../utils/userLoader");
const apolloConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [user_1.UserResolver, follow_1.FollowResolver, quack_1.QuackResolver, block_1.BlockResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            userLoader: userLoader_1.userLoader(),
            requackLoaderByUserId: requackLoader_1.requackLoaderByUserId(),
            requackLoaderByQuackId: requackLoader_1.requackLoaderByQuackId(),
            likeLoaderByQuackId: likeLoader_1.likeLoaderByQuackId(),
            likeLoaderByUserId: likeLoader_1.likeLoaderByUserId(),
        }),
    });
});
exports.apolloConfig = apolloConfig;
//# sourceMappingURL=apollo.config.js.map