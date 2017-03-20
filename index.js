const fs = require('fs');
const readline = require('readline');
const execSync = require('child_process').execSync;
const path = require('path');
const exec = require('child_process').exec;
const chalk = require('chalk');
let child;
var ininstalling = { "angular": false, "express" : false, "nodemon": false};
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function brogfinisch(finishname) {
  ininstalling[finishname] = true;
  var stop = false;
  var notfinisch = [];
  for(var key in ininstalling) {
    if (ininstalling[key] == false) {
      notfinisch.push(key);
      stop = true;
    }
  }
  if (stop) {
    console.log(chalk.blue("Waiting that " + notfinisch.toString().replace(',', ', ') + " is installed"));
    return;
  }
  process.exit(1);
}

r1.question('Please specify the App-Name: ', appname =>{

  console.log(chalk.blue("Creating Angular App..."));
  process.chdir(process.cwd());

  execSync('ng new ' + appname+ " --skip-install");
  console.log(chalk.green("Angular Struktur Created"));

  process.chdir(path.basename(process.cwd()+"\\"+appname));
  console.log(chalk.blue("Now installing Express and Body Parser"))
  child = exec("yarn install", function (error, stdout, stderr) {
    if (error !== null) {
      return console.log(chalk.red('exec error: ' + error));
    }
    console.log(chalk.green("Angular Modules Installed"));
    brogfinisch("angular")
  });

  child = exec("yarn add --save express body-parser", function (error, stdout, stderr) {
    if (error !== null) {
      console.log(chalk.red('Express and body-parser cann\'t be installed: ' + error));
      return;
    }
    console.log(chalk.green('Express and body-parser installed'));
    brogfinisch("express")
  });

  child = exec("yarn add --save-dev nodemon", function (error, stdout, stderr) {
    if (error !== null) {
      console.log(chalk.red('nodemon cannt be installed ' + error));
      return;
    }
    console.log(chalk.green('Nodemon installed'));
    brogfinisch("nodemon")
  });

  console.log(chalk.blue('Creating Server.js'));
  var target = __dirname+"\\"+"server.js";
  var source = process.cwd()+"\\"+"server.js";
  fs.writeFileSync(source, fs.readFileSync(target));
  console.log(chalk.green('Created Server.js'));

  console.log(chalk.blue('Creating api.js'));
  target = __dirname+"\\"+"api.js";
  source = process.cwd()+"\\server\\routes\\"+"api.js";
  var dir = path.basename(process.cwd()+"\\server")
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  process.chdir(path.basename(process.cwd()+"\\server"))
  var dir = path.basename(process.cwd()+"\\routes")
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(source, fs.readFileSync(target));
  console.log(chalk.green('Created api.js'));
})