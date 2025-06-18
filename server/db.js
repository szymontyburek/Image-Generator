const mongoose = require("mongoose");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const connectionString = process.env.MONGO_SERVERLESS_PROD;

const getConnection = async function () {
  return new MongoClient(connectionString, {
    // ssl: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: false,
    },
  });
};

const getCollection = async function (connection) {
  await connection.connect();
  return connection.db("ImageGenerator").collection("images");
};

const getRecords = async function (dateStr) {
  let records;
  let success;
  let connection;

  try {
    connection = await getConnection();
    const collection = await getCollection(connection);
    const findQuery = dateStr
      ? {
          dateCreated: {
            $gte: new Date(dateStr),
            $lt: new Date(dateStr + "T23:59:59Z"),
          },
        }
      : {};
    records = await collection.find(findQuery).toArray();

    success = true;
  } catch (err) {
    console.log(err);
    success = false;
  } finally {
    connection.close();
  }
  return {
    message: records,
    success: success,
  };
};

const getDates = async function () {
  let distinctDates = [];
  let connection;

  try {
    connection = await getConnection();
    const collection = await getCollection(connection);
    let distinctDatesTmp = await collection
      .aggregate([
        { $group: { _id: "$dateCreated" } },
        { $project: { _id: 0, dateCreated: "$_id" } },
        { $sort: { dateCreated: -1 } },
      ])
      .toArray();
    for (const obj of distinctDatesTmp) {
      const dateNoTime = obj.dateCreated.toISOString().split("T")[0];
      if (!distinctDates.includes(dateNoTime)) distinctDates.push(dateNoTime);
    }

    success = true;
  } catch (err) {
    console.log(err);
    distinctDates = collection;
    success = false;
  } finally {
    connection.close();
  }
  return {
    message: distinctDates,
    success: success,
  };
};

const addRecord = async function (document) {
  let connection;

  try {
    connection = await getConnection();
    const collection = await getCollection(connection);
    const result = await collection.insertOne(document);
    success = true;
  } catch (err) {
    console.log(err);
    success = false;
  } finally {
    connection.close();
  }
  return true;
};

module.exports = { addRecord, getDates, getRecords };
