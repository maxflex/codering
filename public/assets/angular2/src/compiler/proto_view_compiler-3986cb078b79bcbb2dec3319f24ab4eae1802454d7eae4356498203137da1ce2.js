'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var template_ast_1 = require('./template_ast');
var source_module_1 = require('./source_module');
var view_1 = require('angular2/src/core/linker/view');
var view_type_1 = require('angular2/src/core/linker/view_type');
var element_1 = require('angular2/src/core/linker/element');
var util_1 = require('./util');
var di_1 = require('angular2/src/core/di');
exports.PROTO_VIEW_JIT_IMPORTS = lang_1.CONST_EXPR({ 'AppProtoView': view_1.AppProtoView, 'AppProtoElement': element_1.AppProtoElement, 'ViewType': view_type_1.ViewType });
// TODO: have a single file that reexports everything needed for
// codegen explicitly
// - helps understanding what codegen works against
// - less imports in codegen code
exports.APP_VIEW_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/view' + util_1.MODULE_SUFFIX);
exports.VIEW_TYPE_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/view_type' + util_1.MODULE_SUFFIX);
exports.APP_EL_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/element' + util_1.MODULE_SUFFIX);
exports.METADATA_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/metadata/view' + util_1.MODULE_SUFFIX);
var IMPLICIT_TEMPLATE_VAR = '\$implicit';
var CLASS_ATTR = 'class';
var STYLE_ATTR = 'style';
var ProtoViewCompiler = (function () {
    function ProtoViewCompiler() {
    }
    ProtoViewCompiler.prototype.compileProtoViewRuntime = function (metadataCache, component, template, pipes) {
        var protoViewFactory = new RuntimeProtoViewFactory(metadataCache, component, pipes);
        var allProtoViews = [];
        protoViewFactory.createCompileProtoView(template, [], [], allProtoViews);
        return new CompileProtoViews([], allProtoViews);
    };
    ProtoViewCompiler.prototype.compileProtoViewCodeGen = function (resolvedMetadataCacheExpr, component, template, pipes) {
        var protoViewFactory = new CodeGenProtoViewFactory(resolvedMetadataCacheExpr, component, pipes);
        var allProtoViews = [];
        var allStatements = [];
        protoViewFactory.createCompileProtoView(template, [], allStatements, allProtoViews);
        return new CompileProtoViews(allStatements.map(function (stmt) { return stmt.statement; }), allProtoViews);
    };
    ProtoViewCompiler = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ProtoViewCompiler);
    return ProtoViewCompiler;
})();
exports.ProtoViewCompiler = ProtoViewCompiler;
var CompileProtoViews = (function () {
    function CompileProtoViews(declarations, protoViews) {
        this.declarations = declarations;
        this.protoViews = protoViews;
    }
    return CompileProtoViews;
})();
exports.CompileProtoViews = CompileProtoViews;
var CompileProtoView = (function () {
    function CompileProtoView(embeddedTemplateIndex, protoElements, protoView) {
        this.embeddedTemplateIndex = embeddedTemplateIndex;
        this.protoElements = protoElements;
        this.protoView = protoView;
    }
    return CompileProtoView;
})();
exports.CompileProtoView = CompileProtoView;
var CompileProtoElement = (function () {
    function CompileProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex, appProtoEl) {
        this.boundElementIndex = boundElementIndex;
        this.attrNameAndValues = attrNameAndValues;
        this.variableNameAndValues = variableNameAndValues;
        this.renderEvents = renderEvents;
        this.directives = directives;
        this.embeddedTemplateIndex = embeddedTemplateIndex;
        this.appProtoEl = appProtoEl;
    }
    return CompileProtoElement;
})();
exports.CompileProtoElement = CompileProtoElement;
function visitAndReturnContext(visitor, asts, context) {
    template_ast_1.templateVisitAll(visitor, asts, context);
    return context;
}
var ProtoViewFactory = (function () {
    function ProtoViewFactory(component) {
        this.component = component;
    }
    ProtoViewFactory.prototype.createCompileProtoView = function (template, templateVariableBindings, targetStatements, targetProtoViews) {
        var embeddedTemplateIndex = targetProtoViews.length;
        // Note: targetProtoViews needs to be in depth first order.
        // So we "reserve" a space here that we fill after the recursion is done
        targetProtoViews.push(null);
        var builder = new ProtoViewBuilderVisitor(this, targetStatements, targetProtoViews);
        template_ast_1.templateVisitAll(builder, template);
        var viewType = getViewType(this.component, embeddedTemplateIndex);
        var appProtoView = this.createAppProtoView(embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements);
        var cpv = new CompileProtoView(embeddedTemplateIndex, builder.protoElements, appProtoView);
        targetProtoViews[embeddedTemplateIndex] = cpv;
        return cpv;
    };
    return ProtoViewFactory;
})();
var CodeGenProtoViewFactory = (function (_super) {
    __extends(CodeGenProtoViewFactory, _super);
    function CodeGenProtoViewFactory(resolvedMetadataCacheExpr, component, pipes) {
        _super.call(this, component);
        this.resolvedMetadataCacheExpr = resolvedMetadataCacheExpr;
        this.pipes = pipes;
        this._nextVarId = 0;
    }
    CodeGenProtoViewFactory.prototype._nextProtoViewVar = function (embeddedTemplateIndex) {
        return "appProtoView" + this._nextVarId++ + "_" + this.component.type.name + embeddedTemplateIndex;
    };
    CodeGenProtoViewFactory.prototype.createAppProtoView = function (embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements) {
        var protoViewVarName = this._nextProtoViewVar(embeddedTemplateIndex);
        var viewTypeExpr = codeGenViewType(viewType);
        var pipesExpr = embeddedTemplateIndex === 0 ?
            codeGenTypesArray(this.pipes.map(function (pipeMeta) { return pipeMeta.type; })) :
            null;
        var statement = "var " + protoViewVarName + " = " + exports.APP_VIEW_MODULE_REF + "AppProtoView.create(" + this.resolvedMetadataCacheExpr.expression + ", " + viewTypeExpr + ", " + pipesExpr + ", " + util_1.codeGenStringMap(templateVariableBindings) + ");";
        targetStatements.push(new util_1.Statement(statement));
        return new util_1.Expression(protoViewVarName);
    };
    CodeGenProtoViewFactory.prototype.createAppProtoElement = function (boundElementIndex, attrNameAndValues, variableNameAndValues, directives, targetStatements) {
        var varName = "appProtoEl" + this._nextVarId++ + "_" + this.component.type.name;
        var value = exports.APP_EL_MODULE_REF + "AppProtoElement.create(\n        " + this.resolvedMetadataCacheExpr.expression + ",\n        " + boundElementIndex + ",\n        " + util_1.codeGenStringMap(attrNameAndValues) + ",\n        " + codeGenDirectivesArray(directives) + ",\n        " + util_1.codeGenStringMap(variableNameAndValues) + "\n      )";
        var statement = "var " + varName + " = " + value + ";";
        targetStatements.push(new util_1.Statement(statement));
        return new util_1.Expression(varName);
    };
    return CodeGenProtoViewFactory;
})(ProtoViewFactory);
var RuntimeProtoViewFactory = (function (_super) {
    __extends(RuntimeProtoViewFactory, _super);
    function RuntimeProtoViewFactory(metadataCache, component, pipes) {
        _super.call(this, component);
        this.metadataCache = metadataCache;
        this.pipes = pipes;
    }
    RuntimeProtoViewFactory.prototype.createAppProtoView = function (embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements) {
        var pipes = embeddedTemplateIndex === 0 ? this.pipes.map(function (pipeMeta) { return pipeMeta.type.runtime; }) : [];
        var templateVars = keyValueArrayToStringMap(templateVariableBindings);
        return view_1.AppProtoView.create(this.metadataCache, viewType, pipes, templateVars);
    };
    RuntimeProtoViewFactory.prototype.createAppProtoElement = function (boundElementIndex, attrNameAndValues, variableNameAndValues, directives, targetStatements) {
        var attrs = keyValueArrayToStringMap(attrNameAndValues);
        return element_1.AppProtoElement.create(this.metadataCache, boundElementIndex, attrs, directives.map(function (dirMeta) { return dirMeta.type.runtime; }), keyValueArrayToStringMap(variableNameAndValues));
    };
    return RuntimeProtoViewFactory;
})(ProtoViewFactory);
var ProtoViewBuilderVisitor = (function () {
    function ProtoViewBuilderVisitor(factory, allStatements, allProtoViews) {
        this.factory = factory;
        this.allStatements = allStatements;
        this.allProtoViews = allProtoViews;
        this.protoElements = [];
        this.boundElementCount = 0;
    }
    ProtoViewBuilderVisitor.prototype._readAttrNameAndValues = function (directives, attrAsts) {
        var attrs = visitAndReturnContext(this, attrAsts, {});
        directives.forEach(function (directiveMeta) {
            collection_1.StringMapWrapper.forEach(directiveMeta.hostAttributes, function (value, name) {
                var prevValue = attrs[name];
                attrs[name] = lang_1.isPresent(prevValue) ? mergeAttributeValue(name, prevValue, value) : value;
            });
        });
        return mapToKeyValueArray(attrs);
    };
    ProtoViewBuilderVisitor.prototype.visitBoundText = function (ast, context) { return null; };
    ProtoViewBuilderVisitor.prototype.visitText = function (ast, context) { return null; };
    ProtoViewBuilderVisitor.prototype.visitNgContent = function (ast, context) { return null; };
    ProtoViewBuilderVisitor.prototype.visitElement = function (ast, context) {
        var _this = this;
        var boundElementIndex = null;
        if (ast.isBound()) {
            boundElementIndex = this.boundElementCount++;
        }
        var component = ast.getComponent();
        var variableNameAndValues = [];
        if (lang_1.isBlank(component)) {
            ast.exportAsVars.forEach(function (varAst) { variableNameAndValues.push([varAst.name, null]); });
        }
        var directives = [];
        var renderEvents = visitAndReturnContext(this, ast.outputs, new Map());
        collection_1.ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
            directiveAst.visit(_this, new DirectiveContext(index, boundElementIndex, renderEvents, variableNameAndValues, directives));
        });
        var renderEventArray = [];
        renderEvents.forEach(function (eventAst, _) { return renderEventArray.push(eventAst); });
        var attrNameAndValues = this._readAttrNameAndValues(directives, ast.attrs);
        this._addProtoElement(ast.isBound(), boundElementIndex, attrNameAndValues, variableNameAndValues, renderEventArray, directives, null);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    ProtoViewBuilderVisitor.prototype.visitEmbeddedTemplate = function (ast, context) {
        var _this = this;
        var boundElementIndex = this.boundElementCount++;
        var directives = [];
        collection_1.ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
            directiveAst.visit(_this, new DirectiveContext(index, boundElementIndex, new Map(), [], directives));
        });
        var attrNameAndValues = this._readAttrNameAndValues(directives, ast.attrs);
        var templateVariableBindings = ast.vars.map(function (varAst) { return [varAst.value.length > 0 ? varAst.value : IMPLICIT_TEMPLATE_VAR, varAst.name]; });
        var nestedProtoView = this.factory.createCompileProtoView(ast.children, templateVariableBindings, this.allStatements, this.allProtoViews);
        this._addProtoElement(true, boundElementIndex, attrNameAndValues, [], [], directives, nestedProtoView.embeddedTemplateIndex);
        return null;
    };
    ProtoViewBuilderVisitor.prototype._addProtoElement = function (isBound, boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex) {
        var appProtoEl = null;
        if (isBound) {
            appProtoEl =
                this.factory.createAppProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, directives, this.allStatements);
        }
        var compileProtoEl = new CompileProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex, appProtoEl);
        this.protoElements.push(compileProtoEl);
    };
    ProtoViewBuilderVisitor.prototype.visitVariable = function (ast, ctx) { return null; };
    ProtoViewBuilderVisitor.prototype.visitAttr = function (ast, attrNameAndValues) {
        attrNameAndValues[ast.name] = ast.value;
        return null;
    };
    ProtoViewBuilderVisitor.prototype.visitDirective = function (ast, ctx) {
        ctx.targetDirectives.push(ast.directive);
        template_ast_1.templateVisitAll(this, ast.hostEvents, ctx.hostEventTargetAndNames);
        ast.exportAsVars.forEach(function (varAst) { ctx.targetVariableNameAndValues.push([varAst.name, ctx.index]); });
        return null;
    };
    ProtoViewBuilderVisitor.prototype.visitEvent = function (ast, eventTargetAndNames) {
        eventTargetAndNames.set(ast.fullName, ast);
        return null;
    };
    ProtoViewBuilderVisitor.prototype.visitDirectiveProperty = function (ast, context) { return null; };
    ProtoViewBuilderVisitor.prototype.visitElementProperty = function (ast, context) { return null; };
    return ProtoViewBuilderVisitor;
})();
function mapToKeyValueArray(data) {
    var entryArray = [];
    collection_1.StringMapWrapper.forEach(data, function (value, name) { entryArray.push([name, value]); });
    // We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    collection_1.ListWrapper.sort(entryArray, function (entry1, entry2) { return lang_1.StringWrapper.compare(entry1[0], entry2[0]); });
    var keyValueArray = [];
    entryArray.forEach(function (entry) { keyValueArray.push([entry[0], entry[1]]); });
    return keyValueArray;
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
        return attrValue1 + " " + attrValue2;
    }
    else {
        return attrValue2;
    }
}
var DirectiveContext = (function () {
    function DirectiveContext(index, boundElementIndex, hostEventTargetAndNames, targetVariableNameAndValues, targetDirectives) {
        this.index = index;
        this.boundElementIndex = boundElementIndex;
        this.hostEventTargetAndNames = hostEventTargetAndNames;
        this.targetVariableNameAndValues = targetVariableNameAndValues;
        this.targetDirectives = targetDirectives;
    }
    return DirectiveContext;
})();
function keyValueArrayToStringMap(keyValueArray) {
    var stringMap = {};
    for (var i = 0; i < keyValueArray.length; i++) {
        var entry = keyValueArray[i];
        stringMap[entry[0]] = entry[1];
    }
    return stringMap;
}
function codeGenDirectivesArray(directives) {
    var expressions = directives.map(function (directiveType) { return typeRef(directiveType.type); });
    return "[" + expressions.join(',') + "]";
}
function codeGenTypesArray(types) {
    var expressions = types.map(typeRef);
    return "[" + expressions.join(',') + "]";
}
function codeGenViewType(value) {
    if (lang_1.IS_DART) {
        return "" + exports.VIEW_TYPE_MODULE_REF + value;
    }
    else {
        return "" + value;
    }
}
function typeRef(type) {
    return "" + source_module_1.moduleRef(type.moduleUrl) + type.name;
}
function getViewType(component, embeddedTemplateIndex) {
    if (embeddedTemplateIndex > 0) {
        return view_type_1.ViewType.EMBEDDED;
    }
    else if (component.type.isHost) {
        return view_type_1.ViewType.HOST;
    }
    else {
        return view_type_1.ViewType.COMPONENT;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9fdmlld19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9jb21waWxlci9wcm90b192aWV3X2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbIlByb3RvVmlld0NvbXBpbGVyIiwiUHJvdG9WaWV3Q29tcGlsZXIuY29uc3RydWN0b3IiLCJQcm90b1ZpZXdDb21waWxlci5jb21waWxlUHJvdG9WaWV3UnVudGltZSIsIlByb3RvVmlld0NvbXBpbGVyLmNvbXBpbGVQcm90b1ZpZXdDb2RlR2VuIiwiQ29tcGlsZVByb3RvVmlld3MiLCJDb21waWxlUHJvdG9WaWV3cy5jb25zdHJ1Y3RvciIsIkNvbXBpbGVQcm90b1ZpZXciLCJDb21waWxlUHJvdG9WaWV3LmNvbnN0cnVjdG9yIiwiQ29tcGlsZVByb3RvRWxlbWVudCIsIkNvbXBpbGVQcm90b0VsZW1lbnQuY29uc3RydWN0b3IiLCJ2aXNpdEFuZFJldHVybkNvbnRleHQiLCJQcm90b1ZpZXdGYWN0b3J5IiwiUHJvdG9WaWV3RmFjdG9yeS5jb25zdHJ1Y3RvciIsIlByb3RvVmlld0ZhY3RvcnkuY3JlYXRlQ29tcGlsZVByb3RvVmlldyIsIkNvZGVHZW5Qcm90b1ZpZXdGYWN0b3J5IiwiQ29kZUdlblByb3RvVmlld0ZhY3RvcnkuY29uc3RydWN0b3IiLCJDb2RlR2VuUHJvdG9WaWV3RmFjdG9yeS5fbmV4dFByb3RvVmlld1ZhciIsIkNvZGVHZW5Qcm90b1ZpZXdGYWN0b3J5LmNyZWF0ZUFwcFByb3RvVmlldyIsIkNvZGVHZW5Qcm90b1ZpZXdGYWN0b3J5LmNyZWF0ZUFwcFByb3RvRWxlbWVudCIsIlJ1bnRpbWVQcm90b1ZpZXdGYWN0b3J5IiwiUnVudGltZVByb3RvVmlld0ZhY3RvcnkuY29uc3RydWN0b3IiLCJSdW50aW1lUHJvdG9WaWV3RmFjdG9yeS5jcmVhdGVBcHBQcm90b1ZpZXciLCJSdW50aW1lUHJvdG9WaWV3RmFjdG9yeS5jcmVhdGVBcHBQcm90b0VsZW1lbnQiLCJQcm90b1ZpZXdCdWlsZGVyVmlzaXRvciIsIlByb3RvVmlld0J1aWxkZXJWaXNpdG9yLmNvbnN0cnVjdG9yIiwiUHJvdG9WaWV3QnVpbGRlclZpc2l0b3IuX3JlYWRBdHRyTmFtZUFuZFZhbHVlcyIsIlByb3RvVmlld0J1aWxkZXJWaXNpdG9yLnZpc2l0Qm91bmRUZXh0IiwiUHJvdG9WaWV3QnVpbGRlclZpc2l0b3IudmlzaXRUZXh0IiwiUHJvdG9WaWV3QnVpbGRlclZpc2l0b3IudmlzaXROZ0NvbnRlbnQiLCJQcm90b1ZpZXdCdWlsZGVyVmlzaXRvci52aXNpdEVsZW1lbnQiLCJQcm90b1ZpZXdCdWlsZGVyVmlzaXRvci52aXNpdEVtYmVkZGVkVGVtcGxhdGUiLCJQcm90b1ZpZXdCdWlsZGVyVmlzaXRvci5fYWRkUHJvdG9FbGVtZW50IiwiUHJvdG9WaWV3QnVpbGRlclZpc2l0b3IudmlzaXRWYXJpYWJsZSIsIlByb3RvVmlld0J1aWxkZXJWaXNpdG9yLnZpc2l0QXR0ciIsIlByb3RvVmlld0J1aWxkZXJWaXNpdG9yLnZpc2l0RGlyZWN0aXZlIiwiUHJvdG9WaWV3QnVpbGRlclZpc2l0b3IudmlzaXRFdmVudCIsIlByb3RvVmlld0J1aWxkZXJWaXNpdG9yLnZpc2l0RGlyZWN0aXZlUHJvcGVydHkiLCJQcm90b1ZpZXdCdWlsZGVyVmlzaXRvci52aXNpdEVsZW1lbnRQcm9wZXJ0eSIsIm1hcFRvS2V5VmFsdWVBcnJheSIsIm1lcmdlQXR0cmlidXRlVmFsdWUiLCJEaXJlY3RpdmVDb250ZXh0IiwiRGlyZWN0aXZlQ29udGV4dC5jb25zdHJ1Y3RvciIsImtleVZhbHVlQXJyYXlUb1N0cmluZ01hcCIsImNvZGVHZW5EaXJlY3RpdmVzQXJyYXkiLCJjb2RlR2VuVHlwZXNBcnJheSIsImNvZGVHZW5WaWV3VHlwZSIsInR5cGVSZWYiLCJnZXRWaWV3VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFRTywwQkFBMEIsQ0FBQyxDQUFBO0FBQ2xDLDJCQUtPLGdDQUFnQyxDQUFDLENB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c2VudCxcbiAgaXNCbGFuayxcbiAgVHlwZSxcbiAgaXNTdHJpbmcsXG4gIFN0cmluZ1dyYXBwZXIsXG4gIElTX0RBUlQsXG4gIENPTlNUX0VYUFJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIFNldFdyYXBwZXIsXG4gIFN0cmluZ01hcFdyYXBwZXIsXG4gIExpc3RXcmFwcGVyLFxuICBNYXBXcmFwcGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1xuICBUZW1wbGF0ZUFzdCxcbiAgVGVtcGxhdGVBc3RWaXNpdG9yLFxuICBOZ0NvbnRlbnRBc3QsXG4gIEVtYmVkZGVkVGVtcGxhdGVBc3QsXG4gIEVsZW1lbnRBc3QsXG4gIFZhcmlhYmxlQXN0LFxuICBCb3VuZEV2ZW50QXN0LFxuICBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCxcbiAgQXR0ckFzdCxcbiAgQm91bmRUZXh0QXN0LFxuICBUZXh0QXN0LFxuICBEaXJlY3RpdmVBc3QsXG4gIEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsXG4gIHRlbXBsYXRlVmlzaXRBbGxcbn0gZnJvbSAnLi90ZW1wbGF0ZV9hc3QnO1xuaW1wb3J0IHtcbiAgQ29tcGlsZVR5cGVNZXRhZGF0YSxcbiAgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICBDb21waWxlUGlwZU1ldGFkYXRhXG59IGZyb20gJy4vZGlyZWN0aXZlX21ldGFkYXRhJztcbmltcG9ydCB7U291cmNlRXhwcmVzc2lvbnMsIFNvdXJjZUV4cHJlc3Npb24sIG1vZHVsZVJlZn0gZnJvbSAnLi9zb3VyY2VfbW9kdWxlJztcbmltcG9ydCB7QXBwUHJvdG9WaWV3LCBBcHBWaWV3fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlldyc7XG5pbXBvcnQge1ZpZXdUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld190eXBlJztcbmltcG9ydCB7QXBwUHJvdG9FbGVtZW50LCBBcHBFbGVtZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvZWxlbWVudCc7XG5pbXBvcnQge1Jlc29sdmVkTWV0YWRhdGFDYWNoZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3Jlc29sdmVkX21ldGFkYXRhX2NhY2hlJztcbmltcG9ydCB7XG4gIGVzY2FwZVNpbmdsZVF1b3RlU3RyaW5nLFxuICBjb2RlR2VuQ29uc3RDb25zdHJ1Y3RvckNhbGwsXG4gIGNvZGVHZW5WYWx1ZUZuLFxuICBjb2RlR2VuRm5IZWFkZXIsXG4gIE1PRFVMRV9TVUZGSVgsXG4gIGNvZGVHZW5TdHJpbmdNYXAsXG4gIEV4cHJlc3Npb24sXG4gIFN0YXRlbWVudFxufSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5cbmV4cG9ydCBjb25zdCBQUk9UT19WSUVXX0pJVF9JTVBPUlRTID0gQ09OU1RfRVhQUihcbiAgICB7J0FwcFByb3RvVmlldyc6IEFwcFByb3RvVmlldywgJ0FwcFByb3RvRWxlbWVudCc6IEFwcFByb3RvRWxlbWVudCwgJ1ZpZXdUeXBlJzogVmlld1R5cGV9KTtcblxuLy8gVE9ETzogaGF2ZSBhIHNpbmdsZSBmaWxlIHRoYXQgcmVleHBvcnRzIGV2ZXJ5dGhpbmcgbmVlZGVkIGZvclxuLy8gY29kZWdlbiBleHBsaWNpdGx5XG4vLyAtIGhlbHBzIHVuZGVyc3RhbmRpbmcgd2hhdCBjb2RlZ2VuIHdvcmtzIGFnYWluc3Rcbi8vIC0gbGVzcyBpbXBvcnRzIGluIGNvZGVnZW4gY29kZVxuZXhwb3J0IHZhciBBUFBfVklFV19NT0RVTEVfUkVGID0gbW9kdWxlUmVmKCdwYWNrYWdlOmFuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3JyArIE1PRFVMRV9TVUZGSVgpO1xuZXhwb3J0IHZhciBWSUVXX1RZUEVfTU9EVUxFX1JFRiA9XG4gICAgbW9kdWxlUmVmKCdwYWNrYWdlOmFuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3X3R5cGUnICsgTU9EVUxFX1NVRkZJWCk7XG5leHBvcnQgdmFyIEFQUF9FTF9NT0RVTEVfUkVGID1cbiAgICBtb2R1bGVSZWYoJ3BhY2thZ2U6YW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2VsZW1lbnQnICsgTU9EVUxFX1NVRkZJWCk7XG5leHBvcnQgdmFyIE1FVEFEQVRBX01PRFVMRV9SRUYgPVxuICAgIG1vZHVsZVJlZigncGFja2FnZTphbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS92aWV3JyArIE1PRFVMRV9TVUZGSVgpO1xuXG5jb25zdCBJTVBMSUNJVF9URU1QTEFURV9WQVIgPSAnXFwkaW1wbGljaXQnO1xuY29uc3QgQ0xBU1NfQVRUUiA9ICdjbGFzcyc7XG5jb25zdCBTVFlMRV9BVFRSID0gJ3N0eWxlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFByb3RvVmlld0NvbXBpbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGNvbXBpbGVQcm90b1ZpZXdSdW50aW1lKG1ldGFkYXRhQ2FjaGU6IFJlc29sdmVkTWV0YWRhdGFDYWNoZSwgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdKTpcbiAgICAgIENvbXBpbGVQcm90b1ZpZXdzPEFwcFByb3RvVmlldywgQXBwUHJvdG9FbGVtZW50LCBhbnk+IHtcbiAgICB2YXIgcHJvdG9WaWV3RmFjdG9yeSA9IG5ldyBSdW50aW1lUHJvdG9WaWV3RmFjdG9yeShtZXRhZGF0YUNhY2hlLCBjb21wb25lbnQsIHBpcGVzKTtcbiAgICB2YXIgYWxsUHJvdG9WaWV3cyA9IFtdO1xuICAgIHByb3RvVmlld0ZhY3RvcnkuY3JlYXRlQ29tcGlsZVByb3RvVmlldyh0ZW1wbGF0ZSwgW10sIFtdLCBhbGxQcm90b1ZpZXdzKTtcbiAgICByZXR1cm4gbmV3IENvbXBpbGVQcm90b1ZpZXdzPEFwcFByb3RvVmlldywgQXBwUHJvdG9FbGVtZW50LCBhbnk+KFtdLCBhbGxQcm90b1ZpZXdzKTtcbiAgfVxuXG4gIGNvbXBpbGVQcm90b1ZpZXdDb2RlR2VuKHJlc29sdmVkTWV0YWRhdGFDYWNoZUV4cHI6IEV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCB0ZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSk6XG4gICAgICBDb21waWxlUHJvdG9WaWV3czxFeHByZXNzaW9uLCBFeHByZXNzaW9uLCBzdHJpbmc+IHtcbiAgICB2YXIgcHJvdG9WaWV3RmFjdG9yeSA9IG5ldyBDb2RlR2VuUHJvdG9WaWV3RmFjdG9yeShyZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByLCBjb21wb25lbnQsIHBpcGVzKTtcbiAgICB2YXIgYWxsUHJvdG9WaWV3cyA9IFtdO1xuICAgIHZhciBhbGxTdGF0ZW1lbnRzID0gW107XG4gICAgcHJvdG9WaWV3RmFjdG9yeS5jcmVhdGVDb21waWxlUHJvdG9WaWV3KHRlbXBsYXRlLCBbXSwgYWxsU3RhdGVtZW50cywgYWxsUHJvdG9WaWV3cyk7XG4gICAgcmV0dXJuIG5ldyBDb21waWxlUHJvdG9WaWV3czxFeHByZXNzaW9uLCBFeHByZXNzaW9uLCBzdHJpbmc+KFxuICAgICAgICBhbGxTdGF0ZW1lbnRzLm1hcChzdG10ID0+IHN0bXQuc3RhdGVtZW50KSwgYWxsUHJvdG9WaWV3cyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVQcm90b1ZpZXdzPEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUwsIFNUQVRFTUVOVD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGVjbGFyYXRpb25zOiBTVEFURU1FTlRbXSxcbiAgICAgICAgICAgICAgcHVibGljIHByb3RvVmlld3M6IENvbXBpbGVQcm90b1ZpZXc8QVBQX1BST1RPX1ZJRVcsIEFQUF9QUk9UT19FTD5bXSkge31cbn1cblxuXG5leHBvcnQgY2xhc3MgQ29tcGlsZVByb3RvVmlldzxBUFBfUFJPVE9fVklFVywgQVBQX1BST1RPX0VMPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbWJlZGRlZFRlbXBsYXRlSW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIHByb3RvRWxlbWVudHM6IENvbXBpbGVQcm90b0VsZW1lbnQ8QVBQX1BST1RPX0VMPltdLFxuICAgICAgICAgICAgICBwdWJsaWMgcHJvdG9WaWV3OiBBUFBfUFJPVE9fVklFVykge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVQcm90b0VsZW1lbnQ8QVBQX1BST1RPX0VMPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBib3VuZEVsZW1lbnRJbmRleCwgcHVibGljIGF0dHJOYW1lQW5kVmFsdWVzOiBzdHJpbmdbXVtdLFxuICAgICAgICAgICAgICBwdWJsaWMgdmFyaWFibGVOYW1lQW5kVmFsdWVzOiBzdHJpbmdbXVtdLCBwdWJsaWMgcmVuZGVyRXZlbnRzOiBCb3VuZEV2ZW50QXN0W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSwgcHVibGljIGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgYXBwUHJvdG9FbDogQVBQX1BST1RPX0VMKSB7fVxufVxuXG5mdW5jdGlvbiB2aXNpdEFuZFJldHVybkNvbnRleHQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBhc3RzOiBUZW1wbGF0ZUFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gIHRlbXBsYXRlVmlzaXRBbGwodmlzaXRvciwgYXN0cywgY29udGV4dCk7XG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5hYnN0cmFjdCBjbGFzcyBQcm90b1ZpZXdGYWN0b3J5PEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUwsIFNUQVRFTUVOVD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpIHt9XG5cbiAgYWJzdHJhY3QgY3JlYXRlQXBwUHJvdG9WaWV3KGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyLCB2aWV3VHlwZTogVmlld1R5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3M6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZW1lbnRzOiBTVEFURU1FTlRbXSk6IEFQUF9QUk9UT19WSUVXO1xuXG4gIGFic3RyYWN0IGNyZWF0ZUFwcFByb3RvRWxlbWVudChib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyLCBhdHRyTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGVtZW50czogU1RBVEVNRU5UW10pOiBBUFBfUFJPVE9fRUw7XG5cbiAgY3JlYXRlQ29tcGlsZVByb3RvVmlldyh0ZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSwgdGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzOiBzdHJpbmdbXVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlbWVudHM6IFNUQVRFTUVOVFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFByb3RvVmlld3M6IENvbXBpbGVQcm90b1ZpZXc8QVBQX1BST1RPX1ZJRVcsIEFQUF9QUk9UT19FTD5bXSk6XG4gICAgICBDb21waWxlUHJvdG9WaWV3PEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUw+IHtcbiAgICB2YXIgZW1iZWRkZWRUZW1wbGF0ZUluZGV4ID0gdGFyZ2V0UHJvdG9WaWV3cy5sZW5ndGg7XG4gICAgLy8gTm90ZTogdGFyZ2V0UHJvdG9WaWV3cyBuZWVkcyB0byBiZSBpbiBkZXB0aCBmaXJzdCBvcmRlci5cbiAgICAvLyBTbyB3ZSBcInJlc2VydmVcIiBhIHNwYWNlIGhlcmUgdGhhdCB3ZSBmaWxsIGFmdGVyIHRoZSByZWN1cnNpb24gaXMgZG9uZVxuICAgIHRhcmdldFByb3RvVmlld3MucHVzaChudWxsKTtcbiAgICB2YXIgYnVpbGRlciA9IG5ldyBQcm90b1ZpZXdCdWlsZGVyVmlzaXRvcjxBUFBfUFJPVE9fVklFVywgQVBQX1BST1RPX0VMLCBhbnk+KFxuICAgICAgICB0aGlzLCB0YXJnZXRTdGF0ZW1lbnRzLCB0YXJnZXRQcm90b1ZpZXdzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKGJ1aWxkZXIsIHRlbXBsYXRlKTtcbiAgICB2YXIgdmlld1R5cGUgPSBnZXRWaWV3VHlwZSh0aGlzLmNvbXBvbmVudCwgZW1iZWRkZWRUZW1wbGF0ZUluZGV4KTtcbiAgICB2YXIgYXBwUHJvdG9WaWV3ID0gdGhpcy5jcmVhdGVBcHBQcm90b1ZpZXcoZW1iZWRkZWRUZW1wbGF0ZUluZGV4LCB2aWV3VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzLCB0YXJnZXRTdGF0ZW1lbnRzKTtcbiAgICB2YXIgY3B2ID0gbmV3IENvbXBpbGVQcm90b1ZpZXc8QVBQX1BST1RPX1ZJRVcsIEFQUF9QUk9UT19FTD4oXG4gICAgICAgIGVtYmVkZGVkVGVtcGxhdGVJbmRleCwgYnVpbGRlci5wcm90b0VsZW1lbnRzLCBhcHBQcm90b1ZpZXcpO1xuICAgIHRhcmdldFByb3RvVmlld3NbZW1iZWRkZWRUZW1wbGF0ZUluZGV4XSA9IGNwdjtcbiAgICByZXR1cm4gY3B2O1xuICB9XG59XG5cbmNsYXNzIENvZGVHZW5Qcm90b1ZpZXdGYWN0b3J5IGV4dGVuZHMgUHJvdG9WaWV3RmFjdG9yeTxFeHByZXNzaW9uLCBFeHByZXNzaW9uLCBTdGF0ZW1lbnQ+IHtcbiAgcHJpdmF0ZSBfbmV4dFZhcklkOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByOiBFeHByZXNzaW9uLCBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgcHVibGljIHBpcGVzOiBDb21waWxlUGlwZU1ldGFkYXRhW10pIHtcbiAgICBzdXBlcihjb21wb25lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbmV4dFByb3RvVmlld1ZhcihlbWJlZGRlZFRlbXBsYXRlSW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBhcHBQcm90b1ZpZXcke3RoaXMuX25leHRWYXJJZCsrfV8ke3RoaXMuY29tcG9uZW50LnR5cGUubmFtZX0ke2VtYmVkZGVkVGVtcGxhdGVJbmRleH1gO1xuICB9XG5cbiAgY3JlYXRlQXBwUHJvdG9WaWV3KGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyLCB2aWV3VHlwZTogVmlld1R5cGUsXG4gICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3M6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZW1lbnRzOiBTdGF0ZW1lbnRbXSk6IEV4cHJlc3Npb24ge1xuICAgIHZhciBwcm90b1ZpZXdWYXJOYW1lID0gdGhpcy5fbmV4dFByb3RvVmlld1ZhcihlbWJlZGRlZFRlbXBsYXRlSW5kZXgpO1xuICAgIHZhciB2aWV3VHlwZUV4cHIgPSBjb2RlR2VuVmlld1R5cGUodmlld1R5cGUpO1xuICAgIHZhciBwaXBlc0V4cHIgPSBlbWJlZGRlZFRlbXBsYXRlSW5kZXggPT09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZUdlblR5cGVzQXJyYXkodGhpcy5waXBlcy5tYXAocGlwZU1ldGEgPT4gcGlwZU1ldGEudHlwZSkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgdmFyIHN0YXRlbWVudCA9XG4gICAgICAgIGB2YXIgJHtwcm90b1ZpZXdWYXJOYW1lfSA9ICR7QVBQX1ZJRVdfTU9EVUxFX1JFRn1BcHBQcm90b1ZpZXcuY3JlYXRlKCR7dGhpcy5yZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByLmV4cHJlc3Npb259LCAke3ZpZXdUeXBlRXhwcn0sICR7cGlwZXNFeHByfSwgJHtjb2RlR2VuU3RyaW5nTWFwKHRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncyl9KTtgO1xuICAgIHRhcmdldFN0YXRlbWVudHMucHVzaChuZXcgU3RhdGVtZW50KHN0YXRlbWVudCkpO1xuICAgIHJldHVybiBuZXcgRXhwcmVzc2lvbihwcm90b1ZpZXdWYXJOYW1lKTtcbiAgfVxuXG4gIGNyZWF0ZUFwcFByb3RvRWxlbWVudChib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyLCBhdHRyTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSwgZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZW1lbnRzOiBTdGF0ZW1lbnRbXSk6IEV4cHJlc3Npb24ge1xuICAgIHZhciB2YXJOYW1lID0gYGFwcFByb3RvRWwke3RoaXMuX25leHRWYXJJZCsrfV8ke3RoaXMuY29tcG9uZW50LnR5cGUubmFtZX1gO1xuICAgIHZhciB2YWx1ZSA9IGAke0FQUF9FTF9NT0RVTEVfUkVGfUFwcFByb3RvRWxlbWVudC5jcmVhdGUoXG4gICAgICAgICR7dGhpcy5yZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByLmV4cHJlc3Npb259LFxuICAgICAgICAke2JvdW5kRWxlbWVudEluZGV4fSxcbiAgICAgICAgJHtjb2RlR2VuU3RyaW5nTWFwKGF0dHJOYW1lQW5kVmFsdWVzKX0sXG4gICAgICAgICR7Y29kZUdlbkRpcmVjdGl2ZXNBcnJheShkaXJlY3RpdmVzKX0sXG4gICAgICAgICR7Y29kZUdlblN0cmluZ01hcCh2YXJpYWJsZU5hbWVBbmRWYWx1ZXMpfVxuICAgICAgKWA7XG4gICAgdmFyIHN0YXRlbWVudCA9IGB2YXIgJHt2YXJOYW1lfSA9ICR7dmFsdWV9O2A7XG4gICAgdGFyZ2V0U3RhdGVtZW50cy5wdXNoKG5ldyBTdGF0ZW1lbnQoc3RhdGVtZW50KSk7XG4gICAgcmV0dXJuIG5ldyBFeHByZXNzaW9uKHZhck5hbWUpO1xuICB9XG59XG5cbmNsYXNzIFJ1bnRpbWVQcm90b1ZpZXdGYWN0b3J5IGV4dGVuZHMgUHJvdG9WaWV3RmFjdG9yeTxBcHBQcm90b1ZpZXcsIEFwcFByb3RvRWxlbWVudCwgYW55PiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXRhZGF0YUNhY2hlOiBSZXNvbHZlZE1ldGFkYXRhQ2FjaGUsIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICBwdWJsaWMgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSkge1xuICAgIHN1cGVyKGNvbXBvbmVudCk7XG4gIH1cblxuICBjcmVhdGVBcHBQcm90b1ZpZXcoZW1iZWRkZWRUZW1wbGF0ZUluZGV4OiBudW1iZXIsIHZpZXdUeXBlOiBWaWV3VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFyaWFibGVCaW5kaW5nczogc3RyaW5nW11bXSwgdGFyZ2V0U3RhdGVtZW50czogYW55W10pOiBBcHBQcm90b1ZpZXcge1xuICAgIHZhciBwaXBlcyA9XG4gICAgICAgIGVtYmVkZGVkVGVtcGxhdGVJbmRleCA9PT0gMCA/IHRoaXMucGlwZXMubWFwKHBpcGVNZXRhID0+IHBpcGVNZXRhLnR5cGUucnVudGltZSkgOiBbXTtcbiAgICB2YXIgdGVtcGxhdGVWYXJzID0ga2V5VmFsdWVBcnJheVRvU3RyaW5nTWFwKHRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncyk7XG4gICAgcmV0dXJuIEFwcFByb3RvVmlldy5jcmVhdGUodGhpcy5tZXRhZGF0YUNhY2hlLCB2aWV3VHlwZSwgcGlwZXMsIHRlbXBsYXRlVmFycyk7XG4gIH1cblxuICBjcmVhdGVBcHBQcm90b0VsZW1lbnQoYm91bmRFbGVtZW50SW5kZXg6IG51bWJlciwgYXR0ck5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdW10sIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGVtZW50czogYW55W10pOiBBcHBQcm90b0VsZW1lbnQge1xuICAgIHZhciBhdHRycyA9IGtleVZhbHVlQXJyYXlUb1N0cmluZ01hcChhdHRyTmFtZUFuZFZhbHVlcyk7XG4gICAgcmV0dXJuIEFwcFByb3RvRWxlbWVudC5jcmVhdGUodGhpcy5tZXRhZGF0YUNhY2hlLCBib3VuZEVsZW1lbnRJbmRleCwgYXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5tYXAoZGlyTWV0YSA9PiBkaXJNZXRhLnR5cGUucnVudGltZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5VmFsdWVBcnJheVRvU3RyaW5nTWFwKHZhcmlhYmxlTmFtZUFuZFZhbHVlcykpO1xuICB9XG59XG5cbmNsYXNzIFByb3RvVmlld0J1aWxkZXJWaXNpdG9yPEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUwsIFNUQVRFTUVOVD4gaW1wbGVtZW50c1xuICAgIFRlbXBsYXRlQXN0VmlzaXRvciB7XG4gIHByb3RvRWxlbWVudHM6IENvbXBpbGVQcm90b0VsZW1lbnQ8QVBQX1BST1RPX0VMPltdID0gW107XG4gIGJvdW5kRWxlbWVudENvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmYWN0b3J5OiBQcm90b1ZpZXdGYWN0b3J5PEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUwsIFNUQVRFTUVOVD4sXG4gICAgICAgICAgICAgIHB1YmxpYyBhbGxTdGF0ZW1lbnRzOiBTVEFURU1FTlRbXSxcbiAgICAgICAgICAgICAgcHVibGljIGFsbFByb3RvVmlld3M6IENvbXBpbGVQcm90b1ZpZXc8QVBQX1BST1RPX1ZJRVcsIEFQUF9QUk9UT19FTD5bXSkge31cblxuICBwcml2YXRlIF9yZWFkQXR0ck5hbWVBbmRWYWx1ZXMoZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyQXN0czogVGVtcGxhdGVBc3RbXSk6IHN0cmluZ1tdW10ge1xuICAgIHZhciBhdHRycyA9IHZpc2l0QW5kUmV0dXJuQ29udGV4dCh0aGlzLCBhdHRyQXN0cywge30pO1xuICAgIGRpcmVjdGl2ZXMuZm9yRWFjaChkaXJlY3RpdmVNZXRhID0+IHtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChkaXJlY3RpdmVNZXRhLmhvc3RBdHRyaWJ1dGVzLCAodmFsdWUsIG5hbWUpID0+IHtcbiAgICAgICAgdmFyIHByZXZWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICBhdHRyc1tuYW1lXSA9IGlzUHJlc2VudChwcmV2VmFsdWUpID8gbWVyZ2VBdHRyaWJ1dGVWYWx1ZShuYW1lLCBwcmV2VmFsdWUsIHZhbHVlKSA6IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1hcFRvS2V5VmFsdWVBcnJheShhdHRycyk7XG4gIH1cblxuICB2aXNpdEJvdW5kVGV4dChhc3Q6IEJvdW5kVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRUZXh0KGFzdDogVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdE5nQ29udGVudChhc3Q6IE5nQ29udGVudEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdEVsZW1lbnQoYXN0OiBFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHZhciBib3VuZEVsZW1lbnRJbmRleCA9IG51bGw7XG4gICAgaWYgKGFzdC5pc0JvdW5kKCkpIHtcbiAgICAgIGJvdW5kRWxlbWVudEluZGV4ID0gdGhpcy5ib3VuZEVsZW1lbnRDb3VudCsrO1xuICAgIH1cbiAgICB2YXIgY29tcG9uZW50ID0gYXN0LmdldENvbXBvbmVudCgpO1xuXG4gICAgdmFyIHZhcmlhYmxlTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSA9IFtdO1xuICAgIGlmIChpc0JsYW5rKGNvbXBvbmVudCkpIHtcbiAgICAgIGFzdC5leHBvcnRBc1ZhcnMuZm9yRWFjaCgodmFyQXN0KSA9PiB7IHZhcmlhYmxlTmFtZUFuZFZhbHVlcy5wdXNoKFt2YXJBc3QubmFtZSwgbnVsbF0pOyB9KTtcbiAgICB9XG4gICAgdmFyIGRpcmVjdGl2ZXMgPSBbXTtcbiAgICB2YXIgcmVuZGVyRXZlbnRzOiBNYXA8c3RyaW5nLCBCb3VuZEV2ZW50QXN0PiA9XG4gICAgICAgIHZpc2l0QW5kUmV0dXJuQ29udGV4dCh0aGlzLCBhc3Qub3V0cHV0cywgbmV3IE1hcDxzdHJpbmcsIEJvdW5kRXZlbnRBc3Q+KCkpO1xuICAgIExpc3RXcmFwcGVyLmZvckVhY2hXaXRoSW5kZXgoYXN0LmRpcmVjdGl2ZXMsIChkaXJlY3RpdmVBc3Q6IERpcmVjdGl2ZUFzdCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgZGlyZWN0aXZlQXN0LnZpc2l0KHRoaXMsIG5ldyBEaXJlY3RpdmVDb250ZXh0KGluZGV4LCBib3VuZEVsZW1lbnRJbmRleCwgcmVuZGVyRXZlbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZUFuZFZhbHVlcywgZGlyZWN0aXZlcykpO1xuICAgIH0pO1xuICAgIHZhciByZW5kZXJFdmVudEFycmF5ID0gW107XG4gICAgcmVuZGVyRXZlbnRzLmZvckVhY2goKGV2ZW50QXN0LCBfKSA9PiByZW5kZXJFdmVudEFycmF5LnB1c2goZXZlbnRBc3QpKTtcblxuICAgIHZhciBhdHRyTmFtZUFuZFZhbHVlcyA9IHRoaXMuX3JlYWRBdHRyTmFtZUFuZFZhbHVlcyhkaXJlY3RpdmVzLCBhc3QuYXR0cnMpO1xuICAgIHRoaXMuX2FkZFByb3RvRWxlbWVudChhc3QuaXNCb3VuZCgpLCBib3VuZEVsZW1lbnRJbmRleCwgYXR0ck5hbWVBbmRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZUFuZFZhbHVlcywgcmVuZGVyRXZlbnRBcnJheSwgZGlyZWN0aXZlcywgbnVsbCk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRFbWJlZGRlZFRlbXBsYXRlKGFzdDogRW1iZWRkZWRUZW1wbGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB2YXIgYm91bmRFbGVtZW50SW5kZXggPSB0aGlzLmJvdW5kRWxlbWVudENvdW50Kys7XG4gICAgdmFyIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdID0gW107XG4gICAgTGlzdFdyYXBwZXIuZm9yRWFjaFdpdGhJbmRleChhc3QuZGlyZWN0aXZlcywgKGRpcmVjdGl2ZUFzdDogRGlyZWN0aXZlQXN0LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBkaXJlY3RpdmVBc3QudmlzaXQoXG4gICAgICAgICAgdGhpcywgbmV3IERpcmVjdGl2ZUNvbnRleHQoaW5kZXgsIGJvdW5kRWxlbWVudEluZGV4LCBuZXcgTWFwPHN0cmluZywgQm91bmRFdmVudEFzdD4oKSwgW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlcykpO1xuICAgIH0pO1xuXG4gICAgdmFyIGF0dHJOYW1lQW5kVmFsdWVzID0gdGhpcy5fcmVhZEF0dHJOYW1lQW5kVmFsdWVzKGRpcmVjdGl2ZXMsIGFzdC5hdHRycyk7XG4gICAgdmFyIHRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncyA9IGFzdC52YXJzLm1hcChcbiAgICAgICAgdmFyQXN0ID0+IFt2YXJBc3QudmFsdWUubGVuZ3RoID4gMCA/IHZhckFzdC52YWx1ZSA6IElNUExJQ0lUX1RFTVBMQVRFX1ZBUiwgdmFyQXN0Lm5hbWVdKTtcbiAgICB2YXIgbmVzdGVkUHJvdG9WaWV3ID0gdGhpcy5mYWN0b3J5LmNyZWF0ZUNvbXBpbGVQcm90b1ZpZXcoXG4gICAgICAgIGFzdC5jaGlsZHJlbiwgdGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzLCB0aGlzLmFsbFN0YXRlbWVudHMsIHRoaXMuYWxsUHJvdG9WaWV3cyk7XG4gICAgdGhpcy5fYWRkUHJvdG9FbGVtZW50KHRydWUsIGJvdW5kRWxlbWVudEluZGV4LCBhdHRyTmFtZUFuZFZhbHVlcywgW10sIFtdLCBkaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXN0ZWRQcm90b1ZpZXcuZW1iZWRkZWRUZW1wbGF0ZUluZGV4KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2FkZFByb3RvRWxlbWVudChpc0JvdW5kOiBib29sZWFuLCBib3VuZEVsZW1lbnRJbmRleCwgYXR0ck5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdW10sIHJlbmRlckV2ZW50czogQm91bmRFdmVudEFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sIGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyKSB7XG4gICAgdmFyIGFwcFByb3RvRWwgPSBudWxsO1xuICAgIGlmIChpc0JvdW5kKSB7XG4gICAgICBhcHBQcm90b0VsID1cbiAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlQXBwUHJvdG9FbGVtZW50KGJvdW5kRWxlbWVudEluZGV4LCBhdHRyTmFtZUFuZFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZUFuZFZhbHVlcywgZGlyZWN0aXZlcywgdGhpcy5hbGxTdGF0ZW1lbnRzKTtcbiAgICB9XG4gICAgdmFyIGNvbXBpbGVQcm90b0VsID0gbmV3IENvbXBpbGVQcm90b0VsZW1lbnQ8QVBQX1BST1RPX0VMPihcbiAgICAgICAgYm91bmRFbGVtZW50SW5kZXgsIGF0dHJOYW1lQW5kVmFsdWVzLCB2YXJpYWJsZU5hbWVBbmRWYWx1ZXMsIHJlbmRlckV2ZW50cywgZGlyZWN0aXZlcyxcbiAgICAgICAgZW1iZWRkZWRUZW1wbGF0ZUluZGV4LCBhcHBQcm90b0VsKTtcbiAgICB0aGlzLnByb3RvRWxlbWVudHMucHVzaChjb21waWxlUHJvdG9FbCk7XG4gIH1cblxuICB2aXNpdFZhcmlhYmxlKGFzdDogVmFyaWFibGVBc3QsIGN0eDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRBdHRyKGFzdDogQXR0ckFzdCwgYXR0ck5hbWVBbmRWYWx1ZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KTogYW55IHtcbiAgICBhdHRyTmFtZUFuZFZhbHVlc1thc3QubmFtZV0gPSBhc3QudmFsdWU7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXREaXJlY3RpdmUoYXN0OiBEaXJlY3RpdmVBc3QsIGN0eDogRGlyZWN0aXZlQ29udGV4dCk6IGFueSB7XG4gICAgY3R4LnRhcmdldERpcmVjdGl2ZXMucHVzaChhc3QuZGlyZWN0aXZlKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5ob3N0RXZlbnRzLCBjdHguaG9zdEV2ZW50VGFyZ2V0QW5kTmFtZXMpO1xuICAgIGFzdC5leHBvcnRBc1ZhcnMuZm9yRWFjaChcbiAgICAgICAgdmFyQXN0ID0+IHsgY3R4LnRhcmdldFZhcmlhYmxlTmFtZUFuZFZhbHVlcy5wdXNoKFt2YXJBc3QubmFtZSwgY3R4LmluZGV4XSk7IH0pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RXZlbnQoYXN0OiBCb3VuZEV2ZW50QXN0LCBldmVudFRhcmdldEFuZE5hbWVzOiBNYXA8c3RyaW5nLCBCb3VuZEV2ZW50QXN0Pik6IGFueSB7XG4gICAgZXZlbnRUYXJnZXRBbmROYW1lcy5zZXQoYXN0LmZ1bGxOYW1lLCBhc3QpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RGlyZWN0aXZlUHJvcGVydHkoYXN0OiBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdEVsZW1lbnRQcm9wZXJ0eShhc3Q6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxufVxuXG5mdW5jdGlvbiBtYXBUb0tleVZhbHVlQXJyYXkoZGF0YToge1trZXk6IHN0cmluZ106IHN0cmluZ30pOiBzdHJpbmdbXVtdIHtcbiAgdmFyIGVudHJ5QXJyYXkgPSBbXTtcbiAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKGRhdGEsICh2YWx1ZSwgbmFtZSkgPT4geyBlbnRyeUFycmF5LnB1c2goW25hbWUsIHZhbHVlXSk7IH0pO1xuICAvLyBXZSBuZWVkIHRvIHNvcnQgdG8gZ2V0IGEgZGVmaW5lZCBvdXRwdXQgb3JkZXJcbiAgLy8gZm9yIHRlc3RzIGFuZCBmb3IgY2FjaGluZyBnZW5lcmF0ZWQgYXJ0aWZhY3RzLi4uXG4gIExpc3RXcmFwcGVyLnNvcnQoZW50cnlBcnJheSwgKGVudHJ5MSwgZW50cnkyKSA9PiBTdHJpbmdXcmFwcGVyLmNvbXBhcmUoZW50cnkxWzBdLCBlbnRyeTJbMF0pKTtcbiAgdmFyIGtleVZhbHVlQXJyYXkgPSBbXTtcbiAgZW50cnlBcnJheS5mb3JFYWNoKChlbnRyeSkgPT4geyBrZXlWYWx1ZUFycmF5LnB1c2goW2VudHJ5WzBdLCBlbnRyeVsxXV0pOyB9KTtcbiAgcmV0dXJuIGtleVZhbHVlQXJyYXk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXR0cmlidXRlVmFsdWUoYXR0ck5hbWU6IHN0cmluZywgYXR0clZhbHVlMTogc3RyaW5nLCBhdHRyVmFsdWUyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoYXR0ck5hbWUgPT0gQ0xBU1NfQVRUUiB8fCBhdHRyTmFtZSA9PSBTVFlMRV9BVFRSKSB7XG4gICAgcmV0dXJuIGAke2F0dHJWYWx1ZTF9ICR7YXR0clZhbHVlMn1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhdHRyVmFsdWUyO1xuICB9XG59XG5cbmNsYXNzIERpcmVjdGl2ZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5kZXg6IG51bWJlciwgcHVibGljIGJvdW5kRWxlbWVudEluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBob3N0RXZlbnRUYXJnZXRBbmROYW1lczogTWFwPHN0cmluZywgQm91bmRFdmVudEFzdD4sXG4gICAgICAgICAgICAgIHB1YmxpYyB0YXJnZXRWYXJpYWJsZU5hbWVBbmRWYWx1ZXM6IGFueVtdW10sXG4gICAgICAgICAgICAgIHB1YmxpYyB0YXJnZXREaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSkge31cbn1cblxuZnVuY3Rpb24ga2V5VmFsdWVBcnJheVRvU3RyaW5nTWFwKGtleVZhbHVlQXJyYXk6IGFueVtdW10pOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gIHZhciBzdHJpbmdNYXA6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5VmFsdWVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbnRyeSA9IGtleVZhbHVlQXJyYXlbaV07XG4gICAgc3RyaW5nTWFwW2VudHJ5WzBdXSA9IGVudHJ5WzFdO1xuICB9XG4gIHJldHVybiBzdHJpbmdNYXA7XG59XG5cbmZ1bmN0aW9uIGNvZGVHZW5EaXJlY3RpdmVzQXJyYXkoZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10pOiBzdHJpbmcge1xuICB2YXIgZXhwcmVzc2lvbnMgPSBkaXJlY3RpdmVzLm1hcChkaXJlY3RpdmVUeXBlID0+IHR5cGVSZWYoZGlyZWN0aXZlVHlwZS50eXBlKSk7XG4gIHJldHVybiBgWyR7ZXhwcmVzc2lvbnMuam9pbignLCcpfV1gO1xufVxuXG5mdW5jdGlvbiBjb2RlR2VuVHlwZXNBcnJheSh0eXBlczogQ29tcGlsZVR5cGVNZXRhZGF0YVtdKTogc3RyaW5nIHtcbiAgdmFyIGV4cHJlc3Npb25zID0gdHlwZXMubWFwKHR5cGVSZWYpO1xuICByZXR1cm4gYFske2V4cHJlc3Npb25zLmpvaW4oJywnKX1dYDtcbn1cblxuZnVuY3Rpb24gY29kZUdlblZpZXdUeXBlKHZhbHVlOiBWaWV3VHlwZSk6IHN0cmluZyB7XG4gIGlmIChJU19EQVJUKSB7XG4gICAgcmV0dXJuIGAke1ZJRVdfVFlQRV9NT0RVTEVfUkVGfSR7dmFsdWV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYCR7dmFsdWV9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiB0eXBlUmVmKHR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7bW9kdWxlUmVmKHR5cGUubW9kdWxlVXJsKX0ke3R5cGUubmFtZX1gO1xufVxuXG5mdW5jdGlvbiBnZXRWaWV3VHlwZShjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgZW1iZWRkZWRUZW1wbGF0ZUluZGV4OiBudW1iZXIpOiBWaWV3VHlwZSB7XG4gIGlmIChlbWJlZGRlZFRlbXBsYXRlSW5kZXggPiAwKSB7XG4gICAgcmV0dXJuIFZpZXdUeXBlLkVNQkVEREVEO1xuICB9IGVsc2UgaWYgKGNvbXBvbmVudC50eXBlLmlzSG9zdCkge1xuICAgIHJldHVybiBWaWV3VHlwZS5IT1NUO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBWaWV3VHlwZS5DT01QT05FTlQ7XG4gIH1cbn1cbiJdfQ==
