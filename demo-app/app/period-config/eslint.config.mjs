import fioriTools from '@sap-ux/eslint-plugin-fiori-tools';

export default [
    ...fioriTools.configs.recommended,
    {
        rules: {
            curly: 'off',
            'comma-dangle': 'off'
        }
    }
];
