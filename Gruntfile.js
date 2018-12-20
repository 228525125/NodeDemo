module.exports = function(grunt) {

	var sassStyle = 'expanded';
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			output: {
				options: {
					style:sassStyle
				},
				files: {
					'./grunt/style.css':'./grunt/scss/style.scss'
				}
			}
		},
		
		concat: {
			options: {
				//separator: ';',
		    },
		    dist: {
		    	src: ['./grunt/src/plugin.js', './grunt/src/plugin2.js'],
		        dest: './grunt/global.js',
		    }
		},
		
		uglify: {
			compressjs: {
				files: {
					'./grunt/global.min.js': ['./grunt/global.js']
		        }
		    }
		},
		
		jshint: {
			all: ['./grunt/global.js']
		},
		
		watch: {
			scripts: {
				files: ['./grunt/src/plugin.js','./grunt/src/plugin2.js'],
				tasks: ['concat','jshint','uglify']
		    },
		    sass: {
		    	files: ['./grunt/scss/style.scss'],
		        tasks: ['sass']
		    },
		    livereload: {
		        options: {
		            livereload: '<%= connect.options.livereload %>'
		        },
		        files: [
		            './grunt/index.html',
		            './grunt/style.css',
		            './grunt/global.min.js'
		        ]
		    }
		},
		
		connect: {
			options: {
		        port: 9000,
		        open: true,
		        livereload: 35729,
		        // Change this to '0.0.0.0' to access the server from
				// outside
		        hostname: 'localhost'
		    },
		    server: {
		    	options: {
		    		port: 9001,
		    		base: './'
		        }
		    }
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	// Default task(s).
	grunt.registerTask('outputcss', ['sass']);
	grunt.registerTask('concatjs',['concat']);
	grunt.registerTask('compressjs',['concat','jshint','uglify']);
	grunt.registerTask('watchit',['sass','concat','jshint','uglify','connect','watch']);
	grunt.registerTask('default');

};