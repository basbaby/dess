#!/bin/bash

# az login --service-principal --username 1044ff88-c944-49a5-979c-f6737bd55042 --password 65dcc99a-bba4-41f3-94e3-eb6e6f19ef04  --tenant 9f0b2463-0d63-4ac2-b62e-d2415ce0780b


az login --service-principal --username ${azusername} --password ${azpassword} --tenant ${aztenantid}