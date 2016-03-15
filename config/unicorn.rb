listen "unix:/var/run/codering.sock"
worker_processes 1
preload_app true
user "rails"
working_directory "/home/rails/codering/current"
pid "/var/run/codering.pid"
stderr_path "/var/log/unicorn/codering.log"
stdout_path "/var/log/unicorn/codering.log"
