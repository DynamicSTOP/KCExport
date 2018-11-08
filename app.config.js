const pkg = require('./package')

module.exports = {
    name: 'KCExport',
    description: pkg.description,
    navItems: [
        { icon: "apps", title: "Welcome", to: "/" },
        { icon: "bubble_chart", title: "Inspire", to: "/inspire" }
    ]
}
