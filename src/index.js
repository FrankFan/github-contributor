/*
 * github-contributor
 * http://fy98.com
 *
 */

 // 思路：
 // 1. touch aTempFile.js
 // 2. echo "123" >> aTempFile.js
 // 3. git add aTempFile.js
 // 4. git commit -m 'a beautiful world'
 // 5. 修改系统时间  sudo date 0318125013
 // date {month}{day}{hour}{minute}{year}


var exec = require('child_process').exec;
var github = require('./githubHelper');
var green = require('./green');
var dateTimeUtil = require('./dateTimeUtil');
var moment = require('moment');


function execCmd(cmdStr, callback) {
	exec(cmdStr, function(err, stdout, stderr) {
		if (err) {
			console.log('error: ' + stderr);	
		} else {
			callback && callback(stdout);
		}
	});
}

function execCmdSudo(cmdStr, callback) {
	exec('sudo ' + cmdStr, function(err, stdout, stderr) {
		if (err) {
			console.log('error: ' + stderr);	
		} else {
			callback && callback(stdout);
		}
	});
}

function createTmpFile() {
	var cmdStrNewFile = github.newFile('tmpFile.js');
	execCmd(cmdStrNewFile);
}

function makeChanges() {
	var cmdStrAddContent = github.addContent();
	execCmd(cmdStrAddContent);
}

function gitStatus() {
	var cmdStrGitStatus = github.status();
	execCmd(cmdStrGitStatus, function(stdout) {
		// console.log(stdout);
	});
}

function gitAddWithCommit(commitMsg) {
	// var cmdStrAdd = github.add();
	var cmdStrAdd = 'git add . \n' +
					'git commit -m "up" ';
	execCmd(cmdStrAdd, function(stdout) {
		// console.log(stdout);

		// var cmdStrCommit = github.commit(commitMsg);
		// execCmd(cmdStrCommit, function(stdout) {
		// 	// console.log(stdout);
		// });
	});

	
}

function removeTmpFile() {
	var cmdStrRmFile = github.rm('tmpFile.js');
	execCmd(cmdStrRmFile);
}

function oneDay() {
	console.log(2);

	var cmdStrAddContent = github.addContent();
	execCmd(cmdStrAddContent);

	console.log(3);

	var cmdStrAdd = github.add();
	execCmd(cmdStrAdd);

	console.log(4);

	var cmdStrCommit = github.commit('update');
	execCmd(cmdStrCommit);

	console.log(5);
}

function lastDay() {
	console.log(6);

	var cmdStrRm = github.rm('tmpFile.js');
	execCmd(cmdStrRm);

	console.log(7);

	var cmdStrAdd = github.add();
	execCmd(cmdStrAdd);

	console.log(8);

	var cmdStrCommit = github.commit('rm tmpFile');
	execCmd(cmdStrCommit);

	console.log(9);

	var cmdStrPull = github.pull();
	execCmd(cmdStrPull);

	console.log(10);

	var cmdStrPush = github.push();
	execCmd(cmdStrPush);
}





function addDay() {
	execCmd('date', function(result) {
		console.log(result);
	});
	console.log('e');
}

function syncTime() {
	var cmdStr = dateTimeUtil.syncTime();
	execCmdSudo(cmdStr, function(result) {
		console.log(result);
	});
}

function setStartDate(date, callback) {
	var dateStr = dateTimeUtil.setDateTime(date);
	execCmdSudo(dateStr, function(result) {
		console.log(result);
		callback && callback();
	});
}



// 
// createTmpFile();
// oneDay();
// addDay();
// lastDay();


// addDay();



/**
 * @from  {string} 2015-01-01
 * @to    {string} 2015-02-11
 * @return {void}
 */
exports.run = function(from, to) {
	console.log(from);
	console.log(to);
	// console.log(dateTimeUtil.getDate(from));
	// console.log(dateTimeUtil.getDate(to));

	
	// 1.设置开始时间
	setStartDate(from, function() {

		while(!moment(Date.parse(from)).isSame(Date.parse(to))) {
			
			console.log(from);
			
			// 2.创建一个临时文件
			// createTmpFile();

			// 3.make some changes

			// 4.git add .

			// 5.git commit -m 'update'

			// 6. 日期自增
			from = moment(Date.parse(from)).add(1, 'd').format('YYYY-M-D');

		}


		// 7. 循环完毕，删除文件
		// removeTmpFile();
		// 8.git add & commit

		// 9.git push

		// 10.把时间改回来
		// syncTime();
	});
	
}





/**
 * @from  {string} 2015-01-01
 * @to    {string} 2015-02-11
 * @return {void}
 */
exports.go = function(from, to) {
	console.log('come in go: ', from, to);

	// 1.设置开始时间
	var dateStr = dateTimeUtil.setDateTime(from);
	var p = green.execCmdSudo(dateStr);
	p.then(function(stdout) {
		// 2.创建一个临时文件
		createTmpFile();

		while(!moment(Date.parse(from)).isSame(Date.parse(to))) {

			// 3.make some changes
			makeChanges();

			// gitStatus();

			gitAddWithCommit('test update');

			// 4.git add .

			// 5.git commit -m 'update'

			// 6. 日期自增
			from = moment(Date.parse(from)).add(1, 'd').format('YYYY-M-D');

		}
	});



}







