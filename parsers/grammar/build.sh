#!/usr/bin/env bash

node pegjs_conv camxes.peg
node build-camxes camxes.pegjs
