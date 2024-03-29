import { Collection, Db, Document, MongoClient } from 'mongodb'

// export class MongoHelper {
//   private connection?: MongoClient
//   private db?: Db

//   async connect(): Promise<MongoHelper> {
//     this.connection = await MongoClient.connect(process.env.MONGO_URL || '')
//     this.db = await this.connection.db(process.env.MONGO_DB_NAME || '')
//     return this
//   }

//   async disconnect(): Promise<void> {
//     await this.connection?.close()
//   }

//   getCollection(name: string): Collection {
//     return this.db?.collection(name)!
//   }
// }

// export class MongoHelper {
//   private client?: MongoClient
//   private db?: Db

//   async connect(): Promise<MongoHelper> {
//     this.client = new MongoClient(process.env.MONGO_URL || '')
//     this.db = this.client.db(process.env.MONGO_DB_NAME || '')
//     return this
//   }

//   //   async disconnect(): Promise<void> {
//   //     await this.connection?.close()
//   //   }

//   getCollection(name: string): Collection {
//     return this.db!.collection(name)
//   }
// }

// const getClient = (): MongoClient => {
//   return new MongoClient(process.env.MONGO_URL || '')
// }
// const client = new MongoClient(process.env.MONGO_URL || '')

export const MongoHelper = {
  client: null as MongoClient | null,
  db: null as Db | null,
  async connect(): Promise<void> {
    this.client = new MongoClient(process.env.MONGO_URL || '')
    this.db = this.client.db(process.env.MONGO_DB_NAME || '')
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
