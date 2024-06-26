const mongoose = require("mongoose");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const getConnection = async function () {
  return new MongoClient(process.env.MONGODB_CONNECTION, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
};

const getCollection = async function (connection) {
  await connection.connect();
  return connection.db("ImageGenerator").collection("images");
};

const getData = async function () {
  let data;
  let distinctDates = [];
  let success;
  let connection;

  try {
    connection = await getConnection();
    const collection = await getCollection(connection);

    data = await collection.find().toArray();

    let distinctDatesTmp = await collection
      .aggregate([
        { $group: { _id: "$dateCreated" } },
        { $project: { _id: 0, dateCreated: "$_id" } },
      ])
      .toArray();
    for (const obj of distinctDatesTmp) {
      distinctDates.push(obj.dateCreated);
    }

    success = true;
  } catch (err) {
    console.log(err);
    success = false;
  } finally {
    await connection.close();
  }
  return {
    message: { data: data, distinctDates: distinctDates },
    success: success,
  };
};

const addRecord = async function (document) {
  let data;
  let success;
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
    await connection.close();
  }
  return true;
};

module.exports = { addRecord, getData };
