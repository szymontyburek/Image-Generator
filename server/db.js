const mongoose = require("mongoose");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

let collection;

const getCollection = async function () {
  try {
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
  } catch {
    collection = "Error: Refresh page and try again";
  }
};

getCollection();

const getRecords = async function (monthStr) {
  let records;
  let success;

  try {
    const [month, year] = monthStr.split("-");
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Set to the first day of the next month
    const findQuery = monthStr
      ? {
          dateCreated: {
            $gte: startDate,
            $lt: endDate,
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

const getMonths = async function () {
  let distinctDates = [];
  let success;

  try {
    let distinctDatesTmp = await collection
      .aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%m-%Y", date: "$dateCreated" },
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
          },
        },
        {
          $sort: { month: -1 },
        },
      ])
      .toArray();
    for (const obj of distinctDatesTmp) distinctDates.push(obj.month);
    success = true;
  } catch (err) {
    console.log(err);
    distinctDates = collection;
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

module.exports = { addRecord, getMonths, getRecords };
