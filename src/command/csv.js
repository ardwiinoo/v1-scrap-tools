const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function saveToCsv(commentData, filename) {
  const csvWriter = createCsvWriter({
    path: `dist/${filename}.csv`,
    header: [
      { id: "username", title: "Username" },
      { id: "comment", title: "Comment" },
    ],
  });

  await csvWriter.writeRecords(commentData);
}

module.exports = {
  saveToCsv,
};
