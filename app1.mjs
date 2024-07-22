import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config()

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI)
  const dbName = process.env.DB_NAME

  try {
    await client.connect()
    console.log('Connected to Database')

    const db = client.db(dbName)

    // удаление коллекции "users"
    await db.collection('users').drop()
    console.log(chalk.redBright('Collection "users" has been dropped.'))

    // insertOne - вставка одного документа
    const resultInsertOne = await db.collection('users').insertOne({ name: 'Jane Smith', age: 25 })
    console.log(chalk.greenBright('Документ вставлено у колекцію "users".'))
    console.log(chalk.bgRedBright('resultInsertOne:'), resultInsertOne)

    // insertMany - вставка нескольких документов
    const usersToInsert = [
      { name: 'John Doe', email: "john.doe@example.com" },
      { name: 'Jane Doe', email: "jane.doe@example.com" },
      { name: 'Jim Doe', email: "jim.doe@example.com" }
    ]
    const result = await db.collection('users').insertMany(usersToInsert)
    console.log(chalk.bgRedBright('result:'), result)

    // replaceOne - заменяем один документ по идентификатору 
    const insertResult = await db.collection('users').insertOne({
      name: 'John Doe',
      age: 30,
      skills: ['HTML', 'CSS', 'JS']
    })

    const replaceResult = await db
      .collection('users')
      .replaceOne(
        { _id: insertResult.insertedId },
        { name: 'Bob Woo', age: 41 }
      )

    console.log(chalk.blueBright('Документ замінено у колекції "users".'))
    console.log(chalk.bgRedBright('replaceResult:'), replaceResult)

    // updateOne - обновляем один документ по идентификатору, который создал сервер, insertedId, полученный в результате вставки, и добавляем новые значения по ключу $set,
    const updateResult = await db
    .collection('users')
    .updateOne(
      { _id: insertResult.insertedId },
      { $set: { name: 'Jonathan Woo', age: 41 } }
    )


    // updateMany - обновляем все документы, у которых имя содержит "Doe", добавляя в массив skills с помощью оператора $addToSet, 
    // если такой элемент уже существует, ! то он не добавляется, 
    const updateManyResult = await db.collection('users').updateMany(
      {},
      {
        $addToSet: {
          skills: {
            $each: ['TypeScript', 'Node.js']
          }
        }
      }
    )

    // deleteOne - удаляет первый элемент, который совпал { name: /Doe/ } (с именем "Doe")
    const deleteOneResult = await db
    .collection('users')
    .deleteOne(
      { name: /Doe/ }
    )

    // удаляет все документы, у которых имя содержит "Doe"
    const deleteManyResult = await db.collection('users').deleteMany({ name: /Doe/ })

    const documents = await db.collection('users').find({}).toArray()
    console.log(chalk.magentaBright('Contents of the "users" collection:'), documents)

  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  } finally {
    await client.close()
  }
}

run()