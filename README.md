gulp-aws
=========

AWS S3 plugin for [gulp](https://github.com/gulpjs/gulp). This plugin is based open AWS CLI, that supports much more features (and has better performances) then available AWS node.js libraries.


## Features

 * Upload to S3


## Requirements

 * [AWS Command Line Interface](http://aws.amazon.com/cli/)


## Install

```
npm install gulp-aws --save-dev
```


## API

### aws.s3(bucket, options)

Upload files to AWS S3.

- `bucket`: AWS bucket name


#### Required options

- `aws_region`: AWS region
- `aws_key`: AWS access key
- `aws_secret`: AWS access secret

#### Other options

- `aws_cli_path`: The path of the AWS CLI. Defaults to `/usr/local/bin/aws`
- `prefix_path`: A path to prefix the basename of the file with when forming the S3 key

#### Example

Create a tar.gz with the content of the 'src' directory and upload it to S3

```
var aws  = require('gulp-aws');
var tar  = require('gulp-tar');
var gzip = require('gulp-gzip');

gulp.task('my-task', function() {
    return gulp.src('src/**/*', {buffer:false})
        .pipe(tar('mypackage.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./build'))
        .pipe(aws.s3('my-bucket-name', {
            aws_region: 'eu-west-1',
            aws_key:    'your aws key kere',
            aws_secret: 'your aws secret here'
        }));
});
```

## Contributors

 * [Rocco Zanni](https://github.com/roccozanni)
 * [Marco Pracucci](https://github.com/pracucci)
 * [Chris Kinsman](https://github.com/chriskinsman)
