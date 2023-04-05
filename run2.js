#!/bin/sh
UUID=${UUID:-'0e057a24-4dad-4825-acce-1bafc1cfbd8c'}
sed -i "s#UUID#$UUID#g" ./config-vmess.json
