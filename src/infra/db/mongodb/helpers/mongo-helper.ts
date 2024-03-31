import { Collection, Db, Document, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,
  db: null as Db | null,
  async connect(
    uri: string = process.env.MONGO_URL || '',
    db_name: string = process.env.MONGO_DB_NAME || '',
  ): Promise<void> {
    this.client = new MongoClient(uri)
    this.db = this.client.db(db_name)
  },
  async disconnect(): Promise<void> {
    this.client?.close()
    this.client = null
    this.db = null
  },
  getCollection(name: string): Collection | undefined {
    return this.db?.collection(name)
  },
  map(document: Document): Document {
    const { _id, documentWithoutId } = document
    return Object.assign({}, documentWithoutId, { id: _id })
  },
}
