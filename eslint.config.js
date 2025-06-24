import antfu from '@antfu/eslint-config'

export default antfu({
  isInEditor: false,
  rules: {
    'ts/consistent-type-definitions': ['error', 'type'],
  },
})
