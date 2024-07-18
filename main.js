#!/usr/bin/env node
const fs = require("fs/promises");
const { Command } = require("commander");
const program = new Command();

async function readData(filepath) {
  const res = await fs.readFile(filepath, "utf-8");
  return JSON.parse(res);
}

async function writeData(filepath, data) {
  await fs.writeFile(filepath, JSON.stringify(data));
}

program
  .command("add")
  .description("Add a new number")
  .argument("<number>")
  .action(async (number) => {
    try {
      const data = await readData("price.json");
      data.push(Number(number));
      await writeData("price.json", data);
      console.log(`Added number: ${number}`);
    } catch (error) {
      console.error("Error adding number:", error);
    }
  });

program.command("getAll").action(async () => {
  const data = await readData("price.json");
  console.log(data);
});

program
  .command("delete")
  .argument("<number>")
  .action(async (number) => {
    const price = await readData("price.json");
    const index = price.findIndex((item) => item === Number(number));
    if (index === -1) {
      console.log("Number not found");
    }
    const deletNumber = price.splice(index, 1);
    await writeData("price.json", price);
    console.log(deletNumber);
  });

program
  .command("cityName")
  .description("Write a city")
  .argument("<cityName>")
  .action(async (cityName) => {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`
    );
    const res = await data.json();
    console.log(res.main.temp + "°C");
  });
program.parse();
