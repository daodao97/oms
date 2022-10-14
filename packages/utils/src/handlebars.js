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

const a = Handlebars.compile("{{#ifEq state 'done'}}{{count}}人{{else}}{{state}}{{/ifEq}}")({"count":0,"state":"初始化","timestamp":0,"sql":""})

console.log(a)

export default Handlebars