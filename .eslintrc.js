module.exports = {
    root: true,
    env: {
        node: true,
        browser: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/script-indent': ['error', 4, { 'baseIndent': 1, 'switchCase': 1 }],
        indent: [2, 4, { SwitchCase: 1 }]
    },
    overrides:[
        {
            'files':['*.vue'],
            'rules':{
                'indent':'off'
            }
        }
    ],
    parserOptions: {
        parser: 'babel-eslint'
    }
}
