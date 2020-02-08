function serve(dir) {
  validateDir(dir)
}

function build(dir) {
  validateDir(dir)
}

function help() {

}

if serve {
  serve()
} else if build {
  build()
} else {
  help()
}
