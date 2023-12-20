import { seed } from './dbData'

seed()
  .then(() => console.log('Seeding complete'))
  .catch(e => console.error(e))
