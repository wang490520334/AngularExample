var gulp = require('gulp'),
	gulpShell = require('gulp-shell'),//可用來在gulp中run command line tool
	gulpHtmlReplace = require('gulp-html-replace'),//可用來移除畫面中文字或區塊(我們用來移除index.html中引用script的部分)
	gulpDebug = require('gulp-debug'); //可列出gulp目前src()下所有清單檔名
	runSequence = require('run-sequence'),//可用來循序執行task，因為gulp.task()的相依執行順序為synchronous，故我們需要run-sequence來執行asynchronous任務
	del = require('del'), //刪除clean用
	gulpFilter = require('gulp-filter'),//過濾列舉檔案用
	gulpOrder = require('gulp-order'),//來序js或css等用
	gulpConcat = require('gulp-concat'),//何併檔案用(ex多個js合併成一個)
	mainBowerFiles = require('main-bower-files'),//列舉bower_components內檔案
	inject = require("gulp-inject"), //用於相依注入
	streamSeries = require('stream-series'), //當相依注入順序很重要時使用，可控制注入順序
	gulpIgnore = require("gulp-ignore"), //用於排除檔案
	streamFromArray	 = require("stream-from-array"), //用於排除檔案
	minifyCSS = require('gulp-minify-css'),//由於gulp-uglify壓縮css會出錯，故此為替代方案
	gulpUglify = require('gulp-uglify');//用來壓縮js/css




gulp.task('default', function() { //預設不指定任務名會跑 'default' 任務
	console.log('*********請指名任務名稱*********');
});

gulp.task('task-combine', ['1', '2']); //可結合多個任務為單一任務
gulp.task('1', function() {
	console.log('*********1*********');
});
gulp.task('2', function() {
	console.log('*********2*********');
});


// Include plugins
var plugins = require("gulp-load-plugins")({ //很厲害的Node.js相依引用工具，不用再寫一堆 require('xxxx');，僅需寫成 plugins.pluginName()，或寫成以下pattern一此引用多個相依
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});

//****************全域變數區塊****************
// Define default destination folder (定義建構目的位置)
var dest = './target/';
var paths = {
	needOrderJs:[ //需要排序的js 清單及順序
		'jquery.js',
		'bootstrap.js',
		'angular.js',
		'angular-ui-router.js',
		'angular-translate.js',
		'app.js',
		'route.js',
		'i18n.js',
		'controller.js',
		'service.js',
		'*'
	]
}
//****************全域變數區塊****************


//******************************測試開發共用區***************************
gulp.task('clean', function (cb) { //刪除目的檔 target
	del(dest, cb);
	console.log('Files deleted');
});

gulp.task('resource', function() { //搬動相關資源檔
	gulp.src(['assets/images/*']).pipe(gulp.dest(dest + 'images'));
	gulp.src(['bower_components/font-awesome/fonts/*']).pipe(gulp.dest(dest + 'fonts'));
	gulp.src(['bower_components/bootstrap/fonts/*']).pipe(gulp.dest(dest + 'fonts'));
});


gulp.task('server', function() { //搬動html檔 (含相依注入)，注入程式必須相依於前兩項task皆完成才可執行(但目前發現好像是非同步，並非同步，欲執行同步任務參考runSequence)
	return gulp.src(['assets/static_server.js']).pipe(gulp.dest(dest));//搬動檔案
});

gulp.task('runServer', gulpShell.task([
	'node static_server.js'
], {cwd: 'target'} )); //cwd可指定目前工作目作(也就是指令執行目錄)

//******************************開發區***************************

gulp.task('js-dev', function() {
	var jsFiles = ['assets/app/*','assets/app/controllers/*','assets/app/common/services/*']; //列出我們專案所有的js檔位置
 	return gulp.src(mainBowerFiles().concat(jsFiles)) //使plugin(main-bower-files)幫我們從bower_components內撈取所有前端網頁相依程式，及我們專案的所有js檔案(目前尚未找到iterate資料夾方法，故用陣列指定自己專案全部的js所在位置)
		.pipe(gulpFilter('*.js')) //利用 gulp-load-plugins 幫我們過濾剩下 js 檔
		.pipe(gulp.dest(dest + 'js')); //將檔案搬到特定位置
});



gulp.task('css-dev', function() { //可對css做一樣的建構佈署
	gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css.map'])//bootstrap要用的
		.pipe(gulp.dest(dest + 'css'));

 	var cssFiles = ['assets/app/css/*'];
	return gulp.src(mainBowerFiles().concat(cssFiles))
			.pipe(gulpFilter('*.css'))
			//.pipe(gulpConcat('main.css'))
			.pipe(gulp.dest(dest + 'css'));
});



gulp.task('html-dev', ['js-dev', 'css-dev'], function() { //搬動html檔 (含相依注入)，注入程式必須相依於前兩項task皆完成才可執行(但目前發現好像是非同步，並非同步，欲執行同步任務參考runSequence)
	gulp.src(['assets/html/**/*']).pipe(gulp.dest(dest + 'html'));//搬動檔案(非index.html之其他html)
	gulp.src(['assets/countries3.json']).pipe(gulp.dest(dest));//搬動檔案
	var target = gulp.src('./assets/index.html').pipe(gulpHtmlReplace({'forDeveloper': ''}));//1.被注入target。我們利用gulpHtmlReplace來移除index.html中相依的區塊，並改成空白
	var source = gulp.src([dest + 'js/*.js', dest + 'css/*.css'], {read: false}).pipe(gulpOrder(paths.needOrderJs)).pipe(gulpDebug());//2.注入sources。gulpOrder()可用來排序，gulpDebug()可用來印出目前src()清單

	return target.pipe(inject(source, {ignorePath: '/target/'})).pipe(gulp.dest(dest));//3.注入後並搬動至目的地，預設注入相依路徑由Project Directory開始(也就是current working dorectory)，由於我們使用node server，其在/target下，其把project root "/" 定在target那層，故我們希望注入相依時，移除預設/target路徑，故設定ignorePath

});


gulp.task('dev', function (callback) {//由於gulp.task()相依執行為synchronous，故無法保證順序，故改用 run-sequence，但記得，任何要讓後者等前者執行完的前者必須回傳a stream (but make sure they either return a stream or handle the callback)
	runSequence('clean', 'js-dev', 'css-dev', 'html-dev', 'resource', 'server', 'runServer', callback);
});


//******************************正式區(加上合併js css及壓縮js css)***************************

gulp.task('js', function() {
	var jsFiles = ['assets/app/*','assets/app/controllers/*','assets/app/common/services/*']; //列出我們專案所有的js檔位置
	return gulp.src(mainBowerFiles().concat(jsFiles)) //使plugin(main-bower-files)幫我們從bower_components內撈取所有前端網頁相依程式，及我們專案的所有js檔案(目前尚未找到iterate資料夾方法，故用陣列指定自己專案全部的js所在位置)
		.pipe(gulpFilter('*.js')) //利用 gulp-load-plugins 幫我們過濾剩下 js 檔
		.pipe(gulpOrder(paths.needOrderJs))//可用來排序先後次序，給其後合併concat用
		.pipe(gulpConcat('main.js')) //將所有相依js合併成一個檔案
		.pipe(gulpUglify()) //壓縮我們的檔案 (簡少空白及換行)，記得!如果要壓縮，所有Angular程式的注入要養成於function前宣告注入變數名稱好習慣
		.pipe(gulp.dest(dest + 'js')); //將檔案搬到特定位置
});



gulp.task('css', function() { //可對css做一樣的建構佈署
	gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css.map'])//bootstrap要用的
		.pipe(gulp.dest(dest + 'css'));

	var cssFiles = ['assets/app/css/*'];
	return gulp.src(mainBowerFiles().concat(cssFiles))
		.pipe(gulpFilter('*.css'))
		.pipe(gulpConcat('main.css'))
		//.pipe(gulpUglify()) //壓縮時出現例外，故改用gulp-minify-css
		.pipe(minifyCSS({keepBreaks: false}))
		.pipe(gulp.dest(dest + 'css'));
});



gulp.task('html', ['js', 'css'], function() { //搬動html檔 (含相依注入)，注入程式必須相依於前兩項task皆完成才可執行(但目前發現好像是非同步，並非同步，欲執行同步任務參考runSequence)
	gulp.src(['assets/html/**/*']).pipe(gulp.dest(dest + 'html'));//搬動檔案(非index.html之其他html)
	gulp.src(['assets/countries3.json']).pipe(gulp.dest(dest));//搬動檔案
	var target = gulp.src('./assets/index.html').pipe(gulpHtmlReplace({'forDeveloper': ''}));//1.被注入target。我們利用gulpHtmlReplace來移除index.html中相依的區塊，並改成空白
	var source = gulp.src([dest + 'js/*.js', dest + 'css/*.css'], {read: false}).pipe(gulpDebug());//2.注入sources。gulpDebug()可用來印出目前src()清單

	target.pipe(inject(source, {ignorePath: '/target/'})).pipe(gulp.dest(dest));//3.注入後並搬動至目的地，預設注入相依路徑由Project Directory開始(也就是current working dorectory)，由於我們使用node server，其在/target下，其把project root "/" 定在target那層，故我們希望注入相依時，移除預設/target路徑，故設定ignorePath

});




gulp.task('production', function (callback) {//由於gulp.task()相依執行為synchronous，故無法保證順序，故改用 run-sequence，但記得，任何要讓後者等前者執行完的前者必須回傳a stream (but make sure they either return a stream or handle the callback)
	runSequence('clean', 'js', 'css', 'html', 'resource', 'server', 'runServer', callback);
});


