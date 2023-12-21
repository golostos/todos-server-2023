import { seed } from '.'

seed()
  .then(() => console.log('\x1b[32m%s\x1b[0m', 'Seeding complete'))
  .catch(e => console.error(e))
