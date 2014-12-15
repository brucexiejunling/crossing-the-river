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
	          cwd: 'src/',   
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
				src: ['dist/quintus.min.js', 'dist/sprites.min.js', 'dist/scenes.min.js', 'dist/screen.min.js', 'dist/main.min.js'],
				dest: 'dist/main.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['clean:init', 'uglify', 'concat', 'clean:dist']);
};