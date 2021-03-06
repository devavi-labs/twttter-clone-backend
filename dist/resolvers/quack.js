"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.QuackResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Quack_1 = require("../entities/Quack");
const User_1 = require("../entities/User");
const QuackInput_1 = require("../input/QuackInput");
const partialAuth_1 = require("../middleware/partialAuth");
const PaginatedQuacks_1 = require("../response/PaginatedQuacks");
const QuackResponse_1 = require("../response/QuackResponse");
const getHashtags_1 = require("../utils/getHashtags");
const getMentions_1 = require("../utils/getMentions");
const paginate_1 = require("../utils/paginate");
const scrapeMetatags_1 = require("../utils/scrapeMetatags");
const quack_1 = require("../validators/quack");
let QuackResolver = class QuackResolver {
    truncatedText(quack) {
        if (quack.text.length > 50) {
            return quack.text.slice(0, 50) + "...";
        }
        return quack.text;
    }
    inReplyToQuack(quack, { quackLoader, blockLoader, payload: { user } }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!quack.inReplyToQuackId) {
                return null;
            }
            const rQuack = yield quackLoader.load(quack.inReplyToQuackId);
            if (!rQuack) {
                return null;
            }
            if (user) {
                const blocked = yield blockLoader.load({
                    userId: user.id,
                    blockedByUserId: rQuack.quackedByUserId,
                });
                if (blocked && blocked.length > 0) {
                    return null;
                }
            }
            return rQuack;
        });
    }
    quackedByUser(quack, { userLoader, blockLoader, payload: { user } }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user) {
                const blocked = yield blockLoader.load({
                    userId: user.id,
                    blockedByUserId: quack.quackedByUserId,
                });
                if (blocked && blocked.length > 0) {
                    return null;
                }
            }
            return userLoader.load(quack.quackedByUserId);
        });
    }
    requacks(quack, { requackLoaderByQuackId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const requacks = yield requackLoaderByQuackId.load(quack.id);
            return requacks ? requacks.length : 0;
        });
    }
    likes(quack, { likeLoaderByQuackId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const likes = yield likeLoaderByQuackId.load(quack.id);
            return likes ? likes.length : 0;
        });
    }
    replies(quack, { quackLoaderByInReplyToQuackId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const replies = yield quackLoaderByInReplyToQuackId.load(quack.id);
            return replies ? replies.length : 0;
        });
    }
    links(quack) {
        return scrapeMetatags_1.scrapeMetatags(quack.text, quack.id);
    }
    mentions(quack, { userLoaderByUsername, blockLoaderByUserId, payload: { user } }) {
        return __awaiter(this, void 0, void 0, function* () {
            const usernames = getMentions_1.getMentions(quack.text, false);
            const users = yield userLoaderByUsername.loadMany(usernames);
            if (user) {
                const blocks = (yield blockLoaderByUserId.load(user.id)).map((block) => block.blockedByUserId);
                return users.filter((user) => { var _a; return !blocks.includes((_a = user) === null || _a === void 0 ? void 0 : _a.id); });
            }
            return users;
        });
    }
    hashtags(quack) {
        return getHashtags_1.getHashtags(quack.text);
    }
    requackStatus(quack, { payload: { user }, requackLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return null;
            const requacks = yield requackLoader.load({
                quackId: quack.id,
                userId: user === null || user === void 0 ? void 0 : user.id,
            });
            if ((requacks === null || requacks === void 0 ? void 0 : requacks.length) > 0)
                return true;
            return false;
        });
    }
    likeStatus(quack, { payload: { user }, likeLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return null;
            const likes = yield likeLoader.load({
                quackId: quack.id,
                userId: user === null || user === void 0 ? void 0 : user.id,
            });
            if ((likes === null || likes === void 0 ? void 0 : likes.length) > 0)
                return true;
            return false;
        });
    }
    quack({ text, inReplyToQuackId }, { payload: { user } }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = new quack_1.QuackValidator(text).validate();
            if (errors.length !== 0) {
                return { errors };
            }
            if (inReplyToQuackId) {
                const inReplyToQuack = yield Quack_1.Quack.findOne({
                    where: { id: inReplyToQuackId, isVisible: true },
                });
                if (!inReplyToQuack) {
                    return {
                        errors: [
                            {
                                field: "inReplyToQuackId",
                                message: "The quack you are replying to no longer exists.",
                            },
                        ],
                    };
                }
            }
            const quack = Quack_1.Quack.create({
                text,
                quackedByUserId: user.id,
                inReplyToQuackId,
            });
            yield quack.save();
            return { quack };
        });
    }
    deleteQuack(quackId, { payload: { user } }) {
        return __awaiter(this, void 0, void 0, function* () {
            const quack = yield Quack_1.Quack.findOne(quackId);
            if (!quack)
                return true;
            if ((quack === null || quack === void 0 ? void 0 : quack.quackedByUserId) !== user.id)
                return false;
            yield quack.remove();
            return true;
        });
    }
    quackById(id, { payload: { user }, blockLoaderByUserId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = typeorm_1.getConnection()
                .getRepository(Quack_1.Quack)
                .createQueryBuilder("q")
                .where(`q.id = ${id}`)
                .andWhere(`q."isVisible" = true`);
            if (user) {
                const ids = (yield blockLoaderByUserId.load(user.id)).map((block) => block.blockedByUserId);
                if (ids.length > 0) {
                    q.andWhere(`q."quackedByUserId" not in (${ids.join(", ")})`);
                }
            }
            return yield q.getOne();
        });
    }
    quacksForMe(limit, lastIndex, { payload: { user }, followLoaderByFollowerId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = typeorm_1.getConnection()
                .createQueryBuilder()
                .select("q.*")
                .from(Quack_1.Quack, "q")
                .where(`q."isVisible" = true`);
            if (user) {
                const follows = yield followLoaderByFollowerId.load(user.id);
                if (follows && follows.length > 0) {
                    const ids = follows.map((follow) => follow.userId);
                    ids.push(user.id);
                    q.andWhere(`q."quackedByUserId" in (${ids.join(", ")})`);
                }
            }
            const { data: quacks, hasMore } = yield paginate_1.paginate({
                queryBuilder: q,
                index: "q.id",
                limit,
                lastIndex,
            });
            return {
                quacks,
                hasMore,
            };
        });
    }
    quacksFromUser(userId, limit, lastIndex, { payload: { user: me }, blockLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (me) {
                const blocks = yield blockLoader.load({
                    userId: me.id,
                    blockedByUserId: userId,
                });
                if (blocks && blocks.length > 0) {
                    return {
                        quacks: [],
                        hasMore: false,
                    };
                }
            }
            const user = yield User_1.User.findOne(userId);
            if (!user) {
                throw Error("User couldn't be found");
            }
            const q = typeorm_1.getConnection()
                .createQueryBuilder()
                .select("q.*")
                .from(Quack_1.Quack, "q")
                .where(`q."quackedByUserId" = ${userId}`);
            const { data: quacks, hasMore } = yield paginate_1.paginate({
                queryBuilder: q,
                index: "q.id",
                limit,
                lastIndex,
            });
            return {
                quacks,
                hasMore,
            };
        });
    }
    repliesOfQuack(quackId, limit, lastIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = typeorm_1.getConnection()
                .createQueryBuilder()
                .select("q.*")
                .from(Quack_1.Quack, "q")
                .where(`q."inReplyToQuackId" = ${quackId}`);
            const { data: quacks, hasMore } = yield paginate_1.paginate({
                queryBuilder: q,
                index: "q.id",
                limit,
                lastIndex,
            });
            return {
                quacks,
                hasMore,
            };
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => String, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack]),
    __metadata("design:returntype", void 0)
], QuackResolver.prototype, "truncatedText", null);
__decorate([
    type_graphql_1.FieldResolver(() => Quack_1.Quack, { nullable: true }),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "inReplyToQuack", null);
__decorate([
    type_graphql_1.FieldResolver(),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "quackedByUser", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "requacks", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "likes", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "replies", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "links", null);
__decorate([
    type_graphql_1.FieldResolver(),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "mentions", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack]),
    __metadata("design:returntype", void 0)
], QuackResolver.prototype, "hashtags", null);
__decorate([
    type_graphql_1.FieldResolver(),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "requackStatus", null);
__decorate([
    type_graphql_1.FieldResolver(),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quack_1.Quack, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "likeStatus", null);
__decorate([
    type_graphql_1.Mutation(() => QuackResponse_1.QuackResponse),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuackInput_1.QuackInput, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "quack", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.Authorized(),
    __param(0, type_graphql_1.Arg("quackId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "deleteQuack", null);
__decorate([
    type_graphql_1.Query(() => Quack_1.Quack, { nullable: true }),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "quackById", null);
__decorate([
    type_graphql_1.Query(() => PaginatedQuacks_1.PaginatedQuacks, { nullable: true }),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Arg("limit", () => type_graphql_1.Int, { nullable: true, defaultValue: 20 })),
    __param(1, type_graphql_1.Arg("lastIndex", () => type_graphql_1.Int, { nullable: true })),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "quacksForMe", null);
__decorate([
    type_graphql_1.Query(() => PaginatedQuacks_1.PaginatedQuacks, { nullable: true }),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Arg("userId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("limit", () => type_graphql_1.Int, { nullable: true, defaultValue: 20 })),
    __param(2, type_graphql_1.Arg("lastIndex", () => type_graphql_1.Int, { nullable: true })),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "quacksFromUser", null);
__decorate([
    type_graphql_1.Query(() => PaginatedQuacks_1.PaginatedQuacks, { nullable: true }),
    type_graphql_1.UseMiddleware(partialAuth_1.partialAuth),
    __param(0, type_graphql_1.Arg("quackId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("limit", () => type_graphql_1.Int, { nullable: true, defaultValue: 20 })),
    __param(2, type_graphql_1.Arg("lastIndex", () => type_graphql_1.Int, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], QuackResolver.prototype, "repliesOfQuack", null);
QuackResolver = __decorate([
    type_graphql_1.Resolver(Quack_1.Quack)
], QuackResolver);
exports.QuackResolver = QuackResolver;
//# sourceMappingURL=quack.js.map