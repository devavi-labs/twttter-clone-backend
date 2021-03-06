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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const typeorm_1 = require("typeorm");
const Quack_1 = require("./Quack");
const User_1 = require("./User");
let Like = class Like extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Like.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Like.prototype, "quackId", void 0);
__decorate([
    typeorm_1.OneToMany(() => Quack_1.Quack, (quack) => quack._likes),
    __metadata("design:type", Quack_1.Quack)
], Like.prototype, "quack", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Like.prototype, "userId", void 0);
__decorate([
    typeorm_1.OneToMany(() => User_1.User, (user) => user._likes),
    __metadata("design:type", User_1.User)
], Like.prototype, "user", void 0);
Like = __decorate([
    typeorm_1.Entity()
], Like);
exports.Like = Like;
//# sourceMappingURL=Like.js.map