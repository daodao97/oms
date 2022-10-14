import Handlebars from 'handlebars'

Handlebars.registerHelper('ifEq', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('ifNeq', function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('ifGt', function (a, b, options) {
    if (a > b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('ifGte', function (a, b, options) {
    if (a >= b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('ifLt', function (a, b, options) {
    if (a < b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('ifLte', function (a, b, options) {
    if (a <= b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('match', function(kv, k) {
    return kv[k] ?? kv["_default"]
});

export default Handlebars