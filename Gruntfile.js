module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			init: ['dist/*'],
			dist: ['dist/*.min.js']
		},

		uglify: {
			build: {
				files: [
					{
	          expand: true, 
	          cwd: 'src/js/',   
	          src: ['*.js'],
	          dest: 'dist/',  
	          ext: '.min.js',
	          extDot: 'first' 
	        }
	      ]
			}
		},

		concat: {
			dist: {
				src: ['dist/weixin.min.js', 'dist/quintus.min.js', 'dist/sprites.min.js', 'dist/scenes.min.js', 'dist/screen.min.js', 'dist/main.min.js'],
				dest: 'dist/main.js'
			}
		},

		cssmin: {
			minify: {
		    src: ['src/css/style.css'],
		    dest: 'dist/style.css',
  		}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['clean:init', 'uglify', 'concat', 'cssmin', 'clean:dist']);
};