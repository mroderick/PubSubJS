#!/bin/bash
echo -e "Starting the server. Point the browsers to http://localhost:9876 \n"
java -Xms128m -Xmx512m -jar JsTestDriver.jar --port 9876
