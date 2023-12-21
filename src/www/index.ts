import { app } from '@/app'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(
    '\x1b[36m%s\x1b[0m',
    'Server is running at http://localhost:' + port,
  )
})
