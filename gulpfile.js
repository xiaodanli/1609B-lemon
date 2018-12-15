var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

//起服务
gulp.task('server',function(){
    return gulp.src('src')
    .pipe(server({
        port:8989,
        proxies:[
            {
                source:'/classify/api/iconlist',target:'http://localhost:3000/classify/api/iconlist'
            },
			{
				source:'/users/api/addUser',target:'http://localhost:3000/users/api/addUser'
			},
			{
				source:'/classify/api/addClassify',target:'http://localhost:3000/classify/api/addClassify'
			},
			{
				source:'/classify/api/getClassify',target:'http://localhost:3000/classify/api/getClassify'
			}
        ]
    }))
})

gulp.task('sass',function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css'))
})

gulp.task('watch',function(){
    return gulp.watch('./src/scss/*.scss',gulp.series('sass'))
})
//开发
gulp.task('dev',gulp.series('sass','server','watch'))


