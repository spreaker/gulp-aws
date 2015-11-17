var through     = require('through2');
var PluginError = require('gulp-util').PluginError;
var _           = require('underscore');
var path        = require('path');

var PLUGIN_NAME = 'gulp-aws';

function s3(bucket, options) {

    _.defaults(options, {
        aws_cli_path: '/usr/local/bin/aws',
        aws_region: undefined,
        aws_key: undefined,
        aws_secret: undefined,
        preseve_paths: false
    });

    if (!options.aws_region && !options.aws_profile) {
        throw new PluginError(PLUGIN_NAME, '`options.aws_region` or `options.aws_profile` must be specified');
    }

    if (!options.aws_key && !options.aws_profile) {
        throw new PluginError(PLUGIN_NAME, '`options.aws_key` or `options.aws_profile`  must be specified');
    }

    if (!options.aws_secret && !options.aws_profile) {
        throw new PluginError(PLUGIN_NAME, '`options.aws_secret` or `options.aws_profile`  must be specified');
    }

    return through.obj(function(file, enc, done) {

        // Check for empty file
        if (file.isNull()) {
            this.push(file);
            return done();
        }

        // Only streams supported
        if (file.isBuffer()) {
            this.emit('error', new PluginError(PLUGIN_NAME, new Error('Only streams supported'), { showStack: true }));
            return done();
        }

        var env = {};

        if (options.aws_key) {
            evn.AWS_ACCESS_KEY_ID = options.aws_key;
        }

        if (options.aws_secret) {
            env.AWS_SECRET_ACCESS_KEY = options.aws_secret;
        }

        if (options.aws_region) {
            env.AWS_DEFAULT_REGION = options.aws_region;
        }

        if (options.aws_profile) {
            env.AWS_DEFAULT_PROFILE = options.aws_profile;
        }

        var filepath;
        if (options.prefix_path) {
            filepath = path.join(options.prefix_path, path.basename(file.path));
        } else if (options.preserve_paths) {
            filepath = file.relative;
        } else {
            filepath = path.basename(file.path);
        }

        var command = [
            options.aws_cli_path,
            's3',
            'cp',
            file.path,
            's3://' + bucket + '/' + filepath,
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
