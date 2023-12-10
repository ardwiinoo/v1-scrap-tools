const readline = require("readline");
const { scrapeComments } = require("./command/scraper");
const { saveToCsv } = require("./command/csv");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Masukkan URL YouTube: ", async (url) => {
  rl.question("Masukkan nama file CSV: ", async (filename) => {
    try {
      console.log("Loading...");

      const commentData = await scrapeComments(url);
      console.log("Data komentar berhasil diambil.");

      await saveToCsv(commentData, filename);
      console.log(
        `Data komentar berhasil disimpan dalam file CSV dengan nama ${filename}.csv.`
      );

      rl.close();
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      rl.close();
    }
  });
});
