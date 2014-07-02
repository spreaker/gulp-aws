gulp-aws
=========

AWS CLI plugin for [gulp](https://github.com/wearefractal/gulp).

#Install

```
npm install --save-dev gulp-aws
```

#Features

- Upload to S3

#Example

Create a tar.gz with the content of the 'src' directory and upload it to S3

```
var aws  = require('gulp-aws')

gulp.task('my-task', function() {
    return gulp.src('src/**/*')
        .pipe(tar('mypackage.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./build'))
        .pipe(aws.s3('my-bucket-name', 'mypackage.tar.gz', {
            aws_region: 'eu-west-1',
            aws_key:    'your aws key kere',
            aws_secret: 'your aws secret here'
        }));
});

```

#Required options

- `aws_region`: AWS region
- `aws_key`: AWS access key
- `aws_secret`: AWS access secret

#Other options

- `aws_cli_path`: The path of the AWS CLI. Defaults to `/usr/local/bin/aws`
