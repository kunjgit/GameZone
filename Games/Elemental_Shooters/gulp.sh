#!/bin/bash

gulp index
gulp closureCompiler
gulp smoosher
gulp clean
gulp zip
