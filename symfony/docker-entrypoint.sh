#!/bin/bash

HOST_IP=$(ip route | awk '/default/ { print $3 }')

# Перевіряємо, що змінна не пуста
if [ -n "$HOST_IP" ]; then
  echo "$HOST_IP host.docker.internal" >> /etc/hosts
else
  echo "Error HOST_IP!" >&2
fi

exec php-fpm
