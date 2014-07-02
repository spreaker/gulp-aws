var through     = require('through2');
var PluginError = require('gulp-util').PluginError;
var _           = require('underscore');

var PLUGIN_NAME = 'gulp-aws';

function s3(bucket, key, options) {

    _.defaults(options, {
        aws_cli_path: '/usr/local/bin/aws'
    });

    if (!options.aws_region) {
        throw new PluginError(PLUGIN_NAME, '`options.aws_region` must be specified');
    }

    if (!options.aws_key) {
        throw new PluginError(PLUGIN_NAME, '`options.aws_key` must be specified');
    }

    if (!options.aws_secret) {
        throw new PluginError(PLUGIN_NAME, '`options.aws_secret` must be specified');
    }

    return through.obj(function(file, enc, done) {

        // Check for empty file
        if (file.isNull()) {
            self.push(file);
            return done();
        }

        // Only streams supported
        if (file.isBuffer()) {
            this.emit('error', new PluginError(PLUGIN_NAME, new Error('Only streams supported'), { showStack: true }));
            return done();
        }

        var env = {
            AWS_DEFAULT_REGION:     options.aws_region,
            AWS_ACCESS_KEY_ID:      options.aws_key,
            AWS_SECRET_ACCESS_KEY:  options.aws_secret,
        };

        var command = [
            options.aws_cli_path,
            's3',
            'cp',
            file.path,
            's3://' + bucket + '/' + key
        ];

        require('child_process').exec(command.join(' '), { env: env }, function(error, stdout, stderr){

            if (error) {
                this.emit('error', new PluginError(PLUGIN_NAME, error, { showStack: true }));
                return done();
            }

            this.push(file);
            return done();

        }.bind(this));
    });
}

module.exports = {
    s3: s3
};