#!/bin/bash
export PATH="/tmp/node-v20.11.0-darwin-x64/bin:$PATH"
cd "$(dirname "$0")"
node server.js
