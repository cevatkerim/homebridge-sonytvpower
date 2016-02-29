# Sony TV Power control
### Turn on or off your Sony TV with Siri

###### Installing

To install the plugin, head over to the machine with Homebridge set up and run
```
sudo npm install -g homebridge-sonytvpower
```

###### Configuration

To make Homebridge aware of the new plugin, you will have to add it to your configuration usually found in `.homebridge/config.json`. Somewhere inside that file you should see a key named `accessories`. This is where you can add your tv as shown here:

```
"accessories": [
    {
      "accessory": "SonyTV",
      "name": "Living Room TV",
      "mac": "<mac-address of your TV>",
      "ip": "<IP address of your TV>",
      "compatibilityMode": "false"
    } 
]
```

###### Troubleshooting

Set  compatibilityMode to true.
