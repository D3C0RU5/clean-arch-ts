import { Collection, Db, Document, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,
  uri: '' as string,
  db: null as Db | null,
  async connect(
    uri: string = process.env.MONGO_URL || '',
    db_name: string = process.env.MONGO_DB_NAME || '',
  ): Promise<void> {
    this.uri = uri
    this.client = new MongoClient(uri)
    this.db = this.client.db(db_name)
  },
  async disconnect(): Promise<void> {
    this.client?.close()
    this.client = null
    this.db = null
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.db || !this.client) {
      await this.connect(this.uri)
    }
    return this.db!.collection(name)
  },
  map(document: Document): Document {
    const { _id, ...documentWithoutId } = document
    return Object.assign({}, documentWithoutId, { id: _id })
  },
}
