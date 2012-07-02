require 'rake'
require 'rake/clean'

# Creates a task that uses the various template wrappers to make a wrapped
# output file. There is some extra complexity because Dojo and YUI use
# different final locations.
def templated_build(name, opts={})
  short = name.downcase
  source = File.join("wrappers", short)
  dependencies = ["src/pubsub.js"] + Dir.glob("#{source}/*.tpl.*")
  target_js = opts[:location] ? "pubsub.js" : "#{short}.pubsub.js"

  CLEAN.include(opts[:location] ? opts[:location] : target_js)

  desc "Package for #{name}"
  task short.to_sym => dependencies do
    puts "Packaging for #{name}"

    mkdir_p opts[:location] if opts[:location]

    files = [
      "#{source}/pubsub.js.pre.txt",
      'src/pubsub.js',
      "#{source}/pubsub.js.post.txt"
    ]

    open("#{opts[:location] || '.'}/#{target_js}", 'w') do |f|
      files.each {|file| f << File.read(file) }
    end

    puts "Done, see #{opts[:location] || '.'}/#{target_js}"
  end
end

templated_build "jQuery"
# templated_build "MooTools"
# templated_build "Dojo", :location => "dojox/string"
# templated_build "YUI3", :location => "yui3/pubsub"
# templated_build "RequireJS"
# templated_build "qooxdoo"

task :default do
end

task :minify do
  # npm install uglify-js
  mmjs = "pubsub.min.js"
  # `echo "/*! Version: 1.0.4-dev */" > #{mmjs}`
  `uglifyjs pubsub.js >> #{mmjs}`
  puts "Created #{mmjs}"
end
