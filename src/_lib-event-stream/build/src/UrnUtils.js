"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var URN_DELIMITER = ":";
var URN_FIELD_SCHEMA = [
    function (prefix) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, prefix === "urn"];
    }); }); },
    function (namespace) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); },
    function (entity) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); },
    function (property) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); },
];
var IllegalArgumentException = /** @class */ (function (_super) {
    __extends(IllegalArgumentException, _super);
    function IllegalArgumentException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return IllegalArgumentException;
}(Error));
exports.IllegalArgumentException = IllegalArgumentException;
function validateFieldUrn(urn) {
    return __awaiter(this, void 0, void 0, function () {
        var splits, result, err_1, falseResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    splits = urn.split(URN_DELIMITER);
                    if (splits.length !== URN_FIELD_SCHEMA.length) {
                        return [2 /*return*/, false];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(splits.map(function (value, index) { return URN_FIELD_SCHEMA[index](value); }))];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    throw new IllegalArgumentException(err_1);
                case 4:
                    falseResults = result.filter(function (re) { return re === false; });
                    return [2 /*return*/, falseResults.length === 0];
            }
        });
    });
}
exports.validateFieldUrn = validateFieldUrn;
function getFieldForUrn(urn) {
    return __awaiter(this, void 0, void 0, function () {
        var fieldSplits, prefix, namespace, entity, column, foreignKey, namespaceParts, reformattedEntity;
        return __generator(this, function (_a) {
            fieldSplits = urn.split(URN_DELIMITER);
            if (!(fieldSplits.length === 4 || fieldSplits.length === 5)) {
                throw new IllegalArgumentException("Urn is not valid " + urn);
            }
            if (fieldSplits.length === 4) {
                prefix = fieldSplits[0], namespace = fieldSplits[1], entity = fieldSplits[2], column = fieldSplits[3];
            }
            else {
                prefix = fieldSplits[0], namespace = fieldSplits[1], entity = fieldSplits[2], foreignKey = fieldSplits[3], column = fieldSplits[4];
            }
            namespaceParts = entity.split(".");
            reformattedEntity = namespaceParts.pop();
            return [2 /*return*/, {
                    namespace: namespace,
                    entity: reformattedEntity,
                    column: column,
                }];
        });
    });
}
exports.getFieldForUrn = getFieldForUrn;
function getFieldUrnFromProcessUrn(urn) {
    return __awaiter(this, void 0, void 0, function () {
        var field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFieldForUrn(urn)];
                case 1:
                    field = _a.sent();
                    return [2 /*return*/, ["urn", field.namespace, field.entity, field.column].join(URN_DELIMITER)];
            }
        });
    });
}
exports.getFieldUrnFromProcessUrn = getFieldUrnFromProcessUrn;
function getEntityId(urn) {
    var splits = urn.split(URN_DELIMITER);
    if (splits.length !== 5) {
        throw new IllegalArgumentException("urn is not a process urn " + urn);
    }
    return splits[splits.length - 2];
}
exports.getEntityId = getEntityId;
//# sourceMappingURL=UrnUtils.js.map