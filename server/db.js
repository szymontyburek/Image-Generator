const mongoose = require("mongoose");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

let collection;

const getCollection = async function () {
  const connection = new MongoClient(process.env.MONGODB_CONNECTION, {
    ssl: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await connection.connect();
  collection = connection.db("ImageGenerator").collection("images");
};

getCollection();

const getRecords = async function (dateStr) {
  let records;
  let success;

  try {
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
  }
  return {
    message: records,
    success: success,
  };
};

const getDates = async function () {
  let distinctDates = [];
  let success;

  try {
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
    success = false;
  }
  return {
    message: distinctDates,
    success: success,
  };
};

const addRecord = async function (document) {
  let success;

  try {
    const result = await collection.insertOne(document);
    success = true;
  } catch (err) {
    console.log(err);
    success = false;
  }
  return true;
};

module.exports = { addRecord, getDates, getRecords };
