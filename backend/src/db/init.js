import mongoose from 'mongoose'

export function initDatabase() {
  const DB_Url = process.env.DATABASE_URL
  mongoose.connection.on('open', () => {
    console.info('Connected to DB: ', DB_Url)
  })
  const connection = mongoose.connect(DB_Url)
  return connection
}
